import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";

import "./utils/init.ts";

const app = createApp(App);

app.use(ArcoVue);
app.use(router);
app.mount("#app");
