<template>
  <div>
    {{ timeNow }}
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

    timeNow: new Date().getTime(),

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
    setInterval(() => {
      this.timeNow++
    }, 1000)
    window.Vue = this
    // this.$set(this.obj.test, 'dfsdf', '')
    // this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   type: "warning",
    //   closeOnClickModal: false,
    // })

    /**
     * 从代码体积角度优化，把公共依赖统一扔到 cdn 里面，从而达到快速打包
     *
     * 我知道咋说了
     *
     * 首先 micro-app 不是通过 eval 执行子应用的，是通过 Function 构造函数来执行
     *
     * eval 和 Function 的区别
     *
     *
     * eval 是纯把字符串转化成代码然后执行，这个过程要调用 js的解释器
     *
     * Function 会创建一个可以被复用的函数，相对来说效率比 eval 高
     *
     * Function 和 eval 同样有效率 & 安全问题，但是 Function 是在顶级作用域执行的，安全问题相对较小
     *
     * 性能问题也是可以通过拆包来避免的，如果发现存在执行效率的瓶颈可以通过拆包来解决，避免子应用包过大
     *
     *
     * 终极大招：qiankun 是用 eval 执行子应用的，说白了就是(官方推荐 Function 替代 eval，qiankun还在用 eval，那还对 micro-app 性能问题有啥担心的)
     **/
  },
}
</script>
