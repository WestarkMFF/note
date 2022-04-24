<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点相关查询</el-breadcrumb-item>
      <el-breadcrumb-item>优质节点推荐</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!--条件检索区域-->
      <el-form :inline="true" :model="mInline">
        <el-form-item label="调度域">
          <el-input v-model="mInline.mInput1" placeholder="调度域"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-select v-model="mInline.mInput2" placeholder="省份(默认XXX)">
            <el-option
              label="河北省"
              value="河北省(可以是省份代码,选择后会放在Inline.mInput2字段)"
            ></el-option>
            <el-option
              label="海南省"
              value="海南省(可以是省份代码,选择后会放在Inline.mInput2字段)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商">
          <el-select v-model="mInline.mInput3" placeholder="运营商(默认XXX)">
            <el-option
              label="运营商名称1"
              value="运营商名称1(可以是运营商代码,选择后会放在Inline.mInput3字段)"
            ></el-option>
            <el-option
              label="运营商名称2"
              value="运营商名称2(可以是运营商代码,选择后会放在Inline.mInput3字段)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大区">
          <el-input v-model="mInline.mInput4" placeholder="大区(默认XX)"></el-input>
        </el-form-item>

        <el-form-item label="unknow">
          <el-select v-model="selectUnKnowDataKey" :disabled='flag.unKnowDataDisable'>
            <el-option v-for="(val, key) in unKnowData" :key="key" :label="key" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onGetUnKnowData">查询</el-button>
        </el-form-item>
      </el-form>

      <table-box :data="tableData" :dataSize="10" :columns="columns" :table-config="tableConfig"></table-box>
      <!-- <el-table
      :data="mData"
      style="width: 100%"
      height="500"
      border
      :default-sort = "{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="index"
        label="序号"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="'运营商'"
        label="节点名称"
        sortable
        width="180"> 
      </el-table-column>
      <el-table-column
        prop="'节点区域'"
        label="节点大区">
      </el-table-column>
    </el-table> -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "recommendNode",
  data() {
    return {
      tableConfig: {
        props: { "default-sort": { prop: "date", order: "descending" } },
      },

      mData: [
        { index: 18, date: "2022-05-20", 运营商: "1", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "2", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "3", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXE", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXZ", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXE", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXZ", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXE", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXZ", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXE", 节点区域: "华东" },
        { index: 18, date: "2022-05-20", 运营商: "CXXX", 节点区域: "东北" },
        { index: 18, date: "2022-05-20", 运营商: "CXXE", 节点区域: "华东" },
      ],

      columns: [
        { type: "index" },
        { label: "日期", prop: "date" },
        { label: "节点名称", prop: "运营商" },
        { label: "节点大区", prop: "节点区域" },
        { label: "节点评分", prop: "节点评分", sortable: true },
      ],
      mInline: {
        mInput1: "",
        mInput2: "",
        mInput3: "",
        mInput4: "",
      },

      unKnowData: [],
      selectUnKnowDataKey: "",

	  flag: {
		  unKnowDataDisable: true, // 默认不可点击
	  }
    }
  },

  computed: {
    tableData() {
      if (this.selectUnKnowDataKey) {
        return this.unKnowData[this.selectUnKnowDataKey] || []
      } else {
        return []
      }
    },
  },

  methods: {
    onSubmit() {
      console.log(this.mInline)
    },

    onGetUnKnowData() {
      // 模拟请求
      setTimeout(() => {
        const res = {
          liaoning: [
            {
              运营商: "cmcc",
              "节点区域": "东北 ",
              节点省份: "liaoning",
              节点名称: "cn2522",
              设备型号: "xxxxx",
              ssd: "256GB",
              totalDisk: "1024GB",
              type: "xxxx",
              ipv6支持: "true",
              节点评分: 999,
              分组能力: "sxas",
            },
            {
              运营商: "cmcc",
              "节点区域": "东北 ",
              节点省份: "liaoning",
              节点名称: "cn2522",
              设备型号: "xxxxx",
              ssd: "256GB",
              totalDisk: "1024GB",
              type: "xxxx",
              ipv6支持: "true",
              节点评分: 111,
              分组能力: "sxas",
            },
            {
              运营商: "cmcc",
              "节点区域": "东北 ",
              节点省份: "liaoning",
              节点名称: "cn2522",
              设备型号: "xxxxx",
              ssd: "256GB",
              totalDisk: "1024GB",
              type: "xxxx",
              ipv6支持: "true",
              节点评分: 222,
              分组能力: "sxas",
            },
          ],
        //   jilin: [
        //     {
        //       运营商: "cmcc",
        //       "节点区域": "东北 ",
        //       节点省份: "jilin",
        //       节点名称: "cn2522",
        //       设备型号: "xxxxx",
        //       ssd: "256GB",
        //       totalDisk: "1024GB",
        //       type: "xxxx",
        //       ipv6支持: "true",
        //       节点评分: "-",
        //       分组能力: "sxas",
        //     },
        //     {
        //       运营商: "cmcc",
        //       "节点区域": "东北 ",
        //       节点省份: "jilin",
        //       节点名称: "cn2522",
        //       设备型号: "xxxxx",
        //       ssd: "256GB",
        //       totalDisk: "1024GB",
        //       type: "xxxx",
        //       ipv6支持: "true",
        //       节点评分: "-",
        //       分组能力: "sxas",
        //     },
        //   ],
        }

		// 只有一个key就默认选中
		if(Object.keys(res).length == 1){
			this.selectUnKnowDataKey = Object.keys(res)[0]
		}

        this.unKnowData = res
		this.flag.unKnowDataDisable = false
      }, 1000)
    },
  },
}
</script>

<style scoped></style>
