<!--前端分页表格 集成table和pagination, 必要参数 data, columns, 可选参数 dataSize, tableConfig, paginationConfig, 默认一页显示5条数据-->
<!--demo见 static/src/pages/index/index.vue-->
<template>
  <div :class="{ fixHeight }" ref="tableCtn">
    <div class="tableX_table">
      <base-table ref="rawElTable" :columns="columns" :data="parseData" v-bind="tableConfig.props" v-on="$listeners">
        <slot />
      </base-table>
    </div>
    <div v-show="paginationVisible && showPagination" class="pagination">
      <el-pagination
        v-bind="paginationBinds"
        v-on="paginationConfig.events"
        :total="total"
        :current-page.sync="paginationInfo.page"
        :page-size="dataSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import _ from "lodash"

const DEFAULT_PROPS = {
  fit: true,
}
const PAGINATION_DEFAULT = {
  layout: "total, prev, pager, next",
  pageSize: 5,
}
const DEFAULT_COL_PROPS = {
  showOverflowTooltip: true,
}
const BaseTable = {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    props() {
      return Object.assign({}, DEFAULT_PROPS, this.$attrs)
    },
    events() {
      return Object.assign({}, this.$listeners)
    },
  },
  methods: {
    getSlotName(column) {
      return column.slotName
    },
    getScopedSlots(instance, name) {
      if (instance === undefined) {
        return null
      }
      if (instance.$scopedSlots[name]) {
        return instance.$scopedSlots[name]
      } else {
        return this.getScopedSlots(instance.$parent, name)
      }
    },
    renderColumn(column) {
      const data = { props: Object.assign({}, DEFAULT_COL_PROPS, column) }
      const slotName = this.getSlotName(column)
      if (slotName) {
        const slotRender = this.getScopedSlots(this, slotName)
        if (slotRender) {
          data.scopedSlots = {
            default(scope) {
              return slotRender({
                index: scope.$index,
                row: scope.row,
              })
            },
          }
        } else {
          console.warn("[BaseTable] slot defined but not found. name is: " + slotName)
        }
      }
      return <el-table-column {...data} />
    },
  },
  render() {
    const data = {
      props: this.props,
      on: this.events,
    }
    return (
      <el-table {...data} ref="sTable">
        {this.columns.map((column) => {
          return this.renderColumn(column)
        })}
      </el-table>
    )
  },
}

export default {
  name: "TableLite",
  components: { BaseTable },
  props: {
    data: {
      default: () => [],
    },
    api: { type: String },
    params: { type: Object, default: () => {} },
    dataSize: {
      required: false,
      type: Number,
      default: 5,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    tableConfig: {
      type: Object,
      default: () => {
        return { props: {}, events: {} }
      },
    },
    paginationConfig: {
      type: Object,
      default: () => {
        return { props: { ...PAGINATION_DEFAULT }, events: {} }
      },
    },
    fixHeight: {
      type: Boolean,
      default: false,
    },
    frontPagination: {
      type: Boolean,
      default: true,
    },
    filterKey: String,
  },
  data() {
    return {
      paginationInfo: {
        page: 1,
        limit: 10,
      },
      reqData: [],
      showPagination: true,
      filterData: [],
    }
  },
  computed: {
    parseData() {
      if (this.frontPagination) {
        // 前端分页
        if (!!this.api) {
          return this.reqData.slice((this.paginationInfo.page - 1) * this.dataSize, this.paginationInfo.page * this.dataSize)
        }
        const data = this.filterData || this.data
        return data.slice((this.paginationInfo.page - 1) * this.dataSize, this.paginationInfo.page * this.dataSize)
      } else {
        // 后端分页
        if (!!this.api) {
          return Array.isArray(this.reqData) ? this.reqData : this.reqData.data
        }
        return Array.isArray(this.data) ? this.data : this.data.data
      }
    },
    total() {
      if (this.frontPagination) {
        return this.data.length || this.reqData.length
      } else {
        return this.data.total
      }
    },
    paginationBinds() {
      return _.assign({}, PAGINATION_DEFAULT, this.paginationConfig.props)
    },
    paginationVisible() {
      return this.data.length || this.data.total || this.reqData.total || this.reqData.length
    },

    tableBasicInfo() {
      return {
        filterKey: this.filterKey,
        data: this.data,
      }
    },
  },
  watch: {
    dataSize: {
      handler(val) {
        if (val) {
          this.paginationInfo.limit = val
        }
      },
      immediate: true,
    },

    tableBasicInfo: {
      handler({ data, filterKey }) {
        this.filterData = this.handleFilterChange(data, filterKey) || []
      },
      immediate: true,
    },
  },
  methods: {
    handleCurrentChange(pageNumber) {
      this.paginationInfo.page = pageNumber
    },
    handleSizeChange(pageSize) {
      this.paginationInfo.limit = pageSize
    },
    fixTableHead() {
      const height = this.$refs["tableCtn"].offsetHeight
      this.tableConfig.props.height = height - 68 + "px"
    },
    // _fetch() {
    //   store.dispatch("API_action", { source: this.api, params: this.params }).then((res) => {
    //     if (this.frontPagination) {
    //       this.reqData = res.data
    //     } else {
    //       this.reqData = res
    //     }
    //   })
    // },

    handleFilterChange(data, filterKey = "") {
      if (!!this.api) return false

      const temp = []
      for (let key of this.columns) {
        this.data.forEach((item) => {
          if (item[key.prop]) {
            if (filterKey.includes("^_^")) {
              if (filterKey.toLowerCase().includes(item[key.prop].toString()) && temp.indexOf(item) == -1) temp.push(item)
            } else {
              if (item[key.prop].toString().includes(filterKey.toLowerCase()) && temp.indexOf(item) == -1) temp.push(item)
            }
          }
        })
      }
      if (this.columns.length === 0) return data
      return temp
    },
  },

  mounted() {
    if (this.fixHeight) {
      this.fixTableHead()
      window.addEventListener("resize", () => this.fixTableHead())
    }
    // if (!!this.api) this._fetch()
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => this.fixTableHead())
  },
}
</script>

<style scoped lang="less">
.fixHeight {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tableX_table {
    position: relative;
    margin-bottom: 5px;
    flex: 1;
    overflow: hidden auto;
  }
  .pagination {
    flex: 0;
  }
}
.pagination {
  margin: 16px 0 8px 0;
  text-align: right;
}
</style>
