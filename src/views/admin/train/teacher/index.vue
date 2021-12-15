<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input v-decorator="formDecorator.name" placeholder="姓名"/>
                </a-form-item>
                <a-form-item prop="idCard">
                    <a-input v-decorator="formDecorator.idCard" placeholder="身份证号"/>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="search"
                        @click="handleFilter"
                    >查询
                    </a-button>
                    <a-button
                        class="filter-item"
                        icon="undo"
                        @click="handleReset('searchForm')"
                    >重置
                    </a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_TeachersFetchList"
                    :query="form.getFieldsValue()"
                    :columns="tableCol"
                    :toolActions="actionBtns"
                />
            </div>
        </div>
        <CreateUpdate
            ref="createUpdateModel"
            :model-status="modelStatus"
            :select-data="selectData"
            @getList="getList"
        />
    </div>
</template>
<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import CreateUpdate from "./CreateUpdate";
    import Button from "@/components/Button";
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer/src/component.vue';
    import {
        Api_TeachersFetchList,
        Api_TeachersDelete
    } from "@/api/admin/train/index";

    export default {
        name: "Teacher",
        components: {PageHead, CreateUpdate, TableWrapper, Viewer},
        data() {
            return {
                $viewer: null,
                fileListUrls: ['/group1/M00/00/27/Cr8eXV6ODBCAKV5jAAA_gMHjhuI637.jpg'],
                timeArrVal: [],
                sassData: [],
                tableCol: [
                    {
                        key: "name",
                        label: "姓名"
                    },
                    {
                        key: "idCard",
                        label: "身份证号"
                    },
                    {
                        key: "nickName",
                        label: "昵称"
                    },
                    {
                        key: "title",
                        label: "头衔"
                    },
                    {
                        key: "picurl",
                        label: "头像",
                        render: (data => {
                            var data1 = process.env.VUE_APP_FILE_API + data
                            if (data) {
                                return (<viewer
                                    images={[`${data1}`]}
                                >
                                    <img src={`${data1}`} style={{width: '40px', height: '40px'}} class="cursor"/>
                                </viewer>)
                            }
                        })
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 150,
                        render: (data, row) => {
                            return [
                                <Button
                                    iconClass="icon-edit-square"
                                    iconColor="green"
                                    row={row}
                                    text="修改"
                                    type="success"
                                    click={this.handleUpdate.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-delete"
                                    iconColor="red"
                                    row={row}
                                    text="删除"
                                    type="danger"
                                    click={this.handleDel.bind(this)}
                                />
                            ];
                        }
                    }
                ],
                // 按钮
                actionBtns: [
                    {
                        text: "新增",
                        icon: 'plus',
                        click: this.handleCreate
                    }
                ],
                list: null, // 列表数据
                listLoading: false, // 列表loading状态
                listQuery: {
                    name: "",
                    idCard: ""
                },
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"],
                    idCard: ["idCard"]
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add"
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            Api_TeachersFetchList,
            // 获取主列表数据
            getList(flag) {
                this.listQuery = this.form.getFieldsValue()
                this.$nextTick(() => {
                    this.$refs.child.fetchData(flag);
                })
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList(true);
            },
            // 重置form表单
            resetForm() {
                this.form.resetFields();
            },
            // 打开新增培训讲师界面
            handleCreate() {
                this.modelStatus = "add";
                this.$refs.createUpdateModel.openModel();
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = "update";
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel(row.id);
                });
            },
            // 删除培训讲师
            handleDel({id}) {
                this.$confirm("确定删除该培训讲师?", "提示", {
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading()
                    Api_TeachersDelete(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    });
                });
            },
        }
    };
</script>

<style scoped>
</style>
