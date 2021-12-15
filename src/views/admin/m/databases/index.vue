<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="type">
          <a-select v-decorator="formDecorator.type" placeholder="数据库类型" filterable>
            <a-select-option
              v-for="el in typeOptions"
              :key="el.value"
              :value="el.value"
            >{{el.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop="name">
          <a-input v-decorator="formDecorator.name" placeholder="数据库名称" @input="listInput" />
        </a-form-item>
        <a-form-item prop="host">
          <a-input v-decorator="formDecorator.host" placeholder="主机" />
        </a-form-item>
        <a-form-item class="btns">
          <a-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</a-button>
          <a-button class="filter-item" icon="undo" @click="handleReset('searchForm')">重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_DatabasesGetTreeList"
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
      :typeOptions="typeOptions"
      @getList="getList"
    />
    <!-- <Tables ref="tables" :select-data="selectData" @getList="getList" /> -->
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import Tables from "./Tables";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import { m } from "@/api/index";
import { Api_comboboxDict } from "@/api/admin/index";
import {
  Api_DatabasesGetTreeList,
  Api_DatabasesDelete
} from "@/api/admin/m/index";

export default {
  name: "Databases",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper, Tables },
  data() {
    return {
      typeOptions: [],
      sassData: [],
      tableCol: [
        {
          key: "type",
          label: "数据库类型"
        },
        {
          key: "name",
          label: "数据库名称"
        },
        {
          key: "host",
          label: "主机"
        },
        {
          key: "port",
          label: "端口"
        },
        {
          key: "serviceName",
          label: "服务名"
        },
        {
          key: "username",
          label: "用户名"
        },
        {
          key: "isDefault",
          label: "默认数据库",
          render(data) {
            return data ? "是" : "否";
          }
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 150,
          render: (data, row) => {
            return [
              <Button
                iconClass="icon-golden-fill"
                row={row}
                text="表管理"
                type="success"
                click={this.handleOpenTables.bind(this)}
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
              />
            ];
          }
        }
      ],
      // 按钮
      actionBtns: [
        {
          text: "新增数据库",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      listQuery: {
        type: "",
        name: "",
        host: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        type: ["type"],
        name: ["name"],
        host: ["host"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add"
    };
  },
  created() {
    Api_comboboxDict("database_type", m).then(res => {
      this.typeOptions = res;
    });
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    listInput(v) {
      if (v.length > 5) {
        const { name } = this.listQuery;
        console.log(v);
        this.listQuery.name = name.substring(0, name.length - 1);
      }
    },

    Api_DatabasesGetTreeList: Api_DatabasesGetTreeList,
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.form.resetFields();
      this.getList();
    },
    // 重置form表单
    resetForm(formName) {
      this.form.resetFields();
    },
    // 打开新增数据库界面
    handleCreate() {
      this.modelStatus = "add";
      this.$refs.createUpdateModel.openModel();
    },
    // 打开修改界面
    handleUpdate(row) {
      this.selectData = row;
      this.modelStatus = "update";
      this.$nextTick(() => {
        this.$refs.createUpdateModel.openModel(row.id);
      });
    },
    // 打开表维护弹框
    handleOpenTables(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.tables.openModel(row.id);
      });
    },
    // 删除数据库
    handleDel(row) {
      const { id } = row;
      this.$confirm("确定删除该数据库?", "提示", {
        type: "warning"
      }).then(() => {
        Api_DatabasesDelete(id).then(msg => {
          this.$message.success(msg);
          this.getList();
        });
      });
    },
    // 表格行改变时
    currentChange(data) {
      this.selectData = data;
    }
  }
};
</script>

<style scoped>
</style>
