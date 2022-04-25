import { resolveComponent, reactive, h } from 'vue';
import { TableBoxColumn, TableBoxColumnPlugin } from './types/TableBox';
import { hasOwn } from './Shared';

/**
 * @param col
 *
 * 处理列参数，自定义渲染优先级 render > plugin > template
 *
 * 封装思路：都是利用 arco-design 提供的 render columns 去实现的
 *
 */

export function renderColumn(col: TableBoxColumn, columnsSlots: any, columnPlugins: any): TableBoxColumn {
  let { slotName = '', plugin = [] } = col;
  switch (true) {
    case plugin.length > 0: {
      col.render = data => {
        let rowData = reactive(data);
        return (
          <div class="a-table_colsPlugin">
            {
              /** 遍历插件 */
              plugin.map((pluginItem: TableBoxColumnPlugin, index: number) => {
                const key = `${rowData.column.dataIndex}_${rowData.rowIndex}_${index}`;

                let config = {};
                if (!rowData.record._pluginConfig) rowData.record._pluginConfig = {};

                if (typeof pluginItem.config === 'function' && pluginItem.config(rowData.record)) {
                  config = pluginItem.config(rowData.record);
                } else {
                  config = pluginItem.config;
                }

                /** 暴露给 plugin 的 config */
                if (!rowData.record._pluginConfig[key]) rowData.record._pluginConfig[key] = {};
                let exposeConfig = rowData.record._pluginConfig[key];

                if (!hasOwn(columnPlugins, `a-${pluginItem.type}`)) {
                  // prettier-ignore
                  console.warn( `columns组件未在 BaseTable.tsx 中注册，当前支持 ${Object.keys(columnPlugins).join(',')}` );
                  return null;
                }

                return h(
                  columnPlugins[`a-${pluginItem.type}`], // 这里把他转化成 a-button 之类的组件
                  {
                    type: 'primary', // 默认值，可以被覆盖
                    size: 'small',
                    onClick: () => {
                      if (!hasOwn(pluginItem, 'click')) return;

                      pluginItem.click(rowData, exposeConfig);
                    },
                    ...config,
                    ...exposeConfig,
                  },
                  () => {
                    if (typeof pluginItem.content === 'function') {
                      return pluginItem.content(rowData.record);
                    }

                    return pluginItem.content;
                  }
                );
              })
            }
          </div>
        );
      };
      break;
    }

    /**
     * formatter
     * 思路：有 formatter 就把这列转成 render 函数渲染
     */
    case !!col.formatter: {
      col.render = rowData => {
        return <div>{(col as { formatter: (any) => any }).formatter(rowData)}</div>;
      };
      break;
    }

    case !!slotName: {
      // 没传插槽，组件级别的错误
      if (!columnsSlots) {
        col.render = () => <div></div>;
        break;
      }
      if (columnsSlots[slotName]) {
        col.render = rowData => {
          return columnsSlots[slotName](reactive(rowData));
        };
      } else {
        console.warn(`slotName [${slotName}] 定义了但是没在 slot 里面声明模板`);
      }
    }
  }

  return col;
}
