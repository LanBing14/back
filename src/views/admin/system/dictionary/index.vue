<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item>
          <a-input
            v-decorator="formDecorator.code"
            placeholder="字典组编码"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="formDecorator.name"
            placeholder="字典组名称"
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
          <a-button
            class="filter-item"
            icon="icon iconfont icon-sync"
            @click="handleFreshen('searchForm')"
          >刷新</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_DictionaryFetchList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
          :current-change="currentChange"
          :tableProps="{expandedRowRender}"
          :toolActions="actionBtns"
          :expandedRowRender="expandedRowRender"
          expand
        >
          <!-- <template slot-scope="{props}">
            <a-table :data="props.dictionaryData" style="width: 600px;" border>
              <a-table-column label="字典编码">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataCode }}</span>
                </template>
              </a-table-column>
              <a-table-column label="字典名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataName }}</span>
                </template>
              </a-table-column>
              <a-table-column label="备注">
                <template slot-scope="scope">
                  <span>{{ scope.row.remark }}</span>
                </template>
              </a-table-column>
            </a-table>
          </template>-->
        </TableWrapper>
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
  Api_DictionaryFetchList,
  Api_DictionaryDel, // 删除字典
  Api_DictionaryFreshen // 刷新字典
} from "@/api/admin/system/index";

export default {
  name: "Dictionary",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      tableCol: [
        {
          key: "code",
          label: "字典组编码"
        },
        {
          key: "name",
          label: "字典组名称"
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
          text: "新增字典",
          icon: "icon-plus",
          click: this.handleCreate
        }
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
        code: ["code"]
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
      Api_DictionaryFetchList,
      // 获取主列表数据
      getList(flag) {
          this.$refs.child.fetchData(flag);
      },
      // 根据查询条件获取数据
      handleFilter() {
          this.getList(true);
      },
      // 重置查询条件
      handleReset(formName) {
          this.form.resetFields();
          this.getList(true);
      },
    // 刷新字典
    handleFreshen() {
      Api_DictionaryFreshen().then(msg => {
        this.$message.success(msg);
        this.getList();
      });
    },
    // 重置form表单
    resetForm(formName) {
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
    handleDel() {
      if (!this.selectData) {
        this.$message.warning("请先选择要删除的字典！");
        return;
      }
      const { id } = this.selectData;
      this.$confirm("确定删除该字典?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_DictionaryDel(id)
          .then(msg => {
            this.$message.success(msg);
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    // 表格行改变时
    currentChange(data) {
      this.selectData = data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    expandedRowRender(record, index, indent, expanded) {
      const data = record.dictionaryData;
      const columns = [
        {
          title: "字典编码",
          dataIndex: "dataCode",
          key: "dataCode"
        },
        {
          title: "字典名称",
          dataIndex: "dataName",
          key: "dataName"
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark"
        }
      ];
      return (
        <a-table
          columns={columns}
          dataSource={data}
          style="width: 600px; margin: 8px 0;"
          bordered
          pagination={false}
        ></a-table>
      );
    }
  }
};
</script>

<style scoped>
</style>
