<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="type">
          <a-select v-decorator="formDecorator.type" placeholder="日志类型" filterable>
            <a-select-option
              v-for="item in logData"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop="ip">
          <a-input
            v-decorator="formDecorator.ip"
            placeholder="ip"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="accessUrl">
          <a-input
            v-decorator="formDecorator.accessUrl"
            placeholder="url"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="accessMethod">
          <a-input
            v-decorator="formDecorator.accessMethod"
            placeholder="请求方式"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="accessName">
          <a-input
            v-decorator="formDecorator.accessName"
            placeholder="功能名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="startDate">
          <a-date-picker
            v-decorator="formDecorator.startDate"
            :disabledDate="disabledStartDate"
            format="YYYY-MM-DD"
            placeholder="记录时间起"
            @openChange="handleStartOpenChange"
          />
        </a-form-item>
        <a-form-item prop="endDate">
          <a-date-picker
            v-decorator="formDecorator.endDate"
            :disabledDate="disabledEndDate"
            format="YYYY-MM-DD"
            placeholder="记录时间止"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
        </a-form-item>
        <a-form-item class="btns">
          <a-button
            class="filter-item"
            type="primary"
            icon="icon iconfont icon-search"
            @click="handleFilter"
          >查询</a-button>
          <a-button
            class="filter-item"
            icon="icon iconfont icon-undo"
            @click="handleReset('searchForm')"
          >重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_LogFetchList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
        />
      </div>
    </div>
    <LogDetail ref="LogDetailModel" :select-data="selectData" @getList="getList" />
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import LogDetail from "./LogDetail";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import { Api_comboboxDict } from "@/api/admin/index";
import { Api_LogFetchList } from "@/api/admin/system/index";

export default {
  name: "Log",
  directives: { waves },
  components: { PageHead, LogDetail, TableWrapper },
  data() {
    return {
      sassData: [], // 站编码下拉框数据
      logData: [], // 日志类型下拉框数据
      tableCol: [
        {
          key: "typeDesc",
          label: "日志类型"
          // width: '10%'
        },
        {
          key: "username",
          label: "用户名"
          // width: '10%'
        },
        {
          key: "ip",
          label: "ip"
          // width: 150
        },
        {
          key: "accessUrl",
          label: "url"
        },
        {
          key: "accessMethod",
          label: "请求方式"
          // width: 80
        },
        {
          key: "accessName",
          label: "功能名称"
          // width: 150
        },
        {
          key: "createDate",
          label: "记录时间"
          // width: 150
        },
        {
          key: null,
          label: "操作",
          // width: 60,
          align: "center",
          render: (data, row) => {
            return [
              <Button
                iconClass="icon-eye"
                iconColor="green"
                row={row}
                text="日志详细信息"
                click={this.handleViewDetail.bind(this)}
              />
            ];
          }
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      //   listQuery: {
      //     type: undefined,
      //     startDate: undefined,
      //     endDate: undefined,
      //     ip: undefined,
      //     accessUrl: undefined,
      //     accessName: undefined,
      //     accessMethod: undefined
      //   },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        type: ["type"],
        startDate: ["startDate"],
        endDate: ["endDate"],
        ip: ["ip"],
        accessUrl: ["accessUrl"],
        accessName: ["accessName"],
        accessMethod: ["accessMethod"]
      },
      selectId: undefined,
      selectData: undefined,
      startValue: null,
      endValue: null,
      endOpen: false
    };
  },
  created() {
    // Api_saas().then(res => {
    //     this.sassData = res;
    // });
    // 获取holiday_type节假日字典数据
    Api_comboboxDict("log_type").then(res => {
      this.logData = res;
    });
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
      Api_LogFetchList,
      // 获取主列表数据
      getList(flag) {
          this.$refs.child.fetchData(flag);
      },
      // 根据查询条件获取数据
      handleFilter() {
          this.getList(true);
      },
      // 重置查询条件
      handleReset() {
          this.form.resetFields();
          this.$nextTick(() => {
              this.getList(true);
      });
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 查看日志详情
    handleViewDetail(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.LogDetailModel.openModel();
      });
    },
    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue("endDate");
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.form.getFieldValue("startDate");
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    }
  }
};
</script>

<style scoped>
</style>
