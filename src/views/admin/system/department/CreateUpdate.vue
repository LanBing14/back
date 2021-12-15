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
                label="上级部门"
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
                    empty-text="暂无部门"
                    @check="handleCheckChange"
                />
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="部门名称"
            >
                <a-input
                    v-decorator="formDecorator.name"
                    placeholder="请输入部门名称"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="部门编码"
            >
                <a-input
                    v-decorator="formDecorator.code"
                    placeholder="请输入部门编码"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="顺序"
            >
                <a-input
                    v-decorator="formDecorator.sequence"
                    placeholder="请输入顺序"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="描述"
            >
                <a-input
                    v-decorator="formDecorator.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入描述"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_DepartmentsFetchTreeForUpdate,
        Api_DepartmentsAdd,
        Api_DepartmentsUpdate
    } from '@/api/admin/system/index';

    export default {
        name: 'CreateUpdate',
        filters: {
            filterModelStatus(val) {
                if (val === 'root') {
                    return '新增根部门';
                } else if (val === 'childAdd') {
                    return '新增子部门';
                } else {
                    return '修改部门';
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
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    pid: ['pid', {
                        valuePropName: 'checkedKeys',
                        rules: [{required: true, message: '请选择上级部门', type: 'array'}]
                    }],
                    name: ['name', {
                        rules: createRules({
                            msg: '部门名称',
                            required: true,
                            max: 100
                        })
                    }],
                    description: ['description', {
                        rules: createRules({
                            msg: '描述',
                            max: 300
                        })
                    }],
                    type: ['type', {
                        rules: createRules({
                            msg: '部门类型',
                            required: true,
                            max: 50
                        })
                    }],
                    code: ['code', {
                        rules: createRules({
                            msg: '部门编码',
                            required: true,
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
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                modelType: undefined, // 新增上级部门或者子部门标识
                childDepAddUpdate: undefined, // 新增子部门或者修改子部门标识
                // parentData: {}, // 上级部门数据
                treeData: [], // 部门树的数据
                treeProps: [], // 部门树的显示规则
                visible: false, // 是否显示
                addFormRules: { // 表单验证规则
                    name: createRules({
                        msg: '部门名称',
                        required: true,
                        max: 100
                    }),
                    description: createRules({
                        msg: '描述',
                        max: 300
                    }),
                    type: createRules({
                        msg: '部门类型',
                        required: true,
                        max: 50
                    }),
                    code: createRules({
                        msg: '部门编码',
                        required: true,
                        max: 50,
                        EXP_ENG_NUM_2: true
                    }),
                    sequence: createRules({
                        msg: '顺序',
                        required: true,
                        integer: true,
                        max: 300
                    }),
                    pid: createRules({
                        msg: '上级部门',
                        max: 50,
                        required: (this.modelType === 'child'),
                        validator: this.validatorDep
                    })
                },
                addFormData: {// 新增部门的表单数据
                    name: undefined, // 部门名称，长度100
                    description: undefined, // 描述，长度300
                    type: '0', // 部门类型，长度50
                    adminId: undefined, // 部门管理员ID
                    code: undefined, // 部门编码，长度50
                    sequence: undefined,
                    pid: undefined
                },
                treeLoading: false // 树组件的loading状态
            };
        },
        methods: {
            // 打开模态框
            openModel(modelType, childDepAddUpdate) {
                this.modelType = modelType;
                this.childDepAddUpdate = childDepAddUpdate;
                if (modelType === 'root') { // 是新增根部门
                    this.visible = true;
                } else if (modelType === 'child') {
                    if (childDepAddUpdate === 'add') { // 是新增子部门
                        this.visible = true;
                    } else if (childDepAddUpdate === 'update') { // 是修改子部门
                        this.getDetail()
                    }
                }
            },
            // 点击确认
            handleSure() {
                const {modelType, childDepAddUpdate} = this;
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {version} = this.selectData;
                        const postData = this.form.getFieldsValue();
                        postData.saasCode = this.$store.getters.selectSaasCode;
                        let promiseRes = null;
                        if (modelType === 'root') { // 是新增根部门
                            promiseRes = Api_DepartmentsAdd(postData);
                        } else if (modelType === 'child') {
                            if (childDepAddUpdate === 'add') { // 是新增子部门
                                promiseRes = Api_DepartmentsAdd({
                                    ...postData,
                                    pid: this.parentData.id
                                });
                            } else if (childDepAddUpdate === 'update') { // 是修改子部门
                                promiseRes = Api_DepartmentsUpdate(this.selectData.id, {
                                    ...postData,
                                    version
                                });
                            }
                        }
                        this.handlePostData(promiseRes);
                    }
                });
            },
            handlePostData(promiseRes) {
                const loading = this.$openLoading();
                promiseRes.then(msg => {
                    this.visible = false;
                    this.onClose();
                    this.$message.success(msg);
                    this.$emit('getList');
                    this.$emit('getDepTree');
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            getDetail() {
                const selectData = this.selectData;
                const addFormData = this.addFormData;
                this.treeLoading = true;
                Api_DepartmentsFetchTreeForUpdate(selectData.id, this.$store.getters.selectSaasCode).then(res => {
                    this.treeLoading = false;
                    this.treeData = this.$turnTreeData(res);
                    this.form.setFieldsValue({
                        pid: [selectData.pid || '']
                    });
                }).catch(() => {
                    this.treeLoading = false;
                });
                const newData = {};
                for (const key in addFormData) {
                    if (selectData.hasOwnProperty(key)) {
                        newData[key] = selectData[key];
                    }
                }
                delete newData.pid
                this.form.setFieldsValue(newData);
                this.visible = true;
            },
            // 部门树的选择事件
            handleCheckChange(_, {node, checked}) {
                const {id} = node.dataRef;
                this.form.setFieldsValue({
                    pid: checked ? [id] : []
                });
            },
            // 模态框关闭时
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

<style scoped>

</style>
