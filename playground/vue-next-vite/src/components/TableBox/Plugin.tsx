import { defineComponent, h, resolveComponent } from 'vue';
import { getFileNameFromPath } from './Shared';
import FuzzyFilter from './plugins/FuzzyFilter.vue';
const PluginComp = defineComponent({
  components: { FuzzyFilter },
  setup(any, { attrs }: any) {
    /**
     * 插件区域，插件有三个区域 top, left, right
     *
     * top: 预留
     *
     * left: 模糊搜索，不是很宽的插件
     *
     * right: 各种 icon 类，按钮类插件
     *
     * 开发需要把插件归类
     */
    // const top = [],
    //   left = ['FuzzyFilter'],
    //   right = [];

    // TODO PluginDev
    return () => (
      <div class="tableBox-pluginWrapper">
        <div class="plugin_top"></div>
        <div class="plugin_bottom">
          <div>
            {attrs &&
              attrs.pluginList &&
              attrs.pluginsList.map(plugin => {
                return h(resolveComponent(plugin), {});
              })}
          </div>
        </div>
      </div>
    );
  },
});

PluginComp.components = {};

// export const plugins = import.meta.globEager('./plugins/*');
// for (let key in plugins) {
//   PluginComp.components[getFileNameFromPath(key)] = plugins[key].default; // 异步注册插件
// }

export default PluginComp;
