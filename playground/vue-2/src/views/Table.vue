<template>
  <table-box :data="data" :columns="cols"></table-box>
</template>

<script>
const data = [
  { name: "小麦", time: "2" },
  { name: "胡萝卜", time: "10" },
  { name: "大豆", time: "20" },
]

const cols = [
  { label: "商品名", prop: "name" },
  { label: "耗时", prop: "time" },
]
export default {
  data: () => ({
    data,
    cols,
  }),
}
</script>
