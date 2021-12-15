<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="id">
          <a-input
            v-decorator="formDecorator.id"
            placeholder="监管模型编号"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="name">
          <a-input
            v-decorator="formDecorator.name"
            placeholder="监管模型名称"
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
          :fetch-data-fn="Api_SupervisionGetList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
          :toolActions="actionBtns"
          :sort-change="sortChange"
        />
      </div>
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :select-data="selectData"
      @getList="getList"
    />
    <ModelBuild ref="ref_ModelBuild" :select-data="selectData" @getList="getList" />
  </div>
</template>
<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import ModelBuild from "./ModelBuild";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import {
  Api_SupervisionGetList,
  Api_SupervisionDelete,
  Api_SupervisionGetModelCopy
} from "@/api/admin/m/index";

export default {
  name: "Supervision",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper, ModelBuild },
  data() {
    return {
      timeArrVal: [],
      sassData: [],
      tableCol: [
        {
          key: "id",
          label: "监管模型编号"
        },
        {
          key: "name",
          label: "监管模型名称"
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
                iconClass="icon-build"
                iconColor="green"
                row={row}
                text="建模2"
                type="success"
                click={this.handleBuild2.bind(this)}
              />,
              <Button
                iconClass="icon-file-copy"
                iconColor="green"
                row={row}
                text="复制"
                type="success"
                click={this.handleCopy.bind(this)}
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
          text: "新增",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      list: null, // 列表数据
      listLoading: false, // 列表loading状态
      listQuery: {
        id: "",
        name: "",
        orderProperty: "",
        asc: ""
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        id: ["id"],
        name: ["name"],
        orderProperty: ["orderProperty"],
        asc: ["asc"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add",
      previewData: null,
      pickerOptionsStart: {
        disabledDate: time => {
          const { endDate } = this.listQuery;
          if (endDate) {
            return time.getTime() > new Date(endDate).getTime();
          } else {
            return false;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const { startDate } = this.listQuery;
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime();
          } else {
            return false;
          }
        }
      }
    };
  },
  watch: {
    timeArrVal: function(timeArr) {
      if (!timeArr) {
        timeArr = ["", ""];
      }
      //   this.listQuery.startDate = timeArr[0];
      //   this.listQuery.endDate = timeArr[1];
    }
  },
  mounted() {
    // Api_comboboxDict("form_type").then(res => {
    //     this.typeOptions = res;
    // });
    this.getList();
  },
  methods: {
    Api_SupervisionGetList,
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
      this.$nextTick(() => {
        this.getList();
      });
    },
    // 重置form表单
    resetForm(formName) {
      this.form.resetFields();
    },
    // 打开新增模型界面
    handleCreate() {
      this.modelStatus = "add";
      this.$refs.createUpdateModel.openModel("add");
    },
    // 打开建模界面2
    handleBuild2(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.ref_ModelBuild.openModel();
      });
    },
    // 复制
    handleCopy(row) {
      this.$confirm("确定复制该模型？", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_SupervisionGetModelCopy(row.id)
          .then(msg => {
            this.$message.success(msg);
            loading.close();
            this.getList();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    // 打开修改界面
    handleUpdate(row) {
      this.selectData = row;
      this.modelStatus = "update";
      this.$nextTick(() => {
        this.$refs.createUpdateModel.openModel("update");
      });
    },
    // 删除模型
    handleDel({ id }) {
      this.$confirm("确定删除该模型?", "提示", {
        type: "warning"
      }).then(() => {
        Api_SupervisionDelete(id).then(msg => {
          this.$message.success(msg);
          this.getList();
        });
      });
    },
    // 表格排序发生变化时
    sortChange({ prop, order }) {
      this.form.setFieldsValue({
        orderProperty: prop,
        asc: order === "ascending"
      });
      this.$nextTick(() => {
        this.getList();
      });
    }
  }
};
</script>

<style scoped>
</style>
