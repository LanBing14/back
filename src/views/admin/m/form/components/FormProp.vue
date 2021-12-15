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
                label="属性"
                prop="name"
            >
                <template slot="label">
                    属性
                    <el-tooltip class="item" effect="dark" content="格式：({table}){column}，“table”必需与主键的“table”一致。如果是附件则为附件的type，不用遵循前面的格式。">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.name" @change="handleTitleChange"/>
            </el-form-item>
            <el-form-item
                label="名称"
                prop="title"
            >
                <template slot="label">
                    名称
                    <el-tooltip class="item" effect="dark" content="页面显示的属性名称">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-input v-model="postFormData.title"/>
            </el-form-item>
            <el-form-item
                label="是否显示"
                prop="show"
            >
                <template slot="label">
                    是否显示
                    <el-tooltip class="item" effect="dark" content="尽量把不显示字段放到最后，容易判断页面上字段的排版">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-switch
                    v-model="postFormData.show"
                    :active-color="switchColors.active"
                    :inactive-color="switchColors.inactive"
                />
            </el-form-item>
            <template v-if="isListEdit">
                <el-form-item
                    label="列宽"
                    prop="width"
                >
                    <template slot="label">
                        列宽
                        <el-tooltip class="item" effect="dark" content="列宽，整数，单位：像素，非必填，不填的话，宽度为均分值">
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="postFormData.width"/>
                </el-form-item>
            </template>
            <el-form-item
                label="类型"
                prop="type"
            >
                <template slot="label">
                    类型
                    <el-tooltip class="item" effect="dark" content="支持字典的多选，但不支持一对多表的多选">
                        <i class="iconfont icon-question-circle"></i>
                    </el-tooltip>
                </template>
                <el-select v-model="postFormData.type" placeholder="请选择" filterable clearable @change="typeChange">
                    <el-option label="字符串" value="string"/>
                    <el-option label="长字符串" value="textarea"/>
                    <el-option label="整数" value="integer"/>
                    <el-option label="小数" value="double"/>
                    <el-option label="日期" value="date"/>
                    <el-option label="时间" value="datetime"/>
                    <el-option label="下拉框" value="select"/>
                    <el-option label="附件" value="attachment"/>
                    <el-option label="弹框" value="popup"/>
                    <el-option label="是否" value="boolean"/>
                </el-select>
            </el-form-item>
            <template v-if="postFormData.show">
                <el-form-item
                    label="合并长度"
                    prop="colspan"
                >
                    <template slot="label">
                        合并长度
                        <el-tooltip class="item" effect="dark" content="如一行排放的元素不满每行记录数，则元素长度为：合并长度/每行记录数">
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="postFormData.colspan"/>
                </el-form-item>
                <el-form-item
                    label="是否为空"
                    prop="nullable"
                >
                    <template slot="label">
                        是否为空
                    </template>
                    <el-switch
                        v-model="postFormData.nullable"
                        :active-color="switchColors.active"
                        :inactive-color="switchColors.inactive"
                    />
                </el-form-item>
                <el-form-item
                    label="是否编辑"
                    prop="editable"
                >
                    <template slot="label">
                        是否编辑
                        <el-tooltip class="item" effect="dark" content="不可编辑时，该字段的值不会入库">
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                    </template>
                    <el-switch
                        v-model="postFormData.editable"
                        :active-color="switchColors.active"
                        :inactive-color="switchColors.inactive"
                    />
                </el-form-item>
                <template v-if="filterHasLength(postFormData.type)">
                    <el-form-item
                        label="字符长度"
                        prop="length"
                    >
                        <template slot="label">
                            字符长度
                            <el-tooltip class="item" effect="dark" content="表中有中文字段，请使用nvarchar2，字符长度为nvarchar2的长度">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="postFormData.length"/>
                    </el-form-item>
                    <el-form-item
                        label="验证规则"
                        prop="validationRuleId"
                    >
                        <el-select v-model="postFormData.validationRuleId" placeholder="请选择" filterable clearable>
                            <el-option
                                v-for="(el, index) in validationRuleIdOptions"
                                :key="index"
                                :label="el.label"
                                :value="el.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="js验证规则"
                        prop="validationRuleId"
                    >
                        <el-select v-model="postFormData.jsValidator" placeholder="请选择" filterable clearable>
                            <el-option
                                v-for="(el, index) in jsValidatorRuleIdOptions"
                                :key="index"
                                :label="el.label"
                                :value="el.value"/>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="postFormData.type === 'popup'">
                    <el-form-item
                        label="查询sql"
                        prop="selectSql"
                    >
                        <template slot="label">
                            查询sql
                            <el-tooltip class="item" effect="dark" content="传参的名字请合属性的字段名保持一致，此处sql用于获取详情信息时回写popup字段的默认值">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="postFormData.selectSql" type="textarea"/>
                    </el-form-item>
                    <el-form-item
                        label="显示字段"
                        prop="selectLabel"
                    >
                        <template slot="label">
                            显示字段
                            <el-tooltip class="item" effect="dark" content="需要定义在自定义查询中，页面显示的内容">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="postFormData.selectLabel"/>
                    </el-form-item>
                    <el-form-item
                        label="传值字段"
                        prop="selectValue"
                    >
                        <template slot="label">
                            传值字段
                            <el-tooltip class="item" effect="dark" content="需要定义在自定义查询中，页面传递的值">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="postFormData.selectValue"/>
                    </el-form-item>
                    <el-form-item
                        label="选择表单"
                        prop="formId"
                    >
                        <el-select v-model="postFormData.formId" placeholder="请选择" filterable clearable>
                            <el-option
                                v-for="(el, index) in formIdOptions"
                                :key="index"
                                :label="el.label"
                                :value="el.value"/>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="postFormData.type === 'attachment'">
                    <el-form-item
                        label="附件类型"
                        prop="docType"
                    >
                        <!--                        <template slot="label">-->
                        <!--                            附件类型-->
                        <!--                            <el-tooltip class="item" effect="dark" content="(未定内容)">-->
                        <!--                                <i class="iconfont icon-question-circle"></i>-->
                        <!--                            </el-tooltip>-->
                        <!--                        </template>-->
                        <el-select v-model="postFormData.docType" placeholder="请选择" filterable clearable>
                            <el-option
                                v-for="elType in docTypeOptions"
                                :key="elType.value"
                                :label="elType.label"
                                :value="elType.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="是否多个"
                        prop="isMulti"
                    >
                        <!--                        <template slot="label">-->
                        <!--                            是否多个-->
                        <!--                            <el-tooltip class="item" effect="dark" content="(未定内容)">-->
                        <!--                                <i class="iconfont icon-question-circle"></i>-->
                        <!--                            </el-tooltip>-->
                        <!--                        </template>-->
                        <el-switch
                            v-model="postFormData.isMulti"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"
                        />
                    </el-form-item>
                    <el-form-item
                        label="附件大小"
                        prop="docSize"
                    >
                        <el-input v-model="postFormData.docSize"/>
                    </el-form-item>
                    <el-form-item
                        v-if="postFormData.isMulti"
                        label="最大上传数"
                        prop="docNum"
                    >
                        <el-input v-model="postFormData.docNum"/>
                    </el-form-item>
                </template>
                <template v-else-if="postFormData.type === 'select'">
                    <el-form-item
                        label="是否多选"
                        prop="isMulti"
                    >
                        <template slot="label">
                            是否多选
                            <el-tooltip class="item" effect="dark" content="下拉框是否可以多选值">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-switch
                            v-model="postFormData.isMulti"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"
                        />
                    </el-form-item>
                    <el-form-item
                        label="是否字典查询"
                        prop="isDict"
                    >
                        <template slot="label">
                            是否字典查询
                            <el-tooltip class="item" effect="dark" content="如果不是字典查询，则要填写自定义查询内容">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-switch
                            v-model="postFormData.isDict"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"
                            @change="clearInput()"
                        />
                    </el-form-item>
                    <template v-if="postFormData.isDict">
                        <el-form-item
                            label="字典组"
                            prop="dictCode"
                        >
                            <el-select v-model="postFormData.dictCode" filterable clearable>
                                <el-option
                                    v-for="elDic in dictionaryOptions"
                                    :key="elDic.value"
                                    :label="elDic.label"
                                    :value="elDic.value"
                                />
                            </el-select>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item
                            label="自定义查询sql"
                            prop="selectSql"
                        >
                            <template slot="label">
                                自定义查询sql
                                <el-tooltip class="item" effect="dark" content="不是片断sql">
                                    <i class="iconfont icon-question-circle"></i>
                                </el-tooltip>
                            </template>
                            <el-input v-model="postFormData.selectSql" :rows="3" type="textarea"/>
                        </el-form-item>
                        <el-form-item
                            label="option值"
                            prop="selectValue"
                        >
                            <template slot="label">
                                option值
                                <el-tooltip class="item" effect="dark" content="需要定义在自定义查询中，页面传递的值">
                                    <i class="iconfont icon-question-circle"></i>
                                </el-tooltip>
                            </template>
                            <el-input v-model="postFormData.selectValue"/>
                        </el-form-item>
                        <el-form-item
                            label="option展示内容"
                            prop="selectLabel"
                        >
                            <template slot="label">
                                option展示内容
                                <el-tooltip class="item" effect="dark" content="需要定义在自定义查询中，页面显示的内容">
                                    <i class="iconfont icon-question-circle"></i>
                                </el-tooltip>
                            </template>
                            <el-input v-model="postFormData.selectLabel"/>
                        </el-form-item>
                    </template>
                </template>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleAddQuerySign">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { switchColors } from '@/utils/variables'
import * as validates from '@/utils/validate'
import { m } from '@/api/index'
import { Api_comboboxDict } from '@/api/admin/index'
import {
    Api_DatabasesTablesColumns,
    Api_DatabasesTablesaDictionaryColumns,
    Api_FormFormsCombobox
} from '@/api/admin/m/index'

export default {
    name: 'FormProp',
    props: {
        defaultList: {
            type: Array,
            default: () => []
        },
        isListEdit: Boolean, // 是否是列表编辑时
        validationRuleIdOptions: Array, // 验证规则下拉框
        parentPrimaryKey: String // 主键的()部份
    },
    data () {
        const createRules = this.$createRules
        return {
            switchColors,
            modelStatus: 'add',
            updateIndex: undefined,
            visible: false,
            jsValidatorRuleIdOptions: [], // js的验证规则
            docTypeOptions: [], // 附件类型的option数据
            dictionaryOptions: [], // 字典下拉选择数据
            formIdOptions: [], // 表单下拉选择数据
            postFormData: { // 顶部按钮的新增数据
                show: true,
                name: '',
                title: '',
                type: 'string',
                length: '',
                colspan: '1',
                nullable: true,
                editable: true,
                isMulti: false,
                validationRuleId: '',
                jsValidator: '',
                dictCode: '',
                docType: '',
                docSize: '',
                docNum: '',
                formId: '',
                selectValue: '',
                selectSql: '',
                isDict: true
            },
            postFormRules: { // 表单验证规则
                name: createRules({
                    msg: '属性',
                    required: true,
                    max: 100,
                    validator: this.validatorAnnotation
                }),
                title: createRules({
                    msg: '名称',
                    required: true,
                    max: 100,
                    validator: this.validatorKey
                }),
                type: createRules({
                    msg: '类型',
                    required: true
                }),
                length: createRules({
                    msg: '字符长度',
                    integer0: true
                }),
                colspan: createRules({
                    msg: '合并长度',
                    integer0: true
                }),
                docSize: createRules({
                    msg: '附件大小',
                    integer0: true
                }),
                docNum: createRules({
                    msg: '最大上传数',
                    integer0: true
                }),
                dictCode: createRules({
                    msg: '字典组code',
                    required: true
                })
            }
        }
    },
    watch: {
        parentPrimaryKey (val) {
            this.postFormData.name = val
        }
    },
    created () {
        const jsValidates = []
        for (const key in validates) {
            jsValidates.push({
                label: key,
                value: key
            })
        }
        this.jsValidatorRuleIdOptions = jsValidates
        Api_comboboxDict('doc_type', m).then(res => {
            this.docTypeOptions = res
        })
        Api_DatabasesTablesaDictionaryColumns().then(res => {
            this.dictionaryOptions = res
        })
        Api_FormFormsCombobox(0).then(res => {
            this.formIdOptions = res
        })
        // 如果当前是组件是被列表编辑引用的，则加上列宽的配置
        if (this.isListEdit) {
            this.$set(this.postFormData, 'width', '')
            this.$set(this.postFormRules, 'width', this.$createRules({
                msg: '列宽',
                integer0: true
            }))
        }
    },

    methods: {
        clearInput () {
            this.postFormData.dictCode = ""
        },
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
                    this.postFormData = { ...row }
                }
            })
        },
        // 保存新增的顶部按钮
        handleAddQuerySign () {
            this.$refs['ref_postDataForm'].validate((valid) => {
                if (valid) {
                    if (this.postFormData.isDict) {
                        this.postFormData.selectSql = ''
                        this.postFormData.selectValue = ''
                        this.postFormData.selectLabel = ''
                    }
                    if (this.postFormData.type === 'select') {
                        this.postFormData.validationRuleId = ''
                    } else {
                        this.postFormData.dictCode = ''
                    }

                    if (!this.filterHasLength(this.postFormData.type)) {
                        this.postFormData.length = ''
                    }

                    const postFormData = { ...this.postFormData }
                    let updateIndex
                    if (this.modelStatus === 'update') {
                        updateIndex = this.updateIndex
                    }
                    this.$emit('ok', { ...postFormData }, updateIndex)
                    this.visible = false
                }
            })
        },
        // 名称改变时
        handleTitleChange (val) {
            if (val && this.modelStatus === 'add') {
                Api_DatabasesTablesColumns(val).then((res) => {
                    if (!res) {
                        return
                    }
                    this.postFormData.validationRuleId = res.validationRuleId
                    this.postFormData.title = res.name
                    this.postFormData.type = res.type
                    this.postFormData.length = res.length + ''
                    this.postFormData.dictCode = res.dictCode
                    this.postFormData.nullable = res.isMust
                })
            }
        },
        // 验证属性是否已存在
        validatorAnnotation (rule, value, callback) {
            const { updateIndex } = this
            const findRes = this.defaultList.find((item, index) => {
                return item.name === value && updateIndex !== index
            })

            if (findRes && findRes.length) {
                callback(new Error('属性已存在'))
            } else {
                callback()
            }
        },
        // 验证名称是否已存在
        validatorKey (rule, value, callback) {
            const { updateIndex } = this
            const findRes = this.defaultList.find((item, index) => {
                return item.title === value && updateIndex !== index
            })

            if (findRes && findRes.length) {
                callback(new Error('名称已存在'))
            } else {
                callback()
            }
        },
        filterHasLength (val) {
            return val === 'string' || val === 'textarea' || val === 'integer' || val === 'double'
        },
        // 字段类型选择变化时
        typeChange (val) {
            if (!(val === 'string' || val === 'textarea' || val === 'integer' || val === 'double')) {
                this.postFormData.jsValidator = ''
            }
        },
        // 顶部按钮弹框关闭时
        onModelClose () {
            this.$refs['ref_postDataForm'].resetFields()
        }
    }
}
</script>

<style scoped>

</style>
