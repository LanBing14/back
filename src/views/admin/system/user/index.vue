<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" layout="inline" class="searchForm-wrap">
        <a-form-item>
          <a-input v-decorator="formDecorator.username" placeholder="用户名" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="formDecorator.name" placeholder="名称" @keyup.enter.native="handleFilter" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="formDecorator.mobile" placeholder="手机号" @keyup.enter.native="handleFilter" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="formDecorator.email" placeholder="邮箱" @keyup.enter.native="handleFilter" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="formDecorator.departmentName"
            placeholder="部门"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item>
          <a-select v-decorator="formDecorator.roleId" placeholder="角色" filterable>
            <a-select-option v-for="item in rolesList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-decorator="formDecorator.enable" placeholder="激活状态" clearable filterable>
            <a-select-option v-for="item in enableOptions" :key="item.key" :value="item.key">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="false">
          <a-input v-decorator="formDecorator.withoutSaas" />
        </a-form-item>
        <a-form-item class="btns">
          <a-button type="primary" icon="search" class="filter-item" @click="handleFilter">查询</a-button>
          <a-button icon="undo" class="filter-item" @click="handleReset('searchForm')">重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_UserFetchList"
          :query="listQuery"
          :columns="tableCol"
          :toolActions="actionBtns"
        />
      </div>
    </div>

    <!--新增或修改-->
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :model-visible="addModelVisible"
      :select-data="selectData"
      @getList="getList"
    />

    <!--授权组件-->
    <Grant
      ref="userGrant"
      :select-id="selectId"
      :get-list="Api_UserGetPermissions"
      :update="Api_UserUpdatePermissions"
      title="用户功能授权"
    />
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import Button from "@/components/Button";
import CreateUpdate from "./CreateUpdate";
import Grant from "./components/Grant";
import {
  Api_UserFetchList,
  Api_UserChangeStatus,
  Api_UserDel, // 删除用户
  Api_UserReset, // 重置用户密码
  Api_UserGetPermissions, // 获取用户权限树
  Api_UserUpdatePermissions, // 更新用户权限树
  Api_RolesCombobox, // 获取角色下拉列表数据
} from "@/api/admin/system/index";

export default {
  name: "User",
  components: { PageHead, CreateUpdate, TableWrapper, Grant },
  data() {
    // const selectCode = this.$store.getters.selectSaasCode
    return {
      form: this.$form.createForm(this),
      selectSaasCode: this.$store.getters.selectSaasCode,
      // 查询表单注册表单值
      formDecorator: {
        username: ["username"],
        name: ["name"],
        mobile: ["mobile"],
        email: ["email"],
        roleId: ["roleId"],
        departmentName: ["departmentName"],
        enable: ["enable"],
        withoutSaas: ["withoutSaas", { initialValue: 0 }],
      },
      rolesList: [],
      // 页面按钮
      actionBtns: [
        {
          text: "新增用户",
          icon: "plus",
          click: this.handleCreate,
        },
      ],
      // 列表列的字段定义
      tableCol: [
        {
          key: "username",
          label: "用户名",
        },
        {
          key: "name",
          label: "名称",
        },
        {
          key: "mobile",
          label: "手机号",
        },
        {
          key: "email",
          label: "邮箱",
        },
        {
          key: "departmentName",
          label: "部门",
        },
        {
          key: "roleNames",
          label: "角色",
        },
        {
          key: "enable",
          label: "激活状态",
          align: "center",
          render: (data, row) => {
            return <a-switch checked={row.enable === "1"} onchange={this.changeEnable.bind(this, row)} />;
          },
        },
        {
          key: "operation",
          label: "操作",
          align: "center",
          width: 150,
          render: (data, row) => {
            return [
              <Button iconClass="icon-fork" row={row} text="额外授权" click={this.handleGrant.bind(this)} />,
              <Button
                iconClass="icon-rest"
                iconColor="green"
                row={row}
                text="重置密码"
                type="warning"
                click={this.resetUser.bind(this)}
              />,
              <Button
                iconClass="icon-edit-square"
                iconColor="green"
                row={row}
                text="修改"
                type="success"
                click={this.handleUpdate.bind(this)}
              />,
              <Button
                iconClass="icon-delete"
                iconColor="red"
                row={row}
                text="删除"
                type="danger"
                click={this.handleDel.bind(this)}
              />,
            ];
          },
        },
      ],
      // 列表数据
      list: null,
      // 列表的查询条件值
      listQuery: {},
      selectId: undefined, // 选中数据的id
      selectData: undefined, // 选中的数据
      modelStatus: "add", // 新增或修改model的标题
      addModelVisible: false, // 新增或修改model的显示状态
      enableOptions: [
        {
          // 下拉框的内容
          key: "1",
          label: "启用",
        },
        {
          key: "0",
          label: "禁用",
        },
      ],
      Api_UserGetPermissions,
      Api_UserUpdatePermissions,
    };
  },
  created() {
    Api_RolesCombobox({ saasCode: this.$store.getters.selectSaasCode }).then((res) => {
      this.rolesList = res;
    });
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_UserFetchList,
    // 获取主列表数据
    getList(pageReset) {
      this.listQuery = this.form.getFieldsValue();
      this.listQuery.saasCode = this.selectSaasCode;
      this.$nextTick(() => {
        this.$refs.child.fetchData(pageReset);
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
    // 更改用户状态
    changeEnable(row) {
      row.enable = row.enable === "1" ? "0" : "1";
      Api_UserChangeStatus(row.enable, row.id)
        .then((msg) => {
          this.$message.success(msg);
          // this.getList();
        })
        .catch((msg) => {
          // row.enable = false;
          this.$message.error(msg);
        });
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 打开新增用户界面
    handleCreate() {
      this.modelStatus = "add";
      this.$refs.createUpdateModel.openModel();
    },
    // 打开授权界面
    handleGrant(row) {
      this.selectId = row.id;
      this.$nextTick(() => {
        this.$refs.userGrant.handleGrant();
      });
    },
    // 打开修改界面
    handleUpdate(row) {
      this.selectData = row;
      this.modelStatus = "update";
      this.$nextTick(() => {
        this.$refs.createUpdateModel.openModel(row.id);
      });
    },
    // 删除用户
    handleDel(row) {
      this.$confirm("确定删除该用户?", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_UserDel(row.id)
          .then((msg) => {
            this.$message.success(msg);
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    // 重置用户
    resetUser(row) {
      this.$confirm("确定重置该用户密码?").then(() => {
        const loading = this.$openLoading();
        Api_UserReset(row.id)
          .then((msg) => {
            this.$message.success(msg);
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
  },
};
</script>

<style scoped>
</style>
