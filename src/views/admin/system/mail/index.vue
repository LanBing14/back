<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="name">
          <a-input
            v-decorator="formDecorator.name"
            placeholder="标题"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="name">
          <a-select
            v-decorator="formDecorator.status"
            placeholder="发送状态"
            class="filter-item"
            filterable
          >
            <a-select-option value="1">草稿</a-select-option>
            <a-select-option value="0">已发送</a-select-option>
          </a-select>
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
          :fetch-data-fn="Api_MailFetchList"
          :query="form.getFieldsValue()"
          :columns="tableCol"
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
import {
  Api_MailFetchList,
  Api_UserChangeStatus,
  Api_MailDetail, // 获取单个消息的详情
  Api_MailUnPublish, // 撤消消息
  Api_MailDel, // 删除消息
  Api_RolesGetPermissions, // 获取消息权限树
  Api_RolesUpdatePermissions // 更新消息权限树
} from "@/api/admin/system/index";
import Button from "@/components/Button";

export default {
  name: "Mail",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      tableCol: [
        {
          key: "title",
          label: "标题"
        },
        {
          key: "status",
          label: "发送状态",
          render(data) {
            if (data === "0") {
              return "草稿";
            } else if (data === "1") {
              return "已发送";
            } else {
              return "已撤回";
            }
          }
        },
        {
          key: "sendTime",
          label: "发送时间"
        },
        {
          key: "totalLen",
          label: "接收总人数"
        },
        {
          key: "unreadLen",
          label: "未读总人数"
        },
        {
          key: "createDate",
          label: "创建时间"
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 300,
          render: (data, row) => {
            // status状态码(0:草稿 1:已发送 2:已撤回)
            const { status } = row;
            return [
              <Button
                iconClass="icon-eye"
                iconColor="green"
                row={row}
                text="查看"
                type="success"
                click={this.handleViewDetail.bind(this)}
              />,
              status === "1" && (
                <Button
                  iconClass="icon-undo"
                  iconColor="green"
                  row={row}
                  text="撤消"
                  click={this.handleUnPublish.bind(this)}
                />
              ),
              (status === "0" || status === "2") && (
                <Button
                  iconClass="icon-edit-square"
                  iconColor="green"
                  row={row}
                  text="修改"
                  click={this.handleUpdate.bind(this)}
                />
              ),
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
          text: "新增消息",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      listLoading: false, // 列表loading状态
      listQuery: {
        name: undefined,
        status: undefined
      },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        name: ["name"],
        status: ["status"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "add",
      enableOptions: [
        {
          key: "0",
          label: "启用"
        },
        {
          key: "1",
          label: "禁用"
        }
      ],

      Api_RolesGetPermissions,
      Api_RolesUpdatePermissions
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
      Api_MailFetchList,
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
    // 更改用户状态
    changeEnable(row) {
      Api_UserChangeStatus(row.enable, row.id).then(msg => {
        this.$notify({
          title: "成功",
          message: msg,
          type: "success",
          duration: 2000
        });
      });
    },
    // 重置form表单
    resetForm() {
      this.form.resetFields();
    },
    // 打开新增消息界面
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
    // 撤消消息
    handleUnPublish(row) {
      this.$confirm("确定撤消该消息?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_MailUnPublish(row.id)
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
    // 查看单个站内信详情
    handleViewDetail(row) {
      const { id } = row;
      const loading = this.$openLoading();
      Api_MailDetail(id)
        .then(res => {
          this.$store.commit("SAVE_mailDetailData", res);
          this.$store.commit("TOGGLE_mailDetailVisible", true);
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    // 删除消息
    handleDel(row) {
      this.$confirm("确定删除该消息?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_MailDel(row.id)
          .then(msg => {
            this.$message.success(msg);
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    }
  }
};
</script>

<style scoped>
</style>
