var macros = function(){};

var container = function(){};
container._new = function(){};

var boolean = function(){};
boolean._new = function(){};

var Boolean = boolean;
var bool = boolean;

var date = function(){};
date._new = function(){return new Date()};
date._getNull = function(){return date._new()}

var Map = function(){};
Map._new = function(){return new Map();};

var int = function(){};
int._new = function(){return 0;};
int._getNull = function(){return int._new()}

var TableBuffer = function(){
	this.recId = 0;
}
TableBuffer.prototype.setTmp = function(){};
/*
TableBuffer.prototype._newQuery = function(){
	console.log("New query")
	this._query = {table: this.tableName};
	return this;
};
TableBuffer.prototype.firstonly = function(){
	console.log("firstonly select")
	this._query.firstonly = true;
	return this;
};
TableBuffer.prototype.select = function(){
	console.log("Running query")
	console.log(this._query);
	return this;
};
TableBuffer.prototype.where = function(){
	console.log("where")
	return this;
};
*/
TableBuffer.prototype.valueOf = function(){
	return this.recId;
};
TableBuffer.prototype._hasValue = function(){
	return this.recId > 0 ? true : false;
};
TableBuffer.prototype.initvalue = function(){
	
};
TableBuffer.prototype.insert = async function(){
	console.log("Inserting into " + this.tableName, this.getRecordObj())
};

TableBuffer.prototype.getRecordObj = function(){
	let ret = {};
	for(let f in this.fields)
		ret[f] = this[f];
	return ret;
}

/*

class TableBuffer{
	constructor(){
		this.curRecId = 0;
	}
	setTmp(){

	}

	valueOf(){
		return this.curRecId;
	}
}
 */