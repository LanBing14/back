<template slot>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增用户':'修改用户'"
        :onOk="handleSure"
        @close="onClose">
        <a-form
            :form="form"
            ref="dataForm"
            layout="horizontal"
        >
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="用户名">
                <a-input
                    v-decorator="formDecorator.username"
                    :disabled="modelStatus!=='add'"
                    placeholder="请输入用户名"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="名称">
                <a-input
                    v-decorator="formDecorator.name"
                    placeholder="请输入名称"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="部门"
            >
                <a-tree
                    ref="depTree"
                    v-decorator="formDecorator.departmentId"
                    :treeData="depList"
                    autoExpandParent
                    checkable
                    checkStrictly
                    defaultExpandAll
                    @check="handleCheckChange"
                >
                </a-tree>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="性别">
                <a-select
                    v-decorator="formDecorator.gender"
                    class="filter-item"
                    placeholder="请选择性别"
                    filterable>
                    <a-select-option value="1">
                        男
                    </a-select-option>
                    <a-select-option value="0">
                        女
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="角色">
                <a-select
                    v-decorator="formDecorator.roleIds"
                    mode="multiple"
                    placeholder="请选择"
                    filterable
                >
                    <a-select-option
                        v-for="item in rolesList"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="身份证号">
                <a-input
                    v-decorator="formDecorator.idCard"
                    placeholder="请输入身份证号"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="联系人">
                <a-input
                    v-decorator="formDecorator.linkman"
                    placeholder="请输入联系人"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="联系电话">
                <a-input
                    v-decorator="formDecorator.phone"
                    placeholder="请输入联系电话"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="手机">
                <a-input
                    v-decorator="formDecorator.mobile"
                    placeholder="请输入手机"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="Email">
                <a-input
                    v-decorator="formDecorator.email"
                    placeholder="请输入email"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="地址">
                <a-input
                    v-decorator="formDecorator.address"
                    placeholder="请输入地址"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="职位">
                <a-input
                    v-decorator="formDecorator.position"
                    placeholder="请输入职位"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_DepartmentsFetchTree,
        Api_UserDetail,
        Api_UserAdd,
        Api_UserUpdate,
        Api_RolesCombobox
    } from '@/api/admin/system/index';

    export default {
        name: 'CreateUpdate',
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    username: ['username', {
                        rules: createRules({
                            msg: '用户名',
                            required: true,
                            max: 100
                        })
                    }],
                    name: ['name', {
                        rules: createRules({
                            msg: '名称',
                            required: true,
                            max: 100
                        })
                    }],
                    departmentId: ['departmentId', {
                        valuePropName: 'checkedKeys',
                        rules: [{required: true, message: '请选择部门', type: 'array'}]
                    }],
                    gender: ['gender', {initialValue: '1'}],
                    roleIds: ['roleIds'],
                    idCard: ['idCard', {
                        rules: createRules({
                            msg: '身份证',
                            idCard: true
                        })
                    }],
                    linkman: ['linkman', {
                        rules: createRules({
                            msg: '联系人',
                            max: 100
                        })
                    }],
                    phone: ['phone', {
                        rules: createRules({
                            msg: '手机号',
                            phone: true
                        })
                    }],
                    mobile: ['mobile', {
                        rules: createRules({
                            msg: '联系电话',
                            mobile: true
                        })
                    }],
                    email: ['email', {
                        rules: createRules({
                            msg: '邮箱',
                            email: true,
                            max: 100
                        })
                    }],
                    address: ['address', {
                        rules: createRules({
                            msg: '地址',
                            max: 100
                        })
                    }],
                    position: ['position', {
                        rules: createRules({
                            msg: '职位',
                            max: 100
                        })
                    }]
                },
                checkedKeys: [],
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                visible: false,
                addFormRules: {
                    username: createRules({
                        msg: '用户名',
                        required: true,
                        max: 100
                    }),
                    name: createRules({
                        msg: '名称',
                        required: true,
                        max: 100
                    }),
                    idCard: createRules({
                        msg: '身份证',
                        idCard: true
                    }),
                    phone: createRules({
                        msg: '联系电话',
                        phone: true
                    }),
                    mobile: createRules({
                        msg: '联系电话',
                        mobile: true
                    }),
                    departmentId: createRules({
                        msg: '部门',
                        // required: true,
                        validator: this.validatorDep
                    }),
                    linkman: createRules({
                        msg: '联系人',
                        max: 100
                    }),
                    email: createRules({
                        msg: '邮箱',
                        email: true,
                        max: 100
                    }),
                    address: createRules({
                        msg: '地址',
                        max: 100
                    }),
                    position: createRules({
                        msg: '职位',
                        max: 100
                    })
                },
                addFormData: {// 新增用户的表单数据
                    username: '',
                    name: '',
                    gender: '1',
                    idCard: '',
                    linkman: '',
                    phone: '',
                    mobile: '',
                    email: '',
                    address: '',
                    departmentId: '',
                    roleIds: '',
                    position: ''
                },
                editChecked: undefined,
                depList: undefined, // 部门树列表
                rolesList: undefined// 角色列表
            };
        },
        created() {
            this.getDepList();
            this.getRolesList();
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail(id);
                }
            },
            // 获取部门树列表
            getDepList() {
                Api_DepartmentsFetchTree('', this.$store.getters.selectSaasCode).then(res => {
                    this.depList = this.$turnTreeData(res);
                });
            },
            // 获取角色列表
            getRolesList() {
                Api_RolesCombobox({saasCode: this.$store.getters.selectSaasCode, isFront: false}).then(res => {
                    this.rolesList = res;
                });
            },
            // 获取单个角色信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_UserDetail(id).then(res => {
                    const oldData = {...this.addFormData};
                    const newData = {};
                    for (const key in oldData) {
                        if (res.hasOwnProperty(key)) {
                            newData[key] = res[key];
                        }
                    }
                    newData.departmentId = [newData.departmentId]
                    this.form.setFieldsValue(newData);
                    this.visible = true;
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.form.getFieldsValue();
                        postData.saasCode = this.$store.getters.selectSaasCode
                        const loading = this.$openLoading();
                        const promiseRes = modelStatus === 'add' ? Api_UserAdd(postData) : Api_UserUpdate(id, {
                            ...postData,
                            version
                        });
                        promiseRes.then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            // 部门树的选择事件
            handleCheckChange(_, {node, checked}) {
                const {id} = node.dataRef;
                this.form.setFieldsValue({
                    departmentId: checked ? [id] : []
                });
            },
            onClose() {
                this.form.resetFields();
                this.editChecked = null;
            }
        }
    };
</script>

<style scoped>

</style>
