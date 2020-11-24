"use strict";

var fs  = require("fs");
var beautify = require('js-beautify').js_beautify;
var overrides = require('../input/overrides.js');
var debug = true;

class ast2js{

	constructor(elements){
		this.elements = elements;
		this.missingImplementations = new Set();
	}

	setElements(elements){
		this.elements = elements;
	}

	compile(onFinished){
		//console.log("");
		console.log("Starting compilation of methods AST -> JS");
		var self = this;
		this.methodCount = 0;
		this.compiledCount = 0;
		this.onFinished = onFinished;

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "class" || e.type == "table"){
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].ast == {})
						continue;

					this.methodCount++;

					setTimeout(function(ast, i, m){self.compileMethod(ast, i, m);}, 1, e.methods[m].ast, i, m);
				}
			}
		}
	}

	compileMethod(ast, i, m){
    this.curElement = this.elements[i]
    this.curMethod = this.elements[i].methods[m]

		/* Compile source code */
		var jsSource = this.compileAST2JS(this.elements[i], this.elements[i].methods[m], this.elements[i].name, this.elements[i].methods[m].name, ast);

		/* Write output */
		this.elements[i].methods[m].jsSource = beautify(jsSource, { indent_size: 2 });

    	fs.appendFileSync("server/logs/ast2js.txt", "/* XPP SOURCE: */\n" + this.elements[i].methods[m].source + "\n\n\n");
		fs.appendFileSync("server/logs/ast2js.txt", "/* JS RESULT SOURCE: */\n" + this.elements[i].methods[m].jsSource + "\n\n\n");

		/* Check if finished compilation */
		this.compiledCount++;
		if(this.compiledCount == this.methodCount && this.onFinished !== undefined){
			console.log("Finished compilation of {0} methods".format(this.methodCount));
			this.listMissingImplementations();
      		this.generateJSClasses();
			this.onFinished.call(this);
		}
	}

  generateJSClasses(){
    //Tables are handled in Table2JS
    for(var i = 0; i < this.elements.length; i++){
		var e = this.elements[i];
		if(e.type == "class"){
        	let s = ""
			for(var m = 0; m < e.methods.length; m++){
				if(e.methods[m].isClassDeclaration){
					s = "class " + e.name + " {\nconstructor(){\n" + e.methods[m].jsSource + "\n}" + s;
				} else {
					s += e.methods[m].jsSource;
				}
         		//console.log(e.methods[m].jsSource);
        	}

			s += "\n _getNull() {return null;};";
			s += "\n}";
			s = beautify(s, { indent_size: 2 });
			this.elements[i].jsSource = s;
      	}
	}
  }

	checkForMissingImplementations(ast, supported){
		if(ast instanceof Array){
			this.missingImplementations.add("A type which can have child " + ast[0].type + " does not handle array inputs!");
			return;
		}

		for (var property in ast) {
			if (ast.hasOwnProperty(property)) {
				if(property != "type" && supported.indexOf(property) < 0){
					//this.missingImplementations.add({type: ast.type, property: property});

					if(ast.type != undefined)
						this.missingImplementations.add("Type " + ast.type + " does not use property " + property);
					else if(debug){
						console.log("Unknown type does not use property " + property + ": " + ast);
						console.trace("Callstack for the above error");
						process.exit();
					}
				}
			}
		}
	}

	listMissingImplementations(){
		/*
		this.missingImplementations.forEach(function(value) {
		  console.log(value);
		});
		*/
		Array.from(this.missingImplementations).sort().forEach(function(value) {
			if(debug)
		  	console.log(value);
		});
	}

	compileAST2JS(element, method, className, methodName, ast){
		switch(ast.subtype){
			case "method":
				return this.compile_methoddeclaration(ast.child);
			case "macro-method":
				return this.compile_macromethod(ast);
			case "class":
        		method.isClassDeclaration = true;
				return this.compile_class(ast);

			default:
				if(debug){
					if(ast.type === undefined)
						console.log("Skipping because of previous compilation error: " + className + "." + methodName);
					else
						console.log("Unknown element type at root. Type: " + ast.type + ", subtype: " + ast.subtype + ", object: " + className + "." + methodName);
				}
		}
		return "";
	}

	compile_macromethod(ast){
		this.checkForMissingImplementations(ast, ["method", "subtype"]);
		return this.compile_methoddeclaration(ast.method);
	}

	compile_class(ast){
		this.checkForMissingImplementations(ast, ["subtype", "child"]);
		return this.compile_expression(ast.child.body);
	}

	compile_methoddeclarationinner(ast){
		this.checkForMissingImplementations(ast, ["name", "parms", "body"]);
		return "var " + this.compile_id(ast.name) + " = function(" + this.compile_methoddeclarationparms(ast.parms) + "){" + this.compile_expression(ast.body) + "}";
	}

	compile_methoddeclaration(ast){
		this.checkForMissingImplementations(ast, ["name", "parms", "body", "isStatic"]);
    	this.curMethod.isStatic = ast.isStatic === true;
		return (ast.isStatic ? "static " : "") + "async " + this.compile_id(ast.name) + " (" + this.compile_methoddeclarationparms(ast.parms) + "){" + this.compile_expression(ast.body) + "}";
	}

	compile_methoddeclarationparms(ast){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				if(ast[i].type != "empty"){
					ret += (ret != "" && !ret.endsWith(",") ? ", " : "") + this.compile_methoddeclarationparms(ast[i]);
				}
			}
			return ret;
		}

		this.checkForMissingImplementations(ast, []);
		return '';
	}

  compile_id(ast){
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
            this.missingImplementations.add("Unsupported id type: " + ast.type)
          else if(debug){
            console.log("Unknown type for id: " + ast);
          }
      }
    }

    if(ret == "ttsbegin" || ret == "ttscommit"){
      this.missingImplementations.add("ttsbegin/ttscommit unsupported")
      ret = 'console.log("' + ret + '")';
    }

    return ret;
  }

	compile_variabledeclaration(ast){
		this.checkForMissingImplementations(ast, ["name", "more"]);
		var ret = "let " + this.compile_id(ast.name);
		if(ast.more != undefined){
			ret += ", " + this.compile_variabledeclaration_more(ast.more);
		}

		if(ast.defval != undefined){
			ret += " = " + this.compile_expression(ast.defval);
		} else if(typeof ast.vartype === "string"){
        	switch(ast.vartype.toLowerCase()){
          		case "str":
					ret += " = ''";
					break;
				default:
					this.missingImplementations.add("Unsupported vartype in var declaration (str): " + ast.vartype)
        	}
		} else if(typeof ast.vartype === 'object'){
			switch(ast.vartype.type){
				case "id":
					ret += " = " + this.compile_id(ast.vartype.id) + "._getNull()";
					break;
				default:
					this.missingImplementations.add("Unsupported vartype in var declaration (obj): " + ast.vartype.type)
			}
		}

		ret += ";";
		return ret;
	}

	compile_variabledeclaration_more(ast){
		this.checkForMissingImplementations(ast, ["name", "more"]);
		var ret = this.compile_id(ast.name);
		if(ast.more != undefined){
			ret += ", " + this.compile_variabledeclaration_more(ast.more);
		}
		return ret;
	}

	compile_expression(ast){
		//TODO: check for missingImplementations

		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				if(ast[i].type != "empty"){
					ret += (ret != "" && !ret.endsWith(";") ? "; " : "") + this.compile_expression(ast[i]);
				}
			}
			return ret;
		}

		if(ast === undefined){
			console.log("ERROR: ast undefined in expression")
			console.trace("Callstack for the above error");
			process.exit();
		}


		switch(ast.type){
			case "variabledeclaration":
				return this.compile_variabledeclaration(ast);
			case "if" :
				return this.compile_if(ast);
			case "assign":
				return (ast.leftelement != undefined ? this.compile_expression(ast.leftelement) + "." : "") + this.compile_expression(ast.left) + " = " + this.compile_expression(ast.right);
			case "methodcall" :
				return this.compile_methodcall(ast);
			case "id":
				this.checkForMissingImplementations(ast, ["id"]);
				return this.compile_id(ast.id);
			case "and":
				this.checkForMissingImplementations(ast, ["left", "right"]);
				return this.compile_expression(ast.left) + " \&\& " + this.compile_expression(ast.right);
			case "empty":
				return "";
			case "return":
				return "return " + (ast.e != undefined ? this.compile_expression(ast.e) : "");
			case "new":
				return "new " + this.compile_expression(ast.e);
			case "macroval":
				return ast.macro + "." + ast.val;
			case "container":
				return "[" + this.compile_expression(ast.content) + "]";
			case "paran":
				return "(" + this.compile_expression(ast.content) + ")";
			case "macroref":
				return "eval(macros." + this.compile_id(ast.id) + ")";
			case "onelineif":
				return this.compile_expression(ast.condition) + " ? " + this.compile_expression(ast.trueval) + " : " + this.compile_expression(ast.falseval);
			case "literal":
				return ast.val;
			case "methodinner":
				return this.compile_methoddeclarationinner(ast);
			case "plus":
				return this.compile_expression(ast.left) + " + " + this.compile_expression(ast.right);
			case "less":
				return this.compile_expression(ast.left) + " < " + this.compile_expression(ast.right);
			case "plusplus":
				return this.compile_expression(ast.e) + "++"
			case "negation":
				return "!" + this.compile_expression(ast.e)
			case "memberref":
				return this.compile_expression(ast.element) + "." + this.compile_expression(ast.ref);
			case "for":
				return "for(" + this.compile_expression(ast.vardeclaration) + "; " + this.compile_expression(ast.condition) + "; " + this.compile_expression(ast.counter) + "){" + this.compile_expression(ast.body) + "}"
			case "enumval":
				return this.compile_id(ast.enum) + "." + this.compile_id(ast.val)
			case "select":
				return this.compile_select(ast)
			default:
				if(ast.type != undefined)
					this.missingImplementations.add("Unsupported expression type: " + ast.type)
				else if(debug){
					console.log("Unknown type for expression: " + ast);
				}
		}

		return "";
	}

	compile_methodcall(ast){
		this.checkForMissingImplementations(ast, ["id", "method"]);

		var parms = "";
		if(ast.parameters != undefined){
			parms = this.compile_methodparms(ast.parameters);
		}
		return (ast.element != undefined ? this.compile_expression(ast.element) + "." : "") + this.compile_id(ast.method) + "(" + parms + ")";
	}

	compile_methodparms(ast){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += (ret != "" ? ", " : "") + this.compile_methodparms(ast[i]);
			}
			return ret;
		}

		//Missing implementations is checked in expressions method
		return ast != "" ? this.compile_expression(ast) : "";
	}

	compile_if(ast){
		if(ast instanceof Array){
			var ret = "";
			for(var i in ast){
				ret += this.compile_expression(ast[i]);
			}
			return ret;
		}

		this.checkForMissingImplementations(ast, ["condition", "body"]);

		return "if(" + this.compile_expression(ast.condition) + "){" + this.compile_expression(ast.body) + "}"
	}

	compile_select(ast){
		this.checkForMissingImplementations(ast, []);

		return "select()"
	}
}

if (!String.prototype.format) {
  String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
	  return typeof args[number] != 'undefined'
		? args[number]
		: match
	  ;
	});
  };
}

module.exports = ast2js;
