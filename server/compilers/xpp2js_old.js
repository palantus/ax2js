"use strict";

var fs  = require("fs");
var jison = require("jison");
var beautify = require('js-beautify').js_beautify;
var overrides = require('../input/overrides.js');

var XPP2JSParser = require("../parsers/xpp2js.js").parser;

class XPP2JS{

	constructor(elements){
		this.elements = elements;
		//this.bnf = fs.readFileSync("xpp2js.jison", "utf8");
		//this.parser = new jison.Parser(this.bnf);
		//this.parser = new require("./parsers/xpp2js.js");

		if(fs.existsSync("cursource.xpp"))
			fs.unlink("cursource.xpp"); //TODO: fjern cursource
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
					if(e.methods[m].source == '')
						continue;

					this.methodCount++;
					setTimeout(function(source, i, m){self.compileMethod(source, i, m);}, 1, e.methods[m].source, i, m);
				}
			}
		}
	}

	compileMethod(source, i, m){

		/* Compile source code */
		var jsCode = this.compileXPP2JS(this.elements[i], this.elements[i].methods[m], this.elements[i].name, this.elements[i].methods[m].name, source);

		/* Handle overrides */
		jsCode = this.handleOverrides(this.elements[i], this.elements[i].methods[m], jsCode);

		/* Write output */
		this.elements[i].methods[m].source = jsCode;

		/* Check if finished compilation */
		this.compiledCount++;
		if(this.compiledCount == this.methodCount && this.onFinished !== undefined){
			console.log("Finished compilation of {0} methods".format(this.methodCount));
			this.onFinished.call(this);
		}
	}

	compileXPP2JS(element, method, className, methodName, source){
		// Note: source is an array of lines and the returned type should be an array as well
		var sourceTxt = source;


		fs.appendFileSync("cursource.xpp", "/* XPP SOURCE: */\n" + sourceTxt + "\n\n\n");
		var output = "";
		try{
			output = XPP2JSParser.parse(sourceTxt);
		} catch(err){
			console.log("Could not compile {0}.{1}".format(className, methodName));
			//console.log(err);
		}

		if(output.substring(0, 10) == "__static__"){
			method.isStatic = true;
			output = output.substring(10);
		}

		output = output.replace(/__classDeclaration__/g, "Type_" + element.name);
		output = output.replace(/super\(/g, "this.prototype." + methodName + "(");

		output = beautify(output, { indent_size: 2 });
		fs.appendFileSync("cursource.xpp", "/* JS RESULT SOURCE: */\n" + output + "\n\n\n");

		return output;
	}

	handleOverrides(e, m, source){
		var ret = source;
		for(var i = 0; i < overrides.length; i++){
			if(overrides[i].name == e.name && overrides[i].method == m.name){
				if(typeof(overrides[i].convertSource) == "function"){
					ret = overrides[i].convertSource.call(this, source);
					//console.log("override");
				}
			}
		}

		return ret;
	}

	writeToFiles(folder){
		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "class"){
				var filename = folder + "/" + e.name + ".js";
				if(fs.existsSync(filename))
					fs.unlink(filename);

				if(e.writeFile === false)
					continue;

				//var output = "\"use strict\";\n\nclass {0}{\n".format(e.name);
				var output = "";

				/* Find class declaration */
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name == "classDeclaration"){
						output += "\n" + e.methods[m].source + "\n";
					}
				}

				/* Find class methods */
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name != "classDeclaration" && !e.methods[m].isStatic){
						output += "\n" + e.methods[m].source + "\n";
					}
				}

				output+= "\nthis._getNull = function(){return null;};";
				output+= "\n}";

				/* Find static methods */
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name != "classDeclaration" && e.methods[m].isStatic){
						output += "\n" + e.methods[m].source + "\n";

						if(e.name == "Global")
							output += "\nvar " + e.methods[m].name + " = Type_Global." + e.methods[m].name + ";\n";
					}
				}

				output += "\n__classDeclaration__._new = function(){return null;};";
				output += "var {0} = Type_{0};".format(e.name);


				output = output.replace(/__classDeclaration__/g, "Type_" + e.name);

				output = beautify(output, { indent_size: 2 });

				fs.appendFileSync(filename, output);
			}
		}
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

module.exports = XPP2JS;
