<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增验证规则':'修改验证规则'"
    :onOk="handleSure"
    @close="onClose"
  >
    <a-form ref="dataForm" :form="form" label-position="right" label-width="9em">
      <a-form-item label="验证规则名字" prop="name">
        <a-input v-decorator="formDecorator.name" placeholder="请输入验证规则名字" />
      </a-form-item>
      <a-form-item label="验证规则表达式" prop="expression">
        <a-input v-decorator="formDecorator.expression" placeholder="请输入验证规则表达式" />
      </a-form-item>
      <a-form-item label="顺序" prop="sequence">
        <a-input v-decorator="formDecorator.sequence" placeholder="请输入顺序" />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import {
  Api_ValidationRulesAdd,
  Api_ValidationRulesUpdate,
  Api_ValidationRulesDetail
} from "@/api/admin/m/index";

export default {
  name: "CreateUpdate",
  props: {
    modelStatus: {
      type: String,
      default: ""
    },
    selectData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      timeArrVal: "",
      typeData: [],
      addFormRules: {
        name: createRules({
          msg: "验证规则名称",
          required: true,
          max: 100
        }),
        expression: createRules({
          msg: "验证规则表达式",
          required: true,
          max: 300
        }),
        sequence: createRules({
          msg: "顺序",
          required: true,
          integer: true
        }),
        tips: createRules({
          msg: "提示语",
          required: true,
          max: 100
        })
      },
      addFormData: {
        // 新增验证规则的表单数据
        name: "",
        expression: "",
        sequence: "",
        tips: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        name: [
          "name",
          {
            rules: createRules({
              msg: "验证规则名称",
              required: true,
              max: 100
            })
          }
        ],
        expression: [
          "expression",
          {
            rules: createRules({
              msg: "验证规则表达式",
              required: true,
              max: 300
            })
          }
        ],
        sequence: [
          "sequence",
          {
            rules: createRules({
              msg: "顺序",
              required: true,
              integer: true
            })
          }
        ],
        tips: [
          "tips",
          {
            rules: createRules({
              msg: "提示语",
              required: true,
              max: 100
            })
          }
        ]
      }
    };
  },
  methods: {
    // 打开模态框
    openModel(id) {
      this.visible = true;
      if (id) {
        this.getDetail(id);
      }
    },
    // 点击确认
    handleSure() {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          const { modelStatus } = this; // add新增，update修改
          const { id, version } = this.selectData;
          const postData = values;
          const promiseRes =
            modelStatus === "add"
              ? Api_ValidationRulesAdd(postData)
              : Api_ValidationRulesUpdate(id, {
                  ...postData,
                  version
                });
          const loading = this.$openLoading();
          promiseRes
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
    // 获取单条数据信息
    getDetail(id) {
      const loading = this.$openLoading();
      Api_ValidationRulesDetail(id)
        .then(res => {
          const oldData = { ...this.form.getFieldsValue() };
          const newData = {};
          for (const key in oldData) {
            if (res.hasOwnProperty(key)) {
              newData[key] = res[key];
            }
          }
          this.form.setFieldsValue(newData);
          this.visible = true;
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    onClose() {
      this.form.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.dictionary-list {
  div {
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .a-form-item {
    float: left;
    margin-right: 10px;

    label {
      text-align: center;
      padding-right: 0;
    }
  }

  input {
    width: 100px;
  }
}
</style>
