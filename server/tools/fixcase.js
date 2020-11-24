"use strict";

class FixCase{
	constructor(elements){
		this.elements = elements;
	}

	run(){
		console.log("Running fix case");

		var importantNames = new Map();
		var lessImportantNames = new Map();
		var evenLessImportantNames = new Map();

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];

			importantNames.set(e.name.toLowerCase(), e.name);

			if(e.type == "class" || e.type == "table"){
				for(var m = 0; m < e.methods.length; m++){
					//names.add(e.methods[m].name);
					lessImportantNames.set(e.methods[m].name.toLowerCase(), e.methods[m].name);
				}
			}

			if(e.type == "table"){
				for(var m = 0; m < e.fields.length; m++){
					//names.add(e.fields[m].name);
					evenLessImportantNames.set(e.fields[m].name.toLowerCase(), e.fields[m].name);
				}
			}
		}
		//console.log(names);

		var names = evenLessImportantNames;

		for (var value of lessImportantNames.values()) {
			names.set(value.toLowerCase(), value);
		}
		for (var value of importantNames.values()) {
			names.set(value.toLowerCase(), value);
		}

		console.log("Found " + (names.size) + " unique names");
/*
		var importantNamesArray = Array.from(importantNames.values()).sort(function(a, b){return a.length - b.length;});
		var lessImportantNamesArray = Array.from(lessImportantNames.values()).sort(function(a, b){return a.length - b.length;});
		var evenLessImportantNamesArray = Array.from(evenLessImportantNames.values()).sort(function(a, b){return a.length - b.length;});
*/
	var namesArray = Array.from(names.values()).sort(function(a, b){return a.length - b.length;});

		for(var i = 0; i < this.elements.length; i++){
			var e = this.elements[i];

			e.name = names.get(e.name.toLowerCase());

			if(e.type == "class" || e.type == "table"){
				for(var m = 0; m < e.methods.length; m++){
					e.methods[m].name = names.get(e.methods[m].name.toLowerCase());
					//e.methods[m].source = this.replaceAll(e.methods[m].source, evenLessImportantNamesArray);
					//e.methods[m].source = this.replaceAll(e.methods[m].source, lessImportantNamesArray);
					//e.methods[m].source = this.replaceAll(e.methods[m].source, importantNamesArray);
					e.methods[m].source = this.replaceAll(e.methods[m].source, namesArray);

					//TODO: Query er important så den overskriver queryRange med QueryRange...!
				}
			}

			if(i % 100 == 0 && i > 0)
				console.log("" + i + "/" + this.elements.length);
		}

		console.log("Done fixing case");
	}

	replaceName(name, map1, map2, map3){
		if(map3.has(name.toLowerCase()))
			return map3.get(name.toLowerCase());
		if(map2.has(name.toLowerCase()))
			return map2.get(name.toLowerCase());
		if(map1.has(name.toLowerCase()))
			return map1.get(name.toLowerCase());

		return name;
	}

	replaceAll(source, names){
		var localSource = source;
		for (var value of names) {
			var re = new RegExp(value,"gi");
			localSource = localSource.replace(re, value);
		};

		return localSource;
	}
}

module.exports = FixCase;
