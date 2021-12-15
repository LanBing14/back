<template>
  <div class="app-container">
    <PageHead>
      <a-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        class="demo-form-inline searchForm-wrap"
      >
        <a-form-item prop="triggerName">
          <a-input
            v-decorator="formDecorator.triggerName"
            placeholder="触发器名称"
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
          <a-button class="filter-item" icon="icon iconfont icon-undo" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_ContentsFetchList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
          :current-change="currentChange"
          :toolActions="actionBtns"
        />
      </div>
    </div>
    <CreateUpdate ref="createUpdateModel" :select-data="selectData" @getList="getList" />
    <ModelBuild ref="modelBuild" :select-data="selectData" @getList="getList" />
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import ModelBuild from "./ModelBuild";
import waves from "@/directive/waves"; // Waves directive
import Button from "@/components/Button";
import { Api_ContentsFetchList, Api_ContentsDel } from "@/api/admin/cms/index";

export default {
  name: "CustomReports",
  directives: { waves },
  components: { PageHead, CreateUpdate, ModelBuild, TableWrapper },
  data() {
    return {
      tableCol: [
        {
          key: "triggerName",
          label: "触发器名称"
        },
        {
          key: "triggerStateDesc",
          label: "触发器状态"
        },
        {
          key: "jobName",
          label: "定时器任务"
        },
        {
          key: "description",
          label: "任务描述"
        },
        {
          key: "nextFireDate",
          label: "下次执行时间"
        },
        {
          key: "prevFireDate",
          label: "上次执行时间"
        },
        {
          key: "startDate",
          label: "开始时间"
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 150,
          render: (data, row) => {
            const { triggerState } = row;
            const isPause = triggerState === "PAUSED";
            return [
              <Button
                iconClass="icon-edit-square"
                iconColor="green"
                row={row}
                text="配置"
                type="text"
                click={this.handleModelBuild.bind(this)}
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
          text: "新增任务",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      listQuery: {
        triggerName: undefined
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        triggerName: ["triggerName"]
      },
      selectData: undefined
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
      Api_ContentsFetchList,
      // 获取主列表数据
      getList(flag) {
          this.$refs.child.fetchData(flag);
      },
      // 根据查询条件获取数据
      handleFilter() {
          this.getList(true);
      },
      // 打开新增界面
      handleCreate() {
          this.$refs.createUpdateModel.openModel();
      },
      // 建模配置
    handleModelBuild(row) {
      this.selectData = row;
      this.$nextTick(() => {
        this.$refs.modelBuild.openModel();
      });
    },
    // 删除任务
    handleDel(row) {
      this.$confirm("确定删除该任务?", "提示", {
        type: "warning"
      }).then(() => {
        const { triggerName } = row;
        const loading = this.$openLoading();
        Api_ContentsDel(triggerName)
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
      this.selectData = data || {};
    },
    // 重置查询条件
    handleReset() {
        this.form.resetFields();
        this.getList(true);
    }
  }
};
</script>

<style scoped>
</style>
