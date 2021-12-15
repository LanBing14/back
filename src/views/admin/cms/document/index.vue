<template>
    <div class="app-container">
        <PageHead>
            <a-form
                ref="searchForm"
                :form="form"
                layout="inline"
                class="demo-form-inline searchForm-wrap"
            >
                <a-form-item>
                    <a-input
                        v-decorator="['tittle']"
                        placeholder="文档名称"
                        @keyup.enter.native="handleFilter"
                    />
                </a-form-item>
                <a-form-item>
                    <a-select
                        v-decorator="['publishStatus']"
                        placeholder="发布状态"
                        clearable
                    >
                        <a-select-option
                            v-for="item in enableOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        type="primary"
                        icon="search"
                        class="filter-item"
                        @click="handleFilter"
                    >
                        查询
                    </a-button>
                    <a-button
                        icon="undo"
                        class="filter-item"
                        @click="handleReset()"
                    >
                        重置
                    </a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_DocumentFetchList"
                    :query="listQuery"
                    :columns="tableCol"
                    :toolActions="actionBtns"
                />
            </div>
        </div>

        <!--新增或修改-->
        <CreateUpdate
            ref="createUpdateModel"
            :model-status="modelStatus"
            :model-visible="addModelVisible"
            :select-data="selectData"
            @getList="getList"
        />
    </div>
</template>
<script type="text/jsx">
import PageHead from '@/components/PageHead'
import TableWrapper from '@/components/TableWrapper'
import Button from '@/components/Button'
import CreateUpdate from './CreateUpdate'
import waves from '@/directive/waves' // Waves directive
import { Api_comboboxDict } from '@/api/admin/index'
import {
    Api_DocumentFetchList,
    Api_DocumentDel,
    Api_DocumentPublish,
    Api_DocumentUnPublish,
    Api_DocumentDownloadCount
} from '@/api/admin/cms/index'

export default {
    name: 'Document',
    directives: { waves },
    components: { PageHead, CreateUpdate, TableWrapper },
    data () {
        return {
            form: this.$form.createForm(this),

            // 页面按钮
            actionBtns: [
                {
                    text: '新增文档',
                    icon: 'icon-plus',
                    click: this.handleCreate
                }],
            // 列表列的字段定义
            tableCol: [
                {
                    key: 'title',
                    label: '文档名称'
                }, {
                    key: 'publishStatus',
                    label: '发布状态',
                    align: 'center',
                    render: (data) => {
                        const findRes = this.enableOptions.find(i => i.value === data)
                        return findRes ? findRes.label : ''
                    }
                }, {
                    key: 'publisherName',
                    label: '发布人'
                }, {
                    key: 'releaseTime',
                    label: '发布时间'
                }, {
                    key: 'downloadTimes',
                    label: '下载次数'
                }, {
                    key: 'createDate',
                    label: '创建时间'
                }, {
                    key: null,
                    label: '操作',
                    align: 'center',
                    width: 150,
                    render: (data, row) => {
                        const { publishStatus } = row
                        return [
                            <Button
                                iconClass='icon-download'
                                iconColor='green'
                                row={ row }
                                text='下载'
                                type='success'
                                click={ this.onDownload.bind(this) }/>,
                            (publishStatus === '0' || publishStatus === '3') && <Button
                                iconClass='icon-pushpin'
                                iconColor='green'
                                row={ row }
                                text='发布'
                                type='success'
                                click={ this.onPublish.bind(this) }/>,
                            publishStatus === '2' && <Button
                                iconClass='icon-disconnect'
                                iconColor='green'
                                row={ row }
                                text='撤消'
                                type='success'
                                click={ this.onUnPublish.bind(this) }/>,
                            (publishStatus === '0' || publishStatus === '3') && <Button
                                iconClass='icon-edit-square'
                                iconColor='green'
                                row={ row }
                                text='修改'
                                type='success'
                                click={ this.handleUpdate.bind(this) }/>,
                            <Button
                                iconClass='icon-delete'
                                iconColor='red'
                                row={ row }
                                text='删除'
                                type='danger'
                                click={ this.handleDel.bind(this) }/>
                        ]
                    }
                }],
            // 列表数据
            list: null,
            // 列表的查询条件
            listQuery: {
                name: undefined,
                enable: undefined
            },
            selectId: undefined, // 选中数据的id
            selectData: undefined, // 选中的数据
            modelStatus: 'add', // 新增或修改model的标题
            addModelVisible: false, // 新增或修改model的显示状态
            enableOptions: []// 下拉框的内容
        }
    },
    created () {
        Api_comboboxDict('publish_status').then(res => {
            this.enableOptions = res
        })
        this.$nextTick(() => {
            this.getList()
        })
    },
    methods: {
        Api_DocumentFetchList,
        // 获取主列表数据
        getList (pageReset) {
            this.listQuery = this.form.getFieldsValue();
            this.$nextTick(() => {
                console.log(this.listQuery);
                this.$refs.child.fetchData(pageReset);
            });
        },
        // 根据查询条件获取数据
        handleFilter () {
            this.getList(true)
        },
        // 重置查询条件
        handleReset () {
            this.form.resetFields()
            this.getList(true)
        },
        // 打开新增文档界面
        handleCreate () {
            this.modelStatus = 'add'
            this.$refs.createUpdateModel.openModel()
        },
        // 打开修改界面
        handleUpdate (row) {
            this.selectData = row
            this.modelStatus = 'update'
            this.$nextTick(() => {
                this.$refs.createUpdateModel.openModel(row.id)
            })
        },
        // 删除文档
        handleDel (row) {
            this.$confirm('确定删除该文档?', '提示', {
                type: 'warning'

            }).then(() => {
                const loading = this.$openLoading()
                Api_DocumentDel(row.id).then(msg => {
                    this.$message.success(msg)
                    this.getList()
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            })
        },

        // 发布
        onPublish (row) {
            this.$confirm('确定发布?', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$openLoading()
                Api_DocumentPublish(row.id).then(msg => {
                    this.$message.success(msg)
                    this.getList()
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            })
        },
        // 撤消
        onUnPublish (row) {
            this.$confirm('确定撤消发布?', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$openLoading()
                Api_DocumentUnPublish(row.id).then(msg => {
                    this.$message.success(msg)
                    this.getList()
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            })
        },
        // 下载文件
        onDownload (row) {
            const { id, url } = row
            const a = document.createElement('a')
            a.href = url
            a.target = '_blank'
            a.setAttribute('download', '')
            a.click()
            Api_DocumentDownloadCount(id).then(() => {
                this.getList()
            })
        }
    }

}
</script>

<style scoped>

</style>
