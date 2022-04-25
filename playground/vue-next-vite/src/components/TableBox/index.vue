<template>
  <div class="tableBox" :id="props.id">
    <div class="tableBox-plugins" comment="插件区域">
      <TablePlugins :pluginsList="pluginsList"></TablePlugins>
    </div>
    <BaseTable
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      v-bind="params"
      :slots="$slots"
      :test="attrs"
    ></BaseTable>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  provide,
  computed,
  onUnmounted,
  useAttrs,
  Ref,
  readonly,
} from "vue";
import BaseTable from "./BaseTable";
import * as Type from "./types/TableBox";
import {
  setTableInstance,
  getTableInstance,
  deleteTableInstance,
  hasOwn,
  getFileNameFromPath,
  FuzzyFilterForTableBox,
} from "./Shared";
import TablePlugins from "./Plugin";
import "./style.css";
import Fuse from "fuse.js";
// import { plugins } from './Plugin';

const props = defineProps({
  id: String,
});

setTableInstance(props.id as string);

const emits = defineEmits(["pagination-change"]);

/** 列表必要参数 */
const tableRequiredParams: { value: Type.TableRequiredParams } = ref({
  data: [],
  columns: [],
  res: { data: [], total: 0 },
});

/** arco table 的 props */
const tableConfig: Ref<any> = ref({});

/**
 * 分页的数据
 */
const paginationConfig = reactive({ page: 1, pageSize: 10 });

/**
 * 核心变量，扁平化存放列表的参数
 * { data: xxx, columns: xxx, border: true, stripe: true, size: 'small', ...}
 * 既传递给 arco-design, 也传递给插件系统
 */
const params: { value: any } = ref({});

let filterKey: any = reactive({ key: "" });

const attrs = computed({
  get() {
    // const filterResult = !!filterKey.key ? filter : {};
    const result = Object.assign(
      {},
      tableRequiredParams.value,
      tableConfig.value,
      useAttrs()
    );

    // res 会覆盖 data
    if (result.res) {
      let data = result.res[result.dataAlias || "data"];
      let total: number = result.res[result.totalAlias || "total"];

      if (!Array.isArray(data)) {
        data = [];
      }

      if (typeof total !== "number") {
        total = 0;
      }

      if (data.length) {
        result.data = data;
      }
      !result.pagination
        ? (result.pagination = { total })
        : (result.pagination.total = total);
    }

    if (!result.data || !Array.isArray(result.data)) result.data = []; // 兜底
    result.columns = resolveColumns(result.columns);
    result._originData = result.data; // data 备份
    params.value = result;

    if (!result.data.length) handleAutoLoading(); // 如果列表本身就带着数据，那就没有 loading
    return result;
  },
  set(val) {
    params.value = val;
  },
});

provide("params", { params });

const filter = reactive({ data: [], _originData: [] });

// const flag: { [name: string]: boolean } = reactive({
//   pageChangeInit: true,
//   pageSizeChangeInit: true,

//   userSetPage: false, // 用户是否定义了 page
//   userSetPageSize: false, // 用户是否定义了 page size
// })

const flag = reactive({
  autoLoadingWatchLock: true,
});

/**
 * 列表启动方法
 * @param tableParams
 * @param config
 */
function init(tableParams: Type.TableRequiredParams, config: any) {
  if (!tableParams.data) tableParams.data = [];

  tableRequiredParams.value = reactive(tableParams);
  config = resolveConfig(config || {});
  tableConfig.value = config;

  if (!config.noInitFetch) {
    emits("pagination-change", null, paginationConfig);
  }
}

/**
 *  columns 简写
 *  e.g
 * '单号,id' = {title:'单号', dataIndex: 'id'}
 */
function resolveColumns(cols) {
  return cols.map((col: Type.TableBoxColumn) => {
    if (typeof col === "string") {
      const shortcut = (col as string).split(",");
      if (shortcut.length == 1) {
        console.warn(
          `colItem [${col}] formate is wrong，string "$\{title\},$\{dataIndex\} expected"`
        );
        col = {};
      }

      col = { title: shortcut[0].trim(), dataIndex: shortcut[1].trim() };
    }
    return col;
  });
}

/**
 * 解析 config
 * @param config
 */
function resolveConfig(config) {
  if (hasOwn(config, "pagination")) {
    // flag.userSetPage = hasOwn(config.pagination, 'current') as boolean
    // flag.userSetPageSize = hasOwn(config.pagination, 'pageSize') as boolean
    paginationConfig.page = config.pagination.current || 1;
    paginationConfig.pageSize = config.pagination.pageSize || 10;
  } else {
    config.pagination = {};

    paginationConfig.page = 1;
    paginationConfig.pageSize = 10;
  }

  return config;

  //   config.pagination.total = tableRequiredParams.value.data.length // TODO
}

function handleAutoLoading(fromPaginationChange = false) {
  // 分页变化触发，如果是前端分页的话，就不处理 loading，因为数据实际上没有变化
  if (fromPaginationChange && !params.value.res) {
    return;
  }

  if (!params.value.autoLoading || filterKey.key) return;

  params.value.loading = true;

  flag.autoLoadingWatchLock = false;
  watch(params, (val: any, oldVal) => {
    if (flag.autoLoadingWatchLock) return;

    const a = val._originData,
      b = oldVal._originData;

    if (a !== b && Array.isArray(a) && a.length) {
      params.value.loading = false;
    }

    flag.autoLoadingWatchLock = false;
  });
}

function onPageChange(page: number) {
  tableConfig.value.pagination.current = page;

  paginationConfig.page = page;
  handleAutoLoading(true);
  emits("pagination-change", null, paginationConfig);
}

function onPageSizeChange(pageSize: number) {
  paginationConfig.pageSize = pageSize;
  tableConfig.value.pagination.pageSize = pageSize;
  handleAutoLoading(true);
  emits("pagination-change", null, paginationConfig);
}

/**
 * 暴露搜索 key
 * @param key
 * @param interval 节流
 */
function setFilterKey(key: any, interval?: number) {
  filterKey.key = key;
}

/**
 * 监听 外部组件传进来的 filterKey，执行模糊搜索
 * TODO 加一个节流
 */
watch(filterKey, (val: { key: string }) => {
  params.value.data = FuzzyFilterForTableBox(params.value, val.key);
  // params.value.data =
});

// TODO 更新 config
function updateConfig(config: any): void {
  tableConfig.value = config;

  //   return new Promise((resolve) => {})
}

const pluginsList: any = ref([]);
function setPlugins(plugins: Array<any>) {
  if (!Array.isArray(plugins)) {
    console.warn(`Method [setPlugins], array expected got ${typeof plugins}`);
    return;
  }
  pluginsList.value = plugins;
}

/**
 * 自定义 data formatter, 用于业务层自定义操作列表数据
 * @param fn formatter 函数
 */
function formatter(fn: (any) => any) {
  params.value.data = fn(params.value._originData);
}

onUnmounted(() => {
  deleteTableInstance(props.id as string); // 从组件池删除组件实例
});

defineExpose({ init, updateConfig, setFilterKey, setPlugins, formatter });
</script>

<script lang="ts">
// const getPlugins = Object.keys(plugins).map(item => getFileNameFromPath(item));
export default {
  instance: getTableInstance,
  // getPlugins,
};
</script>
