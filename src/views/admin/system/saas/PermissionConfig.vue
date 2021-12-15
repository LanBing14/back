<template>
  <Drawer ref="drawer" :visible.sync="visible" title="权限配置" :onOk="handleSure" @close="onClose">
    <a-form ref="dataForm" :form="form">
      <a-form-item label="客户数量" prop="mvCustomerLimit">
        <a-input v-decorator="formDecorator.mvCustomerLimit" placeholder="请输入客户数量" />
      </a-form-item>
      <a-form-item label="监测数量" prop="mvMonitorLimit">
        <a-input v-decorator="formDecorator.mvMonitorLimit" placeholder="请输入监测数量" />
      </a-form-item>
      <a-form-item label="基础信息报告数" prop="mvReportLimit">
        <a-input v-decorator="formDecorator.mvReportLimit" placeholder="请输入基础信息报告数" />
      </a-form-item>
      <a-form-item label="子账户数量" prop="mvChildLimit">
        <a-input v-decorator="formDecorator.mvChildLimit" placeholder="请输入子账户数量" />
      </a-form-item>
      <a-form-item label="有效期止" prop="mvEndTime">
        <a-date-picker
          placement="top"
          v-decorator="formDecorator.mvEndTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请输入有效期止"
          style="width: 100%"
          showTime
        />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import { Api_SaasDetail, Api_SaasAudit } from "@/api/admin/system/saas.js";

export default {
  name: "PermissionConfig",
  data() {
    return {
      visible: false,
      rowData: null,
      form: this.$form.createForm(this),
      formDecorator: {
        mvCustomerLimit: [
          "mvCustomerLimit",
          { rules: this.$createRules({ msg: "客户数量", required: true, max: 5,  integer0:true }) },
        ],
        mvMonitorLimit: [
          "mvMonitorLimit",
          { rules: this.$createRules({ msg: "监测数量", required: true, max: 5,  integer0:true}) },
        ],
        mvReportLimit: [
          "mvReportLimit",
          {
            rules: this.$createRules({
              msg: "基础信息报告数",
              required: true,
              integer0:true,
              max: 5,
            }),
          },
        ],
        mvChildLimit: [
          "mvChildLimit",
          {
            rules: this.$createRules({
              msg: "子账户数量",
              required: true,
              integer0:true,
              max: 5,
            }),
          },
        ],
        mvEndTime: ["mvEndTime", { rules: this.$createRules({ msg: "有效期止", required: true }) }],
      },
    };
  },
  methods: {
    /**
     * @rr row data
     */
    openModel(rr) {
      this.rowData = rr;
      this.$nextTick(() => {
        Api_SaasDetail(rr.id).then((res) => {
          this.form.setFieldsValue({
            mvCustomerLimit: res.mvCustomerLimit,
            mvMonitorLimit: res.mvMonitorLimit,
            mvReportLimit: res.mvReportLimit,
            mvChildLimit: res.mvChildLimit,
            mvEndTime: this.$dateFormat(res.mvEndTime, "yyyy-MM-dd"),
          });
        });
      });
      this.visible = true;
    },
    handleSure() {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          Api_SaasAudit(this.rowData.id, {
            ...values,
            code: this.rowData.code,
            name: this.rowData.name,
            creditCode: this.rowData.creditCode,
            version: this.rowData.version,
          }).then((res) => {
            this.$message.success(res);
            this.$emit("getList");
            this.visible = false;
          });
        }
      });
    },
    onClose() {
      this.form.resetFields();
    },
  },
};
</script>

<style>
</style>