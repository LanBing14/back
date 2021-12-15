<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <!-- <a-form-item>
          <a-select v-decorator="formDecorator.status" placeholder="处理状态">
            <a-select-option v-for="(el, index) in statusOptions" :key="index" :value="el.value">{{el.label}}</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item prop="companyName">
          <a-input v-decorator="formDecorator.companyName" placeholder="公司名称" />
        </a-form-item>
        <a-form-item prop="userNameOrPhone">
          <a-input v-decorator="formDecorator.userNameOrPhone" placeholder="用户名/手机号" />
        </a-form-item>
        <a-form-item prop="startDate">
          <a-date-picker
            v-decorator="formDecorator.startDate"
            :disabledDate="disabledStartDate"
            format="YYYY-MM-DD"
            placeholder="开始时间"
            @openChange="handleStartOpenChange"
          />
        </a-form-item>
        <a-form-item prop="endDate">
          <a-date-picker
            v-decorator="formDecorator.endDate"
            :disabledDate="disabledEndDate"
            format="YYYY-MM-DD"
            placeholder="结束时间"
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
        <div style="line-height: 30px; flex: 0 100%">
          <span style="font-weight: bold; padding-right: 15px">处理状态</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status===''}"
            @click="changeStatus('')"
          >全部</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='0'}"
            @click="changeStatus('0')"
          >待处理{{waitDealNum?('('+waitDealNum+')'):''}}</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='1'}"
            @click="changeStatus('1')"
          >洽谈中{{inTalkingNum?('('+inTalkingNum+')'):''}}</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='2'}"
            @click="changeStatus('2')"
          >正式合作</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='3'}"
            @click="changeStatus('3')"
          >无效申请</span>
        </div>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_ChannelFetchList"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
    <DealWith ref="dealWith" :select-data="selectData" @getList="getList" />
  </div>
</template>

<script type="text/jsx">
import { Api_ChannelFetchList, Api_ChannelFetchCount } from "@/api/admin/system/index";
import Button from "@/components/Button";
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import DealWith from "./DealWith";

export default {
  name: "Channel",
  components: { PageHead, TableWrapper, DealWith },
  data() {
    return {
      Api_ChannelFetchList,
      statusOptions: [
        { label: "待处理", value: "0" },
        { label: "洽谈中", value: "1" },
        { label: "正式合作", value: "2" },
        { label: "无效申请", value: "3" }
      ], // 处理状态下拉数据
      listQuery: {
        status: "",
        companyName: null,
        userNameOrPhone: null,
        startDate: null,
        endDate: null
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        status: ["status"],
        companyName: ["companyName"],
        userNameOrPhone: ["userNameOrPhone"],
        startDate: ["startDate"],
        endDate: ["endDate"]
      },
      tableCol: [
        { key: "code", label: "申请编号" },
        { key: "companyName", label: "公司名称", width: 350 },
        { key: "name", label: "姓名" },
        { key: "phone", label: "手机号码" },
        { key: "createDate", label: "申请时间" },
        {
          key: "dealStatus",
          label: "当前状态",
          render: data => {
            let str = "-";
            if (data === "0") {
              str = "待处理";
            } else if (data === "1") {
              str = "洽谈中";
            } else if (data === "2") {
              str = "正式合作";
            } else if (data === "3") {
              str = "无效申请";
            }
            return str;
          }
        },
        {
          key: "",
          label: "操作",
          render: (data, row) => {
            return [
              <Button
                iconClass="icon-edit-square"
                iconColor="green"
                row={row}
                text="处理"
                type="success"
                click={this.handleDealWith.bind(this)}
              />,
              <Button
                iconClass="icon-eye"
                iconColor="green"
                row={row}
                text="查看"
                type="success"
                click={this.handleView.bind(this)}
              />
            ];
          }
        }
      ],
      selectData: undefined,
      endOpen: false,
      waitDealNum: 0,
      inTalkingNum: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取主列表数据
    getList(flag) {
      // this.listQuery = this.form.getFieldsValue();
      this.listQuery.companyName = this.form.getFieldValue("companyName");
      this.listQuery.userNameOrPhone = this.form.getFieldValue("userNameOrPhone");
      this.listQuery.startDate = this.form.getFieldValue("startDate");
      this.listQuery.endDate = this.form.getFieldValue("endDate");
      this.$nextTick(() => {
        this.$refs.child.fetchData(flag);
        Api_ChannelFetchCount("0").then(res => {
          this.waitDealNum = res;
        });
        Api_ChannelFetchCount("1").then(res => {
          this.inTalkingNum = res;
        });
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
    },
    // 处理
    handleDealWith(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.dealWith.openModel();
      });
    },
    // 查看
    handleView(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.dealWith.openModel(true);
      });
    },
    changeStatus(vv) {
      this.listQuery.status = vv;
      this.$nextTick(() => {
        this.getList();
      });
    }
  }
};
</script>

<style scoped>
.text-blue {
  color: #409eff;
}
</style>
