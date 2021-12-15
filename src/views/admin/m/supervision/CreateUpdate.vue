<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增模型':'修改模型'"
    :onOk="handleSure"
    width="50%"
    @close="onClose"
  >
    <a-form ref="dataForm" :form="form" label-position="right" label-width="8em">
      <a-form-item v-if="modelType === 'update'" label="监管模型编号" prop="name">
        <a-input v-model="selectData.id" disabled />
      </a-form-item>
      <a-form-item label="监管模型名称" prop="name">
        <a-input v-decorator="formDecorator.name" placeholder="请输入监管模型名称" />
      </a-form-item>
      <a-form-item label="顺序" prop="sequence">
        <a-input v-decorator="formDecorator.sequence" placeholder="请输入顺序" />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import {
  Api_SupervisionAdd,
  Api_SupervisionUpdate,
  Api_SupervisionGetDetail
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
      modelType: "add",
      addFormRules: {
        name: createRules({
          msg: "模型名称",
          required: true
        }),
        sequence: createRules({
          msg: "顺序",
          required: true,
          integer: true
        })
      },
      addFormData: {
        // 新增模型的表单数据
        name: "",
        sequence: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        name: [
          "name",
          {
            rules: createRules({
              msg: "模型名称",
              required: true
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
        ]
      }
    };
  },
  methods: {
    // 打开模态框
    openModel(modelType) {
      this.modelType = modelType;
      if (modelType === "add") {
        // 是新增模型
        this.visible = true;
      } else if (modelType === "update") {
        // 是修改模型
        this.getDetail();
      }
    },
    getDetail() {
      Api_SupervisionGetDetail(this.selectData.id).then(res => {
        let fieldsData = {};
        for (const key in this.addFormData) {
          if (res.hasOwnProperty(key)) {
            fieldsData[key] = res[key];
          }
        }
        this.form.setFieldsValue(fieldsData);
        this.visible = true;
      });
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
              ? Api_SupervisionAdd(postData)
              : Api_SupervisionUpdate(id, {
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
