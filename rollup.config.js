import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

const name = 'PerfectPlaceholder';
const path = 'dist/perfect-placeholder';
const globals = {
  'react-dom': 'ReactDOM',
  react: 'React',
};
const external = Object.keys(globals);


export default [
  {
    input: 'src/index.tsx',
    output: {
      file: pkg.module,
      format: 'esm',
    },
    external,
    plugins: [typescript()],
  },

  {
    input: 'src/index.tsx',
    output: {
      name,
      file: path + '.js',
      format: 'umd',
      globals,
    },
    external,
    plugins: [typescript(), resolve(), commonjs()],
  },

  {
    input: 'src/index.tsx',
    output: {
      name,
      file: path + '.min.js',
      format: 'umd',
      globals,
    },
    external,
    plugins: [typescript(), resolve(), commonjs(), terser()],
  },
];
