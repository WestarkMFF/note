<template>
  <button class="z-button z-button_normal">z-button</button>
  <button class="z-button z-button_primary">z-button_primary</button>
  <button class="z-button z-button_text">z-button_text</button>
  <h1>{{ msg }}</h1>

  <a-button size="small" status="danger" @click="onOpenMessage">test1</a-button>

  <input type="text" v-model="count" />
  <DevComp :msg="msg" :count="count"></DevComp>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from "vue"
import { Message } from "@arco-design/web-vue"
import DevComp from "./DevComp.vue"

const count = ref(0)
const msg = ref("hello world")

function onOpenMessage() {
  Message.info({
    content: "fuck",
    duration: 204800000,
    closable: true,
  })
}
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

.z-button {
  /** normalize button */
  margin: 0;
  font-size: 100%;
  font-family: inherit;
  line-height: 1.15;

  /** custom style */
  height: 28px;
  padding: 0 15px;
  font-size: 14px;
  border: 1px solid transparent;
  border-radius: 2px;

  white-space: nowrap;
  outline: none;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0, 0, 1, 1);
  -webkit-appearance: none;
  user-select: none;

  display: inline-flex;
  align-items: center;
}

.z-button_normal {
  color: #656d7a;
  background: #f2f3f5;
}

.z-button_normal:hover {
  background: #e5e6eb;
}

.z-button_normal:active {
  background: #cacdd3;
}

.z-button_primary {
  color: #fff;
  background: #2c5ff6;
}

.z-button_primary:hover {
  background: #5080f7;
}

.z-button_primary:active {
  background: #1d44ca;
}

.z-button_text {
  background: transparent;
  color: #3961ed;
}

.z-button_text:hover {
  background: #f2f3f5;
}

.z-button_text:active {
  background: #e5e6eb;
}
</style>
