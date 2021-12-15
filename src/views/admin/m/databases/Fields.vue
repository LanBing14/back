<template>
    <el-dialog
        ref="dialog"
        :title="'“'+title+'”表维护'"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="close"
        width="1050px"
    >
        <el-form
            ref="fieldForm"
            :model="formData"
            class="demo-form-inline" style="padding-top: 20px;padding-bottom: 20px;"
        >
            <table class="table">
                <thead>
                <tr>
                    <th>字段名</th>
                    <th>字段类型</th>
                    <th>长度</th>
                    <th>浮点长度</th>
                    <th>必填</th>
                    <th>主键</th>
                    <th>注释</th>
                    <th>默认值</th>
                    <th>字典</th>
                    <th>多选</th>
                    <th>验证规则</th>
                    <th>外键关联</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(el, index) in formData.list" :key="el.id">
                    <td>
                        <!--字段名-->
                        <el-form-item
                            :prop="'list.'+index+'.name'"
                            :rules="rules.name"
                        >
                            <el-input v-model="el.name" :disabled="el.id | filterHasRecord"
                                      @input="handleNameInput($event, el)"
                            />
                        </el-form-item>
                    </td>
                    <td>
                        <!--字段类型-->
                        <el-form-item
                            :prop="'list.'+index+'.type'"
                            :rules="rules.type"
                        >
                            <el-select v-model="el.type"
                                       :disabled="el.id | filterHasRecord"
                                       filterable
                                       @change="handleTypeChange($event, el)"
                            >
                                <el-option
                                    v-for="elType in typeOptions"
                                    :key="elType.value"
                                    :label="elType.label"
                                    :value="elType.value"
                                />
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>
                        <!--长度-->
                        <el-form-item
                            :prop="'list.'+index+'.length'"
                            :rules="rules.length"
                            style="width: 60px"
                        >
                            <el-input v-model="el.length" :disabled="el.id | filterHasRecord | filterLengthDisabled(el)"/>
                        </el-form-item>
                    </td>
                    <td>
                        <!--浮点长度-->
                        <el-form-item
                            :prop="'list.'+index+'.floatingLength'"
                            :rules="rules.floatingLength"
                            style="width: 60px"
                        >
                            <el-input v-model="el.floatingLength" :disabled="el.id | filterHasRecord | filterFloatingLengthDisabled(el)"/>
                        </el-form-item>
                    </td>
                    <td>
                        <!--必填-->
                        <el-form-item style="width: 30px;text-align: center">
                            <el-checkbox v-model="el.isMust" :checked="el.isMust" :disabled="el.id | filterHasRecord"></el-checkbox>
                        </el-form-item>
                    </td>
                    <td>
                        <!--主键-->
                        <el-form-item style="width: 30px;text-align: center">
                            <el-checkbox v-model="el.isPk" :checked="el.isPk" :disabled="el.id | filterHasRecord"></el-checkbox>
                        </el-form-item>
                    </td>
                    <td>
                        <!--注释-->
                        <el-form-item
                            :prop="'list.'+index+'.remark'"
                            :rules="rules.remark"
                        >
                            <el-input v-model="el.remark"/>
                        </el-form-item>
                    </td>
                    <td>
                        <!--默认值-->
                        <el-form-item
                            :prop="'list.'+index+'.defaultValue'"
                            :rules="[...rules.defaultValue,{'required':(el.isMust&&!el.isPk),'message':'默认值必填',trigger:'change'}]"
                        >
                            <el-input v-model="el.defaultValue"/>
                        </el-form-item>
                    </td>
                    <td>
                        <!--字典-->
                        <el-form-item
                            :prop="'list.'+index+'.dictCode'"
                            :rules="rules.dictCode"
                        >
                            <el-select v-model="el.dictCode" filterable>
                                <el-option
                                    v-for="elDic in dictionaryOptions"
                                    :key="elDic.value"
                                    :label="elDic.label"
                                    :value="elDic.value"
                                />
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>
                        <!--多选-->
                        <el-form-item
                            :prop="'list.'+index+'.isMulti'"
                            :rules="rules.isMulti"
                        >
                            <el-checkbox v-model="el.isMulti" :checked="el.isMulti" :disabled="el.isMulti | filterIsMulti(el.dictCode)"></el-checkbox>
                        </el-form-item>
                    </td>
                    <td>
                        <!--验证规则-->
                        <el-form-item
                            :prop="'list.'+index+'.validationRuleId'"
                            :rules="rules.validationRuleId"
                        >
                            <el-select v-model="el.validationRuleId" filterable>
                                <el-option
                                    v-for="elDic in validationRulesOptions"
                                    :key="elDic.value"
                                    :label="elDic.label"
                                    :value="elDic.value"
                                />
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>
                        <!--外键关联-->
                        <el-form-item
                            :prop="'list.'+index+'.fkTableId'"
                            :rules="rules.fkTableId"
                        >
                            <el-select v-model="el.fkTableId" filterable>
                                <el-option
                                    v-for="elDic in fkTableIdOptions"
                                    :key="elDic.value"
                                    :label="elDic.label"
                                    :value="elDic.value"
                                />
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>
                        <el-form-item style="width: 65px;">
                            <el-button type="success" icon="el-icon-plus" circle @click="addRecord()"/>
                            <el-button icon="el-icon-minus" circle
                                       @click="delRecord(index)"
                            />
                        </el-form-item>
                    </td>
                </tr>
                </tbody>
            </table>
            <el-alert
                v-if="!formData.list.length"
                :closable="false"
                title="暂无数据"
                type="warning"
                center
                style="margin-top: 20px;"
            >
            </el-alert>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleSsure()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {wordTips} from '@/utils/variables'
    import {m} from '@/api/index'
    import {Api_comboboxDict} from '@/api/admin/index'
    import {Api_ValidationRulesCombobox, Api_DatabasesTablesCombobox} from '@/api/admin/m/index'
    import {
        Api_DatabasesTablesColumnsGet,
        Api_DatabasesTablesaColumnsUpdate,
        Api_DatabasesTablesaDictionaryColumns
    } from '@/api/admin/m/index'

    export default {
        name: 'Fields',
        filters: {
            // 是否有记录id
            filterHasRecord(id) {
                return !!id
            },
            // 是否可选"长度"验证
            filterLengthDisabled(a, row) {
                return a || row.disabledLengthFloatingLength
            },
            // 是否可选"浮点长度"验证
            filterFloatingLengthDisabled(a, row) {
                return a || (row.disabledFloatingLength || row.disabledLengthFloatingLength)
            },
            // 是否可选"多选"验证
            filterIsMulti(isMulti, dictCode) {
                return !dictCode
            }
        },
        props: {
            tablesType: String,
            title: String,
        },
        data() {
            const createRules = this.$createRules;

            // id:name:type:length:floatingLength:isMust:isPk:remark:dictCode:editable:validationRuleId
            return {
                visible: false,
                tableId: '',
                rules: {
                    name: createRules({
                        msg: '字段名',
                        required: true,
                        EXP_ENG_NUM_2: true,
                        max: 30
                    }),
                    type: createRules({
                        msg: '字段类型',
                        required: true,
                        max: 50
                    }),
                    length: createRules({
                        msg: '长度',
                        required: true,
                        integer: true
                    }),
                    floatingLength: createRules({
                        msg: '浮点长度',
                        required: true,
                        integer: true
                    }),
                    isMust: createRules({
                        msg: '必填',
                        required: true
                    }),
                    isPk: createRules({
                        msg: '主键',
                        required: true
                    }),
                    defaultValue: createRules({
                        msg: '默认值',
                        max: 100
                    }),
                    remark: createRules({
                        msg: '注释',
                        required: true,
                        a0cn: true,
                        max: 100
                    }),
                    dictCode: createRules({
                        msg: '字典',
                        max: 100
                    }),
                    validationRuleId: createRules({
                        msg: '验证规则',
                        max: 50
                    }),
                    fkTableId: createRules({
                        msg: '外键关联',
                        max: 50
                    })
                },
                formData: {
                    list: [{}]
                },
                // 字段类型下拉选择数据
                typeOptions: [],
                // 字典下拉选择数据
                dictionaryOptions: [],
                // 验证字段下拉选择数据
                validationRulesOptions: [],
                // 外键关联下拉选择数据
                fkTableIdOptions: [],
                // 当前已有的字段名
                fieldsNames: [],
                fieldsNamesFlag: false
            }
        },
        watch: {
            'formData.list'(list) {
                this.fieldsNames = list.map(item => {
                    return item.name ? item.name.toLocaleLowerCase() : ''
                })
            }
        },
        created() {
            Api_DatabasesTablesaDictionaryColumns().then(res => {
                this.dictionaryOptions = res
            });
            Api_ValidationRulesCombobox().then(res => {
                this.validationRulesOptions = res
            })
        },
        methods: {
            filterIsmust(ismark) {
                return !!ismark
            },
            openModel(tableId, databaseId) {
                const loading = this.$openLoading();
                this.tableId = tableId;
                Api_DatabasesTablesColumnsGet({tableId}).then((res) => {
                    this.formData.list = res;
                    this.visible = true;
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
                Api_DatabasesTablesCombobox({databaseId}).then(res => {
                    this.fkTableIdOptions = res
                })
                Api_comboboxDict(this.tablesType + '_column_type', m).then(res => {
                    this.typeOptions = res
                })
            },
            // 添加一条新的数据
            addRecord() {
                this.formData.list.push({
                    editable: true,
                    id: null,
                    name: null,
                    type: null,
                    length: null,
                    floatingLength: null,
                    isMust: null,
                    isPk: null,
                    remark: null,
                    defaultValue: null,
                    dictCode: null,
                    validationRuleId: null,
                    isMulti: null,
                    fkTableId: null
                });
            },
            // 删除一条新的数据
            delRecord(index) {
                if (this.formData.list.length > 1) {
                    this.formData.list.splice(index, 1);
                }
            },
            // 点击确认
            handleSsure() {
                this.$refs['fieldForm'].validate((valid) => {
                    if (valid) {
                        const {tableId} = this;
                        const columns = this.formData.list.map((item) => {
                            if (item.type.indexOf('p,s') !== -1) {
                                item.type = item.type.replace('p,s', 'ps')
                            }
                            return `${item.id}:${item.name}:${item.type}:${item.length}:${item.floatingLength}:${item.isMust || 'false'}:${item.isPk ||
                            'false'}:${item.remark}:${item.defaultValue}:${item.dictCode}:${item.isMulti || 'false'}:${item.editable}:${item.validationRuleId}:${item.fkTableId}`
                        });
                        if (this.fieldsNamesFlag) {
                            this.$message.warning('字段不能重复！');
                            return;
                        }
                        const loading = this.$openLoading();
                        Api_DatabasesTablesaColumnsUpdate({tableId, columns: columns.join(',')}).then(msg => {
                            this.$message.success(msg);
                            this.$emit('getList')
                            this.visible = false;
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        })
                    }
                })
            },
            // 字段名输入事件，控件不能输入相同的字段名
            handleNameInput(val) {
                if (this.fieldsNames.indexOf(val.toLocaleLowerCase()) !== -1) {
                    this.$message.warning('字段名已存在！');
                    this.fieldsNamesFlag = true
                    // row.name = val.substring(0, val.length - 1)
                } else {
                    this.fieldsNamesFlag = false
                }
            },
            // 字段类型change事件
            handleTypeChange(val, row) {
                if (val.indexOf('(n)') !== -1) {
                    row.disabledFloatingLength = true
                    row.disabledLengthFloatingLength = false
                    row.floatingLength = 0
                    row.length = ''
                } else if (val.indexOf('(p,s)') !== -1) {
                    row.disabledFloatingLength = false
                    row.disabledLengthFloatingLength = false
                    row.length = ''
                    row.floatingLength = ''
                } else {
                    row.disabledFloatingLength = true
                    row.disabledLengthFloatingLength = true
                    row.length = 0
                    row.floatingLength = 0
                }
            },
            beforeClose(done) {
                this.$confirm(wordTips.drawerLeaveTip, '提示', {
                    type: 'warning'
                }).then(() => {
                    done();
                })
            },
            close() {

            }
        }
    }
</script>

<style scoped lang="scss">
    .demo-form-inline {
        min-height: 400px;
    }

    .table {
        width: 100%;

        td {
            padding: 0 4px;
        }
    }

    .el-button.is-circle {
        margin: 0;
    }

    /deep/ .el-input .el-input__inner {
        border-color: #b1b3b6;
        color: #757678;
    }

    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        border-color: #b1b3b6;
        color: #757678;
    }

    /deep/ .el-select .el-input .el-input__inner:hover {
        border-color: #b1b3b6;
    }

    /deep/ .el-select .el-input .el-select__caret {
        color: #757678;
    }
    table button.el-button.el-button--mini.is-circle{
        height: 28px;
        padding: 3px 6px;
    }
    /*/deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after{*/
    /*border-color: #b1b3b6;*/
    /*}*/
</style>
