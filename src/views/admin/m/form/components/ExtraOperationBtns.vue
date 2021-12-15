<template>
    <el-dialog
        ref="dialog_querySign"
        :title="modelStatus === 'add' ? '新增表单项信息' : '修改表单项信息'"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="onModelClose"
        width="600px"
    >
        <el-form
            ref="ref_postDataForm"
            :rules="postFormRules"
            :model="postFormData"
            label-position="right"
            label-width="8em"
        >
            <el-form-item
                label="按钮名称"
                prop="name"
            >
                <el-input v-model="postFormData.name"/>
            </el-form-item>
            <el-form-item
                label="接口url"
                prop="url"
            >
                <el-input v-model="postFormData.url"/>
            </el-form-item>
            <el-form-item
                label="传参"
            >
                <template slot="label">
                    传参
                    <el-tooltip class="item" effect="dark" content="自定义弹框里的组件名，需要与前端定义的组件key一致">
                        <div slot="content">
                            tip1: 若是流程启动，则全局参数，tableName,processDefinitionKey必传 <br/>
                            tip2: 若是流程操作，则全局参数，processOperate必传 <br/>
                            tip3: 如果值是以‘${xxx}’的形式传入的话，则表单中‘xxx’的值会替换参数值
                        </div>
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <div class="like-table">
                    <div class="l-head">
                        <div>
                            参数类型
                        </div>
                        <div>
                            属性
                        </div>
                        <div>
                            值
                        </div>
                        <div>
                            <el-button type="success" icon="el-icon-plus" circle @click="add"/>
                        </div>
                    </div>
                    <Draggable
                        v-model="postFormData.params"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="l-body"
                    >
                        <div v-for="(el, index) in postFormData.params" :key="index" class="drag-icon" style="cursor: pointer">
                            <div>
                                <el-form-item
                                    :prop="'params.'+index+'.type'"
                                    :rules="codeRules"
                                >
                                    <el-select v-model="el.type" placeholder="请选择">
                                        <el-option
                                            v-for="item in buttonsParamsOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item
                                    :prop="'params.'+index+'.key'"
                                    :rules="codeRules"
                                >
                                    <el-input v-model="el.key"/>
                                </el-form-item>
                            </div>
                            <div style="flex: 3;">
                                <el-form-item
                                    :prop="'params.'+index+'.value'"
                                    :rules="valueRules"
                                >
                                    <el-input v-model="el.value"/>
                                </el-form-item>
                            </div>
                            <div style="flex: none;width: 90px;">
                                <el-form-item
                                >
                                    <el-button icon="el-icon-minus" circle @click="del(index)"/>
                                </el-form-item>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleAddButtions">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { merge } from 'lodash'
import vuedraggable from 'vuedraggable'
import { switchColors } from '@/utils/variables'
import {m} from '@/api/index'
import { Api_comboboxDict } from '@/api/admin/index'

export default {
    name: 'ExtraOperationBtns',
    components: {
        Draggable: vuedraggable
    },
    props: {
        defaultList: {
            type: Array,
            default: () => []
        },
        isListEdit: Boolean,
        validationRuleIdOptions: Array
    },
    data () {
        const createRules = this.$createRules
        return {
            switchColors,
            modelStatus: 'add',
            updateIndex: undefined,
            visible: false,
            draggableOptions: { // vuedraggable的配置
                animation: 200,
                handle: '.drag-icon'
            },
            docTypeOptions: [], // 附件类型的option数据
            dictionaryOptions: [], // 字典下拉选择数据
            formIdOptions: [], // 表单下拉选择数据
            buttonsParamsOptions: [], // 参数类型下拉选择数据
            postFormData: { // 顶部按钮的新增数据
                name: '',
                url: '',
                params: []
            },
            postFormRules: { // 表单验证规则
                name: createRules({
                    msg: '按钮名称',
                    required: true,
                    max: 100,
                    validator: this.validatorName
                })
            },
            codeRules: createRules({
                msg: '属性',
                max: 50,
                validator: this.validatorCode
            }),
            valueRules: createRules({
                msg: '值',
                max: 300
            })
        }
    },
    created () {
        Api_comboboxDict('param_type', m).then(res => {
            this.buttonsParamsOptions = res
        })
    },
    methods: {
        openModel (row, updateIndex) {
            this.visible = true
            if (row) {
                this.modelStatus = 'update'
                this.updateIndex = updateIndex
            } else {
                this.modelStatus = 'add'
                this.updateIndex = undefined
            }
            this.$nextTick(() => {
                if (row) {
                    this.postFormData = merge({}, row)
                }
            })
        },
        // 保存新增的顶部按钮
        handleAddButtions () {
            this.$refs['ref_postDataForm'].validate((valid) => {
                if (valid) {
                    const postFormData = { ...this.postFormData }
                    let updateIndex

                    if (this.modelStatus === 'update') {
                        updateIndex = this.updateIndex
                    }
                    this.$emit('ok', merge({}, postFormData), updateIndex)
                    this.visible = false
                }
            })
        },
        // 验证按钮名称是否已存在
        validatorName (rule, value, callback) {
            const { updateIndex } = this
            const findRes = this.defaultList.find((item, index) => {
                return item.name === value && updateIndex !== index
            })

            if (findRes && findRes.length) {
                callback(new Error('按钮名称已存在'))
            } else {
                callback()
            }
        },
        validatorCode (rule, value, callback) {
            const codes = this.postFormData.params.map(item => {
                return item.key
            })
            const firstIndex = codes.indexOf(value)
            const lastIndex = codes.lastIndexOf(value)
            if (!value) {
                callback(new Error('参数属性必填'))
                return
            }

            if (firstIndex !== lastIndex) {
                callback(new Error('参数属性已存在'))
            } else {
                callback()
            }
        },
        add () {
            this.postFormData.params.push({
                key: '',
                value: '',
                type: ''
            })
        },
        del (index) {
            this.postFormData.params.splice(index, 1)
            this.$nextTick(() => {
                this.$refs['ref_postDataForm'].clearValidate()
            })
        },
        filterHasLength (val) {
            return val === 'string' || val === 'textarea' || val === 'integer' || val === 'double'
        },
        // 顶部按钮弹框关闭时
        onModelClose () {
            this.postFormData.params = []
            this.$nextTick(() => {
                this.$refs['ref_postDataForm'].resetFields()
            })
        }
    }
}
</script>

<style scoped>

</style>
