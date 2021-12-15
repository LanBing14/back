<template>
    <div class="app-container" v-if="pageDataLoaded">
        <h2 class="flex border-left-primary-3">
            <span class="flex-primary">{{ pageData.subTitle }}</span>
            <el-button
                v-if="modelStatus !== 'view'"
                type="primary"
                plain
                @click="addRecord"
                >
添加
</el-button
            >
        </h2>
        <div class="page-content">
            <div class="page-content-body">
                <el-form
                    ref="dataForm"
                    :model="formData"
                    inline-message
                    label-position="right"
                    class="form-wrap"
                >
                    <el-table :data="formData.tableData" style="width: 100%">
                        <el-table-column type="index" label="#" width="50">
                        </el-table-column>
                        <el-table-column
                            v-for="(el, index) in pageData.columns"
                            v-if="el.show"
                            :key="index"
                            :prop="el.name"
                            :label="el.title"
                        >
                            <template
                                v-if="el.type === 'attachment'"
                                slot="header"
                            >
                                {{ el.title }}
                                <el-tooltip class="item" effect="dark">
                                    <template slot="content"
                                        >
* 只允许上传{{
                                            attachmentTypes[el.docType]
                                        }}格式的文件
</template
                                    >
                                    <i
                                        class="iconfont icon-question-circle"
                                    ></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <FormItem
                                    :scope="scope"
                                    :el="el"
                                    :patternRule="patternRule"
                                    :selectOptions="selectOptions"
                                    :selectOptionsKey="selectOptionsKey"
                                    :disabled="
                                        filterModelStatusDisabled(
                                            modelStatus
                                        ) || !el.editable
                                    "
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="modelStatus !== 'view'"
                            type="index"
                            label="操作"
                            width="80"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    @click="delRecord(scope.$index)"
                                    >
<i class="iconfont icon-close"></i
                                    >删除
</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
import {merge} from 'lodash'
import axios from 'axios'
import FormItem from './FormItem'
import {m} from '@/api/index'
import { Api_comboboxDict, Api_getAttachments } from '@/api/admin/index'
import {
    Api_ValidationRulesDetail,
    Api_DynamicsFormListEdit,
    Api_DynamicsFormSqlSelect,
    Api_DynamicsFormDelete
} from '@/api/admin/m/index'
import { encode64 } from '@/utils/base64'
import { strUnicode2Ansi } from '@/utils/unicode'

export default {
    name: "DynamicsFormEdit",
    components: { FormItem },
    props: {
        id: String,
        pid: String,
        pageData: Object, // 页面数据
        modelStatus: String,
        isTab: Boolean,
        subFormId: String,
        foreignKey: String
    },
    data() {
        return {
            formId: null, // 页面的表单id
            formData: {
                tableData: []
            }, // 列表数据
            actionBtns: [{
                text: '新增',
                icon: 'icon-plus',
                click: this.addRecord
            }],
            pageDataLoaded: false, // 页面数据是否已加载
            pagination: true, // 表格是否需要分页
            iconClass: { // 图标分类
                add: 'icon-plus',
                edit: 'icon-edit-square',
                delete: 'icon-delete',
                view: 'icon-eye',
                select: 'icon-select'
            },
            iconColor: { // 图标颜色
                edit: 'green',
                delete: 'red',
                view: 'green'
            },
            actionBtnEvent: { // 顶部按钮按钮事件
                add: this.handleCreate
            },
            rowActionBtnEvent: { // 每行按钮按钮事件
                edit: this.handleUpdate,
                delete: this.handleDel,
                view: this.handleView,
                select: this.handleSelect
            },
            listQuery: {}, // 查询条件，传后台
            selectOptions: {}, // 下拉框option的数据集，key: array
            selectOptionsKey: {}, // 通用方法获得的下拉框option所对应的label和value
            popupSelectData: {}, // popup选择的数据
            defaultFileList: {}, // 默认附件
            fileList: {}, // 当前附件的值
            patternRule: {}, // 正则规则
            pickerOptionsStart: {
                disabledDate: (time) => {
                    const { endDate } = this.listQuery;
                    return this.$limitTime('max', time, endDate);
                }
            },
            pickerOptionsEnd: {
                disabledDate: (time) => {
                    const { startDate } = this.listQuery;
                    return this.$limitTime('min', time, startDate);
                }
            },
            attachmentTypes: { // 附件上传类型
                pic: 'jpg,png,gif,bmp',
                doc: 'doc,docx,xls,xlsx,ppt,pptx,txt,pdf',
                zip: 'zip,rar',
                pdf: 'pdf'
            },
            promiseRes: []
        }
    },
    // mounted() {
    //     this.initPage(this.pageData);
    // },
    methods: {
        initPage() {
            const listJson = this.pageData;
            listJson.columns.forEach(item => {
                if (item.type === 'select') {
                    this.$set(this.selectOptions, item.name, []);
                    if (item.dictCode) { // 获取字典数据
                        this.getDict(item.dictCode, item.name);
                    } else {
                        this.selectOptionsKey[item.name] = {
                            label: item.selectLabel,
                            value: item.selectValue
                        };
                        this.getSelectVal(item.selectSql, item.name)
                    }
                } else if (item.type === 'attachment') {
                    this.$set(this.defaultFileList, item.name, []);
                    this.$set(this.fileList, item.name, []);
                } else if (item.type === 'popup') {
                    this.$set(this.popupSelectData, item.name, {});
                }
                // 如果有验证规则，调用接口获取规则
                if (item.validationRuleId) {
                    Api_ValidationRulesDetail(item.validationRuleId).then(res => {
                        this.$set(this.patternRule, item.name, new RegExp(res.expression, 'g'))
                    })
                }
            })
            // 完成页面骨骼数据加载
            this.pageDataLoaded = true;
            this.$nextTick(() => {
                // 获取列表数据
                this.getList();
            })
        },
        // 获取主列表数据
        getList() {
            const params = {
                formId: this.pid,
                isTab: this.isTab,
                subFormId: this.subFormId,
                [this.foreignKey]: this.id
            }
            Api_DynamicsFormListEdit(this.id, params).then(res => {
                if (res) {
                    const { columns } = this.pageData;
                    const columnsKeys = {};
                    columns.forEach(item => {
                        columnsKeys[item.name] = ''
                    });
                    res.forEach(row => {
                        for (const key in columnsKeys) {
                            if (!row.hasOwnProperty(key)) {
                                row[key] = '';
                            }
                        }
                    });
                    res.forEach(row => {
                        for (const key in row) {
                            const findRes = columns.find(item => item.name === key);
                            if (findRes && findRes.type === 'select' && findRes.isMulti) {
                                if (res[key]) {
                                    const valueKey = this.selectOptionsKey[key].value;
                                    const mapRes = this.selectOptions[key].map(item => item[valueKey]);
                                    const arr = [];
                                    mapRes.forEach(item => {
                                        if (item & res[key]) {
                                            arr.push(item);
                                        }
                                    });
                                    row[key] = arr;
                                } else {
                                    row[key] = [];
                                }
                            } else if (findRes && findRes.type === 'popup' && row[key]) {
                                const findRes = columns.find(item => item.name === key);

                                if (findRes) {
                                    this.getPopupVal(findRes, key, row[key], row)
                                }
                            } else if (findRes && findRes.type === 'attachment') {
                                this.getAttachment(key, row)
                            }
                        }
                    });
                    axios.all([...this.promiseRes]).then(() => {
                        this.formData.tableData = res;
                    })
                }
            })
        },
        // 返回数据
        getModelData() {
            let m = merge([], this.formData.tableData);
            const { columns } = this.pageData;
            m = m.map(item => {
                for (const key in item) {
                    const findRes = columns.find(item => item.name === key);
                    if (findRes && findRes.type === 'select' && findRes.isMulti) {
                        if (item[key]) {
                            const mapRes = item[key];
                            let n = 0;
                            mapRes.forEach(item => {
                                n += Number(item);
                            });
                            item[key] = n;
                        }
                    }
                }
                delete item[this.pageData.primaryKey]
                return item;
            });

            const o = {};
            if (m[0]) {
                for (const key in m[0]) {
                    o[key] = [];
                    m.forEach(item => {
                        o[key].push(item[key]);
                    })
                }
            }

            for (const key in o) {
                if (key.indexOf('defaultPopup') !== -1 || key.indexOf('defaultFileList') !== -1) {
                    delete o[key]
                }
            }
            // console.log(o)
            return o
        },
        // 新增
        handleCreate() {
        },
        // 修改
        handleUpdate() {
        },
        // 查看
        handleView() {

        },
        // 选择
        handleSelect() {

        },
        // 获取字典数据
        getDict(dictCode, selectOptionsKey) {
            Api_comboboxDict(dictCode, m).then(res => {
                this.selectOptions[selectOptionsKey] = res;
            })
        },
        // 获取select通用方法里的值
        getSelectVal(selectSql, selectOptionsKey) {
            const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql));
            Api_DynamicsFormSqlSelect(this.formId, sqlEncodeStr).then(res => {
                if (res) {
                    res = res.map(item => {
                        return {
                            ...item,
                            selectKey: selectOptionsKey
                        }
                    });
                    this.selectOptions[selectOptionsKey] = res;
                }
            })
        },
        // 获取popup通用方法里的值
        getPopupVal({ selectSql, selectLabel, selectValue }, nameKey, rowValue, row) {
            const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql));
            this.promiseRes.push(Api_DynamicsFormSqlSelect(this.formId, sqlEncodeStr, `${ nameKey.substring(nameKey.indexOf(')') + 1) }=${ rowValue }`).then(res => {
                if (res) {
                    if (res[0]) {
                        this.$set(row, 'defaultPopup' + nameKey, {
                            selectLabel: selectLabel,
                            selectValue: selectValue,
                            label: res[0][selectLabel],
                            value: res[0][selectValue]
                        })
                    }
                }
            }))
        },
        // 是否属于普通input类型
        isInputType(val) {
            return val === 'string' || val === 'integer' || val === 'double'
        },
        // 删除
        handleDel(row) {
            this.$confirm('确定删除该条数据?', '提示', {
                type: 'warning'
            }).then(() => {
                Api_DynamicsFormDelete(this.formId, row.id).then(msg => {
                    this.$message.success(msg)
                })
            })
        },
        // 生成picker时间控制选项配置
        getPickerOptions(d) {
            if (d.conditionEnd && this.listQuery[d.conditionEnd]) {
                return {
                    disabledDate: (time) => {
                        const endDate = this.listQuery[d.conditionEnd];
                        return this.$limitTime('max', time, endDate);
                    }
                }
            }
            if (d.conditionStart && this.listQuery[d.conditionStart]) {
                return {
                    disabledDate: (time) => {
                        const startDate = this.listQuery[d.conditionStart];
                        return this.$limitTime('min', time, startDate);
                    }
                }
            }
        },
        // 获取附件
        getAttachment(nameKey, row) {
            const id = row[this.pageData.primaryKey]
            this.promiseRes.push(Api_getAttachments(nameKey, id).then(res => {
                if (res && res.length) {
                    this.$set(row, nameKey, res.map(item => item.url).join(';'))
                    this.$set(row, 'defaultFileList' + nameKey, res.map(item => {
                        return {
                            url: item.url,
                            name: item.originalName
                        }
                    }));
                }
            }))
        },
        // 判断字段类型是否为指定的
        isConditionTypeInput(val) {
            return val === 'string' || val === 'double' || val === 'integer'
        },
        // 新增记录
        addRecord() {
            const newTableDataProp = {};
            this.pageData.columns.forEach(item => {
                newTableDataProp[item.name] = '';
            });
            this.formData.tableData.push(newTableDataProp)
        },
        // 删除一条记录
        delRecord(index) {
            this.formData.tableData.splice(index, 1)
        },
        // 清除数据
        clearData() {
            this.formData.tableData = [];
        },
        // 查看时禁用所有可输入项
        filterModelStatusDisabled(val) {
            return val === 'view';
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";

/deep/ .page-content {
    padding: 0;
    margin-top: 15px;
}

/deep/ .page-content-body {
    padding-left: 10px;
    padding-right: 10px;

    .el-form-item {
        margin-bottom: 0;
    }
}

.form-wrap {
    width: 100%;
}

.table-footer {
    width: 100%;
    text-align: center;
}

.queryTags-wrap {
    padding: 13px 15px 0;

    /deep/ .el-radio-button:first-child,
    /deep/ .el-radio-button:last-child {
        .el-radio-button__inner {
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
        }
    }

    /deep/ .el-radio-button {
        margin-right: 10px;

        .el-radio-button__inner {
            border-color: transparent;
        }
    }

    margin-bottom: 0;
    padding-bottom: 0;
    background-color: $bgGreey;
}
</style>
