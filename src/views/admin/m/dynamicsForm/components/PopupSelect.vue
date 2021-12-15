<template>
    <el-dialog
        ref="dialog"
        title="popup"
        :visible.sync="visible"
        append-to-body
        :close-on-click-modal="false"
        @close="onModelClose"
        width="1050px"
    >
        <div class="app-container" v-if="pageDataLoaded">
            <el-form
                ref="queryTagForm"
                class="queryTags-wrap"
                label-width="5em"
                label-position="left"
            >
                <el-form-item v-for="(el, index) in queryTagsRender" :key="index" :label="el.groupName+'：'" style="margin-left: 10px;">
                    <el-radio-group v-model="tagGroups[queryTagsGroupKey + index]" @change="handleQueryTagsChange($event, index)">
                        <el-radio-button label="">
                            不限
                        </el-radio-button>
                        <el-radio-button v-for="(tag, tagIndex) in el.tags" :label="tag.tagName" :key="tagIndex">
                            {{ tag.tagName }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form
                ref="searchForm"
                :model="listQuery"
                :inline="true"
                class="demo-form-inline searchForm-wrap"
            >
                <el-form-item
                    v-for="(el, index) in listQueryRender"
                    :key="index"
                    :prop="el.conditionName"
                >
                    <template v-if="isConditionTypeInput(el.conditionType)">
                        <el-input v-model="listQuery[el.conditionName]" :placeholder="el.conditionTitle"/>
                    </template>
                    <template v-else-if="el.conditionType === 'select'">
                        <el-select
                            v-model="listQuery[el.conditionName]"
                            :placeholder="el.conditionTitle"
                            clearable
                            filterable
                        >
                            <template v-if="!el.selectSql">
                                <el-option
                                    v-for="option in selectOptions[el.conditionName]"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value"
                                />
                            </template>
                            <template v-else>
                                <el-option
                                    v-for="option in selectOptions[el.conditionName]"
                                    :key="option.value"
                                    :label="!option.selectKey ? '' : option[selectOptionsKey[option.selectKey].label]"
                                    :value="!option.selectKey ? '' : option[selectOptionsKey[option.selectKey].value]"
                                />
                            </template>
                        </el-select>
                    </template>
                    <template v-else-if="el.conditionType === 'date'">
                        <el-date-picker
                            v-model="listQuery[el.conditionName]"
                            :pickerOptions="getPickerOptions(el)"
                            :placeholder="el.conditionTitle"
                            value-format="yyyy-MM-dd"
                            type="date"
                        />
                    </template>
                    <template v-else-if="el.conditionType === 'datetime'">
                        <el-date-picker
                            v-model="listQuery[el.conditionName]"
                            :pickerOptions="getPickerOptions(el)"
                            :placeholder="el.conditionTitle"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            type="datetime"
                        />
                    </template>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter"
                    >
                        查询
                    </el-button>
                    <el-button
                        class="filter-item"
                        icon="icon iconfont icon-undo"
                        @click="handleReset('searchForm')"
                    >
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="page-content" style="padding: 0;">
                <div class="page-content-body">
                    <TableWrapper
                        ref="child"
                        :fetch-data-fn="getPageApi()"
                        :query="listQuery"
                        :columns="tableCol"
                        :pagination="pagination"
                        :currentChange="tableCurrentChange"
                    />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script type="text/jsx">
    import Button from '@/components/Button'
    import TableWrapper from '@/components/TableWrapper'
    import {m} from '@/api/index'
    import {Api_comboboxDict} from '@/api/admin/index'
    import {
        Api_FormModelBuildDetail,
        Api_DynamicsFormGetPage,
        Api_DynamicsFormGetList,
        Api_DynamicsFormSqlSelect
    } from '@/api/admin/m/index'
    import {encode64} from '@/utils/base64'
    import {strUnicode2Ansi} from '@/utils/unicode'

    export default {
        name: "PopupSelect",
        components: {TableWrapper},
        data() {
            return {
                Api_DynamicsFormGetPage,
                visible: false,
                formId: null, // 页面的表单id
                popupNameKey: null, // 当前popup在父组件里所属的字段名，用于通知父组件中给哪个popup设置值
                popupValueKey: null, // popup应该是取什么值
                listData: [], // 列表数据
                pageDataLoaded: false, // 页面数据是否已加载
                pageData: null, // 页面数据
                pagination: true, // 表格是否需要分页
                iconColor: { // 图标颜色
                    edit: 'green',
                    delete: 'red',
                    view: 'green'
                },
                queryTagsGroupKey: 'tagGroup', // 查询标签分组的key
                tagGroups: {}, // 查询标签，传后台
                queryTagsRender: [], // 查询标签的渲染数据
                listQuery: {}, // 查询条件，传后台
                listQueryRender: [], // 查询条件的渲染数据
                selectOptions: {}, // 下拉框option的数据集，key: array
                selectOptionsKey: {}, // 通用方法获得的下拉框option所对应的label和value
                tableCol: [], // 表格列
                pickerOptionsStart: {
                    disabledDate: (time) => {
                        const {endDate} = this.listQuery;
                        return this.$limitTime('max', time, endDate);
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: (time) => {
                        const {startDate} = this.listQuery;
                        return this.$limitTime('min', time, startDate);
                    }
                },
                selectData: undefined
            }
        },
        // created() {
        //     const {id: formId} = this.$route.query;
        //     this.formId = formId;
        //     Api_FormModelBuildDetail(formId).then(res => {
        //         this.pageData = {...res};
        //         res.model && this.initPage(res.model);
        //     });
        // },
        methods: {
            openModel(formId, popupNameKey, popupValueKey) {
                this.formId = formId;
                this.popupNameKey = popupNameKey;
                this.popupValueKey = popupValueKey;
                Api_FormModelBuildDetail(formId).then(res => {
                    this.pageData = {...res};
                    res.model && this.initPage(res.model);
                    !res.model && this.$message.warning(`暂无 “${res.name}” 表单建模信息，请先建模！`)
                });
            },
            // 获得页面列表接口
            getPageApi() {
                return this.pagination ? Api_DynamicsFormGetPage : Api_DynamicsFormGetList;
            },
            initPage(listJson) {
                this.pagination = listJson.paging;
                this.listQuery.id = this.pageData.id;

                // 格式化查询条件渲染数据
                this.listQueryRender = listJson.queryConditions.map(item => {
                    if (item.conditionType === 'select') {
                        this.$set(this.selectOptions, item.conditionName, []);
                        if (item.dictCode) { // 获取字典数据
                            this.getDict(item.dictCode, item.conditionName);
                        }
                        if (item.selectSql) {
                            this.selectOptionsKey[item.conditionName] = {
                                label: item.selectLabel,
                                value: item.selectValue
                            };
                            this.getSelectSql(item.selectSql, item.conditionName);
                        }
                    }
                    this.$set(this.listQuery, item.conditionName, '');

                    return {
                        ...item
                    }
                });
                // 格式化查询标签渲染数据
                this.$set(this.listQuery, 'tagGroups', []);
                this.queryTagsRender = listJson.tagGroups.map((item, index) => {
                    this.$set(this.tagGroups, this.queryTagsGroupKey + index, '');
                    this.$set(this.listQuery.tagGroups, index, {
                        groupName: item.groupName,
                        tagName: []
                    });
                    return {
                        ...item
                    }
                });

                // 格式化列数据
                const tableColArrs = listJson.queryColumns.filter(item => item.show)
                    .map(item => {
                        return {
                            key: item.name,
                            label: item.annotation
                        }
                    });
                // 格式化每行的操作列数据
                if (listJson.rowButtons.length) {
                    tableColArrs.push({
                        key: null,
                        label: '操作',
                        align: 'center',
                        render: (h, data, row) => {
                            const rowActionBtns = [];
                            listJson.rowButtons.forEach(item => {
                                rowActionBtns.push(
                                    <Button
                                        iconClass='icon-select'
                                        row={row}
                                        text={item.name}
                                        click={this.handleSelect.bind(this, item, row)}/>
                                )
                            });
                            return rowActionBtns;
                        }
                    })
                }
                this.tableCol = tableColArrs;

                // 完成页面骨骼数据加载
                this.pageDataLoaded = true;
                this.visible = true;
                this.$nextTick(() => {
                    // 获取列表数据
                    this.getList();
                })
            },
            // 获取主列表数据
            getList() {
                this.$refs.child.fetchData()
            },
            // 进行查询
            handleFilter() {
                this.getList()
            },
            // 重置查询条件
            handleReset(formName) {
                this.$refs[formName].resetFields();
                this.getList()
            },
            // 选择一条数据
            handleSelect(actionBtn, row) {
                this.$emit('ok', {...row}, this.popupNameKey, this.popupValueKey);
                if (actionBtn.close) {
                    this.visible = false;
                } else {
                    this.$message.success('已选择该条数据，请关闭窗口！')
                }
            },
            // 表格单选时
            tableCurrentChange(row) {
                this.selectData = row;
            },
            // 查询标签change事件
            handleQueryTagsChange(v, index) {
                console.log(v, index)
            },
            // 获取字典数据
            getDict(dictCode, selectOptionsKey) {
                Api_comboboxDict(dictCode, m).then(res => {
                    this.selectOptions[selectOptionsKey] = res;
                })
            },
            // 获取下拉框通用方法
            getSelectSql(selectSql, selectOptionsKey) {
                const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql));
                Api_DynamicsFormSqlSelect(this.formId, sqlEncodeStr).then(res => {
                    res = res.map(item => {
                        return {
                            ...item,
                            selectKey: selectOptionsKey
                        }
                    })
                    this.selectOptions[selectOptionsKey] = res;
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
            // 判断字段类型是否为指定的
            isConditionTypeInput(val) {
                return val === 'string' || val === 'double' || val === 'integer'
            },
            onModelClose() {

            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~@/styles/variables.scss';

    .queryTags-wrap {
        padding: 13px 15px 0;

        /deep/ .el-radio-button:first-child, /deep/ .el-radio-button:last-child {
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
