"use strict";

class XPOReader{

	constructor(){
		this.readerFunction = function(line){};
		this.elements = [];
		this.state = {};
		this.onFinished = function(){};
		this.currentTypeId = "";
	}

	static readMultipleXPOs(filenames, callback){
		var numFiles = filenames.length;
		var finishedImports = 0;
		var allElements = [];
		for(var i = 0; i < numFiles; i++){
			new XPOReader().readXPO(filenames[i], function(elements){
				finishedImports++;
				allElements = allElements.concat(elements);

				if(finishedImports == numFiles){
					callback.call(this, allElements);
				}
			});
		}
	}

	readXPO(filename, onFinished){
		var t = this;
		var rl = require('readline').createInterface({
			terminal: false,
			input: require('fs').createReadStream(filename)
		});

		rl.on('line', function (line) {
			if(line.lastIndexOf("***Element: ", 0) == 0){
				t.currentTypeId = line.substring(12);
				t.readerFunction = t.getReaderFunction(t.currentTypeId)
				t.state = {};
			}

			if(t.readerFunction !== undefined)
				t.readerFunction.call(t, line, t.currentTypeId);
		});

		rl.on('close', function(){
			onFinished.call(t, t.elements);
		});
	}

	getElements(){
		//console.log(this.elements);
		return this.elements;
	}

	getReaderFunction(elementType){
		switch(elementType){
			case "DBT": //Table
				return this.readTable;
			case "DBE": //Enum
				return this.readEnum;
			case "UTS": //String
			case "UTZ": //DateTime
			case "UTI": //Int
			case "UTE": //EDT Enum
			case "UTR": //Real
			case "UTD": //Date
			case "UTW": //Int64
			case "UTQ": //Container
				return this.readEDT
			case "CLS": //Class
				return this.readClass;
      case "MNU": //Menu
        return this.readMenu;
			case "PRN": //Project
				console.log("Ignored element type " + elementType);
				break;
			case "MCR": //Macro
				console.log("Ignored element type " + elementType);
				break;
			case "END": //End node
				break;

			default:
				console.log("Unknown element type: " + elementType);
		}

		return function(line){};
	}

	readClass(line){
		if(!this.state.foundName){
			if(line.lastIndexOf("  CLASS ", 0) == 0){
				this.state.foundName = true;
				this.state.element = {name: line.substring(9), type: "class", methods: []};
			}
		} else if(line.lastIndexOf("  ENDCLASS", 0) == 0){
			this.elements[this.elements.length] = this.state.element;
			//console.log(this.elements);
		} else {
			if(line.lastIndexOf("      SOURCE #", 0) == 0){
				this.state.inMethod = true;
				this.state.currentMethod = {name: line.substring(14), source: ""};
			} else if(line.lastIndexOf("      ENDSOURCE", 0) == 0){
				this.state.inMethod = false;
				this.state.element.methods[this.state.element.methods.length] = this.state.currentMethod;
				//console.log(this.state.currentMethod);
			} else if(this.state.inMethod){
				//this.state.currentMethod.source[this.state.currentMethod.source.length] = line.substring(9);
				this.state.currentMethod.source += line.substring(9) + "\r\n";
			}
		}
	}

	readEDT(line, type){
		if(!this.state.foundName){
			if(line.lastIndexOf("  USERTYPE ", 0) == 0){
				this.state.foundName = true;
				this.state.element = {name: line.substring(12), type: "edt", subtype: type, properties: {}, arrayElements: []};
				//console.log(this.state.element.name);
			}
		} else if(line.lastIndexOf("  ENDUSERTYPE", 0) == 0){
			this.elements[this.elements.length] = this.state.element;
		} else {
			var lineSplit = line.split("#");
			if(lineSplit.length > 1){
				var prop = lineSplit[0].trim();
				var val = lineSplit[1].trim();
				this.state.element.properties[prop] = val;
          console.log(this.state.element.properties)
			}
		}
	}

	readEnum(line){
		if(!this.state.foundName){
			if(line.lastIndexOf("  ENUMTYPE ", 0) == 0){
				this.state.foundName = true;
				this.state.element = {name: line.substring(12), type: "enum", properties: {}, values: []};
				//console.log(this.state.element.name);
			}
		} else if(line.lastIndexOf("  ENDENUMTYPE", 0) == 0){
			this.elements[this.elements.length] = this.state.element;
			//console.log(this.state.element);
		} else if(line.lastIndexOf("    TYPEELEMENTS", 0) == 0){
			this.state.inEnumElements = true;
		} else if(line.lastIndexOf("    ENDTYPEELEMENTS", 0) == 0){
			this.state.inEnumElements = false;
		} else if(this.state.inEnumElements){

			if(line.trim() == "PROPERTIES"){
				this.state.curEnumVal = {};
			} else if(line.trim() == "ENDPROPERTIES"){
				this.state.element.values.push(this.state.curEnumVal);
			} else {
				var lineSplit = line.split("#");
				if(lineSplit.length > 1){
					var prop = lineSplit[0].trim();
					if(prop != ""){
						var val = lineSplit[1].trim();
						this.state.curEnumVal[prop] = val;
					}
				}
			}
		} else {
			var lineSplit = line.split("#");
			if(lineSplit.length > 1){
				var prop = lineSplit[0].trim();
				var val = lineSplit[1].trim();
				this.state.element.properties[prop] = val;
			}
		}
	}

	readMenu(line){
		if(!this.state.foundName){
			if(line.lastIndexOf("  MENU ", 0) == 0){
				this.state.foundName = true;
				this.state.element = {name: line.substring(8), type: "menu", properties: {}, menuItems: []};
				//console.log(this.state.element.name);
			}
		} else if(line.lastIndexOf("  ENDMENU", 0) == 0){
			this.elements[this.elements.length] = this.state.element;
			//console.log(this.state.element);
		} else if(line.trim() == "MENUITEM"){
			this.state.inMenuItem = true;
		} else if(line.trim() == "ENDMENUITEM"){
			this.state.inMenuItem = false;
		} else if(this.state.inMenuItem){

			if(line.trim() == "PROPERTIES"){
				this.state.curItem = {};
			} else if(line.trim() == "ENDPROPERTIES"){
				this.state.element.menuItems.push(this.state.curItem);
			} else {
				var lineSplit = line.split("#");
				if(lineSplit.length > 1){
					var prop = lineSplit[0].trim();
					if(prop != ""){
						var val = lineSplit[1].trim();
						this.state.curItem[prop] = val;
					}
				}
			}
		} else {
			var lineSplit = line.split("#");
			if(lineSplit.length > 1){
				var prop = lineSplit[0].trim();
				var val = lineSplit[1].trim();
				this.state.element.properties[prop] = val;
			}
		}
	}

	readTable(line){
		var lineTrimmed = line.trim();
		if(!this.state.foundName){
			if(line.lastIndexOf("  TABLE ", 0) == 0){
				this.state.foundName = true;
				this.state.element = {name: line.substring(9), type: "table", properties: [], fields: [], methods: []};
				//console.log(this.state.element.name);
			}
		} else if(line.lastIndexOf("  ENDTABLE", 0) == 0){
			this.elements[this.elements.length] = this.state.element;
			//console.log(this.state.element);

		// FIELDS
		} else if(line.lastIndexOf("    FIELDS", 0) == 0){
			this.state.inFields = true;
		} else if(line.lastIndexOf("    ENDFIELDS", 0) == 0){
			this.state.inFields = false;
		} else if(this.state.inFields){

			if(lineTrimmed == "PROPERTIES"){
				this.state.curField = {name: "", properties: {}};
			} else if(lineTrimmed == "ENDPROPERTIES"){
				this.state.curField.name = this.state.curField.properties.Name;
				this.state.element.fields.push(this.state.curField);
				this.state.curField = null;
			} else if(lineTrimmed == "ExtendedDataType"){
				this.state.inFIELDEDT = true;
			} else if(this.state.inFIELDEDT){
				if(lineTrimmed == "ENDARRAY")
					this.state.inFIELDEDT = false;

				var split = line.split("#");
				if(split.length > 1 && split[1] != ""){
					this.state.curField.properties.edt = split[1];
				}
			} else if(this.state.curField){
				var lineSplit = line.split("#");
				if(lineSplit.length > 1){
					var prop = lineSplit[0].trim();
					if(prop != ""){
						var val = lineSplit[1];
						this.state.curField.properties[prop] = val;
					}
				}
			}

		// Groups
		} else if(line.lastIndexOf("    GROUPS", 0) == 0){
			this.state.inGroups = true;
		} else if(this.state.inGroups){
			if(line.lastIndexOf("    ENDGROUPS", 0) == 0)
				this.state.inGroups = false;


		// INDICES
		} else if(line.lastIndexOf("    INDICES", 0) == 0){
			this.state.inIndices = true;
		} else if(this.state.inIndices){
			if(line.lastIndexOf("    ENDINDICES", 0) == 0)
				this.state.inIndices = false;


		// REFERENCES
		} else if(line.lastIndexOf("    REFERENCES", 0) == 0){
			this.state.inReferences = true;
		} else if(this.state.inReferences){
			if(line.lastIndexOf("    ENDREFERENCES", 0) == 0)
				this.state.inReferences = false;


		// DELETEACTIONS
		} else if(line.lastIndexOf("    DELETEACTIONS", 0) == 0){
			this.state.inDeleteActions = true;
		} else if(this.state.inDeleteActions){
			if(line.lastIndexOf("    ENDDELETEACTIONS", 0) == 0)
				this.state.inDeleteActions = false;


		// METHODS
		} else if(line.lastIndexOf("    METHODS", 0) == 0){
			this.state.inMethods = true;
			this.state.curMethod = null;
		} else if(this.state.inMethods){
			if(line.lastIndexOf("    ENDMETHODS", 0) == 0){
				this.state.inMethods = false;
				return;
			}

			if(line.lastIndexOf("      SOURCE #", 0) == 0){
				this.state.curMethod = {name: line.substring(14), source: ""};
			} else if(line.lastIndexOf("      ENDSOURCE", 0) == 0){
				this.state.element.methods.push(this.state.curMethod);
			} else if(this.state.curMethod){
				this.state.curMethod.source += line.substring(9) + "\r\n";
				//this.state.curMethod.source.push(line.substring(9));
			}



		} else {
			var lineSplit = line.split("#");
			if(lineSplit.length > 1){
				var prop = lineSplit[0].trim();
				var val = lineSplit[1];
				this.state.element.properties[prop] = val;
			}
		}
	}
}

module.exports = XPOReader;
