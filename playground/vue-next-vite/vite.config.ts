import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

import Components from "unplugin-vue-components/vite"
import { ArcoResolver } from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/viteApp/",
  plugins: [vue(), Components({ resolvers: [ArcoResolver()] }), vueJsx()],
})
