<template>
    <Drawer ref="drawer" :visible.sync="visible" :title="modelStatus==='add'?'新增站点':'修改站点'" :onOk="handleSure" @close="onClose">
        <a-form ref="dataForm" :form="form">
            <a-form-item label="站点编码" prop="code">
                <a-input v-decorator="formDecorator.code" placeholder="请输入站点编码" />
            </a-form-item>
            <a-form-item label="站点名称" prop="name">
                <a-input v-decorator="formDecorator.name" placeholder="请输入站点编码" />
            </a-form-item>
            <a-form-item label="社会统一信用代码" prop="creditCode">
                <a-input v-decorator="formDecorator.creditCode" placeholder="请输入社会统一信用代码" />
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
import { Api_SaasAdd, Api_SaasUpdate } from "@/api/admin/system/index";

export default {
    name: "CreateUpdate",
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
            //   addFormRules: {
            //     name: createRules({
            //       msg: "站点名称",
            //       required: true,
            //       max: 100
            //     }),
            //     code: createRules({
            //       msg: "站点编码",
            //       required: true,
            //       EXP_ENG_NUM_2: true,
            //       max: 300
            //     })
            //   },
            //   addFormData: {
            //     name: undefined,
            //     code: undefined
            //   },
            form: this.$form.createForm(this),
            // 查询表单注册表单值
            formDecorator: {
                name: [
                    "name",
                    {
                        rules: [
                            { required: true, message: "站点名称必填" },
                            { max: 100, message: "站点名称最大长度100" }
                        ]
                    }
                ],
                code: [
                    "code",
                    {
                        rules: [
                            { required: true, message: "站点编码必填" },
                            { max: 300, message: "超出最大长度" },
                            {
                                pattern: /^[A-Za-z0-9_\-]+$/,
                                message: "只允许大小写字母、数字、“_”和“-”"
                            }
                        ]
                    }
                ],
                creditCode: [
                    "creditCode",
                    {
                        rules: [
                            { max: 50, message: "超出最大长度" },
                            {
                                pattern: /^[A-Za-z0-9_\-]+$/,
                                message: "只允许大小写字母、数字、“_”和“-”"
                            }
                        ]
                    }
                ]
            }
        };
    },
    methods: {
        // 打开模态框
        openModel() {
            this.$nextTick(() => {
                if (this.modelStatus === "add") {
                    this.onClose();
                } else {
                    this.form.setFieldsValue({
                        name: this.selectData.name,
                        code: this.selectData.code,
                        creditCode: this.selectData.creditCode
                    });
                }
            });
            this.visible = true;
        },
        // 点击确认
        handleSure() {
            this.form.validateFields((valid, values) => {
                if (!valid) {
                    const { modelStatus } = this; // add新增，update修改
                    const { id, version } = this.selectData;
                    const postData = values;
                    const promiseRes =
                        modelStatus === "add"
                            ? Api_SaasAdd(postData)
                            : Api_SaasUpdate(id, {
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
        onClose() {
            this.form.resetFields();
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

.label-right /deep/ {
    label {
        text-align: center;
    }
}
</style>
