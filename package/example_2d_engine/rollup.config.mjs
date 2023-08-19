/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: "build/index.js",
    output: {
        file: "dist/bundle.js",
        format: "cjs"
    }
}