<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增图表':'修改图表'"
    :onOk="handleSure"
    @close="onClose"
  >
    <a-form ref="dataForm" :form="form" label-position="right" label-width="9em">
      <a-form-item label="图表名称" prop="name">
        <a-input v-decorator="formDecorator.name" />
      </a-form-item>
      <a-form-item label="图表备注" prop="remark">
        <a-input v-decorator="formDecorator.remark" type="textarea" :rows="4" />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import { Api_EchartsAdd, Api_EchartsUpdate } from "@/api/admin/m/index";

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
    },
    typeOptions: {
      type: Array,
      default: () => []
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
          msg: "图表名称",
          required: true,
          max: 100
        }),
        remark: createRules({
          msg: "图表备注",
          max: 300
        })
      },
      addFormData: {
        // 新增图表的图表数据
        name: "",
        remark: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        name: [
          "name",
          {
            rules: createRules({
              msg: "图表名称",
              required: true,
              max: 100
            })
          }
        ],
        remark: [
          "remark",
          {
            rules: createRules({
              msg: "图表备注",
              max: 300
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
        this.form.setFieldsValue({
          name: this.selectData.name,
          remark: this.selectData.remark
        });
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
              ? Api_EchartsAdd(postData)
              : Api_EchartsUpdate(id, {
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
