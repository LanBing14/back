<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        title="处理"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="dataForm" :form="form" label-position="right" label-width="8em">
            <a-form-item label="反馈编号">{{ code }}</a-form-item>
            <a-form-item label="反馈分类">{{ typeDesc }}</a-form-item>
            <a-form-item label="反馈内容">{{ content }}</a-form-item>
            <a-form-item label="手机号码">{{ mobile }}</a-form-item>
            <a-form-item label="提交时间">{{ createDate }}</a-form-item>
            <a-form-item label="当前状态">{{ statusDesc }}</a-form-item>
            <a-form-item label="处理状态">
                <a-select v-decorator="formDecorator.status" :disabled="disabled" placeholder="请选择处理状态">
                    <a-select-option v-for="(el, index) in statusOptions.filter(i=>i.value!=='0')" :key="index"
                                     :value="el.value">
                        {{el.label}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="处理意见">
                <a-textarea v-decorator="formDecorator.result" :disabled="disabled" :rows="6" placeholder="请输入反馈内容"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {Api_FeedbacksDealWith} from "@/api/admin/system/index";

    export default {
        name: "DealWith",
        props: {
            statusOptions: {
                type: Array,
                default: []
            },
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                disabled: false,
                code: '',
                typeDesc: '',
                content: '',
                mobile: '',
                createDate: '',
                statusDesc: '',
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    status: [
                        "status",
                        {
                            rules: [
                                {required: true, message: "处理状态必选"}
                            ]
                        }
                    ],
                    result: [
                        "result",
                        {
                            rules: createRules({
                                msg: '处理意见',
                                required: true,
                                max: 2000
                            })
                        }
                    ]
                }
            };
        },
        methods: {
            // 打开模态框
            openModel(isView) {
                this.visible = true;
                this.code = this.selectData.code;
                this.typeDesc = this.selectData.typeDesc;
                this.content = this.selectData.content;
                this.mobile = this.selectData.mobile;
                this.createDate = this.selectData.createDate;
                this.statusDesc = this.selectData.statusDesc;
                if (isView) {
                    this.disabled = true;
                    this.$nextTick(() => {
                        this.form.setFieldsValue({
                            status: this.selectData.status,
                            result: this.selectData.result
                        })
                    })
                } else {
                    this.disabled = false
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {id} = this.selectData;
                        const postData = values;
                        const loading = this.$openLoading();
                        Api_FeedbacksDealWith(id, postData).then(msg => {
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
                this.form.resetFields();
            }
        }
    };
</script>
