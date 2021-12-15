<template>
    <a-modal
        v-model="visible"
        ref="ref_dialog"
        :title="modelStatus === 'add' ? '新增查询条件' : '修改查询条件'"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @ok="handleOk"
        @cancel="onClose"
        width="600px"
    >
        <a-form
            :form="form"
        >
            <a-form-item
                label="查询条件名称"
            >
                <a-input v-decorator="formDecorator.conditionTitle"/>
            </a-form-item>
            <a-form-item
                label="字段key"
            >
                <template slot="label">
                    字段key
                    <a-tooltip class="item" effect="dark" title="字段key必需与下面查询sql中的参数名相同，不能是“id”">
                        <i class="iconfont icon-question-circle"></i>
                    </a-tooltip>
                </template>
                <a-input v-decorator="formDecorator.conditionName"/>
            </a-form-item>
            <a-form-item
                label="查询sql"
            >
                <template slot="label">
                    查询sql
                    <a-tooltip class="item" effect="dark" title="片断sql，不以“and”开头，调用时会和“查询语句”以“ and ”拼接">
                        <i class="iconfont icon-question-circle"></i>
                    </a-tooltip>
                </template>
                <a-input v-decorator="formDecorator.conditionSql"/>
            </a-form-item>
            <a-form-item
                label="类型"
            >
                <a-select v-decorator="formDecorator.conditionType" placeholder="请选择" filterable>
                    <a-select-option value="string">字符串</a-select-option>
                    <a-select-option value="integer">整数</a-select-option>
                    <a-select-option value="double">小数</a-select-option>
                    <a-select-option value="date">日期</a-select-option>
                    <a-select-option value="datetime">时间</a-select-option>
                    <a-select-option value="select">下拉框</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                v-if="form.getFieldsValue().conditionType==='string'"
                label="模糊匹配"
            >
                <template slot="label">
                    模糊匹配
                    <a-tooltip class="item" effect="dark" title="选择“模糊匹配”时，查询sql需要以“like”查询">
                        <i class="iconfont icon-question-circle"></i>
                    </a-tooltip>
                </template>
                <a-switch
                    v-decorator="formDecorator.conditionLike"
                />
            </a-form-item>
            <template v-else-if="form.getFieldValue('conditionType') === 'select'">
                <a-form-item
                    label="是否字典查询"
                >
                    <a-switch
                        v-decorator="formDecorator.isDict"
                    />
                </a-form-item>
                {{form.getFieldsValue()}}
                <a-form-item v-if="form.getFieldValue('isDict')">
                    <a-form-item
                        label="字典组"
                        prop="dictCode"
                    >
                        <a-select v-decorator="formDecorator.dictCode" filterable>
                            <a-select-option
                                v-for="elDic in dictionaryOptions"
                                :key="elDic.value"
                                :value="elDic.value"
                            >
                                {{ elDic.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form-item>
                <a-form-item v-else>
                    <a-form-item
                        label="自定义查询sql"
                        prop="selectSql"
                    >
                        <template slot="label">
                            自定义查询sql
                            <a-tooltip class="item" effect="dark" title="不是片断sql">
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </template>
                        <a-input v-decorator="formDecorator.selectSql" :rows="3" type="textarea"/>
                    </a-form-item>
                    <a-form-item
                        label="option值"
                        prop="selectValue"
                    >
                        <template slot="label">
                            option值
                            <a-tooltip class="item" effect="dark" title="需要定义在自定义查询中，页面传递的值">
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </template>
                        <a-input v-decorator="formDecorator.selectValue"/>
                    </a-form-item>
                    <a-form-item
                        label="option展示内容"
                        prop="selectLabel"
                    >
                        <template slot="label">
                            option展示内容
                            <a-tooltip class="item" effect="dark" title="需要定义在自定义查询中，页面显示的内容">
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </template>
                        <a-input v-decorator="formDecorator.selectLabel"/>
                    </a-form-item>
                </a-form-item>
            </template>
            <template
                v-else-if="form.getFieldValue('conditionType') === 'date'|| form.getFieldValue('conditionType') === 'datetime'">
                <a-form-item
                    label="限制最小时间"
                    prop="conditionEnd"
                >
                    <a-input v-decorator="formDecorator.conditionStart"/>
                </a-form-item>
                <a-form-item
                    label="限制最大时间"
                    prop="conditionStart"
                >
                    <a-input v-decorator="formDecorator.conditionEnd"/>
                </a-form-item>
            </template>
        </a-form>
    </a-modal>
</template>

<script>
    import {switchColors} from '@/utils/variables'
    import {
        Api_DatabasesTablesaDictionaryColumns
    } from '@/api/admin/m/index'

    export default {
        name: 'QueryTerm',
        props: {
            defaultList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    conditionTitle: ['conditionTitle', {
                        rules: createRules({
                            msg: '查询条件名称',
                            required: true,
                            max: 100,
                            validator: this.validatorQueryTermAddName
                        })
                    }],
                    conditionName: ['conditionName', {
                        rules: createRules({
                            msg: '字段key',
                            required: true,
                            max: 100,
                            validator: this.validatorQueryConditionName
                        })
                    }],
                    conditionStart: ['conditionStart'],
                    conditionEnd: ['conditionEnd'],
                    conditionType: ['conditionType', {
                        preserve: true,
                        initialValue: 'string',
                        rules: createRules({
                            msg: '类型',
                            required: true
                        })
                    }],
                    conditionSql: ['conditionSql'],
                    dictCode: ['dictCode', {
                        rules: createRules({
                            msg: '字典',
                            required: true,
                            max: 100
                        })
                    }],
                    selectSql: ['selectSql', {
                        rules: createRules({
                            msg: '自定义查询sql',
                            required: true,
                            max: 100
                        })
                    }],
                    selectLabel: ['selectLabel', {
                        rules: createRules({
                            msg: 'option内容',
                            required: true,
                            max: 100
                        })
                    }],
                    selectValue: ['selectValue', {
                        rules: createRules({
                            msg: 'option值',
                            required: true,
                            max: 100
                        })
                    }],
                    conditionLike: ['conditionLike', {
                        valuePropName: 'checked',
                        initialValue: false
                    }],
                    isDict: ['isDict', {
                        valuePropName: 'checked',
                        initialValue: true
                    }]
                },

                switchColors,
                modelStatus: 'add',
                updateIndex: undefined,
                visible: false,
                isSelectCommon: false, // 当类型为select时，可选择是否为通用方法调用获得option值
                dictionaryOptions: [], // 字典下拉选择数据
                postFormData: { // 顶部按钮的新增数据
                    conditionTitle: '',
                    conditionName: '',
                    conditionStart: "",
                    conditionEnd: "",
                    conditionType: 'string',
                    conditionSql: '',
                    dictCode: '',
                    selectSql: '',
                    selectLabel: '',
                    selectValue: '',
                    conditionLike: false,
                    isDict: true
                },
                postFormRules: { // 顶部按钮的表单验证规则
                    conditionTitle: createRules({
                        msg: '查询条件名称',
                        required: true,
                        max: 100,
                        validator: this.validatorQueryTermAddName
                    }),
                    conditionName: createRules({
                        msg: '字段key',
                        required: true,
                        max: 100,
                        validator: this.validatorQueryConditionName
                    }),
                    conditionType: createRules({
                        msg: '类型',
                        required: true
                    }),
                    dictCode: createRules({
                        msg: '字典',
                        required: true,
                        max: 100
                    }),
                    selectSql: createRules({
                        msg: '自定义查询sql',
                        required: true,
                        max: 100
                    }),
                    selectLabel: createRules({
                        msg: 'option内容',
                        required: true,
                        max: 100
                    }),
                    selectValue: createRules({
                        msg: 'option值',
                        required: true,
                        max: 100
                    }),
                    conditionSql: createRules({
                        msg: '查询sql',
                        required: true,
                        max: 300
                    }),
                    conditionLike: createRules({
                        msg: '查询sql',
                        required: true
                    })
                }
            }
        },
        created() {
            Api_DatabasesTablesaDictionaryColumns().then(res => {
                this.dictionaryOptions = res
            })
        },
        methods: {
            change(val){
                console.log(val);
                console.log(this.form.getFieldValue('isDict'));
            },
            openModel(row, updateIndex) {
                this.visible = true
                this.onClose()

                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        conditionType: 'string'
                    })
                    if (row) {
                        this.modelStatus = 'update'
                        this.updateIndex = updateIndex
                        const rowData = Object.assign({}, row)

                        const source = this.form.getFieldsValue()
                        for (const key in source) {
                            source[key] = rowData[key]
                            delete rowData[key]
                        }
                        this.form.setFieldsValue(source)
                        this.$nextTick(() => {
                            this.form.setFieldsValue(rowData)
                        })
                    } else {
                        this.modelStatus = 'add'
                        this.updateIndex = undefined
                    }
                })

            },
            // 保存新增的顶部按钮
            handleOk() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const postFormData = this.form.getFieldsValue()
                        let updateIndex
                        if (this.modelStatus === 'update') {
                            updateIndex = this.updateIndex
                        }
                        console.log(postFormData, updateIndex);

                        this.$emit('ok', postFormData, updateIndex)
                        this.visible = false
                        this.onClose()
                    }
                })
            },
            validatorQueryTermAddName(rule, value, callback) {
                const {conditionTitle} = this.form.getFieldsValue()
                const {updateIndex} = this
                const findRes = this.defaultList.find((item, index) => { // 查找查询条件名称是否已经存在
                    return item.conditionTitle === conditionTitle && updateIndex !== index
                })
                if (findRes) {
                    callback(new Error('查询条件名称已存在'))
                } else {
                    callback()
                }
            },
            validatorQueryConditionName(rule, value, callback) {
                if (!value) {
                    callback(new Error('字段key必填'))
                }
                if (value === 'id') {
                    callback(new Error('字段key不能是“id”'))
                } else {
                    callback()
                }
            },
            // 顶部按钮弹框关闭时
            onClose() {
                this.form.resetFields()
                this.modelStatus = 'add'
                this.updateIndex = undefined
                this.postFormData.selectLabel = ''
                this.postFormData.selectValue = ''
                this.postFormData.selectSql = ''
                this.postFormData.dictCode = ''
            }
        }
    }
</script>

<style scoped>
    .querySign-table {
        border: none;
    }
</style>
