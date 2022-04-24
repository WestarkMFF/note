<template>
  I'm DevComp <br />

  msg: {{ props.msg }} <br />

  count: {{ props.count }}
</template>

<script setup lang="ts">
const props = defineProps<{
  msg: string;
  count: string | number;
}>();
</script>
