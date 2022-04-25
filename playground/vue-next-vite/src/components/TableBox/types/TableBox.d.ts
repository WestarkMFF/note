import { CSSProperties, RenderFunction, Slot, VNode } from 'vue';

interface TableFilterData {
  /**
   * @zh 筛选数据选项的内容
   * @en Filter the content of the data option
   */
  text: string | RenderFunction;
  /**
   * @zh 筛选数据选项的值
   * @en Filter the value of the data option
   */
  value: string;
}

export interface TableSortable {
  /**
   * @zh 支持的排序方向
   * @en Supported sort direction
   */
  sortDirections: ('ascend' | 'descend')[];
  /**
   * @zh 排序函数。设置为 `true` 可关闭内部排序。
   * @en Sorting function. Set to `true` to turn off internal sorting.
   */
  sorter?: ((a: any, b: any) => number) | boolean;
  /**
   * @zh 排序方向
   * @en Sort direction
   */
  sortOrder?: 'ascend' | 'descend' | '';
  /**
   * @zh 默认排序方向（非受控模式）
   * @en Default sort direction (uncontrolled mode)
   */
  defaultSortOrder?: 'ascend' | 'descend' | '';
}

export interface TableFilterable {
  /**
   * @zh 筛选数据
   * @en Filter data
   */
  filters: TableFilterData[];
  /**
   * @zh 筛选函数
   * @en Filter function
   */
  filter: (filteredValue: string[], record: TableData) => boolean;
  /**
   * @zh 是否支持多选
   * @en Whether to support multiple selection
   */
  multiple?: boolean;
  /**
   * @zh 筛选项
   * @en Filter value
   */
  filteredValue?: string[];
  /**
   * @zh 默认筛选项
   * @en Default filter value
   */
  defaultFilteredValue?: string[];
  /**
   * @zh 筛选框的内容
   * @en The content of filter box
   */
  renderContent?: (data: {
    filterValue: string[];
    setFilterValue: (filterValue: string[]) => void;
    handleFilterConfirm: (event: Event) => void;
    handleFilterReset: (event: Event) => void;
  }) => VNode;
  /**
   * @zh 筛选按钮的图标
   * @en Filter icon for button
   */
  icon?: () => VNode;
  /**
   * @zh 筛选框的弹出框配置
   * @en Pop-up box configuration of filter box
   */
  triggerProps?: any;
  /**
   * @zh 筛选图标是否左对齐
   * @en Whether the filter icon is aligned to the left
   * @version 2.13.0
   */
  alignLeft?: boolean;
}

interface TableColumn {
  /**
   * @zh 列信息的标识，对应 `TableData` 中的数据
   * @en The identifier of the column information, corresponding to the data in `TableData`
   */
  dataIndex?: string;
  /**
   * @zh 列标题
   * @en Column header
   */
  title?: string | RenderFunction;
  /**
   * @zh 列宽度
   * @en Column width
   */
  width?: number;
  /**
   * @zh 对齐方向
   * @en Alignment direction
   */
  align?: 'left' | 'center' | 'right';
  /**
   * @zh 固定位置
   * @en Fixed position
   */
  fixed?: 'left' | 'right';
  /**
   * @zh 是否显示省略号
   * @en Whether to show ellipsis
   */
  ellipsis?: boolean;
  /**
   * @zh 排序相关选项
   * @en Sorting related options
   */
  sortable?: TableSortable;
  /**
   * @zh 过滤相关选项
   * @en Filter related options
   */
  filterable?: TableFilterable;
  /**
   * @zh 表头子数据，用于表头分组
   * @en Header sub-data, used for header grouping
   */
  children?: TableColumn[];
  /**
   * @zh 自定义单元格样式
   * @en Custom cell style
   * @version 2.11.0
   */
  cellStyle?: CSSProperties;
  /**
   * @zh 自定义列单元格的渲染
   * @en Customize the rendering of column cells
   */
  render?: ({
    record,
    column,
    rowIndex,
    config: any,
  }: {
    record: TableData;
    column: TableColumn;
    rowIndex: number;
    config: any;
  }) => VNode;
  // private
  isLastLeftFixed?: boolean;
  isFirstRightFixed?: boolean;
  slot?: Slot;
}

export interface TableBoxColumn extends TableColumn {
  /**
   * @zh 快捷使用 按钮 / tag
   */
  plugin?: Array<TableBoxColumnPlugin>;

  /**
   * @zh 自定义内容的插槽名
   */
  slotName?: string;

  /**
   * @zh formatter
   */
  formatter?: (arg0: any) => any;
}

export interface TableBoxColumnPlugin {
  /**
   * @zh 按钮的content exg. <button>content</button>
   */
  content: string | ((arg0: any) => any);
  /**
   * @zh 类型 会被拼接成 a-button, a-tag 组装成 arco-design 组件
   */
  type: string;

  /**
   * @zh 点击事件回调
   */
  click: (arg0: any, arg1?: any) => void;

  /**
   * @zh 插件配置
   */
  config: {} | ((arg0: any) => any);

  key: number;
}

export interface TableData {
  /**
   * @zh 数据行的key
   * @en The key of the data row
   */
  key?: string;
  /**
   * @zh 扩展行内容
   * @en Expand row content
   */
  expand?: string | RenderFunction;
  /**
   * @zh 子数据
   * @en Sub data
   */
  children?: TableData[];
  /**
   * @zh 是否禁用行选择器
   * @en Whether to disable the row selector
   */
  disabled?: boolean;
  /**
   * @zh 是否是叶子节点
   * @en Whether it is a leaf node
   * @version 2.13.0
   */
  isLeaf?: boolean;

  [name: string]: any;
}

export type TableRequiredParams = {
  data: Array<TableData>;
  columns: Array<TableBoxColumn>;
  res?: {
    data: TableData;
    [name: string]: number | TableData;
  };
};

export interface TableInitParams {
  data: Array<any>;
  columns: Array<TableBoxColumn>;
  res?: {};
}

export interface TableConfig {}
