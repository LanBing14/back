<template>
    <div>
        <Drawer
            ref="drawer"
            :visible.sync="visible"
            :title="modelStatus==='add'?'新增消息':'修改消息'"
            :btn="drBtns"
            @close="onClose"
        >
            <a-form ref="dataForm" :form="form" label-position="right" label-width="6em">
                <a-form-item class="user-area" label="用户" prop="users">
                    <a-button @click="openSelectUser">选择用户</a-button>
                    <a-tag
                        v-for="el in selectedUers"
                        :key="el.id"
                        closable
                        @close="removeSelectUser(el)"
                    >{{ el.name + (el.username ? ('（'+el.username+'）') : '') }}
                    </a-tag>
                </a-form-item>
                <a-form-item label="标题" prop="title">
                    <a-input v-decorator="formDecorator.title" placeholder="请输入标题"/>
                </a-form-item>
                <a-form-item label="附件">
                    <Upload v-decorator="formDecorator.urls" ref="ref_upload"/>
                </a-form-item>
                <a-form-item label="内容" prop="editorValue">
                    <Ckeditor
                        ref="Ckeditor"
                        :content="defaultContentTxt"
                        v-decorator="formDecorator.editorValue"
                    />
                </a-form-item>
            </a-form>
        </Drawer>
        <a-modal width="70%" title="选择用户" :visible.sync="userSelectVisible" :close-on-click-modal="false">
            <UserSelect ref="userSelect"></UserSelect>
            <div slot="footer" class="dialog-footer">
                <a-button @click="userSelectVisible = false">关 闭</a-button>
                <a-button type="primary" @click="sure()">确 定</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import Upload from "@/components/Upload";
    import Ckeditor from "@/components/Ckeditor";
    import UserSelect from "@/components/UserSelect";
    import {
        Api_MailDetail,
        Api_MailAdd,
        Api_MailAddDispatch,
        Api_MailUpdate,
        Api_MailUpdateDispatch
    } from "@/api/admin/system/index";

    export default {
        name: "CreateUpdate",
        components: {Upload, Ckeditor, UserSelect},
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
                userSelectVisible: false,
                lastId: undefined,
                form: this.$form.createForm(this),
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
                    users: [
                        "users",
                        {
                            rules: createRules({
                                msg: "用户",
                                required: true,
                                validator: this.validatorUserSelect
                            })
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
                    // 新增消息的表单数据
                    title: undefined,
                    users: undefined,
                    editorValue: undefined
                },
                defaultFileList: [],
                defaultContentTxt: undefined, // 默认的详情里的富文本内容
                selectedUers: [], // 已选择的用户列表
                drBtns: [
                    {
                        text: "关闭",
                        click: () => {
                            this.visible = false;
                            this.onClose();
                        }
                    },
                    {
                        type: "primary",
                        text: "发送",
                        click: () => {
                            this.handleSure(true);
                        }
                    },
                    {
                        type: "primary",
                        text: "保存",
                        click: () => {
                            this.handleSure(false);
                        }
                    }
                ]
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
            handleSure(isDispatch) {
                const editorValue = this.$refs.Ckeditor.getContent();
                this.form.setFieldsValue({editorValue: this.$trim(editorValue)});
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const userIds = this.selectedUers.map(item => item.id);
                        let fileList;
                        if (values.urls) {
                            fileList = values.urls;
                            fileList = fileList.map(item => item.response.url);
                            fileList = fileList.join(",")
                        }
                        // let fileList = values.urls;
                        // fileList = fileList.map(item => item.response.url);
                        const postData = {
                          title: values.title,
                          // urls: fileList.join(","),
                          urls: fileList,
                          editorValue: values.editorValue,
                            userIds
                        };
                        const loading = this.$openLoading();
                        let promiseRes = null;
                        if (modelStatus === "add") {
                            promiseRes = isDispatch
                                ? Api_MailAddDispatch(postData)
                                : Api_MailAdd(postData);
                        } else {
                            promiseRes = isDispatch
                                ? Api_MailUpdateDispatch(id, {
                                    ...postData,
                                    version
                                })
                                : Api_MailUpdate(id, {
                                    ...postData,
                                    version
                                });
                        }
                        promiseRes
                            .then(msg => {
                                this.$refs.drawer.close();
                                this.$message.success(msg);
                                this.$emit("getList");
                                isDispatch ? this.$store.dispatch("getMailNums") : null;
                                loading.close();
                            })
                            .catch(() => {
                                loading.close();
                            });
                    }
                });
            },
            // 获取单个消息信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_MailDetail(id)
                    .then(res => {
                        this.form.setFieldsValue({title: res.title});
                        let newData = {};
                        let urls = [];
                        if (res.inboxes) {
                            this.selectedUers = res.inboxes.map(item => ({
                                id: item.receiverId,
                                name: item.receiverName,
                                username: item.receiverUserName
                            }));
                            if (res.inboxes.length > 0) {
                                this.form.setFieldsValue({users: 1});
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
                    .catch(() => {
                        loading.close();
                    });
            },
            // 移除已选择的用户
            removeSelectUser(tag) {
                this.selectedUers = this.selectedUers.filter(item => {
                    return tag.id !== item.id;
                });
            },
            validatorUserSelect(rule, value, callback) {
                if (value === "") {
                    callback(new Error("请至少选择一个用户"));
                } else {
                    if (this.selectedUers.length === 0) {
                        callback(new Error("请至少选择一个用户"));
                    } else {
                        callback();
                    }
                }
            },
            onClose() {
                this.form.resetFields();
                this.$nextTick(() => {
                    this.defaultContentTxt = "";
                    this.defaultFileList = [];
                    this.selectedUers = [];
                });
            },
            // 打开选择用户
            openSelectUser() {
                this.userSelectVisible = true;
                this.$nextTick(() => {
                    this.$refs.userSelect.reset();
                    this.$refs.userSelect.updateSelected([...this.selectedUers]);
                });
            },
            sure() {
                this.selectedUers = this.$refs.userSelect.getSelectData();
                this.addFormData.users = 1;
                this.userSelectVisible = false;
            }
        }
    };
</script>

<style scoped lang="scss">
    .user-area {
        button {
            margin-right: 10px;
        }

        .a-tag {
            margin-right: 8px;
        }
    }
</style>
