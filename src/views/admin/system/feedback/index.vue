<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item>
          <a-input
            v-decorator="formDecorator.username"
            placeholder="用户名/手机号码"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item>
          <a-select v-decorator="formDecorator.type" placeholder="反馈分类">
            <a-select-option v-for="(el, index) in typeOptions" :key="index" :value="el.value">{{el.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item>
          <a-select v-decorator="formDecorator.status" placeholder="处理状态">
            <a-select-option v-for="(el, index) in statusOptions" :key="index" :value="el.value">{{el.label}}</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item>
          <a-input
            v-decorator="formDecorator.content"
            placeholder="反馈内容"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
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
          <a-button class="filter-item" icon="icon iconfont icon-undo" @click="handleReset">重置</a-button>
        </a-form-item>
        <div style="line-height: 30px; flex: 0 100%">
          <span style="font-weight: bold; padding-right: 15px">当前状态</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status===''}"
            @click="changeStatus('')"
          >全部</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='0'}"
            @click="changeStatus('1')"
          >待处理</span>
          <span
            style="padding: 0 15px; cursor: pointer"
            :class="{'text-blue':listQuery.status==='1'}"
            @click="changeStatus('2')"
          >已处理</span>
        </div>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_FeedbacksFetchList"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
    <DealWith ref="dealWith" :select-data="selectData" :statusOptions="statusOptions" @getList="getList" />
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import DealWith from "./DealWith";
import Button from "@/components/Button";
import { Api_FeedbacksFetchList } from "@/api/admin/system/index";
import { Api_comboboxDict } from "@/api/admin/index";

export default {
  name: "feedback",
  components: { PageHead, DealWith, TableWrapper },
  data() {
    return {
      typeOptions: [], // 反馈分类下拉数据
      statusOptions: [
        { label: "全部", value: "" },
        { label: "待处理", value: "1" },
        { label: "已处理", value: "2" }
      ], // 处理状态下拉数据
      listQuery: {
        username: null,
        content: null,
        type: null,
        status: "",
        startDate: null,
        endDate: null
      },
      tableCol: [
        {
          key: "code",
          label: "反馈编号",
          render: data => data || "-"
        },
        {
          key: "typeDesc",
          label: "反馈分类"
        },
        {
          key: "content",
          label: "反馈内容",
          render: data => {
            return data && data.length >= 10 ? (
              <a-popover>
                <template slot="content">
                  <p>{data}</p>
                </template>
                <span>{data.substr(0, 10)}...</span>
              </a-popover>
            ) : (
              data
            );
          }
        },
        {
          key: "creator",
          label: "用户名"
        },
        {
          key: "mobile",
          label: "手机号码"
        },
        {
          key: "createDate",
          label: "创建时间",
          render: data => (data ? data.substr(0, 10) : "-")
        },
        {
          key: "statusDesc",
          label: "当前状态"
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 80,
          render: (data, row) => {
            return [
              row.status === "0" && (
                <Button
                  iconClass="icon-edit-square"
                  iconColor="green"
                  row={row}
                  text="处理"
                  type="success"
                  click={this.handleDealWith.bind(this)}
                />
              ),
              row.status !== "0" && (
                <Button
                  iconClass="icon-eye"
                  iconColor="green"
                  row={row}
                  text="查看"
                  type="success"
                  click={this.handleView.bind(this)}
                />
              )
            ];
          }
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      //   listQuery: {
      //     name: undefined,
      //     code: undefined
      //   },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        username: ["username"],
        content: ["content"],
        type: ["type"],
        status: ["status"],
        startDate: ["startDate"],
        endDate: ["endDate"]
      },
      selectData: undefined,
      endOpen: false
    };
  },
  mounted() {
    this.getList();
    Api_comboboxDict("feedback_type").then(res => {
      this.typeOptions = res;
    });
    // Api_comboboxDict("feedback_status").then(res => {
    //   this.statusOptions = res;
    // });
  },
  methods: {
    Api_FeedbacksFetchList,
    // 获取主列表数据
    getList(flag) {
      // this.listQuery = this.form.getFieldsValue();
      this.listQuery.username = this.form.getFieldValue("username");
      this.listQuery.content = this.form.getFieldValue("content");
      this.listQuery.type = this.form.getFieldValue("type");
      this.listQuery.startDate = this.form.getFieldValue("startDate");
      this.listQuery.endDate = this.form.getFieldValue("endDate");
      this.$nextTick(() => {
        this.$refs.child.fetchData(flag);
      });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset() {
      this.form.resetFields();
      this.getList(true);
    },
    // 处理
    handleDealWith(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.dealWith.openModel();
      });
    },
    // 处理
    handleView(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.dealWith.openModel(true);
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
