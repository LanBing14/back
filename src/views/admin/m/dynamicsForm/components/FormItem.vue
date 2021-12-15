<template>
    <div class="form-item-wrap">
        <el-form-item
            :prop="'tableData.'+scope.$index+'.'+el.name"
            :rules="$createRules({
                                    msg: el.title,
                                    required: el.nullable,
                                    max: el.length,
                                    pattern: patternRule[el.name]
                                }, 'blur', ((el.type==='select'&& el.isMulti) ? 'array' : null))"
        >
            <template v-if="isInputType(el.type)">
                <el-input
                    v-model="scope.row[el.name]"
                    :placeholder="'请输入'+el.title"
                    :disabled="disabled"
                    style="width: auto;"
                />
            </template>
            <template v-if="el.type === 'textarea'">
                <el-input
                    v-model="scope.row[el.name]"
                    :placeholder="'请输入'+el.title"
                    :disabled="disabled"
                    type="textarea"
                />
            </template>
            <template v-else-if="el.type === 'select'">
                <el-select
                    v-model="scope.row[el.name]"
                    :multiple="el.isMulti"
                    :placeholder="'请选择'+el.title"
                    :disabled="disabled"
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
                    v-model="scope.row[el.name]"
                    :placeholder="'请选择'+el.title"
                    :disabled="disabled"
                    value-format="yyyy-MM-dd"
                    type="date"
                />
            </template>
            <template v-else-if="el.type === 'datetime'">
                <el-date-picker
                    v-model="scope.row[el.name]"
                    :placeholder="'请选择'+el.title"
                    :disabled="disabled"
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
                    :disabled="disabled"
                    @onFileChange="onFileChange($event, el)"
                />
            </template>
            <template v-else-if="el.type === 'popup'">
                <el-button
                    v-if="(!popupSelectData[el.name]||!popupSelectData[el.name][el.selectLabel])&&!disabled"
                    @click="handleSelectPopup(el, el.name, el.selectValue)">
                    选择
                </el-button>
                <div v-if="popupSelectData[el.name]" class="popup-select-data">
                    <el-tag
                        v-if="popupSelectData[el.name][el.selectLabel]"
                        closable
                        @close="handlePupupTagClose(el)"
                        style="margin-right: 15px;"
                    >
                        {{ popupSelectData[el.name] && popupSelectData[el.name][el.selectLabel] }}
                    </el-tag>
                </div>
            </template>
            <template v-else-if="el.type === 'boolean'">
                <el-switch
                    v-model="scope.row[el.name]"
                    :active-color="switchColors.active"
                    :inactive-color="switchColors.inactive"/>
            </template>
        </el-form-item>
        <PopupSelect ref="ref_PopupSelect" @ok="onPopupSelectOk"></PopupSelect>
    </div>
</template>

<script>
    import Upload from '@/components/Upload'
    import PopupSelect from './PopupSelect'

    export default {
        name: "FormItem",
        components: {
            Upload,
            PopupSelect
        },
        props: {
            scope: Object,
            el: Object,
            selectOptions: Object,
            selectOptionsKey: Object,
            patternRule: Object,
            disabled: Boolean
        },
        data() {
            return {
                // selectOptions: {}, // 下拉框option的数据集，key: array
                // selectOptionsKey: {}, // 通用方法获得的下拉框option所对应的label和value
                popupSelectData: {}, // popup选择的数据
                defaultFileList: {}, // 附件的默认值
                fileList: {}, // 当前附件的值
                attachmentTypes: { // 附件上传类型
                    pic: 'jpg,png,gif,bmp',
                    doc: 'doc,docx,xls,xlsx,ppt,pptx,txt,pdf',
                    zip: 'zip,rar',
                    pdf: 'pdf'
                }
            }
        },
        mounted() {
            const { el, scope } = this;
            const { type, name } = el;
            if (type === 'attachment') {
                const a = scope.row['defaultFileList' + name];

                if (a) {
                    this.$set(this.defaultFileList, name, a);
                    this.$set(this.fileList, name, a);
                } else {
                    this.$set(this.defaultFileList, name, []);
                    this.$set(this.fileList, name, []);
                }
            } else if (type === 'popup') {
                const p = scope.row['defaultPopup' + name];
                if (p) {
                    this.$set(this.popupSelectData, name, {
                        [p.selectLabel]: p.label,
                        [p.selectValue]: p.value
                    });
                } else {
                    this.$set(this.popupSelectData, name, {});
                }
            } else if (type === 'select' && el.isMulti) {
                this.scope.row[el.name] = []
            }
        },
        methods: {
            // 打开popup
            handleSelectPopup(row, popupNameKey, popupValueKey) {
                this.$refs.ref_PopupSelect.openModel(row.formId, popupNameKey, popupValueKey)
            },
            // popup选择成功时
            onPopupSelectOk(row, popupNameKey, popupValueKey) {
                for (const key in row) {
                    this.$set(this.popupSelectData[popupNameKey], key, row[key]);
                }
                this.scope.row[popupNameKey] = row[popupValueKey];
            },
            // popup的标签关闭时
            handlePupupTagClose(row) {
                this.popupSelectData[row.name][row.selectLabel] = '';
                this.popupSelectData[row.name][row.selectValue] = '';
                this.scope.row[row.name] = '';
            },
            // 是否属于普通input类型
            isInputType(val) {
                return val === 'string' || val === 'integer' || val === 'double'
            },
            // 附件上传change
            onFileChange(list, row) {
                this.scope.row[row.name] = list.map(item => item.url).join(';');
            }
        }
    }
</script>

<style scoped lang="scss">
    .popup-select-data {
        display: inline-block;
        vertical-align: middle;
    }

    .form-item-wrap /deep/ input {
        width: 100%;
    }
</style>
