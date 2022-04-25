<template>
  I'm DevComp <br />

  <a-input
    style="width: 240px; margin-top: 16px"
    placeholder="fuse filter"
    v-model="filterKey"
  ></a-input>
  <table-box id="testTable"></table-box>

  msg: {{ props.msg }} <br />

  count: {{ props.count }}
</template>

<script setup lang="ts">
import { ref } from "vue";
import TableBox from "./TableBox/index.vue";
import jsonData from "../assets/data.json";

const props = defineProps<{
  msg: string;
  count: string | number;
}>();

const filterKey = ref<string>("");

TableBox.instance("testTable").then((res: any) => {
  // console.log(res);
  res.init({
    data: jsonData,
    columns: [
      "id, id",
      "email, email",
      "createdAt, createdAt",
      "updatedAt, updatedAt",
    ],
  });

  res.setFilterKey(filterKey);
});
</script>
