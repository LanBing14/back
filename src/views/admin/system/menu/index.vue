<template>
    <div class="app-container">
        <PageHead
            :action-btns="actionBtnsTop"
            title="菜单列表"
        />
        <div class="page-content">
            <a-row :gutter="20" class="left-right-wrap">
                <a-col :span="6">
                    <div class="bg-white pd-15 tree-minheight">
                        <a-input-search
                            v-model="filterText"
                            class="filterInput"
                            placeholder="输入关键字进行过滤"
                        />
                        <Tree
                            ref="tree"
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
                        <a-form-item
                            label="上级菜单："
                        >
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
                                placeholder="菜单名称"
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
                                @click="handleReset"
                            >
                                重置
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <div class="page-content-body">
                        <TableWrapper
                            ref="child"
                            :fetch-data-fn="Api_MenuFetchList"
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
                    ref="refCreateUpdateModel"
                    :model-status="modelStatus"
                    :select-data="selectData"
                    :parent-data="parentData"
                    @getList="getList"
                    @getDepTree="getDepTree"
                />
        <!--授权-->
                <Authority
                    ref="refAuthorityModel"
                    :select-data="selectData"
                    @getList="getList"
                    @getDepTree="getDepTree"
                />
    </div>
</template>
<script type="text/jsx">
    import PageHead from '@/components/PageHead';
    import Tree from '@/components/Tree';
    import TableWrapper from '@/components/TableWrapper';
    import CreateUpdate from './CreateUpdate';
    import Authority from './Authority';
    import Button from '@/components/Button';

    import {
        Api_MenuFetchList, // 查询菜单列表
        Api_MenuFetchTree, // 查询菜单树
        Api_MenuDel // 删除菜单
    } from '@/api/admin/system/index';

    export default {
        name: 'Menus',
        components: {PageHead, TableWrapper, CreateUpdate, Authority, Tree},
        data() {
            return {
                Api_MenuFetchList,
                form: this.$form.createForm(this),
                formDecorator: {
                    name: ['name']
                },

                listQuery: {
                    pid: undefined,
                    name: undefined
                },
                modelStatus: '', // 模态框标题
                list: [], // 主列表数据
                treeLoading: false,
                treeData: [], // 菜单树数据
                treeProps: {// 菜单树的显示规则
                    children: 'children',
                    label: 'label'
                },
                selectData: undefined, // 选择的数据
                parentData: undefined, // 上级的数据
                treeTag: undefined, // 选中左侧时展示的标签
                isShowTag: false,
                filterText: undefined, // 左侧筛选过滤值

                tableCol: [{
                    key: 'name',
                    label: '菜单名称',

                }, {
                    key: 'sequence',
                    label: '顺序'
                }, {
                    key: 'icon',
                    label: '图标',
                    render: (data) => {
                        return (<i class={'iconfont ' + data}/>);
                    }
                }, {
                    key: 'permissions',
                    label: '权限名称',
                    props: {
                        'showOverflowTooltip': true
                    },
                    render: (data) => {
                        return data.map(item => {
                            return item.name;
                        }).join('、');
                    }
                }, {
                    key: null,
                    label: '操作',
                    align: 'center',
                    width: 150,
                    render: (data, row) => {
                        return [
                            <Button
                                iconClass='icon-fork'
                                row={row} text='授权'
                                click={this.handleAuthority.bind(this)}/>,
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
                }],
                // 按钮
                actionBtnsTop: [{
                    text: '新增根菜单',
                    icon: 'plus',
                    click: this.handleCreateRoot
                }],
                actionBtnsTable: [{
                    text: '新增子菜单',
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
            // 获取主列表数据
            getList(flag) {
                this.listQuery = {
                    ...this.listQuery,
                    ...this.form.getFieldsValue()
                };
                this.$nextTick(() => {
                    this.$refs.child.fetchData(flag);
                })
            },
            // 获取左侧菜单树数据
            getDepTree() {
                this.treeLoading = true;
                Api_MenuFetchTree().then(res => {
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
                } else {
                    this.parentData = undefined;
                    this.listQuery.pid = undefined;
                    this.treeTag = '';
                }
                this.$nextTick(() => {
                    this.getList();
                });
            },
            // 菜单树筛选事件
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            // 打开新增根菜单界面
            handleCreateRoot() {
                this.modelStatus = 'root';
                this.$refs.refCreateUpdateModel.openModel('root');
            },
            // 打开新增子菜单界面
            handleCreateChild() {
                if (!this.parentData) {
                    this.$message.warning('请先选择要新增的上级菜单！');
                    return;
                }
                this.modelStatus = 'childAdd';
                this.$refs.refCreateUpdateModel.openModel('child', 'add');
            },

            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'childUpdate';
                this.$nextTick(() => {
                    this.$refs.refCreateUpdateModel.openModel('child', 'update');
                });
            },
            // 授权
            handleAuthority(row) {
                this.selectData = row;
                this.$refs.refAuthorityModel.openModel();
            },

            // 删除菜单
            handleDel(row) {
                this.$confirm('确定删除该菜单?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_MenuDel(row.id).then(msg => {
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
