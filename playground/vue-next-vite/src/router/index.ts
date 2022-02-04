import { createRouter, createMemoryHistory, createWebHistory } from "vue-router"

const routes = [
  {
    path: "",
    name: "index",
    component: () => import("../components/HelloWorld.vue"),
  },
]

const router = createRouter({
  history: createWebHistory("viteApp"),
  routes,
})

export default router
