import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/index.ts",
  output: {
    file: "build/bundle.js",
    format: "cjs"
  },
  plugins: [
    typescript({ sourceMap: true }),
    commonjs(),
    resolve({
      moduileDirectories: ['node_modules'],
      browser: true
    }),
  ]
}