#  ☄️ FE notebook

- [webpack](#webpack)
	* [plugin: webpack-bundle-analyzer](#webpack-bundle-analyzer)
	* [plugin: add-asset-html-webpack-plugin](#add-asset-html-webpack-plugin)

### webpack
<h4 id='webpack-bundle-analyzer'>webpack-bundle-analyzer</h4>
> Visualize size of webpack output files with an interactive zoomable treemap.
 
install
```shell
# Yarn
yarn add webpack-bundle-analyzer -D
```

usage
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// webpack.config.js
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}
```

<h4 id='add-asset-html-webpack-plugin'>add-asset-html-webpack-plugin</h4>
> Add a JavaScript or CSS asset to the HTML generated by html-webpack-plugin

install
```shell
yarn add add-asset-html-webpack-plugin -D
```
