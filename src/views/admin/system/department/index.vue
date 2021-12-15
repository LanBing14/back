<template>
    <div class="app-container">
        <PageHead
            :action-btns="actionBtnsTop"
        >
        </PageHead>
        <div class="page-content">
            <a-row :gutter="20" class="left-right-wrap">
                <a-col :span="6">
                    <div class="pd-15 tree-minheight">
                        <a-input-search
                            v-model="filterText"
                            class="filterInput"
                            placeholder="输入关键字进行过滤"
                        />
                        <Tree
                            ref="depTree"
                            :data="treeData"
                            autoExpandParent
                            defaultExpandAll
                            @select="handleNodeClick"
                        />
                    </div>
                </a-col>
                <a-col :span="18">
                    <a-form
                        ref="searchForm"
                        :form="form"
                        layout="inline"
                        class="demo-form-inline searchForm-wrap"
                    >
                        <a-form-item label="上级部门：">
                            <div>
                                <a-tag
                                    v-if="!isShowTag"
                                >
                                    暂未选择
                                </a-tag>
                                <a-tag
                                    v-else
                                    color="blue"
                                    closable
                                    @close="handleTagClose"
                                >
                                    {{ treeTag }}
                                </a-tag>
                            </div>
                        </a-form-item>
                        <a-form-item>
                            <a-input
                                v-decorator="formDecorator.name"
                                placeholder="部门名称"
                                class="filter-item"
                                @keyup.enter.native="handleFilter"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-input
                                v-decorator="formDecorator.code"
                                placeholder="部门编码"
                                class="filter-item"
                                @keyup.enter.native="handleFilter"
                            />
                        </a-form-item>
                        <a-form-item class="btns">
                            <a-button
                                class="filter-item"
                                type="primary"
                                icon="search"
                                @click="handleFilter"
                            >
                                查询
                            </a-button>
                            <a-button
                                class="filter-item"
                                icon="undo"
                                @click="handleReset('searchForm')"
                            >
                                重置
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <div class="page-content-body">
                        <TableWrapper
                            ref="child"
                            :fetch-data-fn="Api_DepartmentsFetchList"
                            :query="listQuery"
                            :columns="tableCol"
                            :current-change="currentChange"
                            :toolActions="actionBtnsTable"
                        />
                    </div>
                </a-col>
            </a-row>
        </div>

        <!--新增或修改-->
                <CreateUpdate
                    ref="createUpdateModel"
                    :model-status="modelStatus"
                    :select-data="selectData"
                    :parent-data="parentData"
                    @getList="getList"
                    @getDepTree="getDepTree"
                />
    </div>
</template>
<script type="text/jsx">
    import PageHead from '@/components/PageHead';
    import waves from '@/directive/waves'; // Waves directive
    import Tree from '@/components/Tree';
    import TableWrapper from '@/components/TableWrapper';
    import CreateUpdate from './CreateUpdate';
    import Button from '@/components/Button';
    import {
        Api_DepartmentsFetchList, // 查询部门列表
        Api_DepartmentsFetchTree, // 查询部门树
        Api_DepartmentsDel // 删除部门
    } from '@/api/admin/system/index';

    export default {
        name: 'Department',
        directives: {waves},
        components: {PageHead, TableWrapper, CreateUpdate, Tree},
        data() {
            return {
                selectedKeys: [],
                form: this.$form.createForm(this),
                formDecorator: {
                    name: ['name'],
                    code: ['code']
                },

                listQuery: {
                    pid: undefined,
                    name: undefined,
                    code: undefined
                },
                modelStatus: 'add', // 模态框标题
                list: [], // 主列表数据
                treeData: [], // 部门树数据
                treeLoading: false,
                treeProps: {// 部门树的显示规则
                    children: 'children',
                    label: 'label'
                },
                selectData: undefined, // 选择的数据
                parentData: undefined, // 上级的数据
                treeTag: undefined,
                isShowTag: false,
                filterText: undefined, // 左侧筛选过滤值

                tableCol: [{
                    key: 'name',
                    label: '部门名称'
                }, {
                    key: 'code',
                    label: '部门编码'
                }, {
                    key: 'sequence',
                    label: '顺序'
                }, {
                    key: null,
                    label: '操作',
                    align: 'center',
                    width: 150,
                    render: (data, row) => {
                        return [
                            <Button
                                iconClass='icon-edit-square'
                                iconColor='green'
                                row={row}
                                text='修改'
                                type='success'
                                click={this.handleUpdate.bind(this)}/>,
                            <Button
                                iconClass='icon-delete'
                                iconColor='red'
                                row={row}
                                text='删除'
                                type='danger'
                                click={this.handleDel.bind(this)}/>
                        ];
                    }
                }
                    // , {
                    //     key: 'type',
                    //     label: '部门类型',
                    //     render: function (h, data, {type}) {
                    //         if (!type) {
                    //             return ''
                    //         }
                    //         return type === '0' ? '行政区划' : '职能部门'
                    //     }
                    // }
                ],
                // 按钮
                actionBtnsTop: [{
                    text: '新增根部门',
                    icon: 'plus',
                    click: this.handleCreateRoot
                }],
                actionBtnsTable: [{
                    text: '新增子部门',
                    icon: 'plus',
                    click: this.handleCreateChild
                }]
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.$nextTick(() => {
                this.getList();
            });
            this.getDepTree();
        },
        methods: {
            Api_DepartmentsFetchList,
            // 获取主列表数据
            getList(pageReset) {
                this.listQuery = {
                    ...this.listQuery,
                    ...this.form.getFieldsValue()
                };
                this.listQuery.saasCode = this.$store.getters.selectSaasCode;
                this.$nextTick(() => {
                    this.$refs.child.fetchData(pageReset);
                });
            },
            // 获取左侧部门树数据
            getDepTree() {
                this.treeLoading = true;
                Api_DepartmentsFetchTree('', this.$store.getters.selectSaasCode).then(res => {
                    this.treeData = this.$turnTreeData(res);
                    this.treeLoading = false;
                }).catch(() => {
                    this.treeLoading = false;
                });
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
            // 标签关闭时
            handleTagClose(e) {
                e.preventDefault()
                this.parentData = undefined;
                this.listQuery.pid = undefined;
                this.treeTag = '';
                this.isShowTag = false;
                this.selectedKeys = []
                this.$nextTick(() => {
                    this.getList();
                });
            },
            // 表格行改变时
            currentChange(data) {
                this.selectData = data || {};
            },
            // tree节点点击事件
            handleNodeClick(_, {selected, node: {dataRef}}) {
                this.isShowTag = selected;
                if (selected) {
                    this.parentData = {...dataRef};
                    this.listQuery.pid = dataRef.id;
                    this.treeTag = dataRef.label;
                    this.selectedKeys = [dataRef.id]
                } else {
                    this.parentData = undefined;
                    this.listQuery.pid = undefined;
                    this.treeTag = '';
                    this.selectedKeys = []
                }
                this.$nextTick(() => {
                    this.getList();
                });
            },
            // 打开新增根部门界面
            handleCreateRoot() {
                this.modelStatus = 'root';
                this.$refs.createUpdateModel.openModel('root');
            },
            // 打开新增子部门界面
            handleCreateChild() {
                if (!this.parentData) {
                    this.$message.warning('请先选择要新增的上级部门！');
                    return;
                }
                this.modelStatus = 'childAdd';
                this.$refs.createUpdateModel.openModel('child', 'add');
            },
            // 菜单树筛选事件
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'childUpdate';
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel('child', 'update');
                });
            },
            // 删除部门
            handleDel(row) {
                this.$confirm('确定删除该部门?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_DepartmentsDel(row.id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        this.getDepTree();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    });
                });
            }
        }

    };
</script>

<style scoped lang="scss">
    @import '~@/styles/variables.scss';

    /deep/ .search-p {
        .el-form-item__label {
            padding-right: 2px;
        }
    }

    .filterInput {
        margin-bottom: 10px;
    }

    .left-right-wrap {
        display: flex;
        height: 100%;
    }

    .tree-minheight {
        min-height: 100%;
        background-color: $bgGreey;
    }

    .filterTree {
        background-color: transparent;
    }

    .page-content .page-content-body {
        min-height: calc(100% - 70px);
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node__content:hover {
        background-color: #ddecf4;
    }
</style>
