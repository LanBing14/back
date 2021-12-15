<template slot>
<Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增敏感词':'修改敏感词'"
    :onOk="handleSure"
    @close="onClose"
>
    <a-form
        ref="dataForm"
        :form="form"
    >
        <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="敏感词名称"
>
            <a-input
                v-decorator="formDecorator.name"
                placeholder="请输入敏感词名称"
/>
        </a-form-item>
        <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="代替值"
>
            <a-input
                v-decorator="formDecorator.replaceValue"
                placeholder="请输入代替值"
/>
        </a-form-item>
    </a-form>
</Drawer>
</template>

<script>
    import {
        Api_SensitivewordsAdd,
        Api_SensitivewordsUpdate
    } from '@/api/admin/cms/index'

    export default {
        name: 'CreateUpdate',
        // components: {Dialog},
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
            selectData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    name: ['name', {
                        rules: createRules({
                            msg: '名称',
                            required: true,
                            max: 100
                        })
                    }],
                    replaceValue: ['replaceValue', {
                        rules: createRules({
                            msg: '代替值',
                            required: true,
                            max: 100
                        })
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                visible: false,
                addFormRules: {
                    name: createRules({
                        msg: '名称',
                        required: true,
                        max: 100
                    }),
                    replaceValue: createRules({
                        msg: '代替值',
                        required: true,
                        max: 100
                    })
                },
                addFormData: {// 新增敏感词的表单数据
                    replaceValue: undefined,
                    name: undefined
                }
            }
        },
        methods: {
            // 打开模态框
            openModel(modelType) {
                const selectData = this.selectData;
                const addFormData = this.addFormData;
                if (modelType === 'update') {
                    const newData = {};
                    for (const key in addFormData) {
                        if (selectData.hasOwnProperty(key)) {
                            newData[key] = selectData[key];
                        }
                    }
                    this.form.setFieldsValue(newData);
                    this.visible = true
                } else {
                    this.visible = true;
                }
                // if (id) {
                //     this.getDetail(id);
                // }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.form.getFieldsValue()
                        const loading = this.$openLoading();
                        const promiseRes = modelStatus === 'add' ? Api_SensitivewordsAdd(postData) : Api_SensitivewordsUpdate(id, {
                            ...postData,
                            version
                        });

                        promiseRes.then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                        }).catch(() => {
                            loading.close()
                        })
                    }
                })
            },
            onClose() {
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
