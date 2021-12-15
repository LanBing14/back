<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="title"
    :onOk="handleSure"
    :only-close-btn="isView"
    @close="onClose"
  >
    <a-form ref="form" :form="form" label-position="right" label-width="8em">
      <a-form-item label="产品名称">{{ name }}</a-form-item>
      <a-form-item label="市场价" prop="newPrice">
        <a-input v-decorator="formDecorator.newPrice" placeholder="请输入市场价" />
      </a-form-item>
      <a-form-item label="划线价" prop="oldPrice">
        <a-input v-decorator="formDecorator.oldPrice" :disabled="isView" placeholder="请输入划线价" />
      </a-form-item>
      <a-form-item label="有效期(单位：月)" prop="effectiveMonth">
        <a-input v-decorator="formDecorator.effectiveMonth" :disabled="isView" placeholder="请输入有效期" />
      </a-form-item>
      <a-form-item label="客户数量" prop="customerLimit">
        <a-checkbox :disabled="isView" v-model="isCustomerLimit" @change="change1">不限</a-checkbox>
        <a-input
          v-decorator="['customerLimit',{rules:!isCustomerLimit?[{required: true, message: '客户数量必填'},{validator: validatorMetaPar}]:[]}]"
          :disabled="isView||isCustomerLimit"
          placeholder="请输入客户数量"
        />
      </a-form-item>
      <a-form-item label="监测数量" prop="monitorLimit">
        <a-checkbox :disabled="isView" v-model="isMonitorLimit" @change="change2">不限</a-checkbox>
        <a-input
          v-decorator="['monitorLimit',{rules:!isMonitorLimit?[{required: true, message: '监测数量必填'},{validator: validatorMetaPar}]:[]}]"
          :disabled="isView||isMonitorLimit"
          placeholder="请输入监测数量"
        />
      </a-form-item>
      <a-form-item label="基础信息报告数" prop="reportLimit">
        <a-checkbox :disabled="isView" v-model="isReportLimit" @change="change3">不限</a-checkbox>
        <a-input
          v-decorator="['reportLimit',{rules:!isReportLimit?[{required: true, message: '基础信息报告数必填'},{validator: validatorMetaPar}]:[]}]"
          :disabled="isView||isReportLimit"
          placeholder="请输入基础信息报告数"
        />
      </a-form-item>
      <a-form-item label="子账户数量" prop="childLimit">
        <a-checkbox :disabled="isView" v-model="isChildLimit" @change="change4">不限</a-checkbox>
        <a-input
          v-decorator="['childLimit',{rules:!isChildLimit?[{required: true, message: '子账户数量必填'},{validator: validatorMetaPar}]:[]}]"
          :disabled="isView||isChildLimit"
          placeholder="请输入子账户数量"
        />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import { Api_VersionTodo } from "@/api/admin/train/index";

export default {
  name: "DealWith",
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
      isView: false,
      title: "产品配置",
      form: this.$form.createForm(this),
      id: "",
      code: "",
      name: "",
      isCustomerLimit: false,
      isMonitorLimit: false,
      isReportLimit: false,
      isChildLimit: false,
      customerLimitFlag: "0",
      monitorLimitFlag: "0",
      reportLimitFlag: "0",
      childLimitFlag: "0",
      formDecorator: {
        newPrice: [
          "newPrice",
          { rules: [{ required: true, message: "市场价必填" }, { validator: this.validatorMetaPrice }] }
        ],
        oldPrice: ["oldPrice", { rules: [{ validator: this.validatorMetaInfo }] }],
        effectiveMonth: [
          "effectiveMonth",
          {
            rules: [
              { required: true, message: "请输入有效期（1-36之间的数字）" },
              { validator: this.validatorMetaMonth }
            ]
          }
        ]
      }
    };
  },
  methods: {
    openModel(isView) {
      this.visible = true;
      this.isView = isView;
      if (isView) {
        this.title = "查看";
      }
      console.log(this.selectData.customerLimitFlag);
      console.log(this.selectData.monitorLimitFlag);
      console.log(this.selectData.reportLimitFlag);
      console.log(this.selectData.childLimitFlag);
      this.name = this.selectData.name;
      this.id = this.selectData.id;
      this.customerLimitFlag = this.selectData.customerLimitFlag ? "1" : "0";
      this.monitorLimitFlag = this.selectData.monitorLimitFlag ? "1" : "0";
      this.reportLimitFlag = this.selectData.reportLimitFlag ? "1" : "0";
      this.childLimitFlag = this.selectData.childLimitFlag ? "1" : "0";
      this.isCustomerLimit = this.selectData.customerLimitFlag;
      this.isMonitorLimit = this.selectData.monitorLimitFlag;
      this.isReportLimit = this.selectData.reportLimitFlag;
      this.isChildLimit = this.selectData.childLimitFlag;
      this.$nextTick(() => {
        this.form.setFieldsValue({ newPrice: this.selectData.newPrice });
        this.form.setFieldsValue({ oldPrice: this.selectData.oldPrice });
        this.form.setFieldsValue({ effectiveMonth: this.selectData.effectiveMonth });
        this.form.setFieldsValue({ customerLimit: this.selectData.customerLimit });
        this.form.setFieldsValue({ monitorLimit: this.selectData.monitorLimit });
        this.form.setFieldsValue({ reportLimit: this.selectData.reportLimit });
        this.form.setFieldsValue({ childLimit: this.selectData.childLimit });
      });
    },
    handleSure() {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          const postData = values;
          postData.id = this.id;
          postData.customerLimitFlag = this.customerLimitFlag;
          postData.monitorLimitFlag = this.monitorLimitFlag;
          postData.reportLimitFlag = this.reportLimitFlag;
          postData.childLimitFlag = this.childLimitFlag;
          const loading = this.$openLoading();
          Api_VersionTodo(postData)
            .then(msg => {
              this.visible = false;
              this.onClose();
              this.$message.success(msg);
              this.$emit("getList");
              loading.close();
            })
            .catch(() => {
              loading.close();
            });
        }
      });
    },
    onClose() {
      this.form.resetFields();
    },
    validatorMetaPrice(rule, value, callback) {
      if (value) {
        if (!/^(\d|[1-9]\d{1,5})(\.\d{1,2})?$/.test(value)) {
          callback(new Error("不超过6位数,小数位2位"));
        }
      }
      callback();
    },
    validatorMetaMonth(rule, value, callback) {
      if (value) {
        if (/^[1-9]\d*$/.test(value)) {
          if (Number(value) > 36 || Number(value) < 1) {
            callback(new Error("请输入有效期（1-36之间的数字）"));
          }
        } else {
          callback(new Error("请输入正整数"));
        }
      }
      callback();
    },
    validatorMetaInfo(rule, value, callback) {
      if (value) {
        if (/^(\d|[1-9]\d{1,5})(\.\d{1,2})?$/.test(value)) {
          if (Number(value) < Number(this.form.getFieldsValue().newPrice)) {
            callback(new Error("不能小于市场价"));
          }
        } else {
          callback(new Error("不超过6位数,小数位2位"));
        }
      }
      callback();
    },
    validatorMetaPar(rule, value, callback) {
      if (/^[0-9]\d*$/.test(value)) {
        if (value.length > 5) {
          callback(new Error("不超过5位数"));
        }
      } else {
        callback(new Error("请输入正整数"));
      }
      callback();
    },
    validatorMetaNum(rule, value, callback) {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error("请输入正整数"));
      }
      callback();
    },
    change1(e) {
      this.isCustomerLimit = e.target.checked;
      if (this.isCustomerLimit) {
        this.monitorLimitFlag = "1";
      } else {
        this.monitorLimitFlag = "0";
      }
    },
    change2(e) {
      this.isMonitorLimit = e.target.checked;
      if (this.isMonitorLimit) {
        this.customerLimitFlag = "1";
      } else {
        this.customerLimitFlag = "0";
      }
    },
    change3(e) {
      this.isReportLimit = e.target.checked;
      if (this.isReportLimit) {
        this.reportLimitFlag = "1";
      } else {
        this.reportLimitFlag = "0";
      }
    },
    change4(e) {
      this.isChildLimit = e.target.checked;
      if (this.isChildLimit) {
        this.childLimitFlag = "1";
      } else {
        this.childLimitFlag = "0";
      }
    }
  }
};
</script>

<style scoped>
</style>
