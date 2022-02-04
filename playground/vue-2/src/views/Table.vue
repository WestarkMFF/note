<template>
  <div>
    <table-box :data="data" :columns="cols"></table-box>

    <el-input v-model="obj.test"></el-input>
   test: {{ obj.test }}
    <!-- name: {{ info.name }} <br /> -->

    <input v-model="info.age" />
    age: {{ info.age }} <br />

    <button @click="testClick">click</button>
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

    info: {
      //   name: "westark",
    },

    obj: {
      // name: 'supmff',
    },
  }),

  methods: {
    testClick() {
      this.info.age = 22
    },
  },

  created() {
    // this.$set(this.obj.test, 'dfsdf', '')
    // this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   type: "warning",
    //   closeOnClickModal: false,
    // })
  },
}
</script>
