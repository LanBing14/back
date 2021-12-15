<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="title"
        :onOk="handleSure"
        :only-close-btn="isView"
        @close="onClose"
    >
        <a-form ref="form" :form="form" label-position="right" label-width="8em">
            <a-form-item label="申请编号">{{ code }}</a-form-item>
            <a-form-item label="公司名称">{{ companyName }}</a-form-item>
            <a-form-item label="公司地址">{{ companyAddress }}</a-form-item>
            <a-form-item label="姓名">{{ name }}</a-form-item>
            <a-form-item label="手机号码">{{ name }}</a-form-item>
            <a-form-item label="申请描述">{{ applyReason }}</a-form-item>
            <a-form-item label="申请时间">{{ createDate }}</a-form-item>
            <a-form-item label="申请状态">
                <a-radio-group v-decorator="formDecorator.status" :disabled="isView">
                    <a-radio value="0">待处理</a-radio>
                    <a-radio value="1">洽谈中</a-radio>
                    <a-radio value="2">正式合作</a-radio>
                    <a-radio value="3">无效申请</a-radio>
                </a-radio-group>
            </a-form-item>
            <div v-if="!isView">
                <a-form-item label="审核意见">
                    <a-textarea v-decorator="formDecorator.dealDesc" :rows="6" placeholder="请输入反馈内容"/>
                </a-form-item>
            </div>
            <div v-else>
                <TableWrapper
                    ref="child"
                    :data="dataList"
                    :columns="tableCol"
                />
            </div>
        </a-form>
    </Drawer>
</template>

<script>
    import { Api_ChannelTodo, Api_ChannelDetail } from "@/api/admin/system/index";
    import TableWrapper from "@/components/TableWrapper";
    export default {
        name: "DealWith",
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
                visible: false,
                title: '处理',
                isView: false,
                form: this.$form.createForm(this),
                code: '',
                companyName: '',
                companyAddress: '',
                name: '',
                applyReason: '',
                createDate: '',
                formDecorator: {
                    status: [
                        "status",
                        {
                            rules: [
                                {required: true, message: "处理状态必选"}
                            ]
                        }
                    ],
                    dealDesc: [
                        "dealDesc",
                        {
                            rules: [
                                {required: true, max: 150, message: "请填写审核意见，不超过150字"}
                            ]
                        }
                    ]
                },
                dataList: [],
                tableCol: [{
                    key: 'createDate',
                    label: '处理时间'
                }, {
                    key: 'dealStatus',
                    label: '处理状态',
                    render: (data) => {
                        let str = '-';
                        if (data === '0') {
                            str = '待处理'
                        } else if (data === '1') {
                            str = '洽谈中'
                        } else if (data === '2') {
                            str = '正式合作'
                        } else if (data === '3') {
                            str = '无效申请'
                        }
                        return str
                    }
                }, {
                    key: 'dealDesc',
                    label: '处理意见'
                }, {
                    key: 'creator',
                    label: '处理人'
                }]
            }
        },
        methods: {
            openModel(isView) {
                this.visible = true;
                this.isView = isView;
                if (isView) {
                    this.title = '查看';
                    Api_ChannelDetail(this.selectData.id).then(msg => {
                        this.dataList = msg.transientLogs
                    }).catch(msg => {
                        this.$message.error(msg)
                    });
                }
                this.code = this.selectData.code;
                this.companyName = this.selectData.companyName;
                this.companyAddress = this.selectData.companyAddress;
                this.name = this.selectData.name;
                this.applyReason = this.selectData.applyReason;
                this.createDate = this.selectData.createDate;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        status: this.selectData.dealStatus
                    })
                })
            },
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const id = this.selectData.id;
                        const postData = values;
                        const loading = this.$openLoading();
                        Api_ChannelTodo(id, postData).then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit("getList");
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            onClose() {
                this.form.resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
