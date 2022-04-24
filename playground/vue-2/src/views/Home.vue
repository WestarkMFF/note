<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
}
</script>

<style lang="less">
.v-modal {
  z-index: -3 !important;
}
.el-message-box__wrapper {
  z-index: -1 !important;
}
</style>
