<template>
  <div class="app-container">
    <PageHead>
      <a-form-model
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        class="demo-form-inline searchForm-wrap"
      >
        <a-form-model-item prop="triggerName">
          <a-input
            v-model="listQuery.triggerName"
            placeholder="触发器名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-model-item>
        <a-form-model-item class="btns">
          <a-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</a-button>
          <a-button class="filter-item" icon="undo" @click="handleReset">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </PageHead>
    <div class="page-content">
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetch-data-fn="Api_CrontabsFetchList"
          :query="listQuery"
          :columns="tableCol"
          :current-change="currentChange"
          :toolActions="actionBtns"
        />
      </div>
    </div>
    <CreateUpdate ref="createUpdateModel" :select-data="selectData" @getList="getList" />
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import TableWrapper from "@/components/TableWrapper";
import CreateUpdate from "./CreateUpdate";
import Button from "@/components/Button";
import {
  Api_CrontabsFetchList,
  Api_CrontabsPause,
  Api_CrontabsResume,
  Api_CrontabsDel,
} from "@/api/admin/crontab/index";

export default {
  name: "TimedTask",
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      tableCol: [
        {
          key: "triggerName",
          label: "触发器名称",
        },
        {
          key: "triggerStateDesc",
          label: "触发器状态",
        },
        {
          key: "jobName",
          label: "定时器任务",
        },
        {
          key: "description",
          label: "任务描述",
        },
        {
          key: "nextFireDate",
          label: "下次执行时间",
        },
        {
          key: "prevFireDate",
          label: "上次执行时间",
        },
        {
          key: "startDate",
          label: "开始时间",
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
              !isPause && (
                <Button
                  iconClass="icon-pause"
                  iconColor="green"
                  row={row}
                  text="暂停"
                  type="success"
                  click={this.handlePause.bind(this)}
                />
              ),
              isPause && (
                <Button
                  iconClass="icon-play-square"
                  iconColor="green"
                  row={row}
                  text="恢复"
                  type="success"
                  click={this.handleStart.bind(this)}
                />
              ),
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
      // 按钮
      actionBtns: [
        {
          text: "新增任务",
          icon: "plus",
          click: this.handleCreate,
        },
      ],
      listQuery: {
        triggerName: undefined,
      },
      selectData: undefined,
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_CrontabsFetchList,
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 打开新增界面
    handleCreate() {
      this.$refs.createUpdateModel.openModel();
    },
    // 暂停任务
    handlePause(row) {
      this.$confirm("确定暂停该任务?", "提示", {
        type: "warning",
      }).then(() => {
        const { triggerName } = row;
        const loading = this.$openLoading();
        Api_CrontabsPause(triggerName)
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
    // 恢复任务
    handleStart(row) {
      this.$confirm("确定恢复该任务?", "提示", {
        type: "warning",
      }).then(() => {
        const { triggerName } = row;
        const loading = this.$openLoading();
        Api_CrontabsResume(triggerName)
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
    // 删除任务
    handleDel(row) {
      this.$confirm("确定删除该任务?", "提示", {
        type: "warning",
      }).then(() => {
        const { triggerName } = row;
        const loading = this.$openLoading();
        Api_CrontabsDel(triggerName)
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
    // 表格行改变时
    currentChange(data) {
      this.selectData = data || {};
    },
    // 重置查询条件
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.getList();
    },
  },
};
</script>

<style scoped>
</style>
