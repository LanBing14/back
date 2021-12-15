<template slot>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增模型':'修改模型'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form :form="form">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模型名称">
                <a-input v-decorator="formDecorator.name" placeholder="请输入模型名称"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
                <a-input v-decorator="formDecorator.category" placeholder="请输入类型"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标识">
<!--                <a-input v-decorator="formDecorator.flag" placeholder="请输入标识"/>-->
                <a-select
                    v-decorator="formDecorator.flag"
                    placeholder="请输入标识"
                    filterable
                    style="width: 100%;"
                >
                    <a-select-option
                        v-for="(el, index) in flagOptions"
                        :key="index"
                        :value="el.value"
                    >
                        {{ el.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="元数据">
                <a-textarea v-decorator="formDecorator.metaInfo" :rows="6" placeholder="请输入元数据"/>
            </a-form-item>
<!--            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">-->
<!--                <a-textarea v-decorator="formDecorator.description" :rows="4" placeholder="请输入描述"/>-->
<!--            </a-form-item>-->
        </a-form>
    </Drawer>
</template>

<script>
    import { Api_comboboxDict } from '@/api/admin/index'
    import {Api_ActModelAdd, Api_ActModelUpdate} from "@/api/admin/m/index";

    export default {
        name: "CreateUpdate",
        props: {
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
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: [
                        "name",
                        {
                            rules: createRules({
                                msg: "模型名称",
                                required: true,
                            })
                        }
                    ],
                    category: [
                        "category",
                        {
                            rules: createRules({
                                msg: "类型",
                                required: true,
                            })
                        }
                    ],
                    flag: [
                        "flag",
                        {
                            rules: createRules({
                                msg: "标识",
                                required: true,
                            })
                        }
                    ],
                    metaInfo: [
                        "metaInfo",
                        {
                            rules: [{
                                validator: this.validatorMetaInfo
                            }]
                        }
                    ]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                visible: false,
                modelStatus: "add",
                flagOptions: [] // 标识下拉框数据
            };
        },
        created(){
            Api_comboboxDict('workflow_flag').then(res=>{
                this.flagOptions = res
            })
        },
        methods: {
            // 打开模态框
            openModel(modelType) {
                const selectData = this.selectData;
                let fieldsData = {};
                this.modelStatus = modelType;
                if (modelType === "update") {
                    Object.keys(this.formDecorator).forEach(key=>{
                        if (selectData.hasOwnProperty(key)) {
                            fieldsData[key] = selectData[key];
                        }
                    })
                    this.form.setFieldsValue(fieldsData);
                    this.visible = true;
                } else {
                    this.visible = true;
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = values;
                        const loading = this.$openLoading();
                        const promiseRes =
                            modelStatus === "add"
                                ? Api_ActModelAdd({
                                    ...postData,
                                    saasCode: this.$store.getters.selectSaasCode
                                })
                                : Api_ActModelUpdate(id, {
                                    ...postData,
                                    saasCode: this.$store.getters.selectSaasCode,
                                    version
                                });

                        promiseRes
                            .then(msg => {
                                this.visible = false;
                                this.onClose();
                                this.$message.success(msg);
                                this.$emit("getList");
                                loading.close();
                            })
                            .catch(() => {
                                loading.close();
                            });
                    }
                });
            },
            // 验证元数据是否是json串
            validatorMetaInfo(rule, value, callback){
                if(!value){
                    callback()
                    return
                }
                try {
                    JSON.parse(value)
                    callback()
                }catch (e) {
                    callback(new Error('请输入json格式的字符串'))
                }
            },
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

<style scoped>
</style>
