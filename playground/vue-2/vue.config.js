// const path = require("path")

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
// const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin")
// const webpack = require("webpack")

module.exports = {
  devServer: {
    port: 2233,
  },
  configureWebpack: {
    plugins: [
      //   new BundleAnalyzerPlugin(), // webpack đŠćæ
      //   new webpack.DllReferencePlugin({
      //     manifest: require("./dll/manifest.json"),
      //   }),
      //   new AddAssetHtmlPlugin({
      //     filepath: path.resolve(__dirname, "./dll/thirdPartLib.dll.js"),
      //   }),
    ],
  },
}
