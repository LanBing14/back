<template>
    <div>
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
                    label="上级菜单"
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
                    label="菜单key"
                >
                    <a-input
                        v-decorator="formDecorator.key"
                        placeholder="请输入菜单key"/>
                </a-form-item>
                <a-form-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="菜单名称"
                >
                    <a-input
                        v-decorator="formDecorator.name"
                        placeholder="请输入菜单名称"/>
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
                    label="图标"
                >
                    <i v-if="icon" :class="'showSelectIcon icon iconfont ' + icon"></i>
                    <a-button type="success" @click="openIcon" style="margin-right: 10px;">选择图标</a-button>
                    <a-button type="danger" @click="handleRemoveIcon">删除</a-button>
                </a-form-item>
                <a-form-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="菜单URL"
                >
                    <a-input
                        v-decorator="formDecorator.url"
                        placeholder="请输入菜单URL"/>
                </a-form-item>
                <a-form-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="是否模型生成"
                >
                    <a-switch v-decorator="formDecorator.module"/>
                </a-form-item>
                <a-form-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="是否新窗口打开"
                >
                    <a-switch v-decorator="formDecorator.window"/>
                </a-form-item>
            </a-form>
        </Drawer>
        <IconSelect ref="refIconSelect" :defaultSelect="icon" @handleOk="onIconOk"/>
    </div>
</template>

<script>
    import {switchColors} from '@/utils/variables';
    import IconSelect from '@/components/IconSelect';
    import {
        Api_MenuAdd,
        Api_MenuTreeForUpdate,
        Api_MenuUpdate
    } from '@/api/admin/system/index';

    export default {
        name: 'CreateUpdate',
        components: {IconSelect},
        filters: {
            filterModelStatus(val) {
                if (val === 'root') {
                    return '新增根菜单';
                } else if (val === 'childAdd') {
                    return '新增子菜单';
                } else {
                    return '修改菜单';
                }
            }
        },
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
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
                        rules: [{required: true, message: '请选择上级菜单', type: 'array'}]
                    }],
                    name: ['name', {
                        rules: createRules({
                            msg: '菜单名称',
                            required: true,
                            max: 100
                        })
                    }],
                    key: ['key', {
                        rules: createRules({
                            required: true,
                            msg: '菜单key',
                            max: 100,
                            z0: true
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
                    module: ['module'],
                    window: ['window'],
                    url: ['url']
                },
                icon: '',
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                visible: false,
                modelType: undefined, // 新增上级菜单或者子菜单
                childDepAddUpdate: undefined, // 新增子菜单或者修改子菜单
                treeData: [], // 菜单树
                sassData: [], // sass组合框数据
                addFormData: {// 新增菜单的表单数据
                    // saasCode: undefined, // 站编码
                    name: '', // 菜单名称，长度100
                    module: 0, // 是否是模型生成
                    window: 0, // 是否window.open开
                    sequence: '',
                    pid: [],
                    url: '',
                    key: ''
                },
                menuKeyDisable: true, // 菜单key是否可以填写
                treeLoading: false, // 树组件的loading状态
                lastSelectedId: undefined // 上一次选中的数据的id
            };
        },
        // created() {
        //     Api_saas().then(res => {
        //         this.sassData = res;
        //     })
        // },
        methods: {
            // 打开模态框
            openModel(modelType, childDepAddUpdate) {
                const selectData = {...this.selectData};
                const parentData = {...this.parentData};
                const addFormData = {...this.addFormData};
                this.modelType = modelType;
                this.childDepAddUpdate = childDepAddUpdate;
                if (modelType === 'root') { // 是新增根菜单
                    this.menuKeyDisable = false;
                    this.visible = true;
                } else if (modelType === 'child') {
                    if (childDepAddUpdate === 'add') { // 是新增子菜单
                        this.menuKeyDisable = false;
                        this.visible = true;
                        // this.addFormData.saasCode = selectData.saasCode;
                        this.addFormData.pid = parentData.id;
                    } else if (childDepAddUpdate === 'update') { // 是修改子菜单
                        this.menuKeyDisable = true;
                        this.treeLoading = true;
                        Api_MenuTreeForUpdate(selectData.id).then(res => {
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
                            if (selectData.hasOwnProperty(key) && key !== 'pid') {
                                newData[key] = selectData[key];
                            }
                        }
                        this.icon = selectData.icon;
                        this.form.setFieldsValue(newData);
                        this.visible = true;
                    }
                }
            },
            // 点击确认
            handleSure() {
                const {modelType, childDepAddUpdate} = this;
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {id, version} = this.selectData;
                        const postData = {
                            ...this.form.getFieldsValue(),
                            icon: this.icon
                        };
                        let promiseRes = null;
                        if (modelType === 'root') { // 是新增根菜单
                            promiseRes = Api_MenuAdd(postData);
                        } else if (modelType === 'child') {
                            if (childDepAddUpdate === 'add') { // 是新增子菜单
                                promiseRes = Api_MenuAdd({
                                    ...postData,
                                    pid: this.parentData.id
                                });
                            } else if (childDepAddUpdate === 'update') { // 是修改子菜单
                                promiseRes = Api_MenuUpdate(id, {
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
            // 删除图标
            handleRemoveIcon() {
                this.icon = undefined;
            },
            // 打开图标选择
            openIcon() {
                this.$refs.refIconSelect.openModel();
            },
            // 图标选择确认时
            onIconOk({name}) {
                this.icon = name;
            },
            // 节点选中事件
            checkChange(_, {node, checked}) {
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
    .showSelectIcon {
        margin-right: 10px;
        font-size: 22px;
        vertical-align: middle;
    }
</style>
