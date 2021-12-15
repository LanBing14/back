<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input v-decorator="formDecorator.name" placeholder="图表名称"/>
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
                    :fetch-data-fn="Api_EchartsGetList"
                    :query="form.getFieldsValue()"
                    :columns="tableCol"
                    :current-change="currentChange"
                    :toolActions="actionBtns"
                />
            </div>
        </div>
        <CreateUpdate
            ref="createUpdate"
            :model-status="modelStatus"
            :select-data="selectData"
            @getList="getList"
        />
        <ModelBuild ref="modelBuild" :select-data="selectData" @getList="getList"/>
    </div>
</template>
<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import CreateUpdate from "./CreateUpdate";
    import ModelBuild from "./ModelBuild";
    import waves from "@/directive/waves"; // Waves directive
    import Button from "@/components/Button";
    import {
        Api_EchartsGetList,
        Api_EchartsModelCopy,
        Api_EchartsDelete
    } from "@/api/admin/m/index";

    export default {
        name: "Echarts",
        directives: {waves},
        components: {PageHead, CreateUpdate, ModelBuild, TableWrapper},
        data() {
            return {
                timeArrVal: [],
                sassData: [],
                tableCol: [
                    {
                        key: "id",
                        label: "图表id"
                    },
                    {
                        key: "name",
                        label: "图表名称"
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 150,
                        render: (data, row) => {
                            return [
                                <Button
                                    iconClass="icon-monitor"
                                    iconColor="green"
                                    row={row}
                                    text="建模"
                                    type="success"
                                    click={this.handleBuild.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-file-copy"
                                    iconColor="green"
                                    row={row}
                                    text="复制"
                                    type="success"
                                    click={this.handleCopy.bind(this)}
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
                        text: "新增",
                        icon: "icon-plus",
                        click: this.handleCreate
                    }
                ],
                list: null, // 列表数据
                listLoading: false, // 列表loading状态
                listQuery: {
                    startDate: undefined,
                    endDate: undefined
                },
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"]
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add",

                pickerOptionsStart: {
                    disabledDate: time => {
                        const {endDate} = this.listQuery;
                        if (endDate) {
                            return time.getTime() > new Date(endDate).getTime();
                        } else {
                            return false;
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        const {startDate} = this.listQuery;
                        if (startDate) {
                            return time.getTime() < new Date(startDate).getTime();
                        } else {
                            return false;
                        }
                    }
                }
            };
        },
        watch: {
            timeArrVal: function (timeArr) {
                if (!timeArr) {
                    timeArr = ["", ""];
                }
                this.listQuery.startDate = timeArr[0];
                this.listQuery.endDate = timeArr[1];
            }
        },
        created() {
            // Api_saas().then(res => {
            //     this.sassData = res;
            // });
            this.$nextTick(() => {
                this.getList();
            });
        },
        methods: {
            Api_EchartsGetList,
            // 获取主列表数据
            getList(flag) {
                this.$refs.child.fetchData(flag);
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
            // 重置form表单
            resetForm(formName) {
                this.form.resetFields();
            },
            // 打开新增图表界面
            handleCreate() {
                this.modelStatus = "add";
                this.$refs.createUpdate.openModel();
            },
            // 打开建模界面
            handleBuild(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    this.$refs.modelBuild.openModel(row.id);
                });
            },
            // 复制
            handleCopy({id}) {
                const loading = this.$openLoading();
                Api_EchartsModelCopy(id)
                    .then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = "update";
                this.$nextTick(() => {
                    this.$refs.createUpdate.openModel(row.id);
                });
            },
            // 删除图表
            handleDel({id}) {
                this.$confirm("确定删除该图表?", "提示", {
                    type: "warning"
                }).then(() => {
                    Api_EchartsDelete(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                    });
                });
            },
            // 表格行改变时
            currentChange(data) {
                this.selectData = data;
            }
        }
    };
</script>

<style scoped>
</style>
