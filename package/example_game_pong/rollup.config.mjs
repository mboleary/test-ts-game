import commonjs from "@rollup/plugin-commonjs";
import resolve from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: "build/index.js",
    output: {
        file: "dist/bundle.js",
        format: "es"
    },
    plugins: [commonjs(), resolve({
        moduileDirectories: ['node_modules']
    })]
}