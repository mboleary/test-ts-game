import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import { config } from "dotenv";

const parsedConfig = config().parsed;
const configToReplace = {
    NODE_ENV: 'production'
};

if (parsedConfig) {
    for (const [key, v] of Object.entries(parsedConfig)) {
        configToReplace[`process.env.${key}`] = `'${v}'`;
    }
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: "build/index.js",
    output: {
        file: "dist/bundle.js",
        format: "es"
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
            // 'process.env': JSON.stringify(configToReplace)
            'process.env.NODE_ENV': '"production"'
        }
      }),
      commonjs(),
      resolve({
        moduleDirectories: ['node_modules']
      }),
      json(),
    ]
}
