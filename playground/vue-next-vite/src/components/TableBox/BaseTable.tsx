import { defineComponent, h, resolveComponent } from 'vue';
import { renderColumn } from './Column';
import { Table, Tag, Button } from '@arco-design/web-vue';
import '@arco-design/web-vue/es/table/style/css.js';

const BaseTable = defineComponent({
  props: ['slots'],
  components: {
    'a-table': Table,
    'a-tag': Tag,
    'a-button': Button,
  },
  render(instance) {
    // 定义 plugin 组件
    const columnPluginList = ['tag', 'button', 'table'];
    const columnPluginInstanceList = {};

    columnPluginList.forEach((item: any) => {
      columnPluginInstanceList[`a-${item}`] = resolveComponent(`a-${item}`);
    });

    instance.$attrs.columns?.map(col => renderColumn(col, instance.slots, columnPluginInstanceList));

    return h(Table, {
      ref: 'originArcoTable',
      ...instance.$attrs,
    });
  },
});

export default BaseTable;
