<template>
  <div>
    <h1><slot name="header"></slot></h1>

    <div style="color: blue">
      <slot name="sheep" :duck="true" sheep="false"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
