import Entity from 'entitystorage'
import ClassGen from './js-classgen.mjs'
import js_beautify from 'js-beautify';
let beautify = js_beautify.js

class Compiler{

  constructor(){
    this.compileFunction = this.compileFunction.bind(this)
    this.compileExpression = this.compileExpression.bind(this)
    this.rootContext = {variables: [], parent: null}
    this.dependencies = new Set()
  }
  compile(e){
    this.e = e

    switch(e.type){
      case "class":
      case "table":
        break;

      default:
        return;
    }

    this.gen = new ClassGen(e, e.name);
    this.compileDeclaration();
    this.e.rels.function?.forEach(this.compileFunction)

    e.rels.js?.forEach(e => e.delete())
    let jsSource = this.gen.generate()
    let imports = this.genImports()
    let fullSource = `${imports}${imports?';':''}\n\n${jsSource}; export default ${this.e.name};`;

    e.rel(new Entity().tag("js").prop("source", beautify(fullSource, { indent_size: 2 })), "js")
  }

  genImports(){
    return Array.from(this.dependencies).map(i => {
      let type = Entity.find(`prop:name=${i} (tag:class|tag:edt|tag:enum|tag:table)`)?.type;
      if(type)
        return `import ${i} from '/api/meta/${type}/${i}.mjs'`
      else
        return `import ${i} from '/e/class/${i}.mjs'`
    }).join(";\n")
  }

  compileDeclaration(){
    let ast = this.e.related.declaration?.related.ast
    if(!ast) return;

    console.log("STUB: Compile declaration")

    //TODO: add variables to this.rootContext
  }

  compileFunction(f){
    let ast = f.related.ast.source
    if(!ast) return;

    let parms = this.compileFunctionParms(ast.child.parms)
    let body = this.compileFunctionBody(ast.child.body)

    this.gen.addFunction(f.name, body, parms, ast.child.isStatic === true)
  }

  compileFunctionParms(ast){
    if(ast.type == "empty") return ""

    return ""
  }

  compileFunctionBody(ast){
    this.rootContext.parent = ast
    return this.compileExpression(ast, this.rootContext)
  }

  compileExpression(ast, context){
    if(Array.isArray(ast)) return ast.map(e => {
      return this.compileExpression(e, context)
    }).join(";\n    ")

    context.parent = context.lastContext
    context.lastContext = {parent: context.parent, lastContext: context.lastContext, cur: context.cur}
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
				return "new " + this.compileExpression(ast.e, context);
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
				return this.compileId(ast.enum, context) + "." + this.compileId(ast.val, context)
			case "select":
				return this.compileSelect(ast, context)
			case "equals":
				return this.compileExpression(ast.left, context) + " == " + this.compileExpression(ast.right, context);
			default:
				if(ast.type != undefined)
					this.missingImplementations.add("Unsupported expression type: " + ast.type)
				else if(debug){
					console.log("Unknown type for expression: " + ast);
				}
		}

		return "";
  }

	compileVariableDeclaration(ast, context){
    let id = this.compileId(ast.name)
    context.variables.push(id)

		var ret = `let ${id}`;
		if(ast.more != undefined){
			ret += ", " + this.compileVariableDeclarationMore(ast.more, context);
    }
    
    if(ast.vartype?.type == "id")
      this.refUsed(ast.vartype.id, context)

		if(ast.defval != undefined){
			ret += " = " + this.compileExpression(ast.defval, context);
		} else if(typeof ast.vartype === "string"){
      switch(ast.vartype.toLowerCase()){
        case "str":
          ret += " = ''";
          break;
        default:
          console.log("Unsupported vartype in var declaration (str): " + ast.vartype)
      }
		} else if(typeof ast.vartype === 'object'){
			switch(ast.vartype.type){
				case "id":
					ret += " = new " + this.compileId(ast.vartype.id, context) + "()";
					break;
				default:
					console.log("Unsupported vartype in var declaration (obj): " + ast.vartype.type)
			}
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

    return ret;
  }

  compileMethodCall(ast, context){
		var parms = "";
		if(ast.parameters != undefined){
			parms = this.compileMethodCallParms(ast.parameters, context);
		}
		return (ast.element != undefined ? this.compileExpression(ast.element, context) + "." : "") + this.compileId(ast.method, context) + "(" + parms + ")";
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

    if(context.variables.indexOf(refName)>=0)
      return; // Local variable

    this.dependencies.add(refName)
  }
}

export function compileElement(e){
  new Compiler().compile(e)
}