<template>
  <div class="app-container">
    <PageHead>
      <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
        <a-form-item prop="title">
          <a-input
            v-decorator="formDecorator.title"
            placeholder="标题"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="code">
          <a-input
            v-decorator="formDecorator.code"
            placeholder="编号"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </a-form-item>
        <a-form-item prop="publish">
          <a-select
            v-decorator="formDecorator.publish"
            placeholder="发布状态"
            class="filter-item"
            filterable
          >
            <a-select-option value="1">已发布</a-select-option>
            <a-select-option value="0">未发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item prop="startDate">
          <a-date-picker
            placeholder="开始日期"
            v-decorator="formDecorator.startDate"
            :disabledDate="disabledStartDate"
            format="YYYY-MM-DD"
            @openChange="handleStartOpenChange"
          />
        </a-form-item>
        <a-form-item prop="endDate">
          <a-date-picker
            placeholder="结束日期"
            v-decorator="formDecorator.endDate"
            :disabledDate="disabledEndDate"
            format="YYYY-MM-DD"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          ></a-date-picker>
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
          :fetch-data-fn="Api_NoticeFetchList"
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
  Api_NoticeFetchList,
  Api_NoticePublish, // 发布公告
  Api_NoticeUnPublish, // 撤消公告
  Api_NoticeDel, // 删除公告
  Api_RolesGetPermissions, // 获取公告权限树
  Api_RolesUpdatePermissions // 更新公告权限树
} from "@/api/admin/system/index";
import Button from "@/components/Button";

export default {
  name: "Notice",
  directives: { waves },
  components: { PageHead, CreateUpdate, TableWrapper },
  data() {
    return {
      dialogVisible: false,
      detailData: {},
      tableCol: [
        {
          key: "code",
          label: "编号"
        },
        {
          key: "title",
          label: "标题"
        },
        {
          key: "publish",
          label: "发布状态",
          render(data) {
            return data === true ? "已发布" : "未发布";
          }
        },
        {
          key: "viewTimes",
          label: "浏览次数"
        },
        {
          key: "modifyDate",
          label: "最新修改时间"
        },
        {
          key: "creator",
          label: "创建者"
        },
        {
          key: "createDate",
          label: "创建时间"
        },
        {
          key: "publisher",
          label: "发布人"
        },
        {
          key: "publishTime",
          label: "发布时间"
        },
        {
          key: "departmentName",
          label: "发布部门"
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 120,
          render: (data, row) => {
            const { publish } = row;
            return [
              <Button
                iconClass="icon-eye"
                iconColor="green"
                row={row}
                text="查看"
                click={this.handleViewDetail.bind(this)}
              />,
              !publish && (
                <Button
                  iconClass="icon-pushpin"
                  iconColor="green"
                  row={row}
                  text="发布"
                  click={this.onPublish.bind(this)}
                />
              ),
              publish && (
                <Button
                  iconClass="icon-disconnect"
                  iconColor="green"
                  row={row}
                  text="撤消"
                  click={this.onUnPublish.bind(this)}
                />
              ),
              !publish && (
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
                click={this.delNotice.bind(this)}
              />
            ];
          }
        }
      ],
      // 按钮
      actionBtns: [
        {
          text: "新增公告",
          icon: "icon-plus",
          click: this.handleCreate
        }
      ],
      listLoading: false, // 列表loading状态
      //   listQuery: {
      //     title: undefined,
      //     code: undefined,
      //     publish: undefined,
      //     startDate: undefined,
      //     endDate: undefined
      //   },
      form: this.$form.createForm(this),
      // 查询表单注册表单值
      formDecorator: {
        title: ["title"],
        code: ["code"],
        publish: ["publish"],
        startDate: ["startDate"],
        endDate: ["endDate"]
      },
      selectId: undefined,
      selectData: undefined,
      modelStatus: "",
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
      endOpen: false,
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
      Api_NoticeFetchList,
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
    // 打开新增公告界面
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
    // 查看单个公告详情
    handleViewDetail(row) {
      const { id } = row;
      const loading = this.$openLoading();
      this.$store
        .dispatch("getNoticeDetail", id)
        .then(() => {
          this.$store.commit("TOGGLE_noticeDetailVisible", true);
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    // 发布公告
    onPublish(row) {
      this.$confirm("确定发布该公告?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_NoticePublish(row.id, row.id)
          .then(msg => {
            this.$message.success(msg);
            this.$store.dispatch("getNoticeNums");
            this.getList();
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    // 撤消公告
    onUnPublish(row) {
      this.$confirm("确定撤消该公告?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_NoticeUnPublish(row.id, row.id)
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
    // 删除公告
    delNotice(row) {
      this.$confirm("确定删除该公告?", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_NoticeDel(row.id)
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
    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue("endDate");
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.form.getFieldValue("startDate");
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    }
  }
};
</script>

<style scoped>
</style>
