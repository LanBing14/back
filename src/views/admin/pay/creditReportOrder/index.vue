<template>
  <div class="app-container">
    <PageHead>
      <a-form-model
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        class="demo-form-inline searchForm-wrap"
      >
        <a-form-model-item prop="orderNo">
          <a-input v-model="listQuery.orderNo" placeholder="订单编号" />
        </a-form-model-item>
        <a-form-model-item prop="orderName">
          <a-input v-model="listQuery.orderName" placeholder="企业名称" />
        </a-form-model-item>
        <a-form-model-item prop="orderStatus">
          <a-select v-model="listQuery.orderStatus" placeholder="订单状态">
            <a-select-option v-for="el in statusOptions" :key="el.value" :value="el.value">{{ el.label }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="startDate">
          <a-date-picker
            v-model="listQuery.startDate"
            :disabledDate="disabledStartDate"
            format="YYYY-MM-DD"
            type="date"
            placeholder="开始日期"
          />
        </a-form-model-item>
        <a-form-model-item prop="endDate">
          <a-date-picker
            v-model="listQuery.endDate"
            :disabledDate="disabledEndDate"
            format="YYYY-MM-DD"
            type="date"
            placeholder="结束日期"
          />
        </a-form-model-item>
        <a-form-model-item class="btns">
          <a-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</a-button>
          <a-button class="filter-item" icon="undo" @click="handleReset">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_ReportOrderGetList"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :select-data="selectData"
      :typeOptions="typeOptions"
      @getList="getList"
    />
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import Button from "@/components/Button";
import { Api_comboboxDict } from "@/api/admin/index";
import {
  Api_ReportOrderGetList,
  Api_ReportOrderDelete,
  Api_ReportOrderSign,
  Api_ReportCreate
} from "@/api/admin/pay/index";

export default {
  name: "CreditReportOrder",
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      $viewer: null,
      fileListUrls: [],
      typeOptions: [], // 课程类型，下拉框
      statusOptions: [], // 课程状态，下拉框
      sassData: [],
      tableCol: [
        { key: "orderNo", label: "订单编号" },
        { key: "orderName", label: "订单名称" },
        { key: "orderStatusDesc", label: "订单状态" },
        {
          key: "createDate",
          label: "订单时间",
          render: data => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          key: "orderPrice",
          label: "订单价格(元)",
          render: data => {
            return this.$toMoney(data);
          }
        },
        {
          key: "payType",
          label: "支付方式",
          render: data => {
            return data ? (data === "1" ? "支付宝" : "微信") : "";
          }
        },
        { key: "applicantName", label: "申请人" },
        { key: "applicantPhone", label: "申请人手机" },
        { key: "applicantMail", label: "申请邮箱" },
        {
          key: null,
          label: "操作",
          width: "90px",
          align: "center",
          render: (data, row) => {
            return [
              row.orderStatus === "0" && (
                <Button
                  iconClass="icon-down-square"
                  iconColor="green"
                  row={row}
                  text="标记为已付款"
                  type="success"
                  click={this.handleSign.bind(this)}
                />
              ),
              row.orderStatus === "1" && (
                <Button
                  iconClass="icon-vertical-align-middl"
                  iconColor="green"
                  row={row}
                  text="生成信用报告"
                  type="success"
                  click={this.handleCreateReport.bind(this)}
                />
              ),
              row.filePath && (
                <Button
                  iconClass="icon-download"
                  iconColor="green"
                  row={row}
                  text="下载信用报告"
                  type="success"
                  click={this.handleDownLoad.bind(this)}
                />
              ),
              <Button
                iconClass="icon-delete"
                iconColor="red"
                row={row}
                text="删除"
                type="danger"
                click={this.handleDel.bind(this)}
              />
            ];
          }
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      listQuery: {
        orderType: "1",
        orderNo: "",
        reportType: undefined,
        orderStatus: undefined,
        orderName: "",
        startDate: undefined,
        endDate: undefined
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        orderNo: ["orderNo"],
        status: ["status"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add"
    };
  },
  mounted() {
    Api_comboboxDict("report_type").then(res => {
      this.typeOptions = res;
    });
    Api_comboboxDict("order_status").then(res => {
      this.statusOptions = res;
    });
    this.getList();
  },
  methods: {
    Api_ReportOrderGetList,
    // 获取主列表数据
    getList(flag) {
      this.$refs.child.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter(flag) {
      this.getList(flag);
    },
    // 重置查询条件
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.getList(true);
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 打开新增订单界面
    handleCreate() {
      this.modelStatus = "add";
      this.$refs.createUpdateModel.openModel();
    },
    // 打开修改界面
    handleUpdate(row) {
      this.selectData = row;
      this.modelStatus = "update";
      this.$nextTick(() => {
        this.$refs.createUpdateModel.openModel(row.id);
      });
    },
    // 标记为已付款
    handleSign({ id }) {
      this.$confirm("确认标记为已付款？").then(() => {
        Api_ReportOrderSign(id)
          .then(res => {
            this.getList();
            this.$message.success(res);
          })
          .catch(e => {
            loading.close();
          });
      });
    },
    // 生成信用报告
    handleCreateReport({ orderNo }) {
      const loading = this.$openLoading();
      Api_ReportCreate(orderNo)
        .then(res => {
          loading.close();
          this.getList();
          this.$message.success(res);
        })
        .catch(e => {
          loading.close();
        });
    },
    // 下载信用报告
    handleDownLoad({ filePath }) {
      window.open(process.env.VUE_APP_FILE_API + filePath);
    },
    // 删除订单
    handleDel({ id }) {
      this.$confirm("确定删除该订单?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_ReportOrderDelete(id)
          .then(msg => {
            this.$message.success(msg);
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    disabledStartDate(startValue) {
      const endValue = this.listQuery.endDate;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.listQuery.startDate;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    }
  }
};
</script>

<style scoped>
</style>
