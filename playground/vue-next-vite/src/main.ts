import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"

import './utils/init.ts'

const app = createApp(App)

app.use(router)
app.mount("#app")
// createApp(App).mount('#app')
