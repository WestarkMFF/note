<template>
  <a-input
    class="fuzzyFilter"
    style="display: inline-block; width: 300px"
    placeholder="列表模糊搜索"
    v-model="filterKey"
    @input="onInput"
  ></a-input>
</template>

<script setup lang="tsx">
  import { ref, inject } from 'vue';
  import { FuzzyFilterForTableBox } from '../Shared';

  const { params }: any = inject<any>('params'); // 拿到父父组件的值

  const filterKey = ref('');

  function onInput(v: string) {
    params.value.data = FuzzyFilterForTableBox(params.value, v);
  }
</script>
