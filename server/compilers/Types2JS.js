"use strict";

var fs  = require("fs");
var beautify = require('js-beautify').js_beautify;

class Type2JS{

	constructor(elements){
		this.elements = elements;
		this.num = 0;
	}

	setElements(elements){
		this.elements = elements;
	}

	compile(){
		//console.log("");
		//console.log("Starting compilation of types"	);

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "enum"){
				this.compileEnum(e);
				this.num++;
			} else if(e.type == "edt"){
				this.compileEDT(e);
				this.num++;
			}
		}

		console.log("Finished compilation of {0} types".format(this.num));
	}

	compileEDT(e){
		var js = this.compileBasicType(e);
		switch(e.subtype){
			case "UTS": //String
				js += "{0}._new = function(){return '';};".format(e.name);
				break;
			case "UTI": //Int
			case "UTW": //Int64
			case "UTE": //EDT Enum
				js += "{0}._new = function(){return 0;};".format(e.name);
				break;
			case "UTQ": //Container
				js += "{0}._new = function(){return [];};".format(e.name);
				break;
			case "UTR": //Real
				js += "{0}._new = function(){return 0.0;};".format(e.name);
				break;
			case "UTZ": //DateTime
			case "UTD": //Date
				js += "{0}._new = function(){return new Date();};".format(e.name);
		}

    js += "{0}._getNull = function(){return this._new();};".format(e.name);
		js += "var {0} = {0};".format(e.name);

		e.jsSource = beautify(js, { indent_size: 2 });
	}

	compileEnum(e){
		var js = this.compileBasicType(e);
		js += "{0}._new = function(){return 0;};".format(e.name);

		for(var i = 0; i < e.values.length; i++){
			js += "{0}.{1} = {2};".format(e.name, e.values[i].Name, e.values[i].EnumValue);
		}

		js += "var {0} = {0};".format(e.name);

		e.jsSource = beautify(js, { indent_size: 2 });
	}

	compileBasicType(e){
		var js = "var {0} = function(){};".format(e.name);

		return js;
	}

	writeToFile(filename){

		if(fs.existsSync(filename))
			fs.unlink(filename);

		var output = "";

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "enum" || e.type == "edt"){
				output += "\n" + e.jsSource + "\n";
			}
		}

		output = beautify(output, { indent_size: 2 });
		fs.appendFileSync(filename, output);
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

module.exports = Type2JS;
