<template>
    <Drawer
        ref="drawer"
        :title="modelStatus | filterModelStatus"
        :visible.sync="visible"
        :onOk="handleSure"
        @close="onClose">
        <a-form
            ref="dataForm"
            :form="form"
        >
            <a-form-item
                v-if="modelType!=='root'"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="上级区域"
            >
                <div v-if="childDepAddUpdate==='add'">
                    <a-input
                        v-model="parentData.label"
                        disabled
                    />
                </div>
                <a-tree
                    v-loading="treeLoading"
                    v-else
                    ref="treeEdit"
                    v-decorator="formDecorator.pid"
                    :treeData="treeData"
                    checkable
                    checkStrictly
                    defaultExpandAll
                    empty-text="暂无数据"
                    @check="checkChange"
                />
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="区域名称">
                <a-input
                    v-decorator="formDecorator.name"
                    placeholder="请输入区域名称"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="区域编码">
                <a-input
                    v-decorator="formDecorator.code"
                    placeholder="请输入区域编码"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="顺序">
                <a-input
                    v-decorator="formDecorator.sequence"
                    placeholder="请输入顺序"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="区域类型">
                <a-select v-decorator="formDecorator.type" placeholder="请选择区域类型">
                    <a-select-option
                        v-for="item in typeCodeOptions"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="描述">
                <a-textarea
                    v-decorator="formDecorator.description"
                    :rows="4"
                    placeholder="请输入描述"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {Api_comboboxDict} from '@/api/admin/index'
    import {
        Api_AreaFetchTreeForUpdate,
        Api_AreaAdd,
        Api_AreaUpdate
    } from '@/api/admin/system/index'

    export default {
        name: 'CreateUpdate',
        filters: {
            filterModelStatus(val) {
                if (val === 'root') {
                    return '新增根区域'
                } else if (val === 'childAdd') {
                    return '新增子区域'
                } else {
                    return '修改区域'
                }
            }
        },
        props: {
            modelStatus: String,
            selectData: {
                type: Object,
                default: () => ({})
            },
            parentData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            const createRules = this.$createRules
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    pid: ['pid', {
                        valuePropName: 'checkedKeys',
                        rules: [{required: true, message: '请选择上级区域', type: 'array'}]
                    }],
                    name: ['name', {
                        rules: createRules({
                            msg: '区域名称',
                            required: true,
                            max: 100
                        })
                    }],
                    code: ['code', {
                        rules: createRules({
                            required: true,
                            msg: '区域编码',
                            max: 50,
                            EXP_ENG_NUM_2: true
                        })
                    }],
                    sequence: ['sequence', {
                        rules: createRules({
                            msg: '顺序',
                            required: true,
                            integer: true,
                            max: 300
                        })
                    }],
                    type: ['type', {
                        rules: createRules({
                            msg: '区域类型',
                            required: true,
                            max: 50
                        })
                    }],
                    description: ['description', {
                        rules: createRules({
                            msg: '描述',
                            max: 300
                        })
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                modelType: undefined, // 新增上级区域或者子区域标识
                childDepAddUpdate: undefined, // 新增子区域或者修改子区域标识
                // parentData: {}, // 上级区域数据
                treeData: [], // 区域树的数据
                treeProps: [], // 区域树的显示规则
                typeCodeOptions: [], // 区域类型下拉框数据
                visible: false, // 是否显示
                addFormData: {// 新增区域的表单数据
                    name: undefined, // 区域名称，长度100
                    description: undefined, // 描述，长度300
                    type: '', // 区域类型，长度50
                    // typeName: '', // 区域类型名称
                    adminId: undefined, // 区域管理员ID
                    code: undefined, // 区域编码，长度50
                    sequence: undefined,
                    pid: undefined
                },
                treeLoading: false // 树组件的loading状态
            }
        },
        created() {
            Api_comboboxDict('area_type').then(res => {
                this.typeCodeOptions = res
            })
        },
        methods: {
            // 打开模态框
            openModel(modelType, childDepAddUpdate) {
                const selectData = {...this.selectData}
                const parentData = {...this.parentData}
                const addFormData = {...this.addFormData}
                this.modelType = modelType
                this.childDepAddUpdate = childDepAddUpdate
                if (modelType === 'root') { // 是新增根区域
                    this.visible = true
                } else if (modelType === 'child') {
                    if (childDepAddUpdate === 'add') { // 是新增子区域
                        this.visible = true
                        this.addFormData.pid = parentData.id
                    } else if (childDepAddUpdate === 'update') { // 是修改子区域
                        this.treeLoading = true
                        Api_AreaFetchTreeForUpdate(selectData.id).then(res => {
                            this.treeLoading = false
                            this.treeData = this.$turnTreeData(res);
                            this.form.setFieldsValue({
                                pid: [selectData.pid || '']
                            });
                        }).catch(() => {
                            this.treeLoading = false
                        })
                        const newData = {}
                        for (const key in addFormData) {
                            if (selectData.hasOwnProperty(key) && key !== 'pid') {
                                newData[key] = selectData[key];
                            }
                        }
                        this.form.setFieldsValue(newData);
                        this.visible = true
                    }
                }
            },
            // 点击确认
            handleSure() {
                const {modelType, childDepAddUpdate} = this
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {version} = this.selectData
                        const postData = values
                        let promiseRes = null
                        if (modelType === 'root') { // 是新增根区域
                            promiseRes = Api_AreaAdd(postData)
                        } else if (modelType === 'child') {
                            if (childDepAddUpdate === 'add') { // 是新增子区域
                                promiseRes = Api_AreaAdd({
                                    ...postData,
                                    pid: this.parentData.id
                                })
                            } else if (childDepAddUpdate === 'update') { // 是修改子区域
                                promiseRes = Api_AreaUpdate(this.selectData.id, {
                                    ...postData,
                                    version
                                })
                            }
                        }
                        this.handlePostData(promiseRes)
                    }
                })
            },
            handlePostData(promiseRes) {
                const loading = this.$openLoading()
                promiseRes.then(msg => {
                    this.visible = false
                    this.onClose()
                    this.$message.success(msg);
                    this.$emit('getList')
                    this.$emit('getDepTree')
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            },
            // 节点选中事件
            checkChange(_, {node, checked}) {
                const {id} = node.dataRef;
                this.form.setFieldsValue({
                    pid: checked ? [id] : []
                });
            },
            validatorDep(rule, value, callback) {
                if (!this.$refs.treeEdit) {
                    callback()
                    return
                }
                const checked = this.$refs.treeEdit.getCheckedKeys()
                if (!(checked && checked.length > 0)) {
                    callback(new Error('请选择一个上级区域'))
                } else {
                    callback()
                }
            },
            // 模态框关闭时
            onClose() {
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
