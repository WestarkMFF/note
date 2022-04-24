<!-- <template>
  <div>
    <child-comp data="SOMEONE" v-slot:sheep="{ text }"> {{ text }} </child-comp>
  </div>
</template> -->

<script>
// 练习 jsx slot

const childComp = {
  props: ["data"],
  render() {
    console.log(this.data)
    // return <div>duck:{this.$scopedSlots.sheep({ text: this.data })}</div>

    // const data = {
    //   scopedSlots: {
    //     sheep: this.$scopedSlots.sheep({ text: this.data }),
    //   },
    // }
    // <span {...data}></span>

    return (
      <div style="color: green; fontSize: 14px;">
        duck: {this.data} <span style="color: gray">and</span>
      </div>
    )
  },
}
export default {
  components: { childComp },
 
  render() {
    const props = {
      props: {
        data: "someSb",
      },

      scopedSlots: {
        default: () => this.$scopedSlots.default({ text: "duckSb" }),
      },
    }
    return (
      <div style="color: blue; fontSize: 18px; fontWeight: bolder">
        duck outside
        <br />
        {console.log(props)}
        <child-comp {...props}></child-comp>
      </div>
    )
  },
}
</script>
