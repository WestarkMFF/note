const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    thirdPartLib: ["vue", "vuex", "vue-router", "element-ui"],
  },

  output: {
    filename: "[name].dll.js",
    path: path.resolve("dll"),
    library: "[name]_dll_[hash]",
  },

  plugins: [
    new webpack.DllPlugin({
      name: "[name]_dll_[hash]",
      path: path.join(__dirname, "dll", "manifest.json"),
    }),
  ],
}
