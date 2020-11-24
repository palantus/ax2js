"use strict";

var fs  = require("fs");
var beautify = require('js-beautify').js_beautify;

class Table2JS{

	constructor(elements){
		this.elements = elements;
		this.num = 0;
	}

	setElements(elements){
		this.elements = elements;
	}

	compile(){
		//console.log("");
		//console.log("Starting compilation of tables");

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "table"){
				this.compileTable(e);
				this.num++;
			}
		}

		console.log("Finished compilation of {0} tables".format(this.num));
	}

	compileTable(e){
		var js = "var {0} = function(){TableBuffer.apply(this, arguments);".format(e.name);

		for(var i = 0; i < e.methods.length; i++){
			if(!e.methods[i].isStatic){
				js += "\n" + e.methods[i].jsSource + "\n";
			}
		}

		for(var i = 0; i < e.fields.length; i++){
			js += "this." + e.fields[i].name + " = '';"; //TODO: correct initial value
		}

		js += `this.fields = ${e.name}.fields;`

		js += "}";

		for(var i = 0; i < e.methods.length; i++){
			if(e.methods[i].isStatic){
				js += "\n" + e.methods[i].jsSource + "\n";
			}
		}



		js += "{0}._new = function(){var ret = new {0}(); ret.tableName = '{0}'; return ret;};".format(e.name);
		js += "{0}.prototype = TableBuffer.prototype;".format(e.name);
		js += "{0}.prototype.constructor = {0};".format(e.name);

		js += "{0}._getNull = function(){return {0}._new();};".format(e.name);
//		js += "Type_{0}.prototype.select = function(){console.log('Run select here');};".format(e.name);

		js += `${e.name}.fields = {`;
			for(var i = 0; i < e.fields.length; i++){
				js += `${i>0?", ":""}${e.fields[i].name}: ${JSON.stringify(e.fields[i].properties)}`
			}
		js += "};"


		e.jsSource = beautify(js, { indent_size: 2 });
	}

	writeToFiles(folder){
		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];
			if(e.type == "table"){
				var filename = folder + "/" + e.name + ".js";

				if(fs.existsSync(filename))
					fs.unlinkSync(filename);

				var output = "";
				output += "\n" + e.js + "\n";

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

module.exports = Table2JS;
