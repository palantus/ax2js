"use strict";

var fs  = require("fs");
var jison = require("jison");
var beautify = require('js-beautify').js_beautify;
var overrides = require('../../input/overrides.js');
var debug = false;

var XPP2JSParser = require("../parsers/xpp2ast.js").parser;

class xpp2ast{

	constructor(elements){
		this.elements = elements;
	}

	setElements(elements){
		this.elements = elements;
	}

	compile(onFinished){
		//console.log("");
		//console.log("Starting compilation of methods");
		var self = this;
		this.methodCount = 0;
		this.compiledCount = 0;
		this.onFinished = onFinished;

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "class" || e.type == "table"){
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].source == "")
						continue;

					this.methodCount++;
					setTimeout(function(source, i, m){self.compileMethod(source, i, m);}, 1, e.methods[m].source, i, m);
				}
			}
		}
	}

	compileMethod(source, i, m){

    fs.appendFileSync("server/logs/xpp2ast.txt", "/* XPP SOURCE: */\n" + source + "\n\n\n");

		/* Compile source code */
    //console.log("Compiling " + this.elements[i].name + "." + this.elements[i].methods[m].name)
		var ast = this.compileXPP2AST(this.elements[i], this.elements[i].methods[m], this.elements[i].name, this.elements[i].methods[m].name, source);


		/* Write output */
    this.elements[i].methods[m].ast = ast;

		fs.appendFileSync("server/logs/xpp2ast.txt", "/* AST: */\n" + beautify(JSON.stringify(ast), { indent_size: 2 }) + "\n\n\n");

		/* Check if finished compilation */
		this.compiledCount++;
		if(this.compiledCount == this.methodCount && this.onFinished !== undefined){
			console.log("Finished compilation of {0} methods".format(this.methodCount));
			this.onFinished.call(this);
		}
	}

	compileXPP2AST(element, method, className, methodName, source){
		var sourceTxt = source;

		var output = {};
		//try{
			output = XPP2JSParser.parse(sourceTxt);
		/*} catch(err){
			if(debug){
				console.log("Could not compile {0}.{1}".format(className, methodName));
			}
		}*/

		return output;
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

module.exports = xpp2ast;
