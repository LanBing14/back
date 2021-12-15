<template>
    <div class="app-container">
        <PageHead :action-btns="actionBtnsTop"/>
        <div class="page-content">
            <a-row :gutter="20" class="left-right-wrap">
                <a-col :span="6">
                    <div class="pd-15 tree-minheight">
                        <a-input
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
                            label="上级栏目："
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
                                v-decorator="['name']"
                                placeholder="栏目名称"
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
                            >
                                查询
                            </a-button>
                            <a-button
                                class="filter-item"
                                icon="icon iconfont icon-undo"
                                @click="handleReset('searchForm')"
                            >
                                重置
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <div class="page-content-body">
                        <TableWrapper
                            ref="child"
                            :fetch-data-fn="Api_ChannelsFetchList"
                            :query="listQuery"
                            :columns="tableCol"
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
    import Tree from '@/components/Tree';
    import PageHead from '@/components/PageHead';
    import TableWrapper from '@/components/TableWrapper';
    import CreateUpdate from './CreateUpdate';
    import Button from '@/components/Button';
    import {
        Api_ChannelsFetchList, // 查询栏目列表
        Api_ChannelsFetchTree, // 查询栏目树
        Api_ChannelsDel, // 删除栏目
        Api_ChannelsPublish, // 发布栏目
        Api_ChannelsUnPublish // 撤消栏目
    } from '@/api/admin/cms/index';

    export default {
        name: 'Channels',
        components: {PageHead, TableWrapper, CreateUpdate, Tree},
        data() {
            return {
                Api_ChannelsFetchList,
                form: this.$form.createForm(this),

                listQuery: {
                    pid: undefined,
                    name: undefined
                },
                modelStatus: 'add', // 模态框标题
                list: [], // 主列表数据
                treeData: [], // 栏目树数据
                treeLoading: false,
                treeProps: {// 栏目树的显示规则
                    children: 'children',
                    label: 'label'
                },
                selectData: undefined, // 选择的数据
                parentData: undefined, // 上级的数据
                treeTag: undefined,
                isShowTag: false,
                filterText: undefined, // 左侧筛选过滤值

                tableCol: [
                    {
                        key: 'name',
                        label: '栏目名称'
                    }, {
                        key: 'path',
                        label: '路径'
                    }, {
                        key: 'sequence',
                        label: '顺序'
                    }, {
                        key: null,
                        label: '操作',
                        align: 'center',
                        width: 150,
                        render: (data, row) => {
                            const {publishStatus} = row;
                            return [
                                publishStatus === '0' && <Button
                                    iconClass='icon-pushpin'
                                    iconColor='green'
                                    row={row}
                                    text='发布'
                                    click={this.onPublish.bind(this)}/>,
                                publishStatus !== '0' && <Button
                                    iconClass='icon-pushpin'
                                    iconColor='green'
                                    row={row}
                                    text='撤消'
                                    click={this.onUnPublish.bind(this)}/>,
                                publishStatus === '0' && <Button
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
                actionBtnsTop: [
                    {
                        text: '新增根栏目',
                        icon: 'icon-plus',
                        click: this.handleCreateRoot
                    }],
                actionBtnsTable: [
                    {
                        text: '新增子栏目',
                        icon: 'icon-plus',
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
                });
            },
            // 获取左侧栏目树数据
            getDepTree() {
                this.treeLoading = true;
                Api_ChannelsFetchTree().then(res => {
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
                e.preventDefault();
                this.parentData = undefined;
                this.listQuery.pid = undefined;
                this.treeTag = '';
                this.isShowTag = false;
                this.$nextTick(() => {
                    this.getList();
                });
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
            // 打开新增根栏目界面
            handleCreateRoot() {
                this.modelStatus = 'root';
                this.$refs.createUpdateModel.openModel('root');
            },
            // 打开新增子栏目界面
            handleCreateChild() {
                if (!this.isShowTag) {
                    this.$message.warning('请先选择要新增的上级栏目！');
                    return;
                }
                this.modelStatus = 'childAdd';
                this.$refs.createUpdateModel.openModel('child', 'add');
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'childUpdate';
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel('child', 'update');
                });
            },
            // 菜单树筛选事件
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            // 删除栏目
            handleDel({id}) {
                this.$confirm('确定删除该栏目?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ChannelsDel(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        this.getDepTree();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    });
                });
            },
            // 发布栏目
            onPublish(row) {
                this.$confirm('确定发布该栏目?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ChannelsPublish(row.id).then(msg => {
                        this.$message.success(msg);
                        this.$store.dispatch('getNoticeNums');
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    });
                });
            },
            // 撤消栏目
            onUnPublish(row) {
                this.$confirm('确定撤消该公告?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ChannelsUnPublish(row.id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
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

        .pagination-container {
            background-color: transparent;
        }
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node__content:hover {
        background-color: #ddecf4;
    }
</style>
