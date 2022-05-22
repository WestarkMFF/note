import path from "path"
import babel from "rollup-plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import postcss from "rollup-plugin-postcss"

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}
const extensions = [".js", ".ts"]

module.exports = {
  input: resolve("./src/index.ts"),

  output: {
    file: resolve("./dist/index.js"),
    format: "esm",
  },

  plugins: [
    nodeResolve({
      extensions,
    }),
    babel({
      exclude: "node_modules/**",
      extensions,
    }),

    postcss({
      extract: resolve("./dist/style.css"),
    }),
  ],
}
