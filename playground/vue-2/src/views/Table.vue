<template>
  <div>
    <table-box :data="data" :columns="cols"></table-box>

    <input type="text" class="fuckInput" />
    <el-button>sdfsdfsdf</el-button>
    <el-popover>
      input
      <el-input v-model="fuck"></el-input>
      <el-button style="z-index: 30000" slot="reference" type="text">click</el-button>
    </el-popover>
  </div>
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
    fuck: "sdf",
  }),

  created() {
    this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      closeOnClickModal: false,
    })
  },
}
</script>
