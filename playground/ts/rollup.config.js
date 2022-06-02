import path from "path"
import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import replace from '@rollup/plugin-replace'

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

const extensions = [".js", ".ts"]

module.exports = {
  input: resolve("./src/main.ts"),

  output: {
    file: resolve("./dist/index.js"),
    format: "iife",
  },

  plugins: [
    nodeResolve({ extensions }),
    babel({
      exclude: "node_modules/**",
      extensions,
    }),
		replace({
			"process.env.NODE_ENV": false
		})
  ],
}
