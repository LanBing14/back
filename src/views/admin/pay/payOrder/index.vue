<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="orderNo">
          <a-input v-decorator="formDecorator.orderNo" placeholder="订单编号" />
        </a-form-item>
        <a-form-item prop="orderName">
          <a-input v-decorator="formDecorator.orderName" placeholder="订单名称" />
        </a-form-item>
        <a-form-item>
          <a-select v-decorator="formDecorator.orderStatus" placeholder="订单状态">
            <a-select-option v-for="(el, index) in statusOptions" :key="index" :value="el.value">{{el.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop="startDate">
          <a-date-picker
            v-decorator="formDecorator.startDate"
            :disabledDate="disabledStartDate"
            format="YYYY-MM-DD"
            placeholder="申请时间起"
            @openChange="handleStartOpenChange"
          />
        </a-form-item>
        <a-form-item prop="endDate">
          <a-date-picker
            v-decorator="formDecorator.endDate"
            :disabledDate="disabledEndDate"
            format="YYYY-MM-DD"
            placeholder="申请时间止"
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
          <a-button class="filter-item" icon="icon iconfont icon-undo" @click="handleReset('searchForm')">重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_PayOrderGetList"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import { Api_PayOrderGetList } from "@/api/admin/pay/index";
import Button from "@/components/Button";
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";

export default {
  name: "Channel",
  components: { PageHead, TableWrapper },
  data() {
    return {
      Api_PayOrderGetList,
      statusOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待付款",
          value: "0"
        },
        {
          label: "已付款",
          value: "1"
        },
        {
          label: "已关闭",
          value: "-1"
        }
      ], // 处理状态下拉数据
      listQuery: {},
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        orderStatus: ["orderStatus"],
        orderName: ["orderName"],
        orderNo: ["orderNo"],
        startDate: ["startDate"],
        endDate: ["endDate"]
      },
      tableCol: [
        { key: "orderNo", label: "订单编号" },
        { key: "orderName", label: "订单名称" },
        { key: "applicantName", label: "用户名" },
        {
          key: "orderPrice",
          label: "订单金额(元)",
          algin: "right",
          render: data => {
            return this.$toMoney(data);
          }
        },
        {
          key: "actualAmount",
          label: "实付金额(元)",
          algin: "right",
          render: data => {
            return this.$toMoney(data);
          }
        },
        {
          key: "payType",
          label: "支付方式",
          render: data => {
            return data === "1" ? "支付宝" : data === "2" ? "微信" : "套餐次数";
          }
        },
        {
          key: "orderStatus",
          label: "当前状态",
          render: data => {
            let str = "-";
            if (data === "0") {
              str = "待付款";
            } else if (data === "1") {
              str = "已付款";
            } else if (data === "-1") {
              str = "已关闭";
            }
            return str;
          }
        },
        { key: "createDate", label: "订单时间" }
      ],
      selectData: undefined,
      endOpen: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取主列表数据
    getList(flag) {
      this.listQuery = this.form.getFieldsValue();
      this.$nextTick(() => {
        this.$refs.child.fetchData(flag);
      });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset(formName) {
      this.form.resetFields();
      this.$nextTick(() => {
        this.getList(true);
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
