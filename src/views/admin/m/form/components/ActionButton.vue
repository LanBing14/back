<template>
    <el-dialog
        ref="ref_dialog"
        :title="titleInfo"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="onQuerySignModelClose"
        width="600px"
    >
        <el-form
            ref="ref_postDataForm"
            :rules="postFormRules"
            :model="postFormData"
            label-position="right"
            label-width="9em"
        >
            <el-form-item
                label="按钮名称"
                prop="name"
            >
                <el-input v-model="postFormData.name"/>
            </el-form-item>
            <el-form-item
                label="按钮类型"
                prop="type"
            >
                <el-select v-model="postFormData.type" placeholder="请选择" filterable>
                    <el-option label="新增" value="add"/>
                    <el-option label="修改" value="edit"/>
                    <el-option label="删除" value="delete"/>
                    <el-option label="查看" value="view"/>
                    <el-option label="选择" value="select"/>
                    <el-option label="定制" value="custom"/>
                </el-select>
            </el-form-item>
            <template v-if="postFormData.type === 'select'">
                <el-form-item
                    label="选择后关闭弹出框"
                    prop="close"
                >
                    <el-switch
                        v-model="postFormData.close"
                        :active-color="switchColors.active"
                        :inactive-color="switchColors.inactive"
                    />
                </el-form-item>
            </template>
            <template v-else-if="postFormData.type === 'custom'">
                <el-form-item
                    label="组件名"
                    prop="key"
                >
                    <template slot="label">
                        组件名
                        <el-tooltip class="item" effect="dark" content="自定义弹框里的组件名，需要与前端定义的组件key一致">
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="postFormData.key"/>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item
                    v-if="postFormData.type!=='delete'"
                    label="选择表单"
                    prop="formId"
                >
                    <el-select v-model="postFormData.formId" placeholder="请选择" filterable>
                        <el-option v-for="(el, index) in formIdOptions" :key="index" :label="el.label" :value="el.value"/>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item
                label="按钮权限"
                prop="permission"
            >
                <template slot="label">
                    按钮权限
                    <el-tooltip class="item" effect="dark" content="需要与菜单中定义的权限对应">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.permission"/>
            </el-form-item>
            <el-form-item
                label="额外条件"
                prop="showCondition"
            >
                <template slot="label">
                    额外条件
                    <el-tooltip class="item" effect="dark" content="限制该按钮的一些其他条件，是if判断条件的js片断代码，操作按钮中可以获取当前记录的对象，取值为“row”">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.showCondition"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {switchColors} from '@/utils/variables'
    import {
        Api_FormFormsCombobox
    } from '@/api/admin/m/index'

    export default {
        name: "TopButton",
        props: {
            title: String,
            defaultList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                switchColors,
                modelStatus: 'add',
                updateIndex: undefined,
                visible: false,
                formIdOptions: null,
                postFormData: { // 按钮的新增数据
                    name: '',
                    type: '',
                    permission: '',
                    showCondition: '',
                    formId: '',
                    key: '',
                    close: true
                },
                postFormRules: { // 按钮的表单验证规则
                    name: createRules({
                        msg: '按钮名称',
                        required: true,
                        max: 100,
                        validator: this.validatorButtonName
                    }),
                    type: createRules({
                        msg: '按钮类型',
                        required: true
                    })
                }
            }
        },
        computed: {
            titleInfo() {
                let t = this.title;
                if (this.modelStatus === 'add') {
                    t = '新增' + t;
                } else {
                    t = '修改' + t;
                }
                return t;
            }
        },
        methods: {
            openModel(row, updateIndex) {
                this.visible = true;
                if (!this.formIdOptions) {
                    Api_FormFormsCombobox(2).then(res => {
                        this.formIdOptions = res;
                    });
                }

                if (row) {
                    this.modelStatus = 'update';
                    this.updateIndex = updateIndex;
                } else {
                    this.modelStatus = 'add';
                    this.updateIndex = undefined;
                }
                this.$nextTick(() => {
                    if (row) {
                        this.postFormData = {...row}
                    }
                })
            },
            // 保存新增的按钮
            handleOk() {
                this.$refs['ref_postDataForm'].validate((valid) => {
                    if (valid) {
                        const postFormData = {...this.postFormData};
                        let updateIndex;
                        if (postFormData.type === 'delete') {
                            postFormData.formId = '';
                        }
                        if (this.modelStatus === 'update') {
                            updateIndex = this.updateIndex;
                        }
                        this.$emit('ok', {...postFormData}, updateIndex);
                        this.visible = false;
                    }
                })
            },
            // 验证按钮是否已存在
            validatorButtonName(rule, value, callback) {
                const {name} = this.postFormData;
                const {updateIndex} = this;

                const findRes = this.defaultList.find((item, index) => { // 查找按钮是否已经存在
                    return item.name === name && updateIndex !== index;
                });

                if (findRes && findRes.length) {
                    callback(new Error('按钮名称已存在'));
                } else {
                    callback()
                }
            },
            // 按钮弹框关闭时
            onQuerySignModelClose() {
                this.$refs['ref_postDataForm'].resetFields();
                this.modelStatus = 'add';
                this.updateIndex = undefined;
            }
        }
    }
</script>

<style scoped>
    .querySign-table {
        border: none;
    }
</style>
