<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input
                        v-decorator="formDecorator.name"
                        placeholder="流程定义名称"
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
                    :fetch-data-fn="Api_ProcDefGetList"
                    :query="getQuery()"
                    :columns="tableCol"
                    :toolActions="actionBtns"
                />
            </div>
        </div>
        <ModelView ref="modelView"></ModelView>
    </div>
</template>

<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import Button from "@/components/Button";
    import ModelView from './ModelView'
    import {
        Api_ProcDefGetList
    } from "@/api/admin/m/index";

    export default {
        name: "ProcDef",
        components: {PageHead, TableWrapper, ModelView},
        data() {
            return {
                tableCol: [
                    {
                        key: "id",
                        label: "id"
                    },
                    {
                        key: "name",
                        label: "流程定义名称"
                    },
                    {
                        key: "flagDesc",
                        label: "标识"
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 150,
                        render: (data, row) => {
                            return [
                                <Button
                                    iconClass="icon-eye"
                                    iconColor="green"
                                    row={row}
                                    text="查看流程图"
                                    type="success"
                                    click={this.handleView.bind(this)}
                                />
                            ];
                        }
                    }
                ],
                // 按钮
                actionBtns: [],
                listQuery: {
                    name: undefined
                },
                options:{},
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"]
                },
                visible: false, // json查看的弹框
                json: '', // json数据
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.getList();
            });
        },
        methods: {
            Api_ProcDefGetList,
            // 获取主列表数据
            getList(flag) {
                this.$refs.child.fetchData(flag);
            },
            getQuery() {
                return {
                    ...this.form.getFieldsValue(),
                    saasCode: this.$store.getters.selectSaasCode
                }
            },
            // 加载代码编辑器需要的模块
            editorInit: function () {
                // require('brace/ext/searchbox')
                require('brace/ext/language_tools') //language extension prerequsite...
                // require('brace/mode/html')
                require('brace/mode/javascript')    //language
                // require('brace/mode/less')
                // require('brace/theme/textmate')
                // require('brace/snippets/javascript') //snippet
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 查看流程图
            handleView(row) {
                this.$refs.modelView.openModel(row)
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
