<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增表单':'修改表单'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form
            ref="dataForm"
            :form="form"
        >
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="表单名称"
            >
                <a-input v-decorator="formDecorator.name"/>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="页面标题"
            >
                <a-input v-decorator="formDecorator.title"/>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="表单类型"
            >
                <a-select
                    v-decorator="formDecorator.type"
                    :disabled="modelStatus==='update'"
                    clearable
                    filterable
                    style="width: 100%;"
                >
                    <a-select-option
                        v-for="el in typeOptions"
                        :key="el.value"
                        :label="el.label"
                        :value="el.value"
                    >
                        {{ el.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_FormAdd,
        Api_FormUpdate,
        Api_FormDetail
    } from '@/api/admin/m/index';

    export default {
        name: 'CreateUpdate',
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            },
            typeOptions: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    name: ['name', {
                        rules: createRules({
                            msg: '表单名称',
                            required: true,
                            max: 50
                        })
                    }],
                    title: ['title', {
                        rules: createRules({
                            msg: '页面标题',
                            required: true,
                            max: 50
                        })
                    }],
                    type: ['type', {
                        rules: createRules({
                            msg: '表单类型',
                            required: true
                        })
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                visible: false,
                timeArrVal: '',
                typeData: [],
                addFormRules: {
                    name: createRules({
                        msg: '表单名称',
                        required: true,
                        max: 50
                    }),
                    title: createRules({
                        msg: '页面标题',
                        required: true,
                        max: 50
                    }),
                    type: createRules({
                        msg: '表单类型',
                        required: true
                    })
                },
                addFormData: {// 新增表单的表单数据
                    name: '',
                    title: '',
                    type: ''
                }
            };
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail(id);
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.form.getFieldsValue();
                        const promiseRes = modelStatus === 'add' ? Api_FormAdd(postData) : Api_FormUpdate(id, {
                            ...postData,
                            version
                        });
                        const loading = this.$openLoading();
                        promiseRes.then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            // 获取单条数据信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_FormDetail(id).then(res => {
                    const oldData = {...this.addFormData};
                    const newData = {};
                    for (const key in oldData) {
                        if (res.hasOwnProperty(key)) {
                            newData[key] = res[key];
                        }
                    }
                    console.log(this.form.getFieldsValue(), newData);
                    this.form.setFieldsValue(newData)
                    this.visible = true;
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

