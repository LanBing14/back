<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="companyName">
                    <a-input v-decorator="formDecorator.name" placeholder="产品名称"/>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter"
                    >查询
                    </a-button>
                    <a-button
                        class="filter-item"
                        icon="icon iconfont icon-undo"
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
                    :fetch-data-fn="Api_VersionFetchList"
                    :query="listQuery"
                    :columns="tableCol"
                />
            </div>
        </div>
        <DealWith
            ref="dealWith"
            :select-data="selectData"
            @getList="getList"
        />
        <Grant
            ref="rolesGrant"
            :select-id="selectId"
            :get-list="Api_VipGetPermissions"
            :update="Api_VipAddDataPerms"
            title="功能授权"
        />
    </div>
</template>

<script type="text/jsx">
    import {
        Api_VersionFetchList
    } from "@/api/admin/train/index";
    import {
        Api_VipAddDataPerms, // 更新角色权限树
        Api_VipGetPermissions // 获取角色权限树
    } from "@/api/admin/system/index";
    import Button from "@/components/Button";
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import DealWith from "./DealWith";
    import Grant from "./Grant";

    export default {
        name: "VipVersion",
        components: {PageHead, TableWrapper, DealWith, Grant},
        data() {
            return {
                Api_VersionFetchList,
                Api_VipGetPermissions,
                Api_VipAddDataPerms,
                listQuery: {},
                form: this.$form.createForm(this),
                selectId: undefined,
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"]
                },
                tableCol: [{
                    key: 'name',
                    label: '会员版本名称'
                }, {
                    key: 'oldPrice',
                    label: '划线价'
                }, {
                    key: 'newPrice',
                    label: '市场价'
                }, {
                    key: 'effectiveMonth',
                    label: '有限期限'
                }, {
                    key: 'modifyDate',
                    label: '更新时间'
                }, {
                    key: '',
                    label: '操作',
                    render: (data, row) => {
                        return [
                            <Button
                                iconClass="icon-edit-square"
                                iconColor="green"
                                row={row}
                                text="功能授权"
                                type="success"
                                click={this.handleGrant.bind(this)}
                            />,
                            <Button
                                iconClass="icon-edit-square"
                                iconColor="green"
                                row={row}
                                text="产品配置"
                                type="success"
                                click={this.handleDealWith.bind(this)}
                            />,
                            <Button
                                iconClass="icon-eye"
                                iconColor="green"
                                row={row}
                                text="查看"
                                type="success"
                                click={this.handleView.bind(this)}
                            />]
                    }
                }],
                selectData: undefined
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            // 获取主列表数据
            getList(flag) {
                this.listQuery = this.form.getFieldsValue();
                this.$nextTick(() => {
                    this.$refs.child.fetchData(flag);
                })
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 重置查询条件
            handleReset(formName) {
                this.form.resetFields();
                this.$nextTick(() => {
                    this.getList(true);
                });
            },
            // 处理
            handleDealWith(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    this.$refs.dealWith.openModel();
                });
            },
            // 查看
            handleView(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    this.$refs.dealWith.openModel(true);
                });
            },
            // 授权
            handleGrant(row) {
                this.selectId = row.id;
                this.$nextTick(() => {
                    this.$refs.rolesGrant.handleGrant();
                });
            },
        }
    }
</script>

<style scoped>

</style>
