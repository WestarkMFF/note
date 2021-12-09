#  ☄️ FE notebook

- JS
  * 判断多个 `简单数据类型` 相等
  * 操作 `url` 参数

- [webpack](#webpack)
	* [plugin: webpack-bundle-analyzer](#webpack-bundle-analyzer)
	* [plugin: add-asset-html-webpack-plugin](#add-asset-html-webpack-plugin)

## webpack
<h3 id='webpack-bundle-analyzer'>webpack-bundle-analyzer</h3>

[https://www.npmjs.com/package/webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

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

<h3 id='add-asset-html-webpack-plugin'>add-asset-html-webpack-plugin</h3>

> Add a JavaScript or CSS asset to the HTML generated by html-webpack-plugin

install
```shell
yarn add add-asset-html-webpack-plugin -D
```


useage

```js

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

```
