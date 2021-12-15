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
                        v-decorator="['name']"
                        placeholder="敏感词名称"
                        @keyup.enter.native="handleFilter"
                    />
                </a-form-item>
                <a-form-item>
                    <a-select
                        v-decorator="['enable']"
                        placeholder="激活状态"
                        clearable
                    >
                        <a-select-option
                            v-for="item in enableOptions"
                            :key="item.key"
                            :value="item.key"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
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
                    <a-button
                        v-waves
                        class="filter-item"
                        icon="sync"
                        @click="handleFreshen"
                    >
                        刷新
                    </a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_SensitivewordsFetchList"
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
    import PageHead from '@/components/PageHead';
    import TableWrapper from '@/components/TableWrapper';
    import Switch from '@/components/Switch';
    import Button from '@/components/Button';
    import CreateUpdate from './CreateUpdate';
    import waves from '@/directive/waves'; // Waves directive
    import {
        Api_SensitivewordsFetchList,
        Api_SensitivewordsChangeStatus,
        Api_SensitivewordsFreshenCache,
        Api_SensitivewordsDel // 删除敏感词
    } from '@/api/admin/cms/index';

    export default {
        name: 'Sensitivewords',
        directives: {waves},
        components: {PageHead, CreateUpdate, TableWrapper},
        data() {
            return {
                form: this.$form.createForm(this),

                // 页面按钮
                actionBtns: [{
                    text: '新增敏感词',
                    icon: 'icon-plus',
                    click: this.handleCreate
                }],
                // 列表列的字段定义
                tableCol: [{
                    key: 'name',
                    label: '敏感词名称'
                }, {
                    key: 'replaceValue',
                    label: '代替值'
                }, {
                    key: 'enable',
                    label: '激活状态',
                    align: 'center',
                    render: (data, row) => {
                        return (<a-switch v-model={row.enable} onchange={this.changeEnable.bind(this, row)}/>);
                    }
                }, {
                    key: 'createDate',
                    label: '创建时间'
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
                enableOptions: [{// 下拉框的内容
                    key: '1',
                    label: '启用'
                }, {
                    key: '0',
                    label: '禁用'
                }]
            };
        },
        created() {
            this.$nextTick(() => {
                this.getList();
            });
        },
        methods: {
            Api_SensitivewordsFetchList,
            // 获取主列表数据
            getList(pageReset) {
                this.listQuery = this.form.getFieldsValue();
                this.$nextTick(() => {
                    this.$refs.child.fetchData(pageReset);
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
            // 更改敏感词状态
            changeEnable(row) {
                Api_SensitivewordsChangeStatus(row.id, row.enable).then(msg => {
                    this.$message.success(msg);
                    row.version++;
                });
            },
            // 打开新增敏感词界面
            handleCreate() {
                this.modelStatus = 'add';
                this.$refs.createUpdateModel.openModel();
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'update';
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel('update');
                });
            },
            // 删除敏感词
            handleDel(row) {
                this.$confirm('确定删除该敏感词?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_SensitivewordsDel(row.id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    });
                });
            },
            // 刷新敏感词缓存
            handleFreshen() {
                Api_SensitivewordsFreshenCache().then(msg => {
                    this.$message.success(msg);
                    this.getList();
                });
            }
        }

    };
</script>

<style scoped>

</style>
