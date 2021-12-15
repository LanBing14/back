<template>
  <Drawer ref="drawer" :visible.sync="visible" title="详细日志" onlyCloseBtn>
    <a-form ref="dataForm" label-position="right" label-width="6em">
      <a-form-item label="日志类型：">
        <span class="tipText">{{ selectData.typeDesc }}</span>
      </a-form-item>
      <a-form-item label="用户名：">
        <span class="tipText">{{ selectData.username }}</span>
      </a-form-item>
      <a-form-item label="ip：">
        <span class="tipText">{{ selectData.ip }}</span>
      </a-form-item>
      <a-form-item label="url：">
        <span class="tipText">{{ selectData.accessUrl }}</span>
      </a-form-item>
      <a-form-item label="功能名称：">
        <span class="tipText">{{ selectData.accessName }}</span>
      </a-form-item>
      <a-form-item label="记录时间：">
        <span class="tipText">{{ selectData.createDate }}</span>
      </a-form-item>
      <a-form-item label="日志参数："></a-form-item>
      <TableWrapper
        ref="refLogParams"
        :loading="logParamsLoading"
        :data="logParamsData"
        :columns="tableCol"
        :pagination="false"
        :filterGroup="false"
        style="padding: 0;"
      />
    </a-form>
  </Drawer>
</template>

<script>
import TableWrapper from "@/components/TableWrapper";
import { Api_LogFetchParams } from "@/api/admin/system/index";

export default {
  name: "LogDetail",
  components: { TableWrapper },
  props: {
    selectData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      visible: false,
      logParamsLoading: false, // 加载数据的loading状态
      logParamsData: [],
      tableCol: [
        {
          key: "paramName",
          label: "参数名",
          width: 150
        },
        {
          key: "paramValue",
          label: "参数值"
        }
      ]
    };
  },
  watch: {
    "selectData.id": function(val) {
      if (!val) return;
      this.getLogParams();
    }
  },
  created() {},
  methods: {
    Api_LogFetchParams,
    // 打开模态框
    openModel() {
      this.visible = true;
      this.getLogParams();
    },
    // 获取日志参数
    getLogParams() {
      this.logParamsLoading = true;
      Api_LogFetchParams(this.selectData.id).then(res => {
        this.logParamsData = res;
        this.logParamsLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
