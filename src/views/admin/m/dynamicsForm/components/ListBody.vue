<template>
    <div>
        <template v-if="pageDataLoaded">
            <div class="search-area">
                <template
                    v-if="pageData.statisticGroups && pageData.statisticGroups.length"
                >
                    <el-row
                        :gutter="20"
                        type="flex"
                        style="margin-bottom: 15px;flex-wrap: wrap;"
                    >
                        <el-col
                            v-for="(el, index) in pageData.statisticGroups"
                            :key="index"
                            :style="{
                width:
                  pageData.statisticGroups.length > 6 ? '16.66667%' : undefined
              }"
                            class="statistic-item"
                        >
                            <div class="statistic-item-content">
                                <strong class="statistic-number">
                                    <Mallki class-name="mallki-text" :text="el.show"/>
                                </strong>
                                <p class="statistic-title">{{ el.name }}</p>
                            </div>
                        </el-col>
                    </el-row>
                </template>
                <el-form
                    v-if="queryTagsRender.length"
                    ref="queryTagForm"
                    class="queryTags-wrap"
                    label-width="5em"
                    label-position="left"
                    style="padding-bottom: 3px; margin-bottom: 15px"
                >
                    <el-form-item
                        v-for="(el, index) in queryTagsRender"
                        :key="index"
                        :label="el.groupName + '：'"
                        style="margin-left: 10px;"
                    >
                        <el-radio-group
                            v-model="tagGroups[queryTagsGroupKey + index]"
                            @change="handleQueryTagsChange($event, queryTagsGroupKey, index)"
                        >
                            <el-radio-button label="">
                                不限
                            </el-radio-button>
                            <el-radio-button
                                v-for="(tag, tagIndex) in el.tags"
                                :key="tagIndex"
                                :label="tag.tagName"
                            >
                                {{ tag.tagName }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-form
                    v-if="listQueryRender.length"
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
                            <el-input
                                v-model="listQuery[el.conditionName]"
                                :placeholder="el.conditionTitle"
                            />
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
                                :picker-options="getPickerOptions(el)"
                                :placeholder="el.conditionTitle"
                                value-format="yyyy-MM-dd"
                                type="date"
                            />
                        </template>
                        <template v-else-if="el.conditionType === 'datetime'">
                            <el-date-picker
                                v-model="listQuery[el.conditionName]"
                                :picker-options="getPickerOptions(el)"
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
                        <el-button
                            v-if="pageData.export"
                            class="filter-item"
                            icon="icon iconfont icon-undo"
                            @click="handleExport()"
                        >
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="page-content">
                <div class="page-content-body">
                    <TableWrapper
                        ref="child"
                        :fetch-data-fn="getPageApi()"
                        :query="listQuery"
                        :columns="tableCol"
                        :pagination="pagination"
                        :sort-change="sortChange"
                        :checkbox="isCheckbox"
                        @onCheckedChange="onCheckedChange"
                    >
                        <template slot="tool">
                            <el-button
                                v-for="(el, index) in actionBtns"
                                :key="index"
                                type="primary"
                                plain
                                @click="el.click"
                            >
                                <i v-if="el.icon" :class="el.icon" class="iconfont "></i>
                                {{ el.text }}
                            </el-button>
                        </template>
                    </TableWrapper>
                </div>
            </div>
        </template>
        <!--新增或修改-->
        <CreateUpdate ref="ref_createUpdateModel" @getList="getList"/>
        <Custom
            v-for="(el, index) in customArrs"
            :key="index"
            :ref="'ref_' + el"
            :comp-key="el"
            :is-other="isOther"
            :checkbox-data="checkboxData"
            @getList="getList"
            @onOther="onOther"
        />
    </div>
</template>

<script type="text/jsx">
import axios from 'axios/index'
import { merge } from 'lodash'
import Mallki from '@/components/TextHoverEffect/Mallki'
import Button from '@/components/Button'
import TableWrapper from '@/components/TableWrapper'
import CreateUpdate from '../CreateUpdate'
import Custom from './Custom'
import {m} from '@/api/index'
import { Api_comboboxDict } from '@/api/admin/index'
import {
    Api_DynamicsFormGetPage,
    Api_DynamicsFormGetList,
    Api_DynamicsFormSqlSelect,
    Api_DynamicsFormDelete,
    Api_DynamicsFormExport
} from '@/api/admin/m/index'
import { encode64 } from '@/utils/base64'
import { strUnicode2Ansi } from '@/utils/unicode'

export default {
    name: 'ListBody',
    components: { TableWrapper, CreateUpdate, Mallki, Custom },
    props: {
        pageData: Object, // 页面数据
        isOther: Boolean
    },
    data () {
        return {
            formId: null, // 页面的表单id
            pageDataLoaded: false, // 页面数据是否已加载
            pagination: true, // 表格是否需要分页
            isCheckbox: false, // 表格是否需要checkbox
            checkboxData: [],
            actionBtns: [], // 顶部按钮
            customKey: '',
            customArrs: [],
            iconClass: { // 图标分类
                add: 'icon-plus',
                edit: 'icon-edit-square',
                delete: 'icon-delete',
                view: 'icon-eye',
                select: 'icon-select',
                custom: ''
            },
            iconColor: { // 图标颜色
                // edit: 'green',
                // delete: 'red',
                // view: 'green'
            },
            actionBtnEvent: { // 顶部按钮按钮事件
                add: this.handleCreate,
                custom: this.handleCustom
            },
            rowActionBtnEvent: { // 每行按钮按钮事件
                add: this.handleCreate,
                edit: this.handleUpdate,
                delete: this.handleDel,
                view: this.handleView,
                custom: this.handleCustom,
                select: this.handleSelect
            },
            queryTagsGroupKey: 'tagGroup', // 查询标签分组的key
            statisticSqlsRes: [], // 头部统计中的数字结果，二维数组
            tagGroups: {}, // 查询标签，传后台
            queryTagsRender: [], // 查询标签的渲染数据
            listQuery: {}, // 查询条件，传后台
            listQueryRender: [], // 查询条件的渲染数据
            selectOptions: {}, // 下拉框option的数据集，key: array
            selectOptionsKey: {}, // 通用方法获得的下拉框option所对应的label和value
            tableCol: [], // 表格列
            pickerOptionsStart: {
                disabledDate: (time) => {
                    const { endDate } = this.listQuery
                    return this.$limitTime('max', time, endDate)
                }
            },
            pickerOptionsEnd: {
                disabledDate: (time) => {
                    const { startDate } = this.listQuery
                    return this.$limitTime('min', time, startDate)
                }
            }
        }
    },
    mounted () {
        this.initPage(this.pageData)
    },
    methods: {
        // 获得页面列表接口
        getPageApi () {
            return this.pagination ? Api_DynamicsFormGetPage : Api_DynamicsFormGetList
        },
        initPage (listJson) {
            const { iconClass, actionBtnEvent } = this
            const { permissionIds } = this.$store.getters.personInfo
            this.pagination = listJson.paging
            this.isCheckbox = listJson.isCheckbox
            this.listQuery.id = this.pageData.formId
            this.$set(this.listQuery, 'tagGroups', [])

            // 格式化头部统计数据
            if (listJson.statisticGroups) {
                listJson.statisticGroups.map(item => {
                    this.getStatisticSql(item)
                })
            }
            // 格式化顶部按钮数据
            if (listJson.topButtons) {
                listJson.topButtons.forEach(item => {
                    if (item.type === 'custom') {
                        this.customArrs.push(item.key)
                    }
                })
                listJson.topButtons.forEach(item => {
                    const tj = []
                    if (permissionIds && item.permission && permissionIds.length) {
                        tj.push('permissionIds.indexOf("' + item.permission + '")!==-1')
                    }
                    if (item.showCondition) {
                        tj.push(item.showCondition)
                    }

                    if (tj.length && eval(tj.join('&&'))) {
                        this.actionBtns.push({
                            text: item.name,
                            icon: iconClass[item.type],
                            click: actionBtnEvent[item.type].bind(this, item, {})
                        })
                        return
                    }
                    if (!item.permission && !item.showCondition) {
                        this.actionBtns.push({
                            text: item.name,
                            icon: iconClass[item.type],
                            click: actionBtnEvent[item.type].bind(this, item, {})
                        })
                    }
                })
            }
            // 格式化查询条件渲染数据
            if (listJson.queryConditions) {
                this.listQueryRender = listJson.queryConditions.map(item => {
                    if (item.conditionType === 'select') {
                        this.$set(this.selectOptions, item.conditionName, [])
                        if (item.dictCode) { // 获取字典数据
                            this.getDict(item.dictCode, item.conditionName)
                        }
                        if (item.selectSql) {
                            this.selectOptionsKey[item.conditionName] = {
                                label: item.selectLabel,
                                value: item.selectValue
                            }
                            this.getSelectSql(item.selectSql, item.conditionName)
                        }
                    }
                    this.$set(this.listQuery, item.conditionName, '')

                    return {
                        ...item
                    }
                })
            }
            // 格式化查询标签渲染数据
            if (listJson.tagGroups) {
                this.queryTagsRender = listJson.tagGroups.map((item, index) => {
                    this.$set(this.tagGroups, this.queryTagsGroupKey + index, '')
                    this.$set(this.listQuery.tagGroups, index, {
                        groupName: item.groupName,
                        tagName: []
                    })
                    return {
                        ...item
                    }
                })
            }
            // 格式化列数据
            const tableColArrs = listJson.queryColumns.filter(item => item.show).map(item => {
                return {
                    key: item.name,
                    label: item.annotation,
                    width: item.width ? item.width + 'px' : '',
                    props: {
                        sortable: 'custom'
                    }
                }
            })
            // 格式化每行的操作列数据
            if (listJson.rowButtons.length) {
                listJson.rowButtons.forEach(item => {
                    if (item.type === 'custom') {
                        this.customArrs.push(item.key)
                    }
                })
                tableColArrs.push({
                    key: null,
                    label: '操作',
                    width: listJson.rowButtonsWidth ? listJson.rowButtonsWidth + 'px' : '',
                    align: 'center',
                    render: (h, data, row) => {
                        const rowActionBtns = []
                        listJson.rowButtons.forEach(item => {
                            const tj = []
                            if (permissionIds && item.permission && permissionIds.length) {
                                tj.push('permissionIds.indexOf("' + item.permission + '")!==-1')
                            }
                            if (item.showCondition) {
                                tj.push(item.showCondition)
                            }
                            if (tj.length && eval(tj.join('&&'))) {
                                rowActionBtns.push(
                                    <Button
                                        iconClass={ this.iconClass[item.type] }
                                        iconColor={ this.iconColor[item.type] }
                                        isIcon={ false }
                                        row={ row }
                                        text={ item.name }
                                        click={ this.rowActionBtnEvent[item.type].bind(this, item, row) }/>
                                )
                                return
                            }
                            if (!item.permission && !item.showCondition) {
                                rowActionBtns.push(
                                    <Button
                                        iconClass={ this.iconClass[item.type] }
                                        iconColor={ this.iconColor[item.type] }
                                        isIcon={ false }
                                        row={ row }
                                        text={ item.name }
                                        click={ this.rowActionBtnEvent[item.type].bind(this, item, row) }/>
                                )
                            }
                        })
                        return rowActionBtns
                    }
                })
            }
            this.tableCol = tableColArrs

            // 完成页面骨骼数据加载
            this.pageDataLoaded = true

            this.$nextTick(() => {
                // 获取列表数据
                this.getList()
            })
        },
        // 获取主列表数据
        getList () {
            this.$refs.child.fetchData()
        },
        // 表格排序发生变化时
        sortChange ({ prop, order }) {
            this.listQuery.orderProperty = prop
            this.listQuery.asc = order === 'ascending'
            this.getList()
        },
        // 进行查询
        handleFilter () {
            this.getList()
        },
        // 重置查询条件
        handleReset (formName) {
            this.$refs[formName].resetFields()
            this.getList()
        },
        // 导出
        handleExport () {
            if (!this.$refs.child.getData().length) {
                this.$message.warning('暂无数据，无法导出文件！')
                return
            }
            const properties = this.$refs.child.getColumnsData()
                .filter(i => i.key)
                .map(({ key: property, label: name }) => ({
                    property,
                    name
                }))
            Api_DynamicsFormExport(this.pageData.formId, {
                properties
            }, this.listQuery).then(res => {
                const url = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.target = '_blank'
                link.setAttribute('download', this.$dateFormat(new Date(), 'yyyy-MM-dd') + '-查询结果.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        },
        // 新增
        handleCreate (pageModelButon) {
            this.$refs.ref_createUpdateModel.openModel(pageModelButon.formId, 'add')
        },
        // 修改
        handleUpdate (pageModelButon, row) {
            this.$refs.ref_createUpdateModel.openModel(pageModelButon.formId, 'update', row.id)
        },
        // 查看
        handleView (pageModelButon, row) {
            this.$refs.ref_createUpdateModel.openModel(pageModelButon.formId, 'view', row.id)
        },
        // 自定义按钮
        handleCustom (actionButton, row) {
            this.$refs['ref_' + actionButton.key][0].openModel(row)
        },
        // 选择
        handleSelect () {

        },
        // 删除
        handleDel (actionButton, row) {
            this.$confirm('确定删除该条数据?', '提示', {
                type: 'warning'
            }).then(() => {
                let { primaryKey } = this.pageData
                primaryKey = primaryKey.substring(primaryKey.indexOf('(') + 1, primaryKey.lastIndexOf(')'))
                const loading = this.$openLoading()
                Api_DynamicsFormDelete(primaryKey, row.id).then(msg => {
                    this.$message({
                        message: msg > 0 ? '删除成功！' : '删除失败！',
                        type: msg > 0 ? 'success' : 'error'
                    })
                    this.getList()
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            })
        },
        // 查询标签change事件
        handleQueryTagsChange (v, d, index) {
            this.listQuery.tagGroups[index].tagName = [v]
            this.getList()
        },
        // 获取字典数据
        getDict (dictCode, selectOptionsKey) {
            Api_comboboxDict(dictCode, m).then(res => {
                this.selectOptions[selectOptionsKey] = res
            })
        },
        // 获取下拉框通用方法
        getSelectSql (selectSql, selectOptionsKey) {
            const sqlEncodeStr = encode64(strUnicode2Ansi(selectSql))
            Api_DynamicsFormSqlSelect(this.pageData.formId, sqlEncodeStr).then(res => {
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
        // 获取头部统计sql数据
        getStatisticSql (row) {
            const { sqls } = row
            const promiseRes = []
            const fetchRes = []
            if (!sqls) {
                return
            }
            sqls.map(item => {
                const sqlEncodeStr = encode64(strUnicode2Ansi(item))
                const res = Api_DynamicsFormSqlSelect(this.pageData.formId, sqlEncodeStr).then(res => {
                    if (res) {
                        if (res[0]) {
                            for (const key in res[0]) {
                                fetchRes.push(res[0][key])
                            }
                        }
                    }
                })
                promiseRes.push(res)
            })
            axios.all([...promiseRes]).then(() => {
                this.statisticSqlsRes.push(fetchRes)
                const showArr = row.show.split('/')
                fetchRes.forEach((item, index) => {
                    showArr[index] = showArr[index].replace('?', item)
                })
                row.show = showArr.join('/')
            })
        },
        // 生成picker时间控制选项配置
        getPickerOptions (d) {
            if (d.conditionEnd && this.listQuery[d.conditionEnd]) {
                return {
                    disabledDate: (time) => {
                        const endDate = this.listQuery[d.conditionEnd]
                        return this.$limitTime('max', time, endDate)
                    }
                }
            }
            if (d.conditionStart && this.listQuery[d.conditionStart]) {
                return {
                    disabledDate: (time) => {
                        const startDate = this.listQuery[d.conditionStart]
                        return this.$limitTime('min', time, startDate)
                    }
                }
            }
        },
        // 判断字段类型是否为指定的
        isConditionTypeInput (val) {
            return val === 'string' || val === 'double' || val === 'integer'
        },
        onOther () {
            this.$emit('fetchOtherData', this.pageData.formId)
        },
        // 当表格有checbox时的change事件
        onCheckedChange (data) {
            this.checkboxData = merge([], data)
        }
    }
}
</script>

<style scoped lang="scss">
    @import "~@/styles/variables.scss";

    .search-area {
        padding: 0 20px;
    }

    .mallki-text {
        color: #fff;
    }

    .queryTags-wrap {
        padding: 13px 15px 0px 15px;
        margin-bottom: 0;
        background-color: $bgGreey;

        .el-form-item--mini:last-child {
            margin-bottom: 0;
        }

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
    }

    .statistic-item {
        text-align: center;
        color: #fff;
        margin-bottom: 15px;
        flex: 1;

        &:nth-child(3n) {
            .statistic-item-content {
                background-color: #44b6ae;
            }
        }

        &:nth-child(3n + 1) {
            .statistic-item-content {
                background-color: #facd91;
            }
        }

        &:nth-child(3n + 2) {
            .statistic-item-content {
                background-color: #f2a6af;
            }
        }

        & > div {
            padding: 6px;
            border-radius: 6px;

            .statistic-number {
                font-size: 24px;
                margin-top: 10px;
                display: block;
            }
        }
    }
</style>
