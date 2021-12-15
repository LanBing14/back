<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增公告':'修改公告'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="dataForm" :form="form" label-position="right" label-width="6em">
            <a-form-item label="标题" prop="title">
                <a-input v-decorator="formDecorator.title" placeholder="请输入标题"/>
            </a-form-item>
            <a-form-item label="附件">
                <Upload v-decorator="formDecorator.urls"/>
            </a-form-item>
            <a-form-item label="内容" prop="editorValue">
                <Ckeditor
                    ref="ref_Ckeditor"
                    :content="defaultContentTxt"
                    v-decorator="formDecorator.editorValue"
                />
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import Upload from "@/components/Upload";
    import Ckeditor from "@/components/Ckeditor";
    import {
        Api_NoticeDetail,
        Api_NoticeAdd,
        Api_NoticeUpdate
    } from "@/api/admin/system/index";

    export default {
        name: "CreateUpdate",
        components: {Upload, Ckeditor},
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
                lastId: undefined,
                //   addFormRules: {
                //     title: createRules({
                //       msg: "标题",
                //       required: true,
                //       max: 100
                //     }),
                //     editorValue: createRules({
                //       msg: "内容",
                //       required: true
                //     })
                //   },
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    title: [
                        "title",
                        {
                            rules: createRules({
                                msg: "标题",
                                required: true,
                                max: 100
                            })
                        }
                    ],
                    urls: [
                        "urls",
                        {
                            rules: [{required: false, message: "文件选填"}, {type: "array"}]
                        }
                    ],
                    editorValue: [
                        "editorValue",
                        {
                            rules: createRules({
                                msg: "内容",
                                required: true
                            })
                        }
                    ]
                },
                addFormData: {
                    // 新增公告的表单数据
                    title: undefined,
                    editorValue: undefined
                },
                defaultFileList: [],
                defaultContentTxt: undefined // 默认的详情里的富文本内容
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
                const editorValue = this.$refs.ref_Ckeditor.getContent();
                this.form.setFieldsValue({editorValue: this.$trim(editorValue)});
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        let fileList;
                        if (values.urls) {
                            fileList = values.urls;
                            fileList = fileList.map(item => item.response.url);
                            fileList = fileList.join(",")
                        }
                        const postData = {
                            title: values.title,
                            editorValue: values.editorValue,
                            urls: fileList
                        };
                        const promiseRes =
                            modelStatus === "add"
                                ? Api_NoticeAdd(postData)
                                : Api_NoticeUpdate(id, {
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
            // 获取单个公告信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_NoticeDetail(id)
                    .then(res => {
                        const oldData = {...this.form.getFieldsValue()};
                        let newData = {};
                        let urls = [];
                        for (const key in oldData) {
                            if (res.hasOwnProperty(key)) {
                                newData[key] = res[key];
                            }
                        }
                        if (res.attachments) {
                            urls = res.attachments.map(item => ({
                                name: item.originalName,
                                url: item.url
                            }));
                        }
                        newData.urls = urls;
                        newData.editorValue = res.txt;
                        this.defaultContentTxt = res.txt;
                        this.form.setFieldsValue(newData);
                        this.visible = true;
                        loading.close();
                    })
                    .catch(e => {
                        console.log(e);
                        loading.close();
                    });
            },
            handleCheckChange(data, checked) {
                if (checked) {
                    this.$refs.depTree.setCheckedKeys([data.id]);
                    this.addFormData.departmentId = data.id;
                } else {
                    this.$refs.depTree.setCheckedKeys([]);
                    this.addFormData.departmentId = "";
                }
            },
            onClose() {
                this.form.resetFields();
                this.defaultContentTxt = "";
                this.defaultFileList = [];
            }
        }
    };
</script>

<style scoped>
</style>
