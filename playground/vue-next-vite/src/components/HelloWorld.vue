<template>
  <h1>{{ msg }}</h1>

  <input type="text" v-model="count" />
  <DevComp :msg="msg" :count="count"></DevComp>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from "vue";
import DevComp from "./DevComp.vue";

const count = ref(0);
const msg = ref("hello world");
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
