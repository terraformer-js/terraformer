const exec = require('child_process').exec;
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const getTestFiles = source =>
  readdirSync(source).filter(filename => filename.endsWith('test.js'));

// get all the folders insides the packages/ folder
const packages = getDirectories('packages').reverse();

for (var i = 0; i < packages.length; i++) {
  // pluck out all the files with tests in each package's test directory
  const tests = getTestFiles(`${packages[i]}/test`);
  for (var j = 0; j < tests.length; j++) {
    // use babel to transpile the source and pass each test to the Node.js CLI
    exec(`babel-node ${packages[i]}/test/${tests[j]} [ babelify --presets @babel/preset-env ] | faucet`, function (err, res) {
      console.log(res);
      if (err) {}
      // throw Error(err);
    });
  }
}
