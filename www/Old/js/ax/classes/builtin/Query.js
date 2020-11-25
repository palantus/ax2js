var Query = function(){}
Query._new = function(){return new Query();};
Query.prototype.addDataSource = function(tabId){
	var ret = new QueryBuildDataSource();
	ret.query = this;
	return ret;
};

var QueryBuildDataSource = function(){};
QueryBuildDataSource._new = function(){return null;};
QueryBuildDataSource.prototype.addRange = function(fieldId){
	var ret = new QueryBuildRange();
	ret.query = this.query;
	ret.ds = this;
	return ret;
};
QueryBuildDataSource.prototype.addSelectionField = function(fieldId, type){

};


var QueryBuildRange = function(){this._value = ""};
QueryBuildRange._new = function(){return new QueryBuildRange();};
QueryBuildRange.prototype.value = function(val){this._value = val; return this._val;};

var QueryRun = function(){this.lastRecord = 1; this.curRecord = 0;};
QueryRun._new = function(){return null;};
QueryRun.prototype.next = function(){
	if(this.curRecord < this.lastRecord){
		this.curRecord++;
		return true;
	} else {
		return false
	}
};
QueryRun.prototype.get = function(tab){
	var record = Type_LessorPaytypeTransaction._new();
	record.LessorPaytypeAmount = 123;
	return record;
};


var Type_Query = Query;
var Type_QueryBuildDataSource = QueryBuildDataSource;
var Type_QueryBuildRange = QueryBuildRange;
var Type_QueryRun = QueryRun;
