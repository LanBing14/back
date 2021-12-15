<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="companyName">
                    <a-input v-decorator="formDecorator.name" placeholder="报告名称"/>
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
                    :fetch-data-fn="Api_ProductsFetchList"
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
    </div>
</template>

<script type="text/jsx">
    import {
        Api_ProductsFetchList
    } from "@/api/admin/train/index";
    import Button from "@/components/Button";
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import DealWith from "./DealWith";

    export default {
        name: "ReportProduct",
        components: { PageHead, TableWrapper, DealWith },
        data() {
            return {
                Api_ProductsFetchList,
                listQuery: {},
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"]
                },
                tableCol: [{
                    key: 'code',
                    label: '产品编号'
                }, {
                    key: 'name',
                    label: '报告名称',
                    width: 350
                }, {
                    key: 'oldPrice',
                    label: '划线价'
                }, {
                    key: 'price',
                    label: '市场价'
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
                                text="产品配置"
                                type="success"
                                click={this.handleDealWith.bind(this)}
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
            }
        }
    }
</script>

<style scoped>

</style>
