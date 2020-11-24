"use strict";

var XPOReader = require("./XPOReader.js")
var XPPCompiler = require("./compilers/xpp2js.js")
var Types2JS = require("./compilers/Types2JS.js")
var Table2JS = require("./compilers/Table2JS.js")
var FixCase = require("./tools/fixcase.js")
var MetadataHandler = require("./metadatahandler.js")
var fs  = require("fs");

/* Read XPO */
/*
var reader = new XPOReader();
reader.readXPO('input/projekt_med_calc.xpo', function(){
	var elements = reader.getElements();

	// Comvert to Javascript source
	var compiler = new XPPCompiler(elements);
	compiler.compile(function(){
		this.writeToFiles('./www/js/ax/classes')

		var reader = new XPOReader();
		reader.readXPO('input/Class_Global.xpo', function(){
			var elements = reader.getElements();
			compiler.setElements(elements);
			compiler.compile(function(){
				this.writeToFiles('./www/js/ax/classes')
			});
		});

	});
});
*/

/*
var reader = new XPOReader();
reader.readXPO('input/EDTandENUM.xpo', function(){
	var elements = reader.getElements();

	// Comvert to Javascript source
	var compiler = new Types2JS(elements);
	compiler.compile();
	compiler.writeToFile('./www/js/ax/types/Types.js');

	var compiler = new Types2JS(require("./input/systypes.js"));
	compiler.compile();
	compiler.writeToFile('./www/js/ax/types/SysTypes.js');
});
*/

/*
var xpos = 	[
				'input/projekt_med_calc.xpo',
				'input/Class_Global.xpo',
				'input/EDTandENUM.xpo',
				'input/SysQuery.xpo' //TODO: skal have lavet en form for fil med "manual fixes", så SysQuery.findtoQbr ikke giver syntax error i JS pga. continue udenfor loop...
			];
*/

var xpos = ['./server/input/Class_Global.xpo',
            './server/input/SimpleProject.xpo'
            ]


//var xpos = ['input/testclass.xpo'];
XPOReader.readMultipleXPOs(xpos, function(elements){

	//Include sys types
	elements = elements.concat(require("./input/systypes.js"));
	//elements = require("./input/systypes.js").concat(elements);

	var fixCase = new FixCase(elements);
	fixCase.run();


	// Convert classes/methods to Javascript source
	var compiler = new XPPCompiler(elements);
	compiler.compile(async function(){

		//Write classes
		//this.writeToFiles('../www/js/ax/classes')

		// Types
		var compiler = new Types2JS(elements);
		compiler.compile();
		//compiler.writeToFile('../www/js/ax/types/Types.js');

		// SYS Types
		/*
		compiler = new Types2JS(require("./input/systypes.js"));
		compiler.compile();
		compiler.writeToFile('./www/js/ax/types/SysTypes.js');
		*/

		// Tables
		compiler = new Table2JS(elements);
		compiler.compile();
		//compiler.writeToFiles('../www/js/ax/tables');

		let meta = new MetadataHandler();
		await meta.init()
		meta.fillDependencies(this.elements);
		meta.saveElementsToDatabase(this.elements, true, function(){
			console.log("Finished writing to database")
		})
	});
});




/* Transform using Babel */
/*
var result = require("babel-core").transformFileSync("./www/js/common_source.js", {});
if(fs.existsSync("./www/js/common.js"))
	fs.unlink("./www/js/common.js");
fs.appendFileSync("./www/js/common.js", result.code)
*/
