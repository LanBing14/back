<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增字典':'修改字典'"
    :onOk="handleSure"
    @close="onClose"
  >
    <a-form ref="dataForm" :form="form" label-position="right" label-width="8em">
      <a-form-item label="字典组编码">
        <a-input v-decorator="formDecorator.code" placeholder="请输入字典组编码" />
      </a-form-item>
      <a-form-item label="字典组名称">
        <a-input v-decorator="formDecorator.name" placeholder="请输入字典组名称" />
      </a-form-item>
      <a-form-item label="字典键值对" class="dictionary-list">
        <div class="label-right list-item">
          <a-form-item label="字典编码" style="text-align: center" />
          <a-form-item label="字典名称" />
          <a-form-item label="备注" />
          <a-form-item class="action">
            <a-button
              icon="el-icon-plus"
              circle
              style="opacity: 0;z-index: -1;position: relative;"
            />
            <a-button
              icon="el-icon-minus"
              circle
              style="opacity: 0;z-index: -1;position: relative;"
            />
          </a-form-item>
        </div>
        <div v-for="(domain, index) in formDecorator.data" :key="index" class="list-item">
          <a-form-item :prop="'data.' + index + '.dataCode'">
            <a-input
              v-decorator="['dataCode'+index ,{rules: [{ required: true, message: '字典编码必填' },{ max: 50, message: '字典编码过长' }]}]"
              placeholder="请输入字典编码"
            />
          </a-form-item>
          <a-form-item :prop="'data.' + index + '.dataName'">
            <a-input
              v-decorator="['dataName'+index ,{rules: [{ required: true, message: '字典名称必填' },{ max: 100, message: '字典名称过长' }]}]"
              placeholder="请输入字典名称"
            />
          </a-form-item>
          <a-form-item :prop="'data.' + index + '.remark'">
            <a-input
              v-decorator="['remark'+index , { rules: [{ max: 300, message: '备注过长' }] }]"
              placeholder="请输入备注"
            />
          </a-form-item>
          <a-form-item class="action">
            <a-button type="primary" shape="circle" icon="plus" @click="add" />
            <a-button icon="minus" shape="circle" @click="del(index)" />
          </a-form-item>
        </div>
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import {
  Api_DictionariesAdd,
  Api_DictionariesUpdate
} from "@/api/admin/system/index";

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
      //   dataCodeRules: createRules({
      //     msg: "字典编码",
      //     required: true,
      //     max: 50,
      //     EXP_ENG_NUM_3: true
      //   }),
      //   dataNameRules: createRules({
      //     msg: "字典名称",
      //     required: true,
      //     max: 100
      //   }),
      //   dataRemarkRules: createRules({
      //     msg: "字典备注",
      //     max: 300
      //   }),
      //   addFormRules: {
      //     name: createRules({
      //       msg: "字典组名称",
      //       required: true,
      //       max: 100
      //     }),
      //     code: createRules({
      //       msg: "字典组编码",
      //       required: true,
      //       max: 50,
      //       EXP_ENG_NUM_3: true
      //     })
      //   },
      addFormData: {
        // 新增字典的表单数据
        name: undefined,
        code: undefined,
        data: [{}]
      },
      form: this.$form.createForm(this),
      formDecorator: {
        code: [
          "code",
          {
            rules: [
              { required: true, message: "字典组编码必填" },
              { max: 50, message: "字典组编码过长" }
            ]
          }
        ],
        name: [
          "name",
          {
            rules: [
              { required: true, message: "字典组名称必填" },
              { max: 100, message: "字典组名称过长" }
            ]
          }
        ],
        data: [{}]
      }
    };
  },
  methods: {
    // 打开模态框
    openModel() {
      if (this.modelStatus === "update") {
        //             const oldData = { ...this.form.getFieldsValue() };
        //   const newData = {};
        //   for (const key in oldData) {
        //     if (res.hasOwnProperty(key)) {
        //       newData[key] = res[key];
        //     }
        //   }
        //   this.form.setFieldsValue(newData);
        //   this.visible = true;
        //   loading.close();
        let editData = {};
        editData.name = this.selectData.name;
        editData.code = this.selectData.code;
        for (let i = 0; i < this.selectData.dictionaryData.length; i++) {
          if (i != 0) {
            this.add();
          }
          editData["dataCode" + i] = this.selectData.dictionaryData[i].dataCode;
          editData["dataName" + i] = this.selectData.dictionaryData[i].dataName;
          editData["remark" + i] = this.selectData.dictionaryData[i].remark;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(editData);
        });
      }
      this.visible = true;
    },
    // 点击确认
    handleSure() {
      this.form.validateFields((valid, value) => {
        if (!valid) {
          console.log(value);
          const { modelStatus } = this; // add新增，update修改
          const { id, version } = this.selectData;
          //   const dictionarieDatas = this.formDecorator.data.map(item => {
          //     return `${item.dataCode};${item.dataName};${item.remark || ""}`;
          //   });
          const dictionarieDatas = JSON.parse(JSON.stringify(value));
          let dictionarieDatasArray = [];
          delete dictionarieDatas.code;
          delete dictionarieDatas.name;
          for (let i = 0; i < Object.keys(dictionarieDatas).length; i++) {
            if (Object.keys(dictionarieDatas)[i].indexOf("dataCode") != -1) {
              let _index = Object.keys(dictionarieDatas)[i].substr(
                Object.keys(dictionarieDatas)[i].length - 1,
                1
              );
              dictionarieDatasArray.push(
                dictionarieDatas["dataCode" + _index] +
                  ";" +
                  dictionarieDatas["dataName" + _index] +
                  ";" +
                  (dictionarieDatas["remark" + _index] || "")
              );
            }
          }
          const postData = {
            code: value.code,
            name: value.name,
            data: dictionarieDatasArray
          };
          const promiseRes =
            modelStatus === "add"
              ? Api_DictionariesAdd(postData)
              : Api_DictionariesUpdate(id, {
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
    add() {
      this.formDecorator.data.push({});
    },
    del(index) {
      if (this.formDecorator.data.length > 1) {
        this.formDecorator.data.splice(index, 1);
      }
    },
    onClose() {
      this.form.resetFields();
      this.formDecorator.data = [{}];
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

.list-item {
  display: flex;
  & > div {
    flex: 1;
  }
  /deep/ .a-form-item__label {
    width: 100% !important;
  }
  .action {
    flex: initial;
    margin-right: 0;
  }
}
.label-right /deep/ {
  label {
    text-align: center;
  }
}
</style>
