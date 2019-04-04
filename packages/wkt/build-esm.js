var fs = require('fs');
var jison = require('jison');

var grammar = fs.readFileSync('./wkt.yy', 'utf8');
var wrapper = fs.readFileSync('./wkt.js', 'utf8');

var Parser = jison.Parser;
var parser = new Parser(grammar);

// generate source, ready to be written to disk using a jison fork to get a es module output: https://github.com/zaach/jison/pull/326
var parserSource = parser.generate({ moduleType: 'es' });

wrapper = wrapper.replace('\'SOURCE\';', parserSource);
fs.writeFileSync('./index.js', wrapper, 'utf8');
