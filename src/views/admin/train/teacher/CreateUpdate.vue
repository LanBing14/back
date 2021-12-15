<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增培训讲师':'修改培训讲师'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="dataForm" :form="form">
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="姓名"
                prop="name">
                <a-input v-decorator="formDecorator.name" placeholder="请输入姓名"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="身份证号"
                prop="idCard">
                <a-input v-decorator="formDecorator.idCard" placeholder="请输入身份证号"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="昵称"
                prop="nickName">
                <a-input v-decorator="formDecorator.nickName" placeholder="请输入昵称"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="头衔"
                prop="title">
                <a-input v-decorator="formDecorator.title" placeholder="请输入头衔"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="头像"
                prop="picurl">
                <Upload
                    v-decorator="formDecorator.picurl"
                    :limit="1"
                    actionType="image"
                    fileType="png,gif,jpeg,jpg"
                    listType="picture-card"
                >
                    <div slot="tip" class="slot-tip">
                        请上传png、gif、jpeg、jpg格式的图片
                    </div>
                </Upload>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="简介"
                prop="intro">
                <a-textarea v-decorator="formDecorator.intro" :rows="4" placeholder="请输入简介"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import Upload from '@/components/Upload'
    import {
        Api_TeachersAdd,
        Api_TeachersUpdate
    } from "@/api/admin/train/index";

    export default {
        name: "CreateUpdate",
        components: {Upload},
        props: {
            modelStatus: {
                type: String,
                default: ""
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
                timeArrVal: "",
                typeData: [],
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: [
                        "name",
                        {
                            rules: createRules({
                                msg: "培训讲师名称",
                                required: true,
                                max: 100
                            })
                        }
                    ],
                    idCard: [
                        "idCard",
                        {
                            rules: createRules({
                                msg: "身份证号",
                                required: true,
                                idCard: true
                            })
                        }
                    ],
                    nickName: [
                        "nickName",
                        {
                            rules: createRules({
                                msg: "昵称",
                                max: 100
                            })
                        }
                    ],
                    title: [
                        "title",
                        {
                            rules: createRules({
                                msg: "头衔",
                                max: 100
                            })
                        }
                    ],
                    intro: [
                        "intro",
                        {
                            rules: createRules({
                                msg: "简介",
                                max: 300
                            })
                        }
                    ],
                    picurl: ["picurl", {
                        initialValue: []
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
            };
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail();
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = values;
                        postData.picurl = postData.picurl.map(i => i.response.url)[0]
                        const promiseRes =
                            modelStatus === "add"
                                ? Api_TeachersAdd(postData)
                                : Api_TeachersUpdate(id, {
                                    ...postData,
                                    version
                                });
                        const loading = this.$openLoading();
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
            // 获取单条数据信息
            getDetail() {
                const keys = Object.keys(this.form.getFieldsValue())
                keys.forEach(key => {
                    let value = this.selectData[key]
                    if (key === 'picurl') {
                        value = value ? [{
                            url: value,
                            name: '-',
                        }] : []
                    }
                    this.form.setFieldsValue({
                        [key]: value
                    })
                })
            },
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dictionary-list {
        div {
            &::after {
                content: "";
                display: block;
                clear: both;
            }
        }

        .a-form-item {
            float: left;
            margin-right: 10px;

            label {
                text-align: center;
                padding-right: 0;
            }
        }

        input {
            width: 100px;
        }
    }
</style>
