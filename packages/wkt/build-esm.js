const fs = require('fs');
const jison = require('jison');

const grammar = fs.readFileSync('./src/wkt.yy', 'utf8');
let wrapper = fs.readFileSync('./src/wkt.js', 'utf8');

const Parser = jison.Parser;
const parser = new Parser(grammar);

// generate source, ready to be written to disk using a jison fork to get a es module output: https://github.com/zaach/jison/pull/326
const parserSource = parser.generate({ moduleType: 'es' });

wrapper = wrapper.replace('\'SOURCE\';', parserSource);
fs.writeFileSync('./src/index.js', wrapper, 'utf8');
