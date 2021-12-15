<template>
    <div class="app-container">
        <PageHead>
            <a-form
                ref="searchForm"
                :form="form"
                layout="inline"
                class="demo-form-inline searchForm-wrap"
>
                <a-form-item prop="id">
                    <a-input
                        v-decorator="['id']"
                        placeholder="编号"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['name']"
                        placeholder="标题"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['channelName']"
                        placeholder="栏目名称"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['author']"
                        placeholder="作者"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['publisher']"
                        placeholder="发布人"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item prop="top">
                    <a-select v-decorator="['top']" placeholder="是否置顶" filterable>
                        <a-select-option value="0" >否</a-select-option>
                        <a-select-option value="1" >是</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-select v-decorator="['hot']" placeholder="是否热点" filterable>
                        <a-select-option value="0" >否</a-select-option>
                        <a-select-option value="1" >是</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-select v-decorator="['publishStatus']" placeholder="发布状态" filterable>
                        <a-select-option value="0" >未发布</a-select-option>
                        <a-select-option value="1" >待发布</a-select-option>
                        <a-select-option value="2" >已发布</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-select v-decorator="['type']" placeholder="内容类型" filterable>
                        <a-select-option value="0" >普通</a-select-option>
                        <a-select-option value="1" >图片集</a-select-option>
                        <a-select-option value="2" >视频</a-select-option>
                        <a-select-option value="3" >音频</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-date-picker
                        v-decorator="['startDate',{initialValue:null}]"
                        :disabledDate="disabledStartDate"
                        format="YYYY-MM-DD"
                        placeholder="开始日期"
                    />
                </a-form-item>
                <a-form-item>
                    <a-date-picker
                        v-decorator="['endDate',{initialValue:null}]"
                        :disabledDate="disabledEndDate"
                        format="YYYY-MM-DD"
                        placeholder="结束日期"
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
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableList
                    ref="child"
                    listStyle
                    :fetch-data-fn="Api_ContentsFetchList"
                    :query="listQuery"
                    :columns="tableCol"
                    :current-change="currentChange"
                    :toolActions="actionBtns"
                    class="table"
                />
            </div>
        </div>

        <!--新增或修改-->
        <CreateUpdate
            ref="createUpdateModel"
            :model-status="modelStatus"
            :select-data="selectData"
            @getList="getList"
        />
    </div>
</template>
<script type="text/jsx">
    import PageHead from '@/components/PageHead'
    import TableList from '@/components/TableWrapper/TableList'
    import CreateUpdate from './CreateUpdate'
    import Button from '@/components/Button'
    import {
        Api_ContentsFetchList, // 查询内容列表
        Api_ContentsDel, // 删除内容
        Api_ContentsPublish, // 发布内容
        Api_ContentsUnPublis // 撤消内容
    } from '@/api/admin/cms/index'

    export default {
        name: 'Content',
        components: {PageHead, TableList, CreateUpdate},
        data() {
            return {
                Api_ContentsFetchList,
                form: this.$form.createForm(this),

                listQuery: {
                    id: '', // 内容编号
                    title: '', // 内容标题
                    author: '', // 内容作者
                    top: '', // 是否置顶{0：否，1：是}
                    hot: '', // 是否热点{0：否，1：是}
                    publishStatus: '', // 发布状态{0：未发布，1：待发布，2：已发布}
                    publisher: '', // 发布人
                    channelName: '', // 栏目名称
                    type: '', // 内容类型{0：普通，1：图片集，2：视频，3：音频}
                    startTime: '', // 发布开始时间
                    endTime: '' // 发布结束时间
                },
                modelStatus: 'add', // 模态框标题
                list: [], // 主列表数据
                selectData: undefined, // 选择的数据

                tableCol: [
                    [{
                        key: 'title',
                        label: false,
                        controlStyle: {
                            fontSize: '18px',
                            color: '#333',
                            marginLeft: 0
                        }
                    }, {
                        key: 'author',
                        label: '作者:',
                        style: {
                            marginLeft: '30px'
                        }
                    }],
                    [{
                        key: 'id',
                        label: '编号:',
                        width: '25%'
                    }, {
                        key: 'top',
                        label: '是否置顶:',
                        width: '25%',
                        render(h, data) {
                            return data === '1' ? '是' : '否';
                        }
                    }, {
                        key: 'top',
                        label: '是否热点:',
                        width: '25%',
                        render(h, data) {
                            return data === '1' ? '是' : '否';
                        }
                    }, {
                        key: 'publishStatus',
                        label: '发布状态:',
                        width: '25%',
                        render(h, data) {
                            if (data === '0') {
                                return '未发布';
                            } else if (data === '1') {
                                return '待发布';
                            } else {
                                return '已发布';
                            }
                        }
                    }, {
                        key: 'publisherName',
                        label: '发布人:',
                        width: '25%'
                    }, {
                        key: 'channelName',
                        label: '栏目名称:',
                        width: '25%'
                    }, {
                        key: 'type',
                        label: '内容类型:',
                        width: '25%',
                        render(h, data) {
                            if (data === '0') {
                                return '普通';
                            } else if (data === '1') {
                                return '图片集';
                            } else if (data === '1') {
                                return '视频';
                            } else {
                                return '音频';
                            }
                        }
                    }, {
                        key: 'releaseTime',
                        label: '发布时间:',
                        width: '25%',
                        render: (h, data) => {
                            return this.$dateFormat(data)
                        }
                    }],
                    [{
                        key: null,
                        label: false,
                        width: '100%',
                        align: 'right',
                        render: (h, data, row) => {
                            const {publishStatus} = row;
                            return [
                                publishStatus === '0' && <Button
                                    isIcon={false}
                                    iconClass='icon-pushpin'
                                    row={row}
                                    text='发布'
                                    type='text'
                                    click={this.onPublish.bind(this)}/>,
                                publishStatus !== '0' && <Button
                                    isIcon={false}
                                    iconClass='icon-pushpin'
                                    row={row}
                                    text='撤消'
                                    type='text'
                                    click={this.onUnPublish.bind(this)}/>,
                                publishStatus === '0' && <Button
                                    isIcon={false}
                                    iconClass='icon-edit-square'
                                    iconColor='green'
                                    row={row}
                                    text='修改'
                                    type='text'
                                    click={this.handleUpdate.bind(this)}/>,
                                <Button
                                    isIcon={false}
                                    iconClass='icon-delete'
                                    iconColor='red'
                                    row={row}
                                    text='删除'
                                    type='text'
                                    click={this.handleDel.bind(this)}/>
                            ]
                        }
                    }]],
                // 按钮
                actionBtns: [{
                    text: '新增普通内容',
                    icon: 'plus',
                    click: this.handleCreateText
                }, {
                    text: '新增图文内容',
                    icon: 'plus',
                    click: this.handleCreateImageText
                }, {
                    text: '新增视频内容',
                    icon: 'plus',
                    click: this.handleCreateVideo
                }],
                pickerOptionsStart: {
                    disabledDate: (time) => {
                        const {endDate} = this.listQuery;
                        if (endDate) {
                            return time.getTime() > new Date(endDate).getTime();
                        } else {
                            return false;
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: (time) => {
                        const {startDate} = this.listQuery;
                        if (startDate) {
                            return time.getTime() < new Date(startDate).getTime();
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            // 获取主列表数据
            getList() {
                this.$refs.child.fetchData()
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList()
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList()
            },
            // 重置form表单
            resetForm() {
                this.form.resetFields();
            },
            // 表格行改变时
            currentChange(data) {
                this.selectData = data || {};
            },
            // 打开新增内容界面(普通)
            handleCreateText() {
                this.modelStatus = 'add';
                this.$refs.createUpdateModel.openModel('add', '0')
            },
            // 打开新增内容界面(图文)
            handleCreateImageText() {
                this.modelStatus = 'add';
                this.$refs.createUpdateModel.openModel('add', '1')
            },
            // 打开新增内容界面(视频)
            handleCreateVideo() {
                this.modelStatus = 'add';
                this.$refs.createUpdateModel.openModel('add', '2')
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'update';
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel('update', row.type)
                })
            },
            // 删除内容
            handleDel(row) {
                this.$confirm('确定删除该内容?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ContentsDel(row.id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    })
                })
            },
            // 发布内容
            onPublish(row) {
                this.$confirm('确定发布该内容?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ContentsPublish(row.id).then(msg => {
                        this.$message.success(msg);
                        this.$store.dispatch('getNoticeNums')
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    })
                })
            },
            // 撤消内容
            onUnPublish(row) {
                this.$confirm('确定撤消?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ContentsUnPublis(row.id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    })
                })
            },
            disabledStartDate (startValue) {
                const endValue = this.form.getFieldValue('endDate');
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledEndDate (endValue) {
                const startValue = this.form.getFieldValue('startDate');
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            }
        }

    }
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

    .tableWrapper /deep/ .tableListStyle {
        margin: 0;
    }

    .page-content .page-content-body {
        background-color: #F5F6FA;
        padding: 15px;
        border: 0;

        /deep/ .pagination-container {
            background-color: transparent;
        }
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node__content:hover {
        background-color: #ddecf4;
    }
    .table /deep/ .ant-btn-text{
        border-color: transparent;
        color: #4b9df3;
        background: transparent;
    }
</style>
