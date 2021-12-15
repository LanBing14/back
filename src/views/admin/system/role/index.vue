<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="searchForm-wrap">
                <a-form-item>
                    <a-input
                        v-decorator="formDecorator.name"
                        placeholder="角色"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                </a-form-item>
                <a-form-item>
                    <a-select
                        v-decorator="formDecorator.type"
                        placeholder="角色类型"
                        class="filter-item"
                    >
                        <a-select-option
                            v-for="item in rolesList"
                            :key="item.value"
                            :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button type="primary" class="filter-item" icon="search" @click="handleFilter">查询</a-button>
                    <a-button icon="undo" class="filter-item" @click="handleReset('searchForm')">重置</a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_RolesFetchList"
                    :query="listQuery"
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
        <Grant
            ref="rolesGrant"
            :select-id="selectId"
            :get-list="Api_RolesGetPermissions"
            :update="Api_RolesUpdatePermissions"
            title="角色功能授权"
        />
        <DataGrant
            ref="dataGrant"
            :select-id="selectId"
            :get-list="Api_RolesGetPermissions"
            :update="Api_RolesUpdatePermissions"
            title="角色数据授权"
        />
    </div>
</template>
<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import Grant from "../user/components/Grant";
    import DataGrant from "./DataGrant";
    import CreateUpdate from "./CreateUpdate";
    import waves from "@/directive/waves"; // Waves directive
    import {
        Api_RolesFetchList,
        Api_UserChangeStatus,
        Api_RolesDel, // 删除角色
        Api_RolesGetPermissions, // 获取角色权限树
        Api_RolesUpdatePermissions, // 更新角色权限树
    } from "@/api/admin/system/index";
    import {
        Api_comboboxDict //角色类型下拉
    } from "@/api/admin/index";
    import Button from "@/components/Button";

    export default {
        name: "Roles",
        directives: {waves},
        components: {PageHead, CreateUpdate, TableWrapper, Grant, DataGrant},
        data() {
            return {
                tableCol: [
                    {
                        key: "name",
                        label: "角色"
                    },
                    {
                        key: "description",
                        label: "描述"
                    },
                    {
                        key: "typeDesc",
                        label: "角色类型"
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 150,
                        render: (data, row) => {
                            return [
                                <Button
                                    iconClass="icon-fork"
                                    row={row}
                                    text="功能授权"
                                    click={this.handleGrant.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-fork"
                                    row={row}
                                    text="数据授权"
                                    click={this.handleDataGrant.bind(this)}
                                />,
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
                        text: "新增角色",
                        icon: "icon-plus",
                        click: this.handleCreate
                    }
                ],
                list: null, // 列表数据
                rolesList: [],
                listLoading: false, // 列表loading状态
                listQuery: {},
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name", {initialValue: ""}],
                    type: ['type', {initialValue: undefined}],
                    saasCode: ["saasCode", {initialValue: this.$store.getters.selectSaasCode}]
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add",
                enableOptions: [
                    {
                        key: "0",
                        label: "启用"
                    },
                    {
                        key: "1",
                        label: "禁用"
                    }
                ],
                Api_RolesGetPermissions,
                Api_RolesUpdatePermissions
            };
        },
        created() {
            this.getType()
            this.$nextTick(() => {
                this.getList();
            });
        },
        methods: {
            Api_RolesFetchList,
            // 获取主列表数据
            getList(flag) {
                this.listQuery = this.form.getFieldsValue();
                this.listQuery.saasCode = this.$store.getters.selectSaasCode;
                this.$nextTick(() => {
                    this.$refs.child.fetchData(flag);
                })
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            getType() {
                Api_comboboxDict('role_type').then(res => {
                    this.rolesList = res;
                })
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.$nextTick(() => {
                    this.getList(true);
                });
            },
            // 更改用户状态
            changeEnable(row) {
                Api_UserChangeStatus(row.enable, row.id).then(msg => {
                    this.$message.success(msg);
                });
            },
            // 重置form表单
            resetForm() {
                this.form.resetFields();
            },
            // 打开新增角色界面
            handleCreate() {
                this.modelStatus = "add";
                this.$refs.createUpdateModel.openModel();
            },
            // 打开功能授权界面
            handleGrant(row) {
                this.selectId = row.id;
                this.$nextTick(() => {
                    this.$refs.rolesGrant.handleGrant();
                });
            },
            // 打开数据授权界面
            handleDataGrant(row) {
                this.selectId = row.id;
                this.$nextTick(() => {
                    this.$refs.dataGrant.handleGrant();
                });
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = "update";
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel(row.id);
                });
            },
            // 删除角色
            handleDel(row) {
                this.$confirm("确定删除该角色?", "提示", {
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_RolesDel(row.id)
                        .then(msg => {
                            this.$message.success(msg);
                            this.getList();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            }
        }
    };
</script>

<style scoped>
    .ant-form-item {
        margin-bottom: 0;
    }
</style>
