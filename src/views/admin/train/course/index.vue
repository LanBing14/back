<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input v-decorator="formDecorator.name" placeholder="课程名称"/>
                </a-form-item>
                <a-form-item prop="type">
                    <a-select v-decorator="formDecorator.type" placeholder="课程类型">
                        <a-select-option
                            v-for="el in typeOptions"
                            :key="el.value"
                            :value="el.value"
                        >
                            {{ el.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item prop="status">
                    <a-select v-decorator="formDecorator.status" placeholder="课程状态">
                        <a-select-option
                            v-for="el in statusOptions"
                            :key="el.value"
                            :value="el.value"
                        >
                            {{ el.label }}
                        </a-select-option>
                    </a-select>
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
                    :fetch-data-fn="Api_CoursesFetchList"
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
            :typeOptions="typeOptions"
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
    import {Api_comboboxDict} from '@/api/admin/index'
    import {
        Api_CoursesFetchList,
        Api_CoursesDelete,
        Api_CoursesPublish,
        Api_CoursesWithdraw
    } from "@/api/admin/train/index";

    export default {
        name: "Courses",
        components: {PageHead, CreateUpdate, TableWrapper, Viewer},
        data() {
            return {
                $viewer: null,
                fileListUrls: [],
                typeOptions: [], // 课程类型，下拉框
                statusOptions: [], // 课程状态，下拉框
                sassData: [],
                tableCol: [
                    {
                        key: "name",
                        label: "课程名称"
                    },
                    {
                        key: "typeDesc",
                        label: "课程类型"
                    },
                    {
                        key: "statusDesc",
                        label: "课程状态"
                    },
                    {
                        key: "price",
                        label: "课程价格(元)",
                        align: 'right',
                        render: (data) => {
                            return this.$toMoney(data)
                        }
                    },
                    {
                        key: "picurl",
                        label: "课程封面",
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
                                row.status !== '2' && <Button
                                    iconClass="icon-link"
                                    iconColor="green"
                                    row={row}
                                    text="发布"
                                    type="success"
                                    click={this.handlePublish.bind(this)}
                                />,
                                row.status === '2' && <Button
                                    iconClass="icon-disconnect"
                                    iconColor="green"
                                    row={row}
                                    text="撤消"
                                    type="success"
                                    click={this.handleWithdraw.bind(this)}
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
                    type: ["type"],
                    status: ["status"]
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add"
            };
        },
        mounted() {
            Api_comboboxDict('course_type').then(res => {
                this.typeOptions = res
            })
            Api_comboboxDict('publish_status').then(res => {
                this.statusOptions = res
            })
            this.getList();
        },
        methods: {
            Api_CoursesFetchList,
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
            // 发布
            handlePublish({id}) {
                this.$confirm("确定发布?", "提示", {
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading()
                    Api_CoursesPublish(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    });
                });
            },
            // 撤消
            handleWithdraw({id}) {
                this.$confirm("确定撤消?", "提示", {
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading()
                    Api_CoursesWithdraw(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    });
                });
            },
            // 删除培训讲师
            handleDel({id}) {
                this.$confirm("确定删除该课程?", "提示", {
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading()
                    Api_CoursesDelete(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    });
                });
            },
            // 生成图片查看器
            inited(viewer) {
                this.viewer = viewer;
            },
            preview(url) {
                this.fileListUrls = [url]
                this.$nextTick(() => {
                    console.log(this.fileListUrls);
                    console.log(this.viewer.view);
                    this.viewer.view();
                })
            },
        }
    };
</script>

<style scoped>
</style>
