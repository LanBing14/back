<template>
  <div>
    <div class="app-container">
      <PageHead>
        <a-form ref="form" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
          <a-form-item prop="name">
            <a-input v-decorator="['name']" placeholder="企业名称" />
          </a-form-item>
          <a-form-item prop="username">
            <a-input v-decorator="['username']" placeholder="用户名" />
          </a-form-item>
          <a-form-item prop="phone">
            <a-input v-decorator="['phone']" placeholder="手机号码" />
          </a-form-item>
          <a-form-item prop="startDate">
            <a-date-picker
              v-decorator="['startDate']"
              :disabledDate="disabledStartDate"
              format="YYYY-MM-DD"
              placeholder="开始时间"
            />
          </a-form-item>
          <a-form-item prop="endDate">
            <a-date-picker
              v-decorator="['endDate']"
              :disabledDate="disabledEndDate"
              format="YYYY-MM-DD"
              placeholder="结束时间"
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
            <span style="font-weight: bold; padding-right: 15px">企业状态</span>
            <span
              style="padding: 0 15px; cursor: pointer"
              :class="{'text-blue':listQuery.status===''}"
              @click="changeStatus('')"
            >全部</span>
            <span
              style="padding: 0 15px; cursor: pointer"
              :class="{'text-blue':listQuery.status==='-1'}"
              @click="changeStatus('-1')"
            >撤回</span>
            <span
              style="padding: 0 15px; cursor: pointer"
              :class="{'text-blue':listQuery.status==='1'}"
              @click="changeStatus('1')"
            >待审核</span>
            <span
              style="padding: 0 15px; cursor: pointer"
              :class="{'text-blue':listQuery.status==='2'}"
              @click="changeStatus('2')"
            >审核通过</span>
            <span
              style="padding: 0 15px; cursor: pointer"
              :class="{'text-blue':listQuery.status==='0'}"
              @click="changeStatus('0')"
            >审核不通过</span>
          </div>
        </a-form>
      </PageHead>
      <div class="page-content">
        <div class="page-content-body">
          <TableWrapper
            ref="ref_table"
            :fetch-data-fn="Api_enterpriseList"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <AuditEnterprise ref="ref_AuditEnterprise" @getList="getList"></AuditEnterprise>
    <DetailEnterprise ref="ref_DetailEnterprise"></DetailEnterprise>
  </div>
</template>

<script>
import PageHead from "@/components/PageHead";
import { Api_enterpriseList } from "@/api/admin/system/index";
import TableWrapper from "@/components/TableWrapper";
import Button from "@/components/Button";
import AuditEnterprise from "./AuditEnterprise";
import DetailEnterprise from "./DetailEnterprise";
import { Api_enterpriseAudit } from "@/api/admin/system/enterpriseCertification.js";

export default {
  name: "enterpriseCertification",
  components: { PageHead, TableWrapper, AuditEnterprise, DetailEnterprise },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  data() {
    return {
      form: this.$form.createForm(this),
      listQuery: {
        name: null,
        username: null,
        phone: null,
        startDate: null,
        endDate: null,
        status: ""
      },
      tableCol: [
        { label: "业务编号", key: "businessCode", render: data => data || "-" },
        { label: "公司名称", key: "name" },
        { label: "用户名", key: "username" },
        { label: "姓名", key: "fullName", render: data => data || "-" },
        { label: "手机号码", key: "phone" },
        {
          label: "认证状态",
          key: "status",
          render: data => {
            return data === "0"
              ? "审核不通过"
              : data === "1"
              ? "待审核"
              : data === "2"
              ? "审核完成"
              : data === "-1"
              ? "撤回"
              : "-";
          }
        },
        {
          label: "认证申请时间",
          key: "createDate",
          render: data => {
            return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
          }
        },
        {
          label: "操作",
          key: "",
          render: (data, row) => {
            return [
              row.status === "1" && (
                <Button
                  iconClass="icon-edit-square"
                  iconColor="green"
                  row={row}
                  text="审核"
                  type="success"
                  click={this.handleAudit.bind(this)}
                />
              ),
              row.status === "2" && (
                <Button
                  iconClass="icon-undo"
                  iconColor="red"
                  row={row}
                  text="撤销"
                  type="success"
                  click={this.handleUndo.bind(this)}
                />
              ),
              <Button
                iconClass="icon-eye"
                iconColor="blue"
                row={row}
                text="查看"
                type="success"
                click={this.handleView.bind(this)}
              />
            ];
          }
        }
      ]
    };
  },
  methods: {
    Api_enterpriseList,
    getList() {
      // this.listQuery = this.form.getFieldsValue();
      this.listQuery.name = this.form.getFieldValue("name");
      this.listQuery.username = this.form.getFieldValue("username");
      this.listQuery.phone = this.form.getFieldValue("phone");
      this.listQuery.startDate = this.form.getFieldValue("startDate");
      this.listQuery.endDate = this.form.getFieldValue("endDate");
      this.$nextTick(() => {
        this.$refs.ref_table.fetchData();
      });
    },
    handleFilter() {
      this.getList(true);
    },
    handleReset(formName) {
      this.form.resetFields();
      this.$nextTick(() => {
        this.getList(true);
      });
    },
    handleAudit(rr) {
      this.$refs.ref_AuditEnterprise.open(rr);
    },
    handleUndo(rr) {
      // this.$confirm({
      //   title: "提示",
      //   content: "确定要撤回审核吗？",
      //   onOk() {

      //   },
      //   onCancel() {}
      // });
      Api_enterpriseAudit(rr.id, "-1").then(res => {
        this.$message.success("撤回成功！");
        this.getList();
      });
    },
    handleView(rr) {
      this.$refs.ref_DetailEnterprise.open(rr);
    },
    changeStatus(vv) {
      this.listQuery.status = vv;
      this.getList();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.text-blue {
  color: #409eff;
}
</style>