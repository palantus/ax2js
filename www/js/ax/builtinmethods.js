var maxdate = function(){return new Date(2154, 12, 31)};
var conNull = function(){return []};
var ConNull = conNull;
var connull = conNull;

var tableNum = function(tab){return 0;} //TODO: fix tableNum
var fieldNum = function(tab, field){return 0;} //TODO: fix fieldNum

var int2str = function(i){return ""+i}

var strfmt = function(txt) {
	var args = arguments;
	return txt.replace(/%(\d+)/g, function(match, number) {
		return typeof args[number] != 'undefined'
		? args[number]
		: match
		;
	});
};
