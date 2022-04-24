import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "duck~about" */ "../views/About.vue"),
  },
  {
    path: "/table",
    name: "table",
    component: () => import("../views/Table.vue"),
  },
  {
    path: "/slot",
    name: "slot",
    component: () => import("../views/Slot.vue"),
  },
  {
    path: "/slotTest",
    name: "slotTest",
    component: () => import("../views/SlotTest.vue"),
  },
  { path: "/slotJsx", name: "slotJsx", component: () => import("../views/SlotJsx.vue") },
  { path: "/ali", name: "ali", component: () => import("../views/Ali.vue") },
]

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
})

export default router
