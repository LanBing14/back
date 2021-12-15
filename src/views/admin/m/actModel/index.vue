<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input
                        v-decorator="formDecorator.name"
                        placeholder="模型名称"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter"
                    >查询
                    </a-button>
                    <a-button class="filter-item" icon="icon iconfont icon-undo" @click="handleReset">重置</a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_ActModelGetList"
                    :query="getQuery()"
                    :columns="tableCol"
                    :current-change="currentChange"
                    :toolActions="actionBtns"
                />
            </div>
        </div>
        <CreateUpdate ref="createUpdateModel" :select-data="selectData" @getList="getList"/>
        <ModelBuild ref="ref_ModelBuild" :select-data="selectData" @getList="getList"/>
    </div>
</template>

<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import CreateUpdate from "./CreateUpdate";
    import waves from "@/directive/waves"; // Waves directive
    import Button from "@/components/Button";
    import ModelBuild from "./ModelBuild";
    import {
        Api_ActModelGetList,
        Api_ActModelDelete,
        Api_ActModelDeployment,
        Api_ActModelClone
    } from "@/api/admin/m/index";

    export default {
        name: "ActModel",
        directives: {waves},
        components: {PageHead, CreateUpdate, TableWrapper, ModelBuild},
        data() {
            return {
                tableCol: [
                    {
                        key: "name",
                        label: "模型名称",
                        width: 180,
                    },
                    {
                        key: "category",
                        label: "类型",
                        width: 100,
                    },
                    {
                        key: "flagDesc",
                        label: "标识",
                        width: 180,
                    },
                    {
                        key: "metaInfo",
                        label: "元数据"
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 180,
                        render: (data, row) => {
                            const {deploymentId} = row;
                            return [
                                <Button
                                    iconClass="icon-build"
                                    iconColor="green"
                                    row={row}
                                    text="建模"
                                    type="success"
                                    click={this.handleBuildModel.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-sliders"
                                    iconColor="green"
                                    row={row}
                                    text="部署"
                                    type="success"
                                    click={this.handleDeployment.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-file-copy"
                                    iconColor="green"
                                    row={row}
                                    text="复制"
                                    type="success"
                                    click={this.handleClone.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-edit-square"
                                    iconColor="green"
                                    row={row}
                                    text="修改"
                                    type="success"
                                    click={this.handleUpdate.bind(this)}
                                />,
                                !deploymentId && (
                                    <Button
                                        iconClass="icon-delete"
                                        iconColor="red"
                                        row={row}
                                        text="删除"
                                        type="danger"
                                        click={this.handleDel.bind(this)}
                                    />
                                )
                            ];
                        }
                    }
                ],
                // 按钮
                actionBtns: [
                    {
                        text: "新增模型",
                        icon: "icon-plus",
                        click: this.handleCreate
                    }
                ],
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"]
                },
                listQuery: {
                    name: undefined
                },
                selectData: undefined
            };
        },
        created() {
            this.$nextTick(() => {
                this.getList()
            });
        },
        methods: {
            Api_ActModelGetList,
            getQuery() {
                return {
                    ...this.form.getFieldsValue(),
                    saasCode: this.$store.getters.selectSaasCode
                }
            },
            // 获取主列表数据
            getList(flag) {
                this.$refs.child.fetchData(flag);
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 打开新增界面
            handleCreate() {
                this.$refs.createUpdateModel.openModel("add");
            },
            // 修改
            handleUpdate(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel('update');
                });
            },
            // 打开建模界面
            handleBuildModel(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    this.$refs.ref_ModelBuild.openModel();
                });
            },
            // 部署流程
            handleDeployment(row) {
                this.$confirm("确定部署该流程?", "提示", {
                    type: "warning"
                }).then(() => {
                    const {id} = row;
                    const loading = this.$openLoading();
                    Api_ActModelDeployment(id)
                        .then(msg => {
                            this.$message.success(msg);
                            this.getList();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            },
            // 复制流程
            handleClone(row) {
                this.$confirm("确定复制该流程?", "提示", {
                    type: "warning"
                }).then(() => {
                    const {id} = row;
                    const loading = this.$openLoading();
                    Api_ActModelClone(id)
                        .then(msg => {
                            this.$message.success(msg);
                            this.getList();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            },
            // 删除流程
            handleDel(row) {
                this.$confirm("确定删除该流程?", "提示", {
                    type: "warning"
                }).then(() => {
                    const {id} = row;
                    const loading = this.$openLoading();
                    Api_ActModelDelete(id)
                        .then(msg => {
                            this.$message.success(msg);
                            this.getList();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            },
            // 表格行改变时
            currentChange(data) {
                this.selectData = data || {};
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList(true);
            }
        }
    };
</script>

<style scoped>
</style>
