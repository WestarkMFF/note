#  ☄️ FE notebook for learn and quickLook

- JS
  * [判断多个 `简单数据类型` 相等](https://github.com/WestarkMFF/note/blob/main/playground/js/multipleSimpleDataEqual.js)
  * 操作 `url` 参数

- [webpack](#webpack)
	* [plugin: webpack-bundle-analyzer](#webpack-bundle-analyzer)
	* [plugin: add-asset-html-webpack-plugin](#add-asset-html-webpack-plugin)

- [git](#git)
	* [gitignore](#gitignore)

- [html](#html)
	* [link 标签](#tag_link)

- [vue-cli](#vue-cli)
    * [vue cli inspect](#vueCli_inspect)

- [vite](#vite)
    * [vite.config.js](#viteConfigJs)

- [vue](#vue)
    * [vue3 使用 vue-router](#vue3vueRouter)

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


usage
```js

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

new AddAssetHtmlPlugin({
  filepath: path.resolve(__dirname, './build/*.dll.js'),
})
```


## git
### gitignore
`.gitignore`文件是用来防止本地文件被上传到 git 上，文件位置和 .git📁 同一层级

```shell
node_modules/*
.vscode/*

# **/xxx 用来表示任意层级的 xxx 文件夹
**/node_modules/*

```
## html
### 什么是 `html` 标签？
标签规定了**元素**，是构成 web 世界的一砖一瓦
<h3 id='tag_link'>link 标签</h3>
`link` 标签是**HTML外部资源链接元素**，`link`标签最常用于链接`css`

## vue-cli
### 什么是 `vue-cli`？
`vue-cli` 本质上是一个为 vue 定制的、基于 webpack 封装的一个cli。
提供了开箱即用的 css 编译器、typescript、eslint、单元测试...

<h3 id='vueCli_inspect'>vue cli inspect</h3>
`inspect` 参数可以输出当前使用的 webpack 配置

> 该命令会将解析出来的 webpack 配置、包括链式访问规则和插件的提示打印到 stdout。

usage
```shell
npx vue-cli-service inspect
# or
vue inspect

# 输出到文件方便查看
vue inspect > output.js
```


## vite
<h3 id='viteConfigJs'>vite.config.js</h3>
[vite官网](https://cn.vitejs.dev/config/#assetsinclude)


## vue

<h3 id='vue3vueRouter'>vue3 使用 vue-router</h3>

```js
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  {
    path: "/index",
    name: "index",
    component: () => import("../components/HelloWorld.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router


/**
 * main.js
 * 
 * const app = createApp(App)
 * app.use(router)
 */
 ```
