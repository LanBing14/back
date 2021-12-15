<template>
    <el-dialog
        ref="dialog_querySign"
        :title="modelStatus === 'add' ? '新增列信息' : '修改列信息'"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="onQuerySignModelClose"
        width="600px"
    >
        <el-form
            ref="ref_querySignDataForm"
            :rules="postFormRules"
            :model="postFormData"
            label-position="right"
            label-width="8em"
        >
            <el-form-item
                label="列名"
                prop="annotation"
            >
                <template slot="label">
                    列名
                    <el-tooltip class="item" effect="dark" content="表头显示名称">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.annotation"/>
            </el-form-item>
            <el-form-item
                label="key"
                prop="name"
            >
                <template slot="label">
                    key
                    <el-tooltip class="item" effect="dark" content="查询语句中查询字段名称。注：务必要包含id字段，否则按钮无法操作。">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.name"/>
            </el-form-item>
            <el-form-item
                label="对齐方式"
                prop="align"
            >
                <el-select v-model="postFormData.align" style="width: 100%">
                    <el-option label="居左" value="left"/>
                    <el-option label="居中" value="center"/>
                    <el-option label="居右" value="right"/>
                </el-select>
            </el-form-item>
            <el-form-item
                label="是否显示"
                prop="show"
            >
                <el-switch
                    v-model="postFormData.show"
                    :active-color="switchColors.active"
                    :inactive-color="switchColors.inactive"
                />
            </el-form-item>
            <el-form-item
                label="列宽"
                prop="width"
            >
                <template slot="label">
                    列宽
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="列宽，整数，单位：像素，非必填，不填的话，宽度为均分值"
                    >
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.width"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleAddQuerySign">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { switchColors } from '@/utils/variables'

    export default {
        name: "Column",
        props: {
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
                postFormData: { // 顶部按钮的新增数据
                    annotation: '',
                    name: '',
                    width: '',
                    align: 'left',
                    show: true
                },
                postFormRules: { // 顶部按钮的表单验证规则
                    annotation: createRules({
                        msg: '列名',
                        required: true,
                        max: 100,
                        validator: this.validatorAnnotation
                    }),
                    width: createRules({
                        msg: '列宽',
                        integer0: true
                    }),
                    name: createRules({
                        msg: 'key',
                        required: true,
                        max: 100,
                        validator: this.validatorKey
                    })
                }

            }
        },
        methods: {
            openModel(row, updateIndex) {
                this.visible = true;
                if (row) {
                    this.modelStatus = 'update';
                    this.updateIndex = updateIndex;
                } else {
                    this.modelStatus = 'add';
                    this.updateIndex = undefined;
                }
                this.$nextTick(() => {
                    if (row) {
                        this.postFormData = { ...row }
                    }
                })
            },
            // 保存新增的顶部按钮
            handleAddQuerySign() {
                this.$refs['ref_querySignDataForm'].validate((valid) => {
                    if (valid) {
                        const postFormData = { ...this.postFormData };
                        let updateIndex;
                        if (this.modelStatus === 'update') {
                            updateIndex = this.updateIndex;
                        }
                        this.$emit('ok', { ...postFormData }, updateIndex);
                        this.visible = false;
                    }
                })
            },
            // 验证列名是否已存在
            validatorAnnotation(rule, value, callback) {
                const { updateIndex } = this;
                const findRes = this.defaultList.find((item, index) => {
                    return item.annotation === value && updateIndex !== index;
                });

                if (findRes && findRes.length) {
                    callback(new Error('列名已存在'));
                } else {
                    callback()
                }
            },
            // 验证key是否已存在
            validatorKey(rule, value, callback) {
                const { updateIndex } = this;
                const findRes = this.defaultList.find((item, index) => {
                    return item.name === value && updateIndex !== index;
                });

                if (findRes && findRes.length) {
                    callback(new Error('key已存在'));
                } else {
                    callback()
                }
            },
            // 顶部按钮弹框关闭时
            onQuerySignModelClose() {
                this.$refs['ref_querySignDataForm'].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
