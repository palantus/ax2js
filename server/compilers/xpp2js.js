"use strict";

var fs  = require("fs");
var jison = require("jison");
var beautify = require('js-beautify').js_beautify;
var overrides = require('../input/overrides.js');

var xpp2ast = require("./xpp2ast.js");
var ast2js = require("./ast2js.js");

class XPP2JS{

	constructor(elements){
		this.xpp2ast = new xpp2ast();
		this.ast2js = new ast2js();
    this.elements = elements;

		if(fs.existsSync("logs/xpp2ast.txt"))
			fs.unlink("logs/xpp2ast.txt"); //TODO: fjern cursource
			if(fs.existsSync("logs/ast2js.txt"))
				fs.unlink("logs/ast2js.txt"); //TODO: fjern cursource
	}

	setElements(elements){
		this.elements = elements;
	}

	compile(onFinished){
    var astGen = new xpp2ast(this.elements);

    var self = this;
    astGen.compile(function(){
      var jsGen = new ast2js(this.elements);

      jsGen.compile(function(){
        self.elements = this.elements;
        onFinished.call(self);
      });
    });
	}

	writeToFiles(folder){
		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "class"){
				var filename = folder + "/" + e.name + ".js";
				if(fs.existsSync(filename))
					fs.unlinkSync(filename);

				if(e.writeFile === false)
					continue;

        /*
				//var output = "\"use strict\";\n\nclass {0}{\n".format(e.name);
				var output = "";

				// Find class declaration
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name == "classDeclaration"){
						output += "\n" + e.methods[m].jsSource + "\n";
					}
				}

				// Find class methods
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name != "classDeclaration" && !e.methods[m].isStatic){
						output += "\n" + e.methods[m].jsSource + "\n";
					}
				}

				output+= "\nthis._getNull = function(){return null;};";
				output+= "\n}";

				// Find static methods
				for(var m = 0; m < e.methods.length; m++){
					if(e.methods[m].name != "classDeclaration" && e.methods[m].isStatic){
						output += "\n" + e.methods[m].jsSource + "\n";

						if(e.name == "Global")
							output += "\nvar " + e.methods[m].name + " = Type_Global." + e.methods[m].name + ";\n";
					}
				}

				output += "\n__classDeclaration__._new = function(){return null;};";
				output += "var {0} = Type_{0};".format(e.name);


				output = output.replace(/__classDeclaration__/g, "Type_" + e.name);

				output = beautify(output, { indent_size: 2 });
        */
				fs.appendFileSync(filename, e.jsSource);
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
