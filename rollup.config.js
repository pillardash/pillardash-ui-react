import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const preserveUseClient = {
  name: "preserve-use-client",
  generateBundle(options, bundle) {
    for (const [, chunk] of Object.entries(bundle)) {
      if (chunk.type === "chunk") {
        const hasUseClient = Object.keys(chunk.modules || {}).some(
          (moduleId) => {
            try {
              const fs = require("fs");
              if (fs.existsSync(moduleId) && moduleId.endsWith(".tsx")) {
                const content = fs.readFileSync(moduleId, "utf8");
                return content.trim().startsWith('"use client"');
              }
            } catch (e) {}
            return false;
          },
        );

        if (hasUseClient && !chunk.code.includes('"use client"')) {
          chunk.code = '"use client";\n' + chunk.code;
        }
      }
    }
  },
};

const sharedPlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  preserveUseClient,
  terser(),
];

export default [
  // CJS output
  {
    input: "src/index.ts",
    output: {
      dir: "dist/cjs",
      format: "cjs",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
      entryFileNames: "[name].js",
    },
    plugins: sharedPlugins,
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
      entryFileNames: "[name].mjs",
    },
    plugins: sharedPlugins,
    external: ["react", "react-dom"],
  },
  // Type declarations
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
