<template>
  <div>
    duck Test, component ⬇️

    <testComp>
      <template v-slot:header> 头 </template>

      <template v-slot:body> 身体 </template>

      <template v-slot:foot> 下半身 </template>

      <template v-slot:sheep="ppp">
        <div>
          {{ ppp }}
        </div>
      </template>
    </testComp>
  </div>
</template>

<script>
import TestComp from "./TestComp.vue"
// const testCompA = {
//   render() {
//     return (
//       <div>
//         <slot name="header"></slot>
//       </div>
//     )
//   },
// }
export default {
  components: { TestComp },
}
</script>
