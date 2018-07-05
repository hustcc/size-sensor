/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/size-sensor.min.js',
    name: 'sizeSensor',
    format: 'umd',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({
      output: { comments: false },
      compress: { warnings: false }
    }),
  ],
};
