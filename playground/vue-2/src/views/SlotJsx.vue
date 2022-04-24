<!-- <template>
  <div>
    slotJsx

    <br />
    <TestComp>
      <template v-slot:bar="data">
        {{ data }}
      </template>
    </TestComp>
  </div>
</template> -->

<script>
const TestComp = {
  render() {
    // return <button>{this.$slots.default}</button> // 普通插槽

    return <div>data is: {this.$scopedSlots.bar({ foo: "bar", id: 999 })}</div> // 作用域插槽

    // return <div>yes</div>
  },
}
export default {
  components: { TestComp },

  render(h) {
    console.log(h)
    const data = {
      scopedSlots: {
        bar: (props) => {
          //   return h("span", JSON.stringify(props))
          return <span>{JSON.stringify(props)}</span>
        },
      },
    }
    return (
      <div>
        slotJsx! I learned it
        <br />
        <TestComp {...data}> </TestComp>
      </div>
    )
  },
}
</script>
