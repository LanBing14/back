<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        only-close-btn
        title="个人学习记录"
    >
        <TableWrapper
            ref="child"
            :fetch-data-fn="Api_LearningFetchListSelf"
            :query="form.getFieldsValue()"
            :columns="tableCol"
        />
    </Drawer>
</template>

<script>
    import Upload from '@/components/Upload'
    import TableWrapper from "@/components/TableWrapper";
    import {
        Api_LearningFetchListSelf
    } from "@/api/admin/train/index";

    export default {
        name: "CreateUpdate",
        components: {Upload, TableWrapper},
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
            },
            typeOptions: Array
        },
        data() {
            return {
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    courseName: ["courseName"]
                },
                visible: false,
                tableCol: [
                    {
                        key: "courseName",
                        label: "课程名称"
                    },
                    {
                        key: "lessonName",
                        label: "课时名称"
                    },
                    {
                        key: "courseTypeDesc",
                        label: "课程类型"
                    },
                    {
                        key: "ip",
                        label: "ip"
                    },
                ]
            };
        },
        methods: {
            Api_LearningFetchListSelf,
            // 打开模态框
            openModel() {
                this.visible = true;
                this.form.setFieldsValue({
                    courseName: this.selectData.courseName
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

    /deep/ .upload-no-button .ant-upload.ant-upload-select {
        display: block;
    }
</style>
