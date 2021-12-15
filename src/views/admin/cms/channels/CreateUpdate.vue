<template>
    <Drawer
        ref="drawer"
        :title="modelStatus | filterModelStatus"
        :visible.sync="visible"
        :onOk="handleSure"
        fullscreen
        @close="onClose"
    >
        <a-form
            ref="dataForm"
            :form="form"
        >
            <a-row :gutter="20" class="row-wrap">
                <a-col :span="12">
                    <a-form-item
                        v-if="modelType!=='root'"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        :class="{'el-form-item-required': modelType === 'child'}"
                        label="上级栏目"
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
                            @check="handleCheckChange"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="20" class="row-wrap">
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="栏目名称"
                    >
                        <a-input
                            v-decorator="formDecorator.name"
                            placeholder="请输入栏目名称"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="栏目编号"
                    >
                        <a-input
                            v-decorator="formDecorator.channelCode"
                            placeholder="请输入栏目编号"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="20" class="row-wrap">
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="栏目路径"
                    >
                        <a-input
                            v-decorator="formDecorator.path"
                            placeholder="请输入栏目路径"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="顺序"
                    >
                        <a-input
                            v-decorator="formDecorator.sequence"
                            placeholder="请输入顺序"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="20" class="row-wrap">
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="栏模板目"
                    >
                        <a-select
                            v-decorator="formDecorator.template"
                            placeholder="请选择栏模板目"
                            filterable>
                            <a-select-option
                                v-for="el in templateOptions"
                                :key="el.id"
                                :value="el.value"
                            >
                                {{ el.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="是否有内容"
                    >
                        <a-switch
                            v-decorator="formDecorator.contents"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <template v-if="form.getFieldValue('contents')">
                <a-row :gutter="20" class="row-wrap">
                    <a-col :span="12">
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="标题"
                        >
                            <a-input
                                v-decorator="formDecorator.title"
                                placeholder="请输入标题"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="关键词"
                        >
                            <InputBox v-decorator="formDecorator.keyWords" tip="关键词"></InputBox>
                        </a-form-item>
                    </a-col>
                </a-row>
            </template>
            <template v-else>
                <a-row :gutter="20" class="row-wrap">
                    <a-col :span="12">
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="是否显示子栏目内容"
                        >
                            <a-switch
                                v-decorator="formDecorator.display"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="每页记录数"
                        >
                            <a-input
                                v-decorator="formDecorator.pageSize"
                                placeholder="请输入每页记录数"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </template>
            <a-form-item
                :label-col="{span: 2}"
                :wrapper-col="{span: 22}"
                label="摘要"
            >
                <a-input
                    v-decorator="formDecorator.summary"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入摘要"
                />
            </a-form-item>
            <a-form-item v-if="form.getFieldValue('contents')"
                :label-col="{span: 2}"
                :wrapper-col="{span: 22}"
                label="文本内容"
            >
                <Ckeditor ref="Ckeditor" v-decorator="formDecorator.text"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {switchColors} from '@/utils/variables';
    import Ckeditor from '@/components/Ckeditor';
    import InputBox from '@/components/InputBox';
    import {
        Api_ChannelsFetchTreeRoot,
        Api_ChannelsAdd,
        Api_ChannelsUpdate,
        Api_ChannelsFetchDetail,
        Api_ContentsTemplateCombobox,
        Api_ChannelsGetKeyWords
    } from '@/api/admin/cms/index';

    export default {
        name: 'CreateUpdate',
        components: {Ckeditor, InputBox},
        filters: {
            filterModelStatus(val) {
                if (val === 'root') {
                    return '新增根栏目';
                } else if (val === 'childAdd') {
                    return '新增子栏目';
                } else {
                    return '修改栏目';
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
                        rules: [{
                            message: '请选择上级栏目',
                            required: true,
                            type: 'array'
                        }]
                    }],
                    name: ['name', {
                        rules: createRules({
                            msg: '栏目名称',
                            required: true,
                            max: 100
                        })
                    }],
                    channelCode: ['channelCode', {
                        rules: createRules({
                            msg: '栏目编号',
                            required: true,
                            max: 100
                        })
                    }],
                    title: ['title', {
                        rules: createRules({
                            msg: '标题',
                            required: true,
                            max: 100
                        })
                    }],
                    path: ['path', {
                        rules: createRules({
                            msg: '栏目路径',
                            required: true,
                            max: 100
                        })
                    }],
                    summary: ['summary', {
                        rules: createRules({
                            msg: '摘要',
                            required: true,
                            max: 300
                        })
                    }],
                    sequence: ['sequence', {
                        rules: createRules({
                            msg: '顺序',
                            required: true,
                            integer: true
                        })
                    }],
                    pageSize: ['pageSize', {
                        rules: createRules({
                            msg: '每页记录数',
                            required: true,
                            integer: true,
                            max: 300
                        })
                    }],
                    display: ['display'],
                    contents: ['contents', {
                        initialValue: false,
                        valuePropName: 'checked',
                        rules: [{
                            type: 'boolean'
                        }]
                    }],
                    template: ['template'],
                    text: ['text'],
                    keyWords: ['keyWords', {type: 'array', initialValue: []}]
                },
                checkedKeys: [],
                labelCol: {span: 4},
                wrapperCol: {span: 20},

                switchColors,
                modelType: undefined, // 新增上级栏目或者子栏目标识
                childDepAddUpdate: undefined, // 新增子栏目或者修改子栏目标识
                // parentData: {}, // 上级栏目数据
                treeData: [], // 栏目树的数据
                treeProps: [], // 栏目树的显示规则
                visible: false, // 是否显示
                addFormRules: { // 表单验证规则
                    name: createRules({
                        msg: '栏目名称',
                        required: true,
                        max: 100
                    }),
                    channelCode: createRules({
                        msg: '栏目编号',
                        required: true,
                        max: 100
                    }),
                    title: createRules({
                        msg: '标题',
                        required: true,
                        max: 100
                    }),
                    path: createRules({
                        msg: '栏目路径',
                        required: true,
                        max: 100
                    }),
                    summary: createRules({
                        msg: '摘要',
                        required: true,
                        max: 300
                    }),
                    sequence: createRules({
                        msg: '顺序',
                        required: true,
                        integer: true
                    }),
                    pageSize: createRules({
                        msg: '每页记录数',
                        required: true,
                        integer: true,
                        max: 300
                    }),
                    pid: createRules({
                        msg: '上级栏目',
                        validator: this.validatorDep
                    })
                },
                addFormData: {// 新增栏目的表单数据
                    name: '', // 栏目名称，长度100
                    display: false, // 是否显示子栏目内容
                    contents: false, // 是否有内容
                    keyWords: [], // 关键词
                    channelCode: '', // 栏目编号
                    path: '', // 栏目路径，长度100
                    sequence: '',
                    pid: '',
                    pageSize: '',
                    template: '',
                    title: '',
                    summary: '', // 摘要，长度300
                    text: '',
                },
                treeLoading: false, // 树组件的loading状态
                templateOptions: [], // 模版下拉的option数据
                defaultContentTxt: undefined // 默认的详情里的富文本内容

            };
        },
        created() {
            Api_ContentsTemplateCombobox().then(res => {
                this.templateOptions = res;
            });
        },
        methods: {
            // 打开模态框
            openModel(modelType, childDepAddUpdate) {
                this.modelType = modelType;
                this.childDepAddUpdate = childDepAddUpdate;
                if (modelType === 'root') { // 是新增根栏目
                    this.visible = true;
                } else if (modelType === 'child') {
                    if (childDepAddUpdate === 'add') { // 是新增子栏目
                        this.visible = true;
                    } else if (childDepAddUpdate === 'update') { // 是修改子栏目
                        this.getDetail();
                    }
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {modelType, childDepAddUpdate} = this;
                        const {id, version} = this.selectData;
                        const postData = this.form.getFieldsValue();
                        let promiseRes = null;

                        if (modelType === 'root') { // 是新增根栏目
                            promiseRes = Api_ChannelsAdd(postData);
                        } else if (modelType === 'child') {
                            if (childDepAddUpdate === 'add') { // 是新增子栏目
                                promiseRes = Api_ChannelsAdd({
                                    ...postData,
                                    pid: this.parentData.id
                                });
                            } else if (childDepAddUpdate === 'update') { // 是修改子栏目
                                promiseRes = Api_ChannelsUpdate(id, {
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
                const {id, pid} = this.selectData;
                this.treeLoading = true;
                Api_ChannelsFetchTreeRoot(id).then(res => {
                    this.treeLoading = false;
                    this.treeData = this.$turnTreeData(res);
                    this.form.setFieldsValue({
                        pid: [pid || '']
                    });
                }).catch(() => {
                    this.treeLoading = false;
                });
                const loading = this.$openLoading();
                Api_ChannelsFetchDetail(id).then(res => {
                    loading.close();
                    const newData = {};
                    const addFormData = this.form.getFieldsValue();
                    for (const key in addFormData) {
                        newData[key] = res[key];
                    }
                    delete newData.pid
                    this.form.setFieldsValue(newData);
                    this.$nextTick(() => {
                        const data = {};
                        if (newData.contents) {
                            data.title = res.title;
                            data.keyWords = res.keyWords || [];
                            data.text = res.text;
                        } else {
                            data.display = res.display;
                            data.pageSize = res.pageSize;
                        }
                        this.form.setFieldsValue(data);
                    });
                    Api_ChannelsGetKeyWords(id).then(res => {
                        const keywordObj = res[0];
                        if (keywordObj) {
                            let {keyWords} = keywordObj;
                            keyWords = keyWords.replace(/[\[\]]/g, '');
                            this.form.setFieldsValue({
                                keyWords: keyWords ? keyWords.split(',') : []
                            });
                        }
                    });
                    this.visible = true;
                }).catch(() => {
                    loading.close();
                });
            },
            handleCheckChange(_, {node, checked}) {
                const {id} = node.dataRef;
                // this.checkedKeys = checked ? [id] : [];
                this.form.setFieldsValue({
                    pid: checked ? id : undefined
                });
            },
            // validatorDep(rule, value, callback) {
            //     if (!this.checkedKeys.length) {
            //         callback(new Error('请选择一个上级栏目'));
            //     } else {
            //         callback();
            //     }
            // },
            // 模态框关闭时
            onClose() {
                this.form.resetFields();
                // this.checkedKeys = [];
            }
        }
    };
</script>

<style scoped>

</style>
