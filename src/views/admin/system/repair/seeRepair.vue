<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="title"
        onlyCloseBtn
        @close="onClose"

    >
        <a-form ref="form" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }"  >
            <a-form-item label="业务编号">
                <a-input
                    v-model="formDecorator.repairCode"
                    disabled
                />
            </a-form-item>
            <a-form-item label="企业名称">
                <a-input
                    v-model="formDecorator.companyName"
                    disabled
                />
            </a-form-item>
            <a-form-item label="统一社会信用代码">
                <a-input
                    v-model="formDecorator.code"
                    disabled
                />
            </a-form-item>
            <a-form-item label="法定代表人姓名">
                <a-input
                    v-model="formDecorator.legalUserName"
                    disabled
                />
            </a-form-item>

            <a-form-item label="注册地址">
                <a-input
                    v-model="formDecorator.address"
                    disabled
                />
            </a-form-item>
            <a-form-item label="修复需求描述">
                <a-textarea
                v-model="formDecorator.remarks"
                disabled
                />
            </a-form-item>
            <a-row>
                <a-col :span="7">
                    <label style="margin-left: 27px;font-weight: 700;color: #000;margin-top: 3px;">失信修复平台：</label>
                </a-col>
                <a-col :span="17">
                    <a-form-item label="公共信用平台" class="other">
                        <a-input
                            v-model="formDecorator.publicRepairPlats"
                            disabled
                        />
                    </a-form-item>
                    <a-form-item label="社会信用平台" class="other">
                        <a-input
                            v-model="formDecorator.marketRepairPlats"
                            disabled
                        />
                    </a-form-item>
                    <a-form-item label="其他" class="other">
                        <a-input
                            v-model="formDecorator.otherPlatform"
                            disabled
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item label="修复信息条数">
                <a-input
                    v-model="formDecorator.repairCount"
                    disabled
                />
            </a-form-item>
            <a-form-item label="期望修复时间">
                <a-date-picker
                @change="datePickerChange"
                v-model="formDecorator.repairDate"
                :format="dateFormat"
                disabled
                />
            </a-form-item>
            <a-form-item label="申请人姓名">
                <a-input
                    v-model="formDecorator.applyName"
                    disabled
                />
            </a-form-item>
            <a-form-item label="手机号码">
                <a-input
                    v-model="formDecorator.applyPhone"
                    disabled
                />
            </a-form-item>
            <a-form-item label="电子邮箱">
                <a-input
                    v-model="formDecorator.applyEmail"
                    disabled
                />
            </a-form-item>
            <a-form-item label="处理状态">
                <a-radio-group v-model="formDecorator.status" :disabled="isView" disabled>
                    <a-radio value="0">待处理</a-radio>
                    <a-radio value="1">洽谈中</a-radio>
                    <a-radio value="2">修复中</a-radio>
                    <a-radio value="3">修复完成</a-radio>
                    <a-radio value="4">无效申请</a-radio>
                    <a-radio value="5">停止服务</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="处理描述">
                <a-textarea
                    v-model="formDecorator.remark"
                    placeholder="请输入处理描述信息"
                    :auto-size="{ minRows: 2, maxRows: 6 }"
                    disabled
                />
            </a-form-item>
            <TableWrapper
                ref="child"
                :data="dataList"
                :columns="tableCol"
          />
        </a-form>
    </Drawer>
</template>

<script>
    import { Api_RepairTodo, Api_RepairDetail,Api_RepairHistoryDetail } from "@/api/admin/system/index";
    import TableWrapper from "@/components/TableWrapper";
    import moment from 'moment';
    export default {
        name: "SeeRepair",
        components: { TableWrapper },
        props: {
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                logParamsLoading: false, // 加载数据的loading状态
                logParamsData: [],
                visible: false,
                title: '查看信息',
                dateFormat: 'YYYY-MM-DD',
                isView: false,
                applyEmail:'',
                address:'',
                legalUserName:'',
                otherPlatform:'',
                repairCount:'',
                repairDate:'',
                form: this.$form.createForm(this),
                code: '',
                companyName: '',
                companyAddress: '',
                applyName: '',
                remarks: '',
                createDate: '',
                applyPhone:'',
                formDecorator: {
                    applyEmail:'',
                    address:'',
                    legalUserName:'',
                    otherPlatform:'',
                    repairCount:'',
                    repairDate:'',
                    code: '',
                    applyName: '',
                    remarks: '',
                    createDate: '',
                    applyPhone:'',
                    companyName: '',
                    publicRepairPlats:'',
                    marketRepairPlats:'',
                    status: [
                        "status",
                        {
                            rules: [
                                {required: true, message: "处理状态必选"}
                            ]
                        }
                    ]
                },
                dataList: [],
                tableCol: [
                {
                    key: 'createDate',
                    width: 150,
                    label: '处理时间'
                }, {
                    key: 'status',
                    label: '处理状态',
                    width: 150,
                    render: (data) => {
                        let str = "-";
                        if (data === "0") {
                            str = "提交中";
                        } else if (data === "1") {
                            str = "洽谈中";
                        } else if (data === "2") {
                            str = "修复中";
                        } else if (data === "3") {
                            str = "修复完成";
                        }else if (data === "4") {
                            str = "无效申请";
                        }else if (data === "5") {
                            str = "停止服务";
                        }
                        return str;
                    }
                }, 
                {
                    key: 'remarks',
                    width: 150,
                    label: '处理描述'
                },
                 {
                    key: 'creator',
                    label: '处理人',
                    width: 200,
                }]
            }
        },
        methods: {
            getDateTime(time) {
                return time ? moment(time, 'YYYY-MM-DD') : null
            },
            datePickerChange(value){
                console.log(this.formDecorator.repairDate)
            },
            openModel(isView) {
                this.visible = true;
                this.isView = isView;
                Api_RepairHistoryDetail(this.selectData.id).then(res=>{
                    this.dataList = res.data
                })
                this.$nextTick(() => {
                    this.formDecorator.code = this.selectData.code;
                    this.formDecorator.repairCode = this.selectData.repairCode;
                    this.formDecorator.companyName = this.selectData.companyName;
                    this.formDecorator.companyAddress = this.selectData.companyAddress;
                    this.formDecorator.applyName = this.selectData.applyName;
                    this.formDecorator.remarks = this.selectData.remarks;
                    this.formDecorator.applyPhone = this.selectData.applyPhone;
                    this.formDecorator.createDate = this.selectData.createDate;
                    this.formDecorator.address = this.selectData.address;
                    this.formDecorator.applyEmail = this.selectData.applyEmail;
                    this.formDecorator.status = this.selectData.status;
                    this.formDecorator.legalUserName = this.selectData.legalUserName
                    this.formDecorator.otherPlatform = this.selectData.otherPlatform
                    this.formDecorator.repairCount = this.selectData.repairCount
                    this.formDecorator.remark = this.selectData.remark;
                    this.formDecorator.repairDate = this.selectData.repairDate ? moment(this.selectData.repairDate).format('YYYY-MM-DD'):null
                    this.formDecorator.publicRepairPlats = Array.isArray( this.selectData.publicRepairPlats) ? this.selectData.publicRepairPlats.join('/'):''
                    this.formDecorator.marketRepairPlats = Array.isArray( this.selectData.marketRepairPlats)? this.selectData.marketRepairPlats.join('/'):''
                })
            },
            handleSure() {
                const id = this.selectData.id;
                const postData = {
                    type: this.formDecorator.status,
                    remark: this.formDecorator.remark,
                };
                const loading = this.$openLoading();
                Api_RepairTodo(id,  postData).then(msg => {
                    this.visible = false;
                    this.onClose();
                    this.$message.success(msg);
                    this.$emit("getList");
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            onClose() {
                this.form.resetFields()
            }
        },
    }
</script>

<style scoped>
/deep/.ant-col.ant-form-item-control-wrapper{
    width: 365px;
    float: right;
}
/deep/.other .ant-col.ant-form-item-control-wrapper{
    width: 265px;
    float: right;
}
/deep/ .ant-calendar-picker-input.ant-input {
    width: 365px;
    line-height: 1.5;
}
</style>
