var overrides = [
	{name: "SysQuery", method: "mergeRanges", convertSource: function(source){
		return source.replace("if (!addSamefieldrange) continue;", "if (!addSamefieldrange) return;");
	}}
];
module.exports = overrides;
