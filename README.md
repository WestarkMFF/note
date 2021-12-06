#  ☄️ FE notebook

- [webpack](#webpack)
	* [webpack-bundle-analyzer](#webpack-bundle-analyzer)

### webpack
#### webpack-bundle-analyzer
> Visualize size of webpack output files with an interactive zoomable treemap.
 
install
```shell
# Yarn
yarn add -D webpack-bundle-analyzer
```

usage

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```
