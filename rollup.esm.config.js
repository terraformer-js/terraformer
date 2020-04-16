import config from './rollup.umd.config';

config.output.format = 'esm';
config.output.file = config.output.file.replace('umd.js', 'esm.js');
delete config.output.name;

export default config;
