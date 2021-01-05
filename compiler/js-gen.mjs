import Entity from 'entitystorage'
import ClassGen from './js-classgen.mjs'
import js_beautify from 'js-beautify';
let beautify = js_beautify.js

class Compiler{

  constructor(){
    this.compileFunction = this.compileFunction.bind(this)
    this.compileExpression = this.compileExpression.bind(this)
    this.rootContext = {}
  }
  compile(e){
    this.e = e

    switch(e.type){
      case "class":
        break;

      default:
        return;
    }

    this.gen = new ClassGen(e, e.name);
    this.compileDeclaration();
    this.e.rels.function?.forEach(this.compileFunction)
    
    e.rels.js?.forEach(e => e.delete())
    let jsSource = beautify(this.gen.generate(), { indent_size: 2 });
    e.rel(new Entity().tag("js").prop("source", jsSource), "js")
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
    return this.compileExpression(ast, this.rootContext)
  }

  compileExpression(ast, context){
    if(Array.isArray(ast)) return ast.map(e => this.compileExpression(e, context)).join(";\n    ")

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
				if(context.parent && (context.parent.type == "if" || (context.parent.type == "negation" && context.parent.parent.type == "if"))){
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
		var ret = "let " + this.compileId(ast.name);
		if(ast.more != undefined){
			ret += ", " + this.compileVariableDeclarationMore(ast.more);
		}

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
					ret += " = " + this.compileId(ast.vartype.id) + "._getNull()";
					break;
				default:
					console.log("Unsupported vartype in var declaration (obj): " + ast.vartype.type)
			}
		}

		return ret;
	}

	compileVariableDeclarationMore(ast){
		var ret = this.compileId(ast.name);
		if(ast.more != undefined){
			ret += ", " + this.compile_variabledeclaration_more(ast.more);
		}
		return ret;
  }
  
  

  compileId(ast, parents){
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

  compileMethodCall(ast, parents){
		var parms = "";
		if(ast.parameters != undefined){
			parms = this.compileMethodCallParms(ast.parameters);
		}
		return (ast.element != undefined ? this.compileExpression(ast.element, parents) + "." : "") + this.compileId(ast.method) + "(" + parms + ")";
	}

	compileMethodCallParms(ast, parents){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += (ret != "" ? ", " : "") + this.compileMethodCallParms(ast[i]);
			}
			return ret;
		}

		//Missing implementations is checked in expressions method
		return ast != "" ? this.compileExpression(ast, parents) : "";
	}

	compileIf(ast, parents){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += this.compileExpression(ast[i], parents);
			}
			return ret;
		}

		return "if(" + this.compileExpression(ast.condition, parents) + "){\n" + this.compileExpression(ast.body, parents) + "}"
	}

	compileSelect(ast, parents){
		let select = ast.inner;
		return `new Select(${select.id.id})`
				+ (select.modifier && select.modifier.type == "firstonly" ? ".firstonly()" : "")
				+ (select.where ? `.where((${select.id.id}) => ${this.compileExpression(select.where.e, parents)})` : "")
				+ ".fetch()"
  }

	compileMethodDeclarationInner(ast){
		return "var " + this.compile_id(ast.name) + " = function(" + this.compile_methoddeclarationparms(ast.parms) + "){" + this.compile_expression(ast.body) + "}";
	}
}

export function compileElement(e){
  new Compiler().compile(e)
}