import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from '@rollup/plugin-babel';

const path = require('path');

/**
 * Since Rollup runs inside each package
 * we can just get the current package we are bundling.
 */
const pkg = require(path.join(process.cwd(), 'package.json'));

const copyright = `/* @preserve
* ${pkg.name} - v${pkg.version} - ${pkg.license}
* Copyright (c) 2012-${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${new Date().toString()}
*/`;

/**
 * and dig out its name.
 */
const { name } = pkg;
const sanitizedName = name.replace('@terraformer/', 't-');

export default {
  input: 'src/index.js', // resolved by our plugin
  plugins: [
    resolve(),
    json(),
    babel({ presets: ['@babel/preset-env'] })
  ],
  output: {
    file: `./dist/${sanitizedName}.umd.js`,
    banner: copyright,
    format: 'umd',
    name: 'Terraformer',
    extend: true
  }
};
