<template>
    <a-modal
        :title="row.task_name"
        :visible="dialogVisible"
        centered
        width="1000px"
        @cancel="onClose"
    >
        <!--基础信息-->
        <a-form ref="searchForm">
            <a-row>
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="企业名称"
                    >{{ baseData.name }}</a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="统一社会信用代码"
                    >{{ baseData.code }}</a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="营业执照">
                        <div style="padding: 12px 20px;">
                            <viewer :images="[baseData.yyzzlist]">
                                <template slot-scope="scope">
                                    <img
                                        v-for="src in scope.images"
                                        :src="`${src}`"
                                        :key="src"
                                        style="max-width: 100%"
                                    />
                                </template>
                            </viewer>
                        </div>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="授权委托书扫描件">
                        <div style="padding: 12px 20px;">
                            <viewer :images="[baseData.wtsqslist]">
                                <template slot-scope="scope">
                                    <img
                                        v-for="src in scope.images"
                                        :src="`${src}`"
                                        :key="src"
                                        style="max-width: 100%"
                                    />
                                </template>
                            </viewer>
                        </div>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-alert message="流程信息" type="info" style="margin: 20px 0;" />
        <TableWrapper
            ref="child"
            :data="tableData"
            :filterGroup="false"
            :columns="tableCol"
            :tableProps="{border:true}"
            :pagination="false"
            style="margin-bottom: 50px;"
        />
        <a-form v-if="modelStatus!=='view'" :form="form" class="form-wrap">
            <a-form-item :label-col="{span:3}" :wrapper-col="{span:19}" label="意见">
                <a-textarea v-decorator="formDecorator.processRemark" :rows="4" type="textarea" />
            </a-form-item>
        </a-form>
        <!--        <div class="processImg-wrap">-->
        <!--            <img :src="imgUrl" alt=""/>-->
        <!--        </div>-->
        <div slot="footer" style="text-align: center">
            <a-button
                v-if="modelStatus!=='view'"
                :loading="confirmLoading"
                type="primary"
                @click="handleOk(2)"
            >签批</a-button>
            <a-button
                v-if="modelStatus!=='view'"
                :loading="confirmLoading"
                type="danger"
                @click="handleOk(3)"
            >退回</a-button>
            <a-button @click="onClose">取消</a-button>
        </div>
    </a-modal>
</template>

<script>
import {
    Api_EnterpriseCerthistory,
    Api_ProcessesComplete,
    Api_ProcessesReturn,
    Api_ProcessesPerson
} from "@/api/admin/attestation";
import { Api_ToDealHistory } from "@/api/admin/m/toDealWith";
import TableWrapper from "@/components/TableWrapper";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";
import { Api_enterpriseDetail } from "@/api/admin/system/enterpriseCertification.js";

export default {
    name: "Attestation",
    components: {
        TableWrapper,
        Viewer
    },
    props: {
        row: Object,
        todoVisible: Boolean,
        formId: String,
        taskId: String,
        modelStatus: String,
        viewId: String
    },
    data() {
        return {
            form: this.$form.createForm(this),
            formDecorator: {
                processRemark: [
                    "processRemark",
                    {
                        rules: [
                            {
                                message: "请填写审核意见",
                                max: 300,
                                required: true
                            }
                        ]
                    }
                ]
            },
            dialogVisible: false,
            confirmLoading: false,
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            baseData: {}, // 基础详情
            tableData: [], // 历史数据
            tableCol: [
                {
                    key: "taskDefName",
                    label: "流程节点",
                    width: 100
                },
                {
                    key: "operateUser",
                    label: "操作人",
                    width: 130
                },
                {
                    key: "processOperateDesc",
                    label: "操作",
                    width: 100
                },
                {
                    key: "createDate",
                    label: "操作时间",
                    width: 160,
                    render: (data, row) => {
                        return row.processOperateDesc ? row.createDate : "";
                    }
                },
                {
                    key: "processRemark",
                    label: "意见"
                }
            ]
        };
    },
    watch: {
        todoVisible(val) {
            this.dialogVisible = val;
            if (val) {
                this.getDetail();
            }
        }
    },
    computed: {},
    mounted() {
        this.dialogVisible = true;
        this.getDetail();
    },
    methods: {
        getDetail() {
            Api_enterpriseDetail(this.row.business_key).then(res => {
                this.baseData = res || {};
                this.baseData.yyzzlist = process.env.VUE_APP_FILE_API + this.baseData.yyzzlist
                this.baseData.wtsqslist = process.env.VUE_APP_FILE_API + this.baseData.wtsqslist
                Api_ProcessesPerson(this.row.start_user_id).then(res => {
                    this.$set(this.baseData, "mobile", res.mobile);
                });
            });
            Api_ToDealHistory({
                businessKey: this.viewId
            }).then(res => {
                this.tableData = res;
            });
        },
        handleOk(processOperate) {
            if (this.modelStatus === "view") {
                this.onClose();
                return;
            }
            this.form.validateFields((valid, values) => {
                if (!valid) {
                    this.confirmLoading = true;
                    const promiseRes =
                        processOperate === 2
                            ? Api_ProcessesComplete(this.taskId, {
                                  ...values,
                                  processOperate
                              })
                            : Api_ProcessesReturn(this.taskId, {
                                  ...values,
                                  processOperate
                              });
                    promiseRes
                        .then(res => {
                            this.$emit("ok");
                            this.$message.success(res);
                            this.confirmLoading = false;
                            this.onClose();
                        })
                        .catch(e => {
                            this.confirmLoading = false;
                        });
                }
            });
        },
        onClose() {
            this.form.resetFields();
            this.$emit("update:todoVisible", false);
        }
    }
};
</script>

<style scoped>
</style>
