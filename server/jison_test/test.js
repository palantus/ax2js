// myparser.js
var fs = require("fs");
var jison = require("jison");
var beautify = require('js-beautify').js_beautify;

var bnf = fs.readFileSync("xpp_tojs.jison", "utf8");
var parser = new jison.Parser(bnf);

var pr = fs.readFileSync("test3.xpp", "utf8");

var output = parser.parse(pr);
console.log(beautify(output, { indent_size: 2 }));

module.exports = parser;