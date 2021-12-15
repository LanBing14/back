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
                    <a-input v-decorator="['id']" placeholder="表单id"/>
                </a-form-item>
                <a-form-item>
                    <a-input v-decorator="['name']" placeholder="表单名称"/>
                </a-form-item>
                <a-form-item>
                    <a-input v-decorator="['title']" placeholder="页面标题"/>
                </a-form-item>
                <a-form-item>
                    <a-select
                        v-decorator="['type']"
                        placeholder="表单类型"
                        clearable
                        filterable
                    >
                        <a-select-option
                            v-for="el in typeOptions"
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
                    <div class="filter-item">
                        <a-upload
                            class="avatar-uploader"
                            :action="Api_FormImport()"
                            :data="leadData"
                            :showUploadList="false"
                            :before-upload="beforeAvatarUpload"
                            @change="handleLeadSuccess"
                        >
                            <a-button
                                v-loading="leadLoading"
                                icon="import"
                            >
                                更新建模
                            </a-button>
                        </a-upload>
                    </div>
                    <div class="filter-item">
                        <a-button
                            class="filter-item"
                            icon="export"
                            @click="handleExport"
                        >
                            导出建模
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_FormGetList"
                    :query="listQuery"
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
        <FormBuildList
            ref="buildModelList"
            :select-data="selectData"
            @getList="getList"
        />
<!--        <FormBuildListEdit-->
<!--            ref="buildModelListEdit"-->
<!--            :select-data="selectData"-->
<!--            @getList="getList"-->
<!--        />-->
<!--        <FormBuildView-->
<!--            ref="buildModelView"-->
<!--            :select-data="selectData"-->
<!--            @getList="getList"-->
<!--        />-->
    </div>
</template>
<script type="text/jsx">
    import PageHead from '@/components/PageHead';
    import TableWrapper from '@/components/TableWrapper';
    import CreateUpdate from './CreateUpdate';
    import FormBuildList from './FormBuildList';
    import FormBuildListEdit from './FormBuildListEdit';
    import FormBuildView from './FormBuildView';
    import waves from '@/directive/waves'; // Waves directive
    import Button from '@/components/Button';
    import {m} from '@/api/index';
    import {
        Api_comboboxDict
    } from '@/api/admin/index';
    import {
        Api_FormGetList, // 表单分页列表
        Api_FormDel, // 删除表单
        Api_FormFormsCopy,
        Api_FormExport,
        Api_FormImport
    } from '@/api/admin/m/index';

    export default {
        name: 'Form',
        directives: {waves},
        components: {PageHead, CreateUpdate, TableWrapper, FormBuildList, FormBuildListEdit, FormBuildView},
        data() {
            return {
                form: this.$form.createForm(this),

                typeOptions: [], // 表单类型下拉框数据
                sassData: [],
                tableCol: [
                    {
                        key: 'id',
                        label: '表单id'
                    }, {
                        key: 'name',
                        label: '表单名称'
                    }, {
                        key: 'title',
                        label: '页面标题'
                    }, {
                        key: 'typeDesc',
                        label: '表单类型'
                    }, {
                        key: null,
                        label: '操作',
                        align: 'center',
                        width: 150,
                        render: (data, row) => {
                            const {status} = row;
                            return [
                                status === '0' && <Button
                                    iconClass='icon-monitor'
                                    iconColor='green'
                                    row={row}
                                    text='建模'
                                    type='success'
                                    click={this.handleBuild.bind(this)}/>,
                                <Button
                                    iconClass='icon-file-copy'
                                    iconColor='green'
                                    row={row}
                                    text='复制'
                                    type='success'
                                    click={this.handleCopy.bind(this)}/>,
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
                actionBtns: [
                    {
                        text: '新增',
                        icon: 'icon-plus',
                        click: this.handleCreate
                    }],
                list: null, // 列表数据
                listLoading: false, // 列表loading状态
                listQuery: {
                    id: '',
                    name: '',
                    title: '',
                    type: ''
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: 'add',
                leadLoading: false,
                leadData: {} // 导入——查询条件
            };
        },
        computed: {
            exportUrl() {
                const {id, name, title, type} = this.query;
                return Api_FormExport(id, name, title, type);
            }
        },
        created() {
            Api_comboboxDict('form_type', m).then(res => {
                this.typeOptions = res;
            });
            Api_comboboxDict('publish_status', m).then(res => {
                this.statusOptions = res;
            });
            this.$nextTick(() => {
                this.getList();
            });
        },
        methods: {
            Api_FormImport,
            Api_FormGetList,
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
            beforeAvatarUpload(file, fileList) {
                const isExcel = file.type.indexOf('vnd') === -1;
                if (isExcel) {
                    this.$message.error('请上传excel文件！');
                    // this.fileList = fileList.
                    fileList.pop();
                    return false;
                }
                return !isExcel;
            },
            // 导入
            handleLeadSuccess({file}) {
                if (file.status === 'done') {
                    const {response: {success, data, errorMessage}} = file;
                    if (success) {
                        this.$message.success(data);
                    } else {
                        this.$message.error(errorMessage);
                    }
                    this.leadLoading = false;
                } else if (file.status === 'error') {
                    this.$message.error('上传出错！');
                    this.leadLoading = false;
                } else if (file.status === 'uploading') {
                    this.leadLoading = true;
                } else {
                    this.leadLoading = false;
                }
            },
            // 导出
            handleExport() {
                const {id, name, title, type} = this.listQuery;
                const url = Api_FormExport(id, name, title, type);
                window.open(url);
            },
            // 重置form表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 打开新增表单界面
            handleCreate() {
                this.modelStatus = 'add';
                this.$refs.createUpdateModel.openModel();
            },
            // 打开修改界面
            handleUpdate(row) {
                this.selectData = row;
                this.modelStatus = 'update';
                this.$nextTick(() => {
                    this.$refs.createUpdateModel.openModel(row.id);
                });
            },
            // 删除表单
            handleDel({id}) {
                this.$confirm('确定删除该表单?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const loading = this.$openLoading();

                    Api_FormDel(id).then(msg => {
                        this.$message.success(msg);
                        this.getList();
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    });
                });
            },
            // 打开建模界面
            handleBuild(row) {
                this.selectData = row;
                this.$nextTick(() => {
                    if (row.type === '0') {
                        this.$refs.buildModelList.openModel();
                    } else if (row.type === '1') {
                        this.$refs.buildModelListEdit.openModel();
                    } else {
                        this.$refs.buildModelView.openModel();
                    }
                });
            },
            // 复制表单
            handleCopy({id}) {
                const loading = this.$openLoading();
                Api_FormFormsCopy(id).then(msg => {
                    this.$message.success(msg);
                    this.getList();
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            }
        }

    };
</script>

<style scoped lang="scss">
    .filter-item {

        .el-upload {
            width: 100%;

            button {
                width: 100%;
            }

        }
    }
</style>
