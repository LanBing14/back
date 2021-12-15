<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="code">
          <a-input
            v-decorator="formDecorator.code"
            placeholder="站点编码"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="name">
          <a-input
            v-decorator="formDecorator.name"
            placeholder="认证企业"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop>
          <a-select
            v-decorator="formDecorator.mvName"
            placeholder="会员版本"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          >
            <a-select-option value="基础版试用">基础版试用</a-select-option>
            <a-select-option value="企业版">企业版</a-select-option>
            <a-select-option value="专业版">专业版</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop>
          <a-select
            v-decorator="formDecorator.certStatus"
            placeholder="认证状态"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          >
            <a-select-option value="10">待认证</a-select-option>
            <a-select-option value="1">待审核</a-select-option>
            <a-select-option value="2">已认证</a-select-option>
            <a-select-option value="0">认证失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop="creator">
          <a-input
            v-decorator="formDecorator.creator"
            placeholder="管理员名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
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
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_SaasFetchList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
          :current-change="currentChange"
          :toolActions="actionBtns"
        />
      </div>
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :select-data="selectData"
      @getList="getList"
    />
    <PermissionConfig ref="ref_PermissionConfig" @getList="getList"></PermissionConfig>
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import PermissionConfig from "./PermissionConfig";
import {
  Api_SaasFetchList,
  Api_SaasDel, // 删除字典
  Api_SaasFreshen, // 刷新字典
} from "@/api/admin/system/index";

export default {
  name: "Dictionary",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper, PermissionConfig },
  data() {
    return {
      tableCol: [
        { key: "code", label: "站点编码", width: 200 },
        { key: "mvName", label: "会员版本", render: (data, row) => row.mvName || "-" },
        { key: "creator", label: "站点管理员", render: (data, row) => row.creator || "-" },
          {
              key: "name", label: "认证企业", render: (data, row) => {
                  return (
                      <div
                          className="ellipsis"
                          style="cursor: pointer;"
                      >
                          {(row.name ? row.name : "-")}
                          <span style="border: 1px solid;border-radius: 5px;padding: 0 5px;">{   row.certStatus === ""
                              ? "待认证"
                              : row.certStatus === "1"
                                  ? "待审核"
                                  : row.certStatus === "2"
                                      ? "已认证"
                                      : row.certStatus === "0"
                                          ? "认证失败"
                                          : "-"}</span>
                      </div>

                  );
              }
          },
        {
          key: "createDate",
          label: "注册日期",
          width: "120px",
          render: (data, row) => (data ? this.$dateFormat(data, "yyyy-MM-dd") : "-"),
        },
        {
          key: "mvBeginTime",
          label: "会员有效期",
          width: "120px",
          render: (data, row) => {
            return row.mvEndTime ? this.$dateFormat(row.mvEndTime, "yyyy-MM-dd") : "-";
          },
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 80,
          render: (data, row) => {
            return [
              <Button
                iconClass="icon-edit-square"
                iconColor="green"
                row={row}
                text="权限配置"
                type="success"
                click={this.permissionConfig.bind(this, row)}
              />,
              // <Button
              //     iconClass="icon-edit-square"
              //     iconColor="green"
              //     row={row}
              //     text="修改"
              //     type="success"
              //     click={this.handleUpdate.bind(this)}
              // />,
              // <Button
              //     iconClass="icon-delete"
              //     iconColor="red"
              //     row={row}
              //     text="删除"
              //     type="danger"
              //     click={this.handleDel.bind(this, row)}
              // />
            ];
          },
        },
      ],
      // 按钮
      actionBtns: [
        {
          text: "新增站点",
          icon: "icon-plus",
          click: this.handleCreate,
        },
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
        name: ["name"],
        code: ["code"],
        creditCode: ["creditCode"],
        mvName: ["mvName"],
        certStatus: ["certStatus"],
        creator:['creator']
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add",
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_SaasFetchList,
    // 获取主列表数据
    getList(flag) {
      this.$refs.child.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset() {
      this.form.resetFields();
      this.$nextTick(() => {
        this.getList(true);
      });
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 打开新增字典界面
    handleCreate() {
      this.modelStatus = "add";
      this.$refs.createUpdateModel.openModel();
    },
    // 打开修改界面
    handleUpdate(row) {
      this.selectData = row;
      this.modelStatus = "update";
      this.$nextTick(() => {
        this.$refs.createUpdateModel.openModel();
      });
    },
    // 删除字典
    handleDel(row) {
      console.log(row);
      this.$confirm("确定删除该站点?", "提示", {
        type: "warning",
      }).then(() => {
        Api_SaasDel(row.id, row.code).then((msg) => {
          this.$message.success(msg);
          this.getList();
        });
      });
    },
    // 表格行改变时
    currentChange(data) {
      this.selectData = data;
    },
    submitForm(formName) {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @rr row data
     */
    permissionConfig(rr) {
      this.$refs.ref_PermissionConfig.openModel(rr);
    },
  },
};
</script>

<style scoped>
</style>
