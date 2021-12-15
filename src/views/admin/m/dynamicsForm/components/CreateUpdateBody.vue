<template>
    <div>
        <el-form
            v-if="model"
            ref="dataForm"
            :model="postFormData"
            label-position="right"
            label-width="8em"
            class="form-wrap"
        >
            <el-form-item
                v-for="(el, index) in model.columns"
                :key="index"
                :label="el.title"
                :prop="el.name"
                :rules="$createRules({
                        msg: el.title,
                        required: !el.nullable && !filterModelStatusDisabled(modelStatus),
                        max: el.length,
                        pattern: patternRule[el.name],
                        validator: validatorFn[el.name]
                    }, 'blur', ((el.type==='select'&& el.isMulti) ? 'array' : null))"
                :style="{
                        width: parseFloat(Number(el.colspan)/Number(model.rowColumns))*100+'%'
                    }"
            >
                <template v-if="el.show">
                    <template v-if="isInputType(el.type)">
                        <el-input
                            v-model="postFormData[el.name]"
                            :placeholder="'请输入'+el.title"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                        />
                    </template>
                    <template v-if="el.type === 'textarea'">
                        <el-input
                            v-model="postFormData[el.name]"
                            :placeholder="'请输入'+el.title"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            type="textarea"
                        />
                    </template>
                    <template v-else-if="el.type === 'select'">
                        <el-select
                            v-model="postFormData[el.name]"
                            :multiple="el.isMulti"
                            :placeholder="'请选择'+el.title"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            clearable
                            filterable
                            style="width: 100%;"
                        >
                            <template v-if="!el.selectSql">
                                <el-option
                                    v-for="option in selectOptions[el.name]"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value"
                                />
                            </template>
                            <template v-else>
                                <el-option
                                    v-for="(option, index) in selectOptions[el.name]"
                                    :key="index"
                                    :label="!option.selectKey ? '' : option[selectOptionsKey[option.selectKey].label]"
                                    :value="!option.selectKey ? '' : option[selectOptionsKey[option.selectKey].value]"
                                />
                            </template>
                        </el-select>
                    </template>
                    <template v-else-if="el.type === 'date'">
                        <el-date-picker
                            v-model="postFormData[el.name]"
                            :placeholder="'请选择'+el.title"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            value-format="yyyy-MM-dd"
                            type="date"
                        />
                    </template>
                    <template v-else-if="el.type === 'datetime'">
                        <el-date-picker
                            v-model="postFormData[el.name]"
                            :placeholder="'请选择'+el.title"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            type="datetime"
                        />
                    </template>
                    <template v-else-if="el.type === 'attachment'">
                        <Upload
                            ref="ref_upload"
                            :defaultList="defaultFileList[el.name]"
                            :list.sync="fileList[el.name]"
                            :fileSize="el.docSize"
                            :fileType="attachmentTypes[el.docType]"
                            :limit="el.docNum"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            @onFileChange="onFileChange($event, el)"
                        >
                            <template v-if="attachmentTypes[el.docType]" slot="tip">
                                <p style="color: red;">* 只允许上传{{ attachmentTypes[el.docType] }}格式的文件</p>
                            </template>
                        </Upload>
                    </template>
                    <template v-else-if="el.type === 'popup'">
                        <el-button
                            v-if="(!popupSelectData[el.name]||!popupSelectData[el.name][el.selectLabel])&&modelStatus!=='view' || !el.editable"
                            @click="handleSelectPopup(el, el.name, el.selectValue)">
                            选择
                        </el-button>
                        <div v-if="popupSelectData[el.name]" class="popup-select-data">
                            <el-tag
                                v-if="popupSelectData[el.name][el.selectLabel]"
                                :closable="!filterModelStatusDisabled(modelStatus) || !el.editable"
                                @close="handlePupupTagClose(el)"
                                style="margin-right: 15px;"
                            >
                                {{ popupSelectData[el.name] && popupSelectData[el.name][el.selectLabel] }}
                            </el-tag>
                        </div>
                    </template>
                    <template v-else-if="el.type === 'boolean'">
                        <el-switch
                            v-model="postFormData[el.name]"
                            :disabled="filterModelStatusDisabled(modelStatus) || !el.editable"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"/>
                    </template>
                </template>
            </el-form-item>
        </el-form>
        <template v-if="model">
            <div v-for="el in model.normals" v-if="el.type==='1'" :key="el.id" style="margin-top: 25px;">
                <ListEdit
                    ref="ref_listEdit"
                    :pageData="el"
                    :pid="model.formId"
                    :id="rowId"
                    :modelStatus="modelStatus"
                    :subFormId="el.formId"
                    :foreignKey="el.foreignKey"/>
            </div>
        </template>
        <PopupSelect ref="ref_PopupSelect" @ok="onPopupSelectOk"></PopupSelect>
    </div>
</template>

<script type="text/jsx">
import axios from 'axios'
import * as validates from '@/utils/validate'
import { encode64 } from '@/utils/base64'
import { strUnicode2Ansi } from '@/utils/unicode'
import { switchColors } from '@/utils/variables'
import Upload from '@/components/Upload'
import ListEdit from './ListEdit'
import PopupSelect from './PopupSelect'
import { m } from '@/api/index'
import { Api_comboboxDict, Api_getAttachments } from '@/api/admin/index'
import {
    Api_ValidationRulesDetail,
    Api_DynamicsFormDetail,
    Api_DynamicsFormSqlSelect,
    Api_DynamicsFormAddUpdate
} from '@/api/admin/m/index'

export default {
    name: 'CreateUpdateBody',
    components: {
        ListEdit,
        Upload,
        PopupSelect
    },
    props: {
        model: Object,
        modelStatus: String,
        rowId: String, // 当前记录id
        formId: String // 当前模型页面的表单id
    },
    data () {
        return {
            switchColors,
            pageLoaded: false,
            modelType: undefined, // 新增上级部门或者子部门标识
            visible: false, // 是否显示
            postFormData: {}, // 传递后台数据
            selectOptions: {}, // 下拉框option的数据集，key: array
            selectOptionsKey: {}, // 通用方法获得的下拉框option所对应的label和value
            defaultFileList: {}, // 附件的默认值
            fileList: {}, // 当前附件的值
            patternRule: {}, // 正则规则
            validatorFn: {}, // js验证方法
            popupSelectData: {}, // popup选择的数据
            attachmentTypes: { // 附件上传类型
                pic: 'jpg,png,gif,bmp',
                doc: 'doc,docx,xls,xlsx,ppt,pptx,txt,pdf',
                zip: 'zip,rar',
                pdf: 'pdf'
            }
        }
    },
    watch: {
        model (val) {
            if (val) {
                this.initModel()
            }
        }
    },
    mounted () {
        if (this.model) {
            this.initModel()
        }
    },
    methods: {
        init () {
            this.$nextTick(() => {
                const ref_listEdit = this.$refs.ref_listEdit
                if (ref_listEdit && ref_listEdit.length) {
                    ref_listEdit.forEach(comp => {
                        comp.initPage()
                    })
                }
                if (this.modelStatus === 'update' || this.modelStatus === 'view') {
                    this.getDetail()
                } else {
                    this.$nextTick(() => {
                        this.pageLoaded = true
                        this.visible = true
                    })
                }
            })
        },
        initModel () {
            const promiseArrs = this.initData()
            if (promiseArrs.length) {
                axios.all(promiseArrs).then(() => {
                    this.init()
                })
            } else {
                this.init()
            }
        },
        initData () {
            const promiseArrs = []
            const { columns } = this.model
            columns.map(item => {
                if (item.type === 'select' && item.isMulti) {
                    this.$set(this.postFormData, item.name, [])
                } else {
                    this.$set(this.postFormData, item.name, '')
                }
            })
            // 格式化表单属性项
            this.model.columns.map(item => {
                if (item.type === 'select') {
                    this.$set(this.selectOptions, item.name, [])

                    if (item.isDict) { // 获取字典数据
                        promiseArrs.push(this.getDict(item.dictCode, item.name))
                    } else {
                        this.selectOptionsKey[item.name] = {
                            label: item.selectLabel,
                            value: item.selectValue
                        }
                        promiseArrs.push(this.getSelectVal(item.selectSql, item.name))
                    }
                } else if (item.type === 'attachment') {
                    this.$set(this.defaultFileList, item.name, [])
                    this.$set(this.fileList, item.name, [])
                } else if (item.type === 'popup') {
                    this.$set(this.popupSelectData, item.name, {})
                }

                // 如果有验证规则，调用接口获取规则
                if (item.validationRuleId) {
                    Api_ValidationRulesDetail(item.validationRuleId).then(res => {
                        this.$set(this.patternRule, item.name, new RegExp(res.expression, 'g'))
                    })
                }
                if (item.jsValidator) {
                    this.$set(this.validatorFn, item.name, this.createJsValidator(item.jsValidator))
                } else {
                    this.$set(this.validatorFn, item.name, null)
                }
                return {
                    ...item
                }
            })
            return promiseArrs
        },
        // 创建表单项自定义的验证方法
        createJsValidator (jsValidator) {
            return (rule, value, callback) => {
                if (!validates[jsValidator](value)) {
                    callback(new Error('不符合验证规则'))
                } else {
                    callback()
                }
            }
        },
        getDetail () {
            Api_DynamicsFormDetail(this.rowId, this.formId).then(res => {
                if (res) {
                    for (const key in this.postFormData) {
                        const findRes = this.model.columns.find(item => item.name === key)
                        if (findRes && findRes.type === 'select' && findRes.isMulti) {
                            if (res[key]) {
                                const arr = []
                                if (findRes.isDict) {
                                    const mapRes = this.selectOptions[key].map(item => item.value)
                                    mapRes.forEach(item => {
                                        if (item & res[key]) {
                                            arr.push(item)
                                        }
                                    })
                                } else {
                                    const valueKey = this.selectOptionsKey[key].value
                                    const mapRes = this.selectOptions[key].map(item => item[valueKey])
                                    mapRes.forEach(item => {
                                        if (item & res[key]) {
                                            arr.push(item)
                                        }
                                    })
                                }

                                this.postFormData[key] = arr
                            } else {
                                this.postFormData[key] = []
                            }
                        } else if (findRes && findRes.type === 'popup' && res[key]) {
                            const findRes = this.model.columns.find(item => item.name === key)
                            if (findRes) {
                                this.getPopupVal(findRes, key, res[key])
                            }
                        } else if (findRes && findRes.type === 'attachment') {
                            this.getAttachment(key)
                        } else {
                            this.postFormData[key] = res[key]
                        }
                    }
                }
                this.$nextTick(() => {
                    this.pageLoaded = true
                    this.visible = true
                })
            }).catch(() => {
            })
        },
        /**
         * 点击确认
         * @param params    配置表单时的额外参数
         * @param url       如果配置时有配置url参数，则接口采用配置的url
         * @param success   调用成功时通知父组件
         * @param error     调用失败时通知父组件
         */
        handleSure (params, url, success, error) {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const { formId } = this
                    const postParams = {}
                    params.forEach(item => {
                        const replaceValue = item.value.replace(/[$\{\}]+/g, '')
                        if (item.type !== 'form') {
                            if (item.value && item.value.indexOf('$') !== -1 && this.postFormData.hasOwnProperty(replaceValue)) {
                                postParams[item.type + '.' + item.key] = this.postFormData[replaceValue]
                            } else if (item.value && !item.isTask) {
                                postParams[item.type + '.' + item.key] = item.value
                            }
                        } else {
                            postParams[item.key] = item.value
                        }
                        if (item.isTask) {
                            postParams['global.' + item.key] = item.value
                        }
                    })
                    const postData = {
                        ...this.postFormData,
                        ...postParams,
                        [this.model.primaryKey]: this.rowId
                    }

                    for (const key in postData) {
                        const findRes = this.model.columns.find(item => item.name === key)
                        if (findRes && findRes.type === 'select' && findRes.isMulti) {
                            if (postData[key]) {
                                const mapRes = postData[key]
                                let n = 0
                                mapRes.forEach(item => {
                                    n += Number(item)
                                })
                                postData[key] = n
                            }
                        }
                    }
                    let listEditData = {}
                    if (this.$refs.ref_listEdit) {
                        this.$refs.ref_listEdit.map(comp => {
                            listEditData = {
                                ...listEditData,
                                ...comp.getModelData()
                            }
                        })
                    }

                    let promiseRes = null
                    // if (this.modelStatus === 'add') { // 新增
                    promiseRes = Api_DynamicsFormAddUpdate(url, formId, {
                        ...postData,
                        ...listEditData
                    })
                    // } else { // 修改
                    //     promiseRes = Api_DynamicsFormAddUpdate(formId, {
                    //         ...postData,
                    //         ...listEditData
                    //     })
                    // }
                    const loading = this.$openLoading()
                    promiseRes.then(res => {
                        success(res)
                        loading.close()
                    }).catch(() => {
                        error()
                        loading.close()
                    })
                }
            })
        },
        // 打开popup
        handleSelectPopup (row, popupNameKey, popupValueKey) {
            this.$refs.ref_PopupSelect.openModel(row.formId, popupNameKey, popupValueKey)
        },
        // popup选择成功时
        onPopupSelectOk (row, popupNameKey, popupValueKey) {
            for (const key in row) {
                this.$set(this.popupSelectData[popupNameKey], key, row[key])
            }
            this.postFormData[popupNameKey] = row[popupValueKey]
            this.$refs['dataForm'].validateField([popupNameKey])
        },
        // popup的标签关闭时
        handlePupupTagClose (row) {
            this.popupSelectData[row.name][row.selectLabel] = ''
            this.popupSelectData[row.name][row.selectValue] = ''
            this.$refs['dataForm'].validateField([row.name])
        },
        // 获取字典数据
        getDict (dictCode, selectOptionsKey) {
            return Api_comboboxDict(dictCode, m).then(res => {
                this.selectOptions[selectOptionsKey] = res
            })
        },
        // 获取select通用方法里的值
        getSelectVal (selectSql, selectOptionsKey) {
            const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql))
            return Api_DynamicsFormSqlSelect(this.formId, sqlEncodeStr).then(res => {
                if (res) {
                    res = res.map(item => {
                        return {
                            ...item,
                            selectKey: selectOptionsKey
                        }
                    })
                    this.selectOptions[selectOptionsKey] = res
                }
            })
        },
        // 获取popup通用方法里的值
        getPopupVal ({ selectSql, selectLabel, selectValue }, nameKey, rowValue) {
            const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql))
            Api_DynamicsFormSqlSelect(this.formId, sqlEncodeStr, `${ nameKey.substring(nameKey.indexOf(')') + 1) }=${ rowValue }`).then(res => {
                if (res) {
                    if (res[0]) {
                        this.$set(this.popupSelectData[nameKey], selectLabel, res[0][selectLabel])
                        res[0] && (this.postFormData[nameKey] = res[0][selectValue])
                    }
                }
            })
        },
        // 获取附件
        getAttachment (nameKey) {
            Api_getAttachments(nameKey, this.rowId).then(res => {
                this.postFormData[nameKey] = res.map(item => item.url).join(';')
                this.defaultFileList[nameKey] = res.map(item => {
                    return {
                        url: item.url,
                        name: item.originalName
                    }
                })
            })
        },
        // 是否属于普通input类型
        isInputType (val) {
            return val === 'string' || val === 'integer' || val === 'double'
        },
        // 附件上传change
        onFileChange (list, row) {
            this.postFormData[row.name] = list.map(item => item.url).join(';')
            this.$refs['dataForm'].validateField([row.name])
        },
        // 查看时禁用所有可输入项
        filterModelStatusDisabled (val) {
            return val === 'view'
        },
        // 模态框关闭时
        onClose () {
            this.$refs['dataForm'] && this.$refs['dataForm'].resetFields()
            this.pageLoaded = false
            // 格式化表单属性项
            this.model.columns.forEach(item => {
                if (item.type === 'popup') {
                    this.popupSelectData[item.name][item.selectLabel] = ''
                    this.popupSelectData[item.name][item.selectValue] = ''
                } else if (item.type === 'attachment') {
                    this.defaultFileList[item.name] = []
                }
            })
            const ref_listEdit = this.$refs.ref_listEdit
            if (ref_listEdit) {
                ref_listEdit.forEach(comp => {
                    comp.clearData()
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">

    .form-wrap {
        display: flex;
        flex-wrap: wrap;

        &:after {
            content: '';
            display: block;
            clear: both;
        }

        .el-form-item {
            float: left;
        }
    }

    .popup-select-data {
        display: inline-block;
        vertical-align: middle;
    }
</style>
