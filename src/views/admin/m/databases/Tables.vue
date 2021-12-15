<template>
    <div>
        <el-dialog
            ref="dialog"
            :title="'“'+selectData.name+'”数据库表管理'"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @close="close"
            width="1050px"
        >
            <el-form
                ref="searchForm"
                :model="listQuery"
                :inline="true"
                class="demo-form-inline searchForm-wrap">
                <el-form-item prop="name">
                    <el-input v-model="listQuery.name" placeholder="表名"/>
                </el-form-item>
                <el-form-item prop="remark">
                    <el-input v-model="listQuery.remark" placeholder="备注"/>
                </el-form-item>
                <el-form-item prop="status">
                    <el-select v-model="listQuery.status" placeholder="创建状态" filterable>
                        <el-option label="未创建" value="0"/>
                        <el-option label="已创建" value="1"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter">
查询
                    </el-button>
                    <el-button
                        class="filter-item"
                        icon="icon iconfont icon-undo"
                        @click="handleReset('searchForm')">
                        重置
                    </el-button>
                </el-form-item>
                <el-form-item class="btns" style="float: right;">
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleOpenTables">
                        新增表
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="page-content">
                <div class="page-content-body">
                    <TableWrapper
                        ref="child"
                        :fetch-data-fn="Api_DatabasesTables"
                        :query="listQuery"
                        :columns="tableCol"
                        :filterGroup="false"
                    />
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
            </div>
        </el-dialog>
        <Drawer
            ref="drawer"
            :visible.sync="visibleDrawer"
            :onOk="handleDrawerSure"
            :zIndex="drawerZindex"
            :title="tablesStatus==='add'?'新增表':'修改表'"
            width="500px"
            @close="onDrawerClose">
            <el-form
                ref="tablesForm"
                :rules="tablesFormRules"
                :model="tablesFormData"
                label-position="right"
                label-width="8em"
            >
                <el-form-item
                    v-show="tablesStatus==='add'"
                    label="表模板"
                    prop="type">
                    <el-row>
                        <el-col :span="11">
                            <el-select v-model="tablesFormData.databaseId" placeholder="请选择数据库" clearable filterable>
                                <el-option
                                    v-for="el in tableTemp.options1"
                                    :key="el.value"
                                    :label="el.label"
                                    :value="el.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="2" style="min-height: 1px">
                        </el-col>
                        <el-col :span="11">
                            <el-select v-model="tablesFormData.tempTableId" placeholder="请选择数据库" clearable filterable>
                                <el-option
                                    v-for="el in tableTemp.options2"
                                    :key="el.value"
                                    :label="el.label"
                                    :value="el.value"
                                />
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                    label="表名"
                    prop="name">
                    <el-input v-model="tablesFormData.name" placeholder="请输入表名"
                              :disabled="tablesStatus==='update'&&tablesSelectData.status==='1'"/>
                </el-form-item>
                <el-form-item
                    label="备注"
                    prop="remark">
                    <el-input v-model="tablesFormData.remark" :rows="4" type="textarea" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
        </Drawer>
        <Fields ref="fields" @getList="getList" :tablesType="tablesType" :title="fieldsTitle"/>
    </div>
</template>

<script type="text/jsx">
    import {wordTips} from '@/utils/variables'
    import Button from '@/components/Button'
    import TableWrapper from '@/components/TableWrapper'
    import Fields from './Fields'
    import {
        Api_DatabasesTables,
        Api_DatabasesTablesAdd,
        Api_DatabasesTablesUpdate,
        Api_DatabasesTablesSign,
        Api_DatabasesTablesCreation,
        Api_DatabasesTablesDelete,
        Api_DatabasesCombobox,
        Api_DatabasesTablesCombobox
    } from '@/api/admin/m/index'

    export default {
        name: 'Tables',
        components: {TableWrapper, Fields},
        props: {
            selectData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                Api_DatabasesTables,
                visible: false, // 表维护的弹框显示状态
                visibleDrawer: false, // 新增表的抽屉显示状态
                fieldsTitle: '',
                drawerZindex: null,
                listQuery: {
                    name: '',
                    remark: '',
                    databaseId: '',
                    status: ''
                },
                tablesFormRules: {
                    name: createRules({
                        msg: '表名',
                        required: true,
                        EXP_ENG_NUM_2: true,
                        max: 30
                    }),
                    remark: createRules({
                        msg: '备注',
                        required: true,
                        max: 100
                    })
                },
                // 表模板的下拉框选择数据
                tableTemp: {
                    options1: [],
                    options2: []
                },
                // 表弹框的状态，是新增或修改
                tablesStatus: 'add',
                // 新增表的form表单数据
                tablesFormData: {
                    name: '',
                    remark: '',
                    databaseId: '',
                    tempTableId: ''
                },
                // 表的数据列信息
                tableCol: [{
                    key: 'name',
                    label: '表名'
                }, {
                    key: 'remark',
                    label: '备注'
                }, {
                    key: 'status',
                    label: '创建状态',
                    render(h, data) {
                        return data === '0' ? '未创建' : '已创建'
                    }
                }, {
                    key: null,
                    label: '操作',
                    align: 'center',
                    width: 150,
                    render: (h, data, row) => {
                        const {status} = row;
                        return [
                            <Button
                                iconClass='icon-golden-fill'
                                row={row}
                                text='表维护'
                                type='success'
                                click={this.handleOpenField.bind(this)}/>,
                            status === '0' && <Button
                                iconClass='icon-safetycertificate'
                                row={row}
                                text='标记创建'
                                type='success'
                                click={this.handleSign.bind(this)}/>,

                            status === '0' && <Button
                                iconClass='icon-safetycertificate-f'
                                row={row}
                                text='创建表'
                                type='success'
                                click={this.handleCreation.bind(this)}/>,
                            <Button
                                iconClass='icon-edit-square'
                                iconColor='green'
                                row={row}
                                text='修改'
                                type='success'
                                click={this.handleUpdateTables.bind(this)}/>,
                            <Button
                                iconClass='icon-delete'
                                iconColor='red'
                                row={row}
                                text='删除'
                                type='danger'
                                click={this.handleDeleteTables.bind(this)}/>
                        ]
                    }
                }],
                // 表当前选中的数据
                tablesSelectData: {},
                // 当前数据库类型
                tablesType: '',
                // 当前维护的数据库id
                databaseId: ''
            }
        },
        updated() {
            this.$nextTick(() => {
                this.$refs.dialog ? this.drawerZindex = this.$getStyle(this.$refs.dialog.$el, 'z-index') : null
            })
        },
        methods: {
            // 打开模态框
            openModel() {
                this.visible = true;
                const {id, type} = this.selectData;
                this.tablesType = type;
                this.databaseId = id;
                this.$nextTick(() => {
                    this.listQuery.databaseId = id;
                    this.$refs.searchForm.resetFields();
                    this.getList();
                });
                Api_DatabasesCombobox({databaseId: id}).then(res => {
                    this.tableTemp.options1 = res
                })
                Api_DatabasesTablesCombobox({databaseId: id}).then(res => {
                    this.tableTemp.options2 = res
                })
            },
            // 获取主列表数据
            getList() {
                this.$refs.child.fetchData()
            },
            // 查询
            handleFilter() {
                this.getList()
            },
            // 重置查询条件
            handleReset(formName) {
                this.$refs[formName].resetFields();
                this.getList()
            },
            // 打开新增表抽屉(新增)
            handleOpenTables() {
                this.tablesStatus = 'add';
                this.visibleDrawer = true;
            },
            // 打开新增表抽屉(修改)
            handleUpdateTables(row) {
                this.tablesStatus = 'update';
                const {name, remark, databaseId, tempTableId} = row;
                this.tablesSelectData = {...row};
                this.tablesFormData.name = name;
                this.tablesFormData.remark = remark;
                this.tablesFormData.databaseId = databaseId;
                this.tablesFormData.tempTableId = tempTableId;
                this.visibleDrawer = true;
            },
            handleDeleteTables({id}) {
                this.$confirm('确定删除表?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_DatabasesTablesDelete(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    })
                })
            },
            // 把表标记为已创建
            handleSign({id}) {
                this.$confirm('确定把表标记为已创建?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_DatabasesTablesSign(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    })
                })
            },
            // 创建表
            handleCreation({id}) {
                this.$confirm('确定创建表?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_DatabasesTablesCreation(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    })
                })
            },
            // 新增表抽屉确认事件
            handleDrawerSure() {
                this.$refs['tablesForm'].validate((valid) => {
                    if (valid) {
                        const {tablesStatus} = this; // add新增，update修改
                        const {id: databaseId} = this.selectData;
                        const {id, version} = this.tablesSelectData;
                        const postData = {
                            ...this.tablesFormData
                        };
                        if (tablesStatus === 'add') {
                            postData.databaseId = databaseId
                        } else {
                            postData.id = id
                        }
                        const promiseRes = tablesStatus === 'add' ? Api_DatabasesTablesAdd(postData) : Api_DatabasesTablesUpdate(id, {
                            ...postData,
                            version
                        });
                        const loading = this.$openLoading();
                        promiseRes.then(msg => {
                            this.visibleDrawer = false;
                            this.$message.success(msg);
                            this.getList();
                            this.onDrawerClose();
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        })
                    }
                })
            },
            // 新增表抽屉关闭时
            onDrawerClose() {
                this.$refs['tablesForm'].resetFields();
                this.tablesFormData.databaseId = ''
                this.tablesFormData.tempTableId = ''
            },
            // 打开字段维护弹框
            handleOpenField(row) {
                this.tablesSelectData = row;
                this.fieldsTitle = row.name;
                this.$refs.fields.openModel(row.id, this.databaseId)
            },
            beforeClose(done) {
                this.$confirm(wordTips.drawerLeaveTip, '提示', {
                    type: 'warning'
                }).then(() => {
                    done();
                })
            },
            close() {
                // this.$refs.searchForm.resetFields();
            }
        }
    }
</script>

<style scoped lang="scss">
    .page-content {
        padding: 0;

        .page-content-body {
            min-height: 300px;
        }
    }
</style>
