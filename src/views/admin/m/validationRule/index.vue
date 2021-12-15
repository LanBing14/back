<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="name">
          <a-input v-decorator="formDecorator.name" placeholder="验证规则名称" />
        </a-form-item>
        <a-form-item prop="expression">
          <a-input v-decorator="formDecorator.expression" placeholder="验证规则表达式" />
        </a-form-item>
        <a-form-item prop="sequence">
          <a-input v-decorator="formDecorator.sequence" placeholder="顺序" />
        </a-form-item>
        <a-form-item class="btns">
          <a-button
            class="filter-item"
            type="primary"
            icon="icon iconfont icon-search"
            @click="handleFilter"
          >查询</a-button>
          <a-button
            class="filter-item"
            icon="icon iconfont icon-undo"
            @click="handleReset('searchForm')"
          >重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_ValidationRulesGetList"
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
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import {
  Api_ValidationRulesGetList,
  Api_ValidationRulesDel // 删除验证规则
} from "@/api/admin/m/index";

export default {
  name: "Dictionary",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      timeArrVal: [],
      sassData: [],
      tableCol: [
        {
          key: "name",
          label: "验证规则名称"
        },
        {
          key: "expression",
          label: "验证规则表达式"
        },
        {
          key: "sequence",
          label: "顺序"
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 150,
          render: (data, row) => {
            return [
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
          text: "新增",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      listQuery: {
        name: "",
        expression: "",
        sequence: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        name: ["name"],
        expression: ["expression"],
        sequence: ["sequence"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add"
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_ValidationRulesGetList,
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset() {
      this.form.resetFields();
      this.getList();
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 打开新增验证规则界面
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
    // 删除验证规则
    handleDel() {
      if (!this.selectData) {
        this.$message.warning("请先选择要删除的验证规则！");
        return;
      }
      const { id } = this.selectData;
      this.$confirm("确定删除该验证规则?", "提示", {
        type: "warning"
      }).then(() => {
        Api_ValidationRulesDel(id).then(msg => {
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
