const exec = require('child_process').exec;

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);

// get all the folders insides the packages/ folder
const packages = getDirectories('packages').reverse();

for (var i = 0, len = packages.length; i < len; i++) {
  // use babel to transpile the source and pass each test to the Node.js CLI
  exec(`babel-node ${packages[i]}/test/index.js [ babelify --presets @babel/preset-env ] | faucet`, function (err, res) {
    if (!err) {
      console.log(res);
    }
  });
}
