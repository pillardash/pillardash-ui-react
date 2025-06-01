import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            // Add this custom plugin to preserve "use client" directives
            {
                name: 'preserve-use-client',
                generateBundle(options, bundle) {
                    for (const [fileName, chunk] of Object.entries(bundle)) {
                        if (chunk.type === 'chunk') {
                            // Check if any of the modules in this chunk had "use client"
                            const hasUseClient = Object.keys(chunk.modules || {}).some(moduleId => {
                                // Read the original file to check for "use client"
                                try {
                                    const fs = require('fs');
                                    if (fs.existsSync(moduleId) && moduleId.endsWith('.tsx')) {
                                        const content = fs.readFileSync(moduleId, 'utf8');
                                        return content.trim().startsWith('"use client"');
                                    }
                                } catch (e) {
                                    // Fallback to checking code content
                                }
                                return false;
                            });

                            // If any module had "use client", add it to the bundle
                            if (hasUseClient && !chunk.code.includes('"use client"')) {
                                chunk.code = '"use client";\n' + chunk.code;
                            }
                        }
                    }
                }
            },
            terser(),
            postcss(),
        ],
        external: ["react", "react-dom"],
    },
    {
        input: "src/index.ts",
        output: [{ file: packageJson.types }],
        plugins: [dts.default()],
        external: [/\.css$/],
    },
];