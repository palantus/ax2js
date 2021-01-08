import Entity from 'entitystorage'
import ClassGen from './js-classgen.mjs'
import js_beautify from 'js-beautify';
let beautify = js_beautify.js

let globalCaseMap;

class Compiler{

  constructor(){
    this.compileFunction = this.compileFunction.bind(this)
    this.compileExpression = this.compileExpression.bind(this)
    this.rootContext = {variables: [], parent: null}
    this.dependencies = new Set()
    this.globalUsages = new Set()
  }

  compile(e){
    this.e = e

    if(!["class", "table", "form"].includes(e.type))
      return;

    console.log(`Compiling ${e.type} ${e.name}`)

    if(e.type == "form"){
      this.rootContext.variables = [
        ...Entity.search(`tag:formcontrol element.id:${e} prop:autoDeclaration=Yes`).map(c => ({type: "control", id: c.name})),
        ...Entity.search(`tag:fds element.id:${e}`).map(c => ({type: "control", id: c.name + "_ds"}))
      ]
    }

    this.gen = new ClassGen(e, e.type == "form" ? `Form_${e.name}` : e.name);
    this.gen.exportClassDefault()
    this.compileDeclaration();
    this.e.rels.function?.forEach(this.compileFunction)

    if(e.type == 'table'){
      this.dependencies.add("Common")
      this.gen.setExtends("Common")
    } else if(e.type == 'form'){
      this.dependencies.add("FormRun")
      this.gen.setExtends("FormRun")
    }

    e.rels.js?.forEach(e => e.delete())
    let jsSource = this.gen.generate()
    if(this.e.type == "form"){
      jsSource += '\n\n' + this.compileFormControlsAndFDS()
    }
    let imports = this.genImports()
    let fullSource = `${imports}${imports?';':''}\n\n${jsSource}`;

    e.rel(new Entity().tag("js").prop("source", beautify(fullSource, { indent_size: 2 })), "js")
  }

  compileFormControlsAndFDS(){
    let form = this.e;
    let formGen = this.gen
    let jsSource = `Form_${form.name}.controlTypes = {};\n\n`
    
    for(let ds of form.rels.ds||[]){
      this.e = ds
      this.gen = new ClassGen(ds, `FDS_${ds.name}`);
      let baseTypeName = `FormDataSource`
      this.gen.setExtends(baseTypeName)
      this.dependencies.add(baseTypeName)
      this.compileDeclaration()
      this.e.rels.function?.forEach(this.compileFunction)
      jsSource += `Form_${form.name}.controlTypes.${ds.name} = ${this.gen.generate()}\n\n`
    }

    for(let ctl of Entity.search(`tag:formcontrol element.id:${form}`)){
      this.e = ctl
      this.gen = new ClassGen(ctl, `Control_${ctl.name}`);
      let baseTypeName = `Form${ctl.type||''}Control`
      this.gen.setExtends(baseTypeName)
      this.dependencies.add(baseTypeName)
      this.e.rels.function?.forEach(this.compileFunction)
      jsSource += `Form_${form.name}.controlTypes.${ctl.name} = ${this.gen.generate()}\n\n`
    }

    //Restore status
    this.gen = formGen
    this.e = form

    return jsSource
  }

  genImports(){
    let imports = new Set()
    this.dependencies.forEach(i => {
      let e = Entity.find(`prop:name=${i} (tag:class|tag:edt|tag:enum|tag:table)`);
      if(e)
        imports.add(`import ${i} from '/api/meta/${e.type}/${e.name}.mjs'`)
      else
        imports.add(`import ${i} from '/e/class/${i}.mjs'`)
    })

    if(this.globalUsages.size > 0){
      imports.add(`import {${Array.from(this.globalUsages).join(", ")}} from '/e/class/Global.mjs'`)
    }
    return Array.from(imports).join(";\n")
  }

  compileDeclaration(){
    let ast = this.e.related.declaration?.related.ast.source
    if(!ast) return;

    let body = this.compileDeclarationVars(ast.child.body)
    this.gen.addClassVars(body)
  }

  compileDeclarationVars(ast){
    if(ast.type == "empty") return ""

    if(ast instanceof Array )
      return ast.map(p => this.compileDeclarationVars(p)).filter(p => p ? true : false).join(", ")
    this.rootContext.variables.push({type: "this", id: ast.name.id})

    if(ast.defval){
      return `${ast.name.id} = ${this.compileExpression(ast.defval, this.rootContext)}`
    } else {
      let baseType = this.idToBaseType(ast.vartype.id)
      return `${ast.name.id} = ${this.nullValueForBaseType(baseType)}`
    }
  }

  compileFunction(f){
    let ast = f.related.ast.source
    if(!ast) return;

    let parms = this.compileFunctionParms(ast.child.parms)
    let body = this.compileFunctionBody(ast.child.body, Object.assign({}, this.rootContext, {functionName: f.name}))

    this.gen.addFunction(f.name, body, parms, ast.child.isStatic === true)
  }

  compileFunctionParms(ast){
    if(!ast)
      console.log("her")
    if(ast.type == "empty") return ""

    if(ast instanceof Array )
      return ast.map(p => this.compileFunctionParms(p)).join(", ")
    return ast.id.id
  }

  compileFunctionBody(ast, context){
    this.rootContext.parent = ast
    return this.compileExpression(ast, context)
  }

  compileExpression(ast, context){
    if(Array.isArray(ast)) return ast.map(e => {
      return this.compileExpression(e, context)
    }).join(";\n    ")

    context.parent = context.lastContext
    context.lastContext = {parent: context.parent, lastContext: context.lastContext, cur: context.cur, functionName: context.functionName}
    context.cur = ast

    switch(ast.type){
			case "variabledeclaration":
				return this.compileVariableDeclaration(ast, context);
			case "if" :
				return this.compileIf(ast, context);
			case "assign":
				return (ast.leftelement != undefined ? this.compileExpression(ast.leftelement, context) + "." : "") + this.compileExpression(ast.left, context) + " = " + this.compileExpression(ast.right, context);
			case "methodcall" :
				return this.compileMethodCall(ast, context);
			case "id":
				//TODO: this is a hack to fix "if(tableBuffer)". Consider figuring out how to fix this properly.
				if(context.parent && (context.parent?.cur?.type == "if" || (context.parent?.cur?.type == "negation" && context.parent.parent?.cur?.type == "if"))){
					return `${this.compileId(ast.id, context)}._hasValue()`;
				}
				return this.compileId(ast.id, context);
			case "and":
				this.checkForMissingImplementations(ast, ["left", "right"]);
				return this.compileExpression(ast.left, context) + " \&\& " + this.compileExpression(ast.right, context);
			case "empty":
				return "";
			case "return":
				return "return " + (ast.e != undefined ? this.compileExpression(ast.e, context) : "");
			case "new":
				return "new " + this.compileExpression(ast.e || ast.id, context);
			case "macroval":
				return ast.macro + "." + ast.val;
			case "container":
				return "[" + this.compileExpression(ast.content, context) + "]";
			case "paran":
				return "(" + this.compileExpression(ast.content, context) + ")";
			case "macroref":
				return "eval(macros." + this.compileId(ast.id, context) + ")";
			case "onelineif":
				return this.compileExpression(ast.condition, context) + " ? " + this.compileExpression(ast.trueval, context) + " : " + this.compileExpression(ast.falseval, context);
			case "literal":
				return ast.val;
			case "methodinner":
				return this.compileMethodDeclarationInner(ast);
			case "plus":
				return this.compileExpression(ast.left, context) + " + " + this.compileExpression(ast.right, context);
			case "less":
				return this.compileExpression(ast.left, context) + " < " + this.compileExpression(ast.right, context);
			case "plusplus":
				return this.compileExpression(ast.e, context) + "++"
			case "negation":
				return "!" + this.compileExpression(ast.e, context)
			case "memberref":
				return this.compileExpression(ast.element, context) + "." + this.compileExpression(ast.ref, context);
			case "for":
				return "for(" + this.compileExpression(ast.vardeclaration, context) + "; " + this.compileExpression(ast.condition, context) + "; " + this.compileExpression(ast.counter, context) + "){" + this.compileExpression(ast.body, context) + "}"
			case "enumval":
        return this.compileEnumVal(ast, context)
			case "select":
				return this.compileSelect(ast, context)
			case "equals":
        return this.compileExpression(ast.left, context) + " == " + this.compileExpression(ast.right, context);
      case "whereexpequals":
        return `${this.compileId(ast.buffer, context)}.${this.compileId(ast.field, context)} == ${this.compileExpression(ast.e, context)}`
			default:
				if(ast.type != undefined)
				  console.log("Unsupported expression type: " + ast.type)
				else
					console.log("Unknown type for expression for ast: " + JSON.stringify(ast));
		}

		return "";
  }

  compileEnumVal(ast, context){
    let enumName = this.compileId(ast.enum, context)
    let enumEntity = Entity.find(`prop:name=${enumName} tag:enum`)
    let enumValue = this.compileId(ast.val, context)
    if(enumEntity)
      return ''+enumEntity.rels.value?.find(e => e.name == enumValue)?.value||0
    else
      return '0'
  }

	compileVariableDeclaration(ast, context){
    let id = this.compileId(ast.name)
    context.variables.push({type: "local", id})

		var ret = `let ${id}`;
		if(ast.more != undefined){
			ret += ", " + this.compileVariableDeclarationMore(ast.more, context);
    }
    
    /*
    if(ast.vartype?.type == "id")
      this.refUsed(ast.vartype.id, context)
    */

		if(ast.defval != undefined){
			ret += " = " + this.compileExpression(ast.defval, context);
		} else {
      let baseType = this.idToBaseType(ast.vartype.id)
      ret += ` = ${this.nullValueForBaseType(baseType)}`
    }

		return ret;
	}

	compileVariableDeclarationMore(ast, context){
		var ret = this.compileId(ast.name, context);
		if(ast.more != undefined){
			ret += ", " + this.compile_variabledeclaration_more(ast.more, context);
		}
		return ret;
  }

  compileId(ast, context){
    let ret = "";

    if(ast === undefined){
      console.log("ERROR: ast undefined in id")
      console.trace("Callstack for the above error");
      process.exit();
    }

    if (typeof ast === 'string' || ast instanceof String){
      ret = ast;
    } else {
      switch(ast.type){
        case "id":
          ret = ast.id;
          break;
        default:
          if(ast.type != undefined)
            console.log("Unsupported id type: " + ast.type)
          else if(debug){
            console.log("Unknown type for id: " + ast);
          }
      }
    }

    if(ret == "ttsbegin" || ret == "ttscommit"){
      console.log("ttsbegin/ttscommit unsupported")
      ret = 'console.log("' + ret + '")';
    }
    
    let v = context?.variables.find(v => v.id == ret)
    switch(v?.type){
      case "this": return "this."+ret
      case "control": return `this.owner().namedControls.${ret}`
      case "local": return ret
      default: return ret
    }
  }

  compileMethodCall(ast, context){
    let methodName = this.compileId(ast.method, context)
    
    //Handle builtin functions
    switch(methodName){ 
      case "fieldNum":
        let f = Entity.find(`tag:tablefield element.prop:name=${ast.parameters[0].id.id} prop:name=${ast.parameters[1].id.id}`)
        return ""+f._id || `fieldNum("${ast.parameters[0].id.id}", "${ast.parameters[1].id.id}")`
    }

		var parms = "";
		if(ast.parameters != undefined){
			parms = this.compileMethodCallParms(ast.parameters, context);
    }
    
    if(ast.element){
      if(ast.element.type == "id")
        this.refUsed(ast.element.id, context)
      return this.compileExpression(ast.element, context) + "." + methodName + "(" + parms + ")";
    } else {
      let globalName = globalCaseMap[methodName.toLowerCase()]
      if(globalName)
        this.globalUsages.add(globalName)
      return (globalName?globalName:methodName) + (methodName == "super" ? `.${context.functionName}`:'') + "(" + parms + ")";
    }
	}

	compileMethodCallParms(ast, context){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += (ret != "" ? ", " : "") + this.compileMethodCallParms(ast[i], context);
			}
			return ret;
		}

		//Missing implementations is checked in expressions method
		return ast != "" ? this.compileExpression(ast, context) : "";
	}

	compileIf(ast, context){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += this.compileExpression(ast[i], context);
			}
			return ret;
		}

		return "if(" + this.compileExpression(ast.condition, context) + "){\n" + this.compileExpression(ast.body, context) + "}"
	}

	compileSelect(ast, context){
    this.refUsed("Select", context)

		let select = ast.inner;
		return `new Select(${select.id.id})`
				+ (select.modifier && select.modifier.type == "firstonly" ? ".firstonly()" : "")
				+ (select.where ? `.where((${select.id.id}) => ${this.compileExpression(select.where.e, context)})` : "")
				+ ".fetch()"
  }

	compileMethodDeclarationInner(ast, context){
		return "var " + this.compile_id(ast.name) + " = function(" + this.compile_methoddeclarationparms(ast.parms, context) + "){" + this.compile_expression(ast.body, context) + "}";
  }
  
  refUsed(refName, context){
    if(refName == this.e.name)
      return; //Current element

    if(["str", "int", "real"].indexOf(refName)>=0)
      return // Native type

    if(context.variables.find(v => v.id == refName))
      return; // Local variable

    this.dependencies.add(refName)
  }

  idToBaseType(id){
    if(["str", "int", "real", "int64", "container", "boolean"].indexOf(id))
      return id

    console.log(`Unknown type for id ${id}`)
    return null;
  }

  nullValueForBaseType(baseTypeName){
    switch(baseTypeName){
      case "str": return '""';
      case "int": return "0";
      case "real": return '0.0';
      case "int64": return '0';
      case "container": return '[]';
      case "boolean": return 'false';
      default: return 'null';
    }
  }
}

export async function initJSCompiler(){
  let imp = await import('../www/e/class/Global.mjs')
  globalCaseMap = Object.keys(imp).reduce((obj, cur) => {
    obj[cur.toLowerCase()] = cur
    return obj
  }, {})
}

export async function compileElement(e){
  new Compiler().compile(e)
}