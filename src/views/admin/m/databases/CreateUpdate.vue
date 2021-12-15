<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增数据库':'修改数据库'"
    :onOk="handleSure"
    @close="onClose"
  >
    <a-form ref="dataForm" :form="form" label-position="right" label-width="8em">
      <a-form-item label="数据库类型" prop="type">
        <a-select v-decorator="formDecorator.type" placeholder="请选择数据库类型" filterable>
          <a-select-option v-for="el in typeOptions" :key="el.value" :value="el.value">{{el.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="数据库名称" prop="name">
        <a-input v-decorator="formDecorator.name" placeholder="请输入数据库名称" />
      </a-form-item>
      <a-form-item label="主机" prop="host">
        <a-input v-decorator="formDecorator.host" placeholder="请输入主机" />
      </a-form-item>
      <a-form-item label="端口" prop="port">
        <a-input v-decorator.number="formDecorator.port" placeholder="请输入端口" />
      </a-form-item>
      <a-form-item label="服务名" prop="serviceName">
        <a-input v-decorator="formDecorator.serviceName" placeholder="请输入服务名" />
      </a-form-item>
      <a-form-item label="用户名" prop="username">
        <a-input v-decorator="formDecorator.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="密码" prop="password">
        <a-input v-decorator="formDecorator.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item label="默认数据库" prop="isDefault">
        <a-switch
          v-decorator="formDecorator.isDefault"
          :active-color="switchColors.active"
          :inactive-color="switchColors.inactive"
        />
        <!--<a-select v-model="addFormData.isDefault" placeholder="请选择默认数据库">-->
        <!--<a-option label="否" value="0"/>-->
        <!--<a-option label="是" value="1"/>-->
        <!--</a-select>-->
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleTestConnection">测试连接</a-button>
        <p style="color: #ff4949;margin: 0;">注:请先将数据库测试通过后,再保存数据库信息!</p>
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import { switchColors } from "@/utils/variables";
import {
  Api_DatabasesGetInfo,
  Api_DatabasesAdd,
  Api_DatabasesUpdate,
  Api_DatabasesConnection
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
    },
    typeOptions: Array
  },
  data() {
    const createRules = this.$createRules;
    return {
      switchColors,
      visible: false,
      typeData: [],
      //   addFormRules: {
      //     type: createRules({
      //       msg: "数据库类型",
      //       required: true
      //     }),
      //     name: createRules({
      //       msg: "数据库名称",
      //       required: true,
      //       max: 100
      //     }),
      //     host: createRules({
      //       msg: "主机",
      //       required: true,
      //       max: 100
      //     }),
      //     port: createRules({
      //       msg: "端口",
      //       required: true,
      //       integer: true
      //     }),
      //     serviceName: createRules({
      //       msg: "服务名",
      //       required: true,
      //       max: 100
      //     }),
      //     username: createRules({
      //       msg: "用户名",
      //       required: true,
      //       max: 100
      //     }),
      //     password: createRules({
      //       msg: "密码",
      //       required: true,
      //       max: 100
      //     }),
      //     isDefault: createRules({
      //       msg: "默认数据库",
      //       required: true
      //     })
      //   },
      isTestConnection: false,
      addFormData: {
        // 新增数据库的表单数据
        type: "",
        name: "",
        host: "",
        port: "",
        serviceName: "",
        username: "",
        password: "",
        isDefault: false
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        type: [
          "type",
          {
            rules: createRules({
              msg: "数据库类型",
              required: true
            })
          }
        ],
        name: [
          "name",
          {
            rules: createRules({
              msg: "数据库名称",
              required: true,
              max: 100
            })
          }
        ],
        host: [
          "host",
          {
            rules: createRules({
              msg: "主机",
              required: true,
              max: 100
            })
          }
        ],
        port: [
          "port",
          {
            rules: createRules({
              msg: "端口",
              required: true,
              integer: true
            })
          }
        ],
        serviceName: [
          "serviceName",
          {
            rules: createRules({
              msg: "服务名",
              required: true,
              max: 100
            })
          }
        ],
        username: [
          "username",
          {
            rules: createRules({
              msg: "用户名",
              required: true,
              max: 100
            })
          }
        ],
        password: [
          "password",
          {
            rules: createRules({
              msg: "密码",
              required: true,
              max: 100
            })
          }
        ],
        isDefault: [
          "isDefault",
          {
            initialValue: false,
            rules: createRules({
              msg: "默认数据库",
              required: true
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
              ? Api_DatabasesAdd(postData)
              : Api_DatabasesUpdate(id, {
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
    // 获取详情
    getDetail(id) {
      const loading = this.$openLoading();
      Api_DatabasesGetInfo(id)
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
    // 测试连接
    handleTestConnection() {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          const loading = this.$openLoading();
          Api_DatabasesConnection(values)
            .then(msg => {
              this.$message.success(msg);
              this.isTestConnection = true;
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
