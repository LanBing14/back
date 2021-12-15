<template>
  <Drawer ref="drawer" :visible="visible" :title="title" :onOk="handleSure" @close="onClose">
    <a-form ref="form" :form="form" label-position="right" label-width="120px">
      <a-form-item label="业务编号">{{ rowData.businessCode||'-' }}</a-form-item>
      <a-form-item label="企业名称">{{ rowData.name }}</a-form-item>
      <a-form-item label="统一社会信用代码">{{ rowData.code }}</a-form-item>
      <a-form-item label="法定代表人姓名">{{ rowData.fddbrXm }}</a-form-item>
      <a-form-item label="法定代表人身份证号">{{ rowData.fddbrSfzh }}</a-form-item>
      <a-form-item label="营业执照">
        <div>
          <viewer :images="[rowData.yyzzlist]">
            <template slot-scope="scope">
              <img v-for="src in scope.images" :src="`${src}`" :key="src" style="max-width: 100%" />
            </template>
          </viewer>
        </div>
      </a-form-item>
      <a-form-item label="法人身份证图">
        <div>
          <viewer :images="[rowData.fddbrsfzAtt]">
            <template slot-scope="scope">
              <img v-for="src in scope.images" :src="`${src}`" :key="src" style="max-width: 100%" />
            </template>
          </viewer>
        </div>
      </a-form-item>
      <a-form-item label="授权委托书扫描件">
        <div>
          <viewer :images="[rowData.wtsqslist]">
            <template slot-scope="scope">
              <img v-for="src in scope.images" :src="`${src}`" :key="src" style="max-width: 100%" />
            </template>
          </viewer>
        </div>
      </a-form-item>
      <a-form-item label="申请时间">{{ $dateFormat(rowData.createDate,'yyyy-MM-dd') }}</a-form-item>
      <a-form-item label="当前状态">
        {{rowData.status === "0"
        ? "审核不通过"
        : rowData.status === "1"
        ? "待审核"
        : rowData.status === "2"
        ? "审核完成"
        : rowData.status === "-1"
        ? "撤回"
        : "-" }}
      </a-form-item>
      <a-form-item label="处理状态" prop="status">
        <a-radio-group
          :options="statusOptions"
          v-decorator="['status',{rules:[{required:true,message:'处理状态必选'}]}]"
        />
      </a-form-item>
      <a-form-item label="审核意见" prop="remark">
        <a-textarea
          v-decorator="['remark',{rules:[{required:true,message:'审核意见必填'}]}]"
          :rows="4"
          placeholder="请输入审核意见"
        />
      </a-form-item>
    </a-form>
  </Drawer>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";
import { Api_enterpriseDetail, Api_enterpriseAudit } from "@/api/admin/system/enterpriseCertification.js";
import { Api_ProcessesComplete, Api_ProcessesReturn } from "@/api/admin/attestation/index.js";

export default {
  name: "AuditEnterprise",
  components: { Viewer },
  data() {
    return {
      title: "企业认证审核",
      visible: false,
      rowData: {},
      form: this.$form.createForm(this),
      statusOptions: [
        { label: "审核通过", value: "2" },
        { label: "审核不通过", value: "0" }
      ]
    };
  },
  methods: {
    open(rr) {
      this.rowData = rr;
      this.visible = true;
      this.$nextTick(() => {
        const loading = this.$openLoading();
        Api_enterpriseDetail(rr.id)
          .then(res => {
            this.rowData.wtsqslist = process.env.VUE_APP_FILE_API + res.wtsqslist;
            this.rowData.yyzzlist = process.env.VUE_APP_FILE_API + res.yyzzlist;
            this.rowData.fddbrsfzAtt = process.env.VUE_APP_FILE_API + res.fddbrsfzAtt;
            loading.close();
          })
          .catch(res => {
            loading.close();
          });
      });
    },
    handleSure() {
      this.form.validateFields((valid, values) => {
        if (!valid) {
          // Api_enterpriseAudit(this.rowData.id, values.status, { remark: values.remark }).then(res => {
          //   this.$message.success(res);
          //   this.visible = false;
          //   this.$emit("getList");
          // });
          const promiseRes =
            values.status === "2"
              ? Api_ProcessesComplete(this.rowData.taskId, {
                  processRemark: values.remark,
                  processOperate: 2
                })
              : Api_ProcessesReturn(this.rowData.taskId, {
                  processRemark: values.remark,
                  processOperate: 3
                });
          const loading = this.$openLoading();
          promiseRes
            .then(res2 => {
              loading.close();
              this.$message.success(res2);
              this.visible = false;
              this.$emit("getList");
            })
            .catch(res => {
              loading.close();
            });
        }
      });
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style>
</style>