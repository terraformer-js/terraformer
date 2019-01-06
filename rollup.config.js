import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

const path = require('path');

/**
 * Since Rollup runs inside each package we can just get the current
 * package we are bundling.
 */
const pkg = require(path.join(process.cwd(), 'package.json'));

/**
 * and dig out its name.
 */
const { name } = pkg;
const truncatedName = name.replace('@terraformer/', '');

const copyright = `/* @preserve
* ${pkg.name} - v${pkg.version} - ${pkg.license}
* Copyright (c) 2012-${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${new Date().toString()}
*/`;

export default {
  input: 'index.js', // resolved by our plugin
  plugins: [resolve(), json()],
  output: {
    file: `./dist/${truncatedName}.umd.js`,
    banner: copyright,
    format: 'umd',
    name: `Terraformer`,
    sourcemap: true,
    extend: true
  }
};
