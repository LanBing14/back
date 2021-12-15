<template>
    <div>
        <el-dialog
            ref="drawer"
            :title="oldFormData.name"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            width="1300px"
            @close="onBuildModelClose"
        >
            <el-form
                ref="ref_buildDataForm"
                :rules="addFormRules"
                :model="addFormData"
                label-position="right"
                label-width="9em"
            >
                <div class="item-area" style="margin-bottom: 15px;">
                    <el-form-item label="主键" prop="primaryKey" class="fl">
                        <template slot="label">
                            主键
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="格式：({table}){column}"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.primaryKey" style="width: auto"/>
                    </el-form-item>
                    <el-form-item label="外键" prop="foreignKey" class="fl">
                        <template slot="label">
                            外键
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="格式：({table}){column},如果该模型不作为子模型，则可不填；如果作为子模型则填入外键"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.foreignKey" style="width: auto"/>
                    </el-form-item>
                    <el-form-item
                        label="宽度占比"
                        prop="width"
                        class="fl"
                        style="margin-left: 25px;"
                    >
                        <template slot="label">
                            宽度占比
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="0到1之间的数字比例"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.width" style="width: auto"/>
                    </el-form-item>
                    <el-form-item label="副标题" prop="subTitle" class="fl">
                        <template slot="label">
                            副标题
                            <i
                                class="iconfont icon-image icon-image-extend"
                                @click="showDialogImg('subTitle')"
                            ></i>
                        </template>
                        <el-input v-model="addFormData.subTitle" style="width: auto"/>
                    </el-form-item>
                    <el-form-item label="是否分页" class="fl" style="margin-left: 10px;">
                        <el-switch
                            v-model="addFormData.paging"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"
                            style="margin-top: 4px;"
                        />
                    </el-form-item>
                    <el-form-item label="列表多选" class="fl" style="margin-left: 10px;">
                        <el-switch
                            v-model="addFormData.isCheckbox"
                            :active-color="switchColors.active"
                            :inactive-color="switchColors.inactive"
                            style="margin-top: 4px;"
                        />
                    </el-form-item>
                </div>
                <el-form-item class="item-area" label="头部统计块">
                    <template slot="label">
                        头部统计块
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('statisticBlock')"
                        ></i>
                    </template>
                    <Draggable
                        v-model="statistic"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="content"
                    >
                        <el-tag
                            v-for="(tag, index) in statistic"
                            :key="index"
                            closable
                            class="drag-icon"
                            @close="handleStatisticTagClose(tag)"
                            @click="openStatisticAddUpdate(tag, index)"
                        >
                            {{ tag.name }}
                        </el-tag>
                    </Draggable>
                    <div>
                        <el-button
                            type="primary"
                            icon="iconfont icon-plus"
                            class="button-new-tag"
                            @click="openStatisticAdd"
                        >
                            头部统计
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="item-area" label="查询标签">
                    <template slot="label">
                        查询标签
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('tagGroup')"
                        ></i>
                    </template>
                    <Draggable
                        v-model="querySign"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="content"
                    >
                        <el-form-item
                            v-for="(el, index) in querySign"
                            :key="index"
                            :label="el.groupName + '：'"
                            style="margin-left: 10px;"
                            class="drag-icon border-dashed"
                        >
                            <div class="flex" style="width: 100%;">
                                <div class="flex-primary">
                                    <el-tag
                                        v-for="(tag, tagIndex) in el.tags"
                                        :key="tag.tagName + tagIndex"
                                        @click="openQuerySignUpdate(el, index)"
                                    >
                                        {{ tag.tagName }}
                                    </el-tag>
                                </div>
                                <div style="padding-right: 10px;">
                                    <i
                                        class="iconfont icon-close"
                                        @click="handleQuerySignTagClose(index)"
                                    ></i>
                                </div>
                            </div>
                        </el-form-item>
                    </Draggable>
                    <div>
                        <el-button
                            type="primary"
                            icon="iconfont icon-plus"
                            class="button-new-tag"
                            @click="openQuerySignAdd"
                        >
                            查询标签
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="item-area" label="查询条件">
                    <template slot="label">
                        查询条件
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('queryCondition')"
                        ></i>
                    </template>
                    <Draggable
                        v-model="queryTerm"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="content"
                    >
                        <el-tag
                            v-for="(tag, index) in queryTerm"
                            :key="tag.conditionTitle + index"
                            closable
                            class="drag-icon"
                            @close="handleQueryTermTagClose(tag)"
                            @click="openQueryTermAddUpdate(tag, index)"
                        >
                            {{ tag.conditionTitle }}
                        </el-tag>
                    </Draggable>
                    <div>
                        <el-button
                            type="primary"
                            icon="iconfont icon-plus"
                            class="button-new-tag"
                            @click="openQueryTermAdd"
                        >
                            查询条件
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="item-area" label="顶部按钮">
                    <template slot="label">
                        顶部按钮
                        <el-tooltip class="item" effect="dark" content="(未定内容)">
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('topButton')"
                        ></i>
                    </template>
                    <Draggable
                        v-model="topButtons"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="content"
                    >
                        <el-tag
                            v-for="(tag, index) in topButtons"
                            :key="tag.name + index"
                            closable
                            class="drag-icon"
                            @close="handleTopButtonTagClose(tag)"
                            @click="openTopButtonUpdate(tag, index)"
                        >
                            {{ tag.name }}
                        </el-tag>
                    </Draggable>
                    <div>
                        <el-button
                            type="primary"
                            icon="iconfont icon-plus"
                            class="button-new-tag"
                            @click="openTopButtonAdd"
                        >
                            顶部按钮
                        </el-button>
                    </div>
                </el-form-item>
                <div class="item-area" style="margin-bottom: 15px">
                    <el-form-item label="查询语句" prop="querySql" style="margin-bottom: 15px">
                        <template slot="label">
                            查询语句
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="sql不以order by结尾；sql语句请务必添加where valid='1'，因为查询标签与查询条件都是以‘ and ’拼接起来"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.querySql" :rows="3" type="textarea"/>
                    </el-form-item>
                    <el-form-item label="默认排序" prop="defaultOrder">
                        <template slot="label">
                            默认排序
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="查询语句+' order by '+默认排序，可填入值例如'id','id asc','id desc','id asc,name desc'"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input
                            v-model="addFormData.defaultOrder"
                            type="text"
                            style="width: 320px"
                        />
                    </el-form-item>
                </div>
                <div class="item-area" style="margin-bottom: 15px;">
                    <div class="flex" style="margin-bottom: 15px;">
            <span style="width: 220px;text-align: center;">
              数据权限
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="如果选择了数据权限，“只查询自己sql”和“查询部门sql”都必填"
              >
                <i class="iconfont icon-question-circle"></i>
              </el-tooltip>
            </span>
                        <span
                            class="flex-primary"
                            style="margin: 0 15px;text-align: center;"
                        >
              只查询自己sql
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="参数名只为creatorId"
              >
                <i class="iconfont icon-question-circle"></i>
              </el-tooltip>
            </span>
                        <span class="flex-primary" style="text-align: center;">
              查询部门sql
              <el-tooltip class="item" effect="dark" content="只为deptIds">
                <i class="iconfont icon-question-circle"></i>
              </el-tooltip>
            </span>
                    </div>
                    <div class="flex">
                        <el-form-item
                            :prop="'dataAccess.type'"
                            class="fl"
                            label-width="0"
                            style="width: 180px;"
                        >
                            <el-select
                                v-model="addFormData.dataAccess.type"
                                placeholder="请选择"
                                clearable
                                style="width: 100%;"
                                @change="handleDataAccessTypeChange"
                            >
                                <el-option
                                    v-for="(el, index) in dataAccessNameOptions"
                                    :key="index"
                                    :label="el.label"
                                    :value="el.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :prop="'dataAccess.selfSql'"
                            class="fl flex-primary"
                            label-width="0"
                            style="margin: 0 15px;"
                            :rules="
                $createRules({
                  msg: '只查询自己sql',
                  required: addFormData.dataAccess.type ? true : false
                })
              "
                        >
                            <el-input v-model="addFormData.dataAccess.selfSql"/>
                        </el-form-item>
                        <el-form-item
                            :prop="'dataAccess.deptSql'"
                            class="fl flex-primary"
                            label-width="0"
                            :rules="
                $createRules({
                  msg: '查询部门sql',
                  required: addFormData.dataAccess.type ? true : false
                })
              "
                        >
                            <el-input v-model="addFormData.dataAccess.deptSql"/>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item class="item-area" label="操作按钮">
                    <template slot="label">
                        操作按钮
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('colButton')"
                        ></i>
                    </template>
                    <Draggable
                        v-model="actionButtons"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="content"
                    >
                        <el-tag
                            v-for="(tag, index) in actionButtons"
                            :key="tag.name + index"
                            closable
                            class="drag-icon"
                            @close="handleActionButtonTagClose(tag)"
                            @click="openActionButtonUpdate(tag, index)"
                        >
                            {{ tag.name }}
                        </el-tag>
                    </Draggable>
                    <div>
                        <el-button
                            type="primary"
                            icon="iconfont icon-plus"
                            class="button-new-tag"
                            @click="openActionButtonAdd"
                        >
                            操作按钮
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item prop="rowButtonsWidth" class="item-area" label="操作列宽">
                    <template slot="label">
                        操作列宽
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="行按钮总宽度，整数，非必填，不填的话，宽度为均分值"
                        >
                            <i class="iconfont icon-question-circle"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="addFormData.rowButtonsWidth" style="width: auto"/>
                </el-form-item>
                <el-form-item class="item-area" label="列信息">
                    <template slot="label">
                        列信息
                        <i
                            class="iconfont icon-image icon-image-extend"
                            @click="showDialogImg('columns')"
                        ></i>
                    </template>
                    <div class="content">
                        <div class="like-table">
                            <div class="l-head">
                                <div>
                                    列名
                                    <el-tooltip class="item" effect="dark" content="表头显示名称">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div>
                                    key
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content="查询语句中查询字段名称。注：务必要包含id字段，否则按钮无法操作。"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div>
                                    对齐方式
                                </div>
                                <div>
                                    是否显示
                                </div>
                                <div>
                                    列宽
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content="列宽，整数，单位：像素，非必填，不填的话，宽度为均分值"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 5%;text-align: center;">
                                    <el-button
                                        type="primary"
                                        icon="iconfont icon-plus"
                                        class="button-new-tag"
                                        @click="openColumnAdd"
                                    >
                                        列
                                    </el-button>
                                </div>
                            </div>
                            <Draggable
                                v-model="column"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="l-body"
                            >
                                <div
                                    v-for="(el, index) in column"
                                    :key="el.name + index"
                                    class="drag-icon"
                                    style="cursor: pointer"
                                    @click="openColumnUpdate(el, index)"
                                >
                                    <div>
                                        <span>{{ el.annotation }}</span>
                                    </div>
                                    <div>
                                        <span>{{ el.name }}</span>
                                    </div>
                                    <div>
                                        <span>{{ el.align | filterAlign }}</span>
                                    </div>
                                    <div>
                                        <span>{{ el.show | filterColumnIsShow }}</span>
                                    </div>
                                    <div>
                                        <span>{{ el.width }}</span>
                                    </div>
                                    <div style="text-align: left;line-height: 33px;">
                                        <i
                                            class="iconfont icon-close"
                                            @click.stop="delColumn(index)"
                                        ></i>
                                    </div>
                                </div>
                            </Draggable>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
                <el-button type="primary" @click="handleSure">确 定</el-button>
            </div>
        </el-dialog>

        <!--新增查询标签模态框-->
        <QuerySign
            ref="ref_querySign"
            :default-list="querySign"
            @ok="onQuerySignOk"
        />
        <!--新增查询条件模态框-->
        <QueryTerm
            ref="ref_queryTerm"
            :default-list="queryTerm"
            @ok="onQueryTermOk"
        />
        <!--新增顶部按钮模态框-->
        <ActionButton
            ref="ref_topButton"
            title="顶部按钮"
            :default-list="topButtons"
            :form-id-options="ppOptions"
            @ok="onTopButtonOk"
        />
        <!--新增操作按钮模态框-->
        <ActionButton
            ref="ref_actionButton"
            title="操作按钮"
            :default-list="actionButtons"
            :form-id-options="ppOptions"
            @ok="onActionButtonOk"
        />
        <!--新增列信息模态框-->
        <Column ref="ref_column" :default-list="column" @ok="onColumnOk"/>

        <el-dialog :visible.sync="dialogVisible" width="80%">
            <img :src="dialogImageUrl" width="100%" alt=""/>
        </el-dialog>
    </div>
</template>

<script>
import { merge } from 'lodash'
import { switchColors } from '@/utils/variables'
import vuedraggable from 'vuedraggable'
import QuerySign from './QuerySign' // 查询标签弹框组件
import QueryTerm from './QueryTerm' // 查询条件弹框组件
import ActionButton from './ActionButton' // 操作按钮弹框组件
import Column from './Column' // 列信息弹框组件
import img_subTitle from '@/assets/images/tips/statistic-block.jpg'
import img_colButton from '@/assets/images/tips/col-button.jpg'
import img_columns from '@/assets/images/tips/columns.jpg'
import img_queryCondition from '@/assets/images/tips/query-condition.jpg'
import img_statisticBlock from '@/assets/images/tips/statistic-block.jpg'
import img_tagGroup from '@/assets/images/tips/tag-group.jpg'
import img_topButton from '@/assets/images/tips/top-buttion.jpg'

const imgKeys = {
    subTitle: img_subTitle,
    colButton: img_colButton,
    columns: img_columns,
    queryCondition: img_queryCondition,
    statisticBlock: img_statisticBlock,
    tagGroup: img_tagGroup,
    topButton: img_topButton
}

export default {
    name: 'BuildList',
    components: {
        Draggable: vuedraggable,
        QuerySign,
        QueryTerm,
        ActionButton,
        Column
    },
    filters: {
        filterColumnIsShow (val) {
            return val ? '是' : '否'
        },
        filterAlign (val) {
            if (val === 'left') {
                return '居左'
            } else if (val === 'center') {
                return '居中'
            } else {
                return '居右'
            }
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        selectData: {
            type: Object,
            default: () => ({})
        },
        formIdOptions: {
            type: Array,
            default: () => []
        }
    },
    data () {
        const createRules = this.$createRules
        return {
            switchColors,
            visible: false,
            dialogVisible: false,
            dialogImageUrl: '',
            ppOptions: [], // 平铺的列表数据
            ppRenderData: [], // 平铺的选中数据(用于页面渲染)
            ppData: [], // 平铺的选中数据
            tabOptions: [], // tab的列表数据
            tabRenderData: [], // tab的选中数据(用于页面渲染)
            tabData: [], // tab的选中数据
            draggableOptions: {
                // vuedraggable的配置
                animation: 200,
                handle: '.drag-icon'
            },
            addFormRules: {
                defaultOrder: createRules({
                    msg: '默认排序',
                    required: true
                }),
                querySql: createRules({
                    msg: '查询语句',
                    required: true
                }),
                width: createRules({
                    msg: '宽度占比',
                    max: 1,
                    number: true
                }),
                rowButtonsWidth: createRules({
                    msg: '操作列宽',
                    integer0: true
                }),
                subTitle: createRules({
                    msg: '副标题',
                    max: 50
                }),
                primaryKey: createRules({
                    msg: '主键',
                    required: true,
                    EXP_ENG_NUM_5: true
                }),
                dataAccess: {
                    type: createRules({
                        msg: '数据权限'
                    })
                }
            },
            addFormData: {
                // 新增的数据
                paging: true,
                isCheckbox: true,
                querySql: '',
                defaultOrder: '',
                width: '1',
                rowButtonsWidth: '',
                primaryKey: '',
                foreignKey: '',
                subTitle: '',
                dataAccess: {
                    type: '',
                    selfSql: '',
                    deptSql: ''
                }
            },
            statistic: [], // 头部统计块的tags
            querySign: [], // 查询标签的tags
            queryTerm: [], // 查询条件的tags
            topButtons: [], // 顶部按钮的tags
            actionButtons: [], // 表格里操作按钮的tags
            column: [], // 表格里列信息的数据
            oldFormData: {},
            updateIndex: 0,
            dataAccessNameOptions: []
        }
    },
    methods: {
        // 打开模态框
        openModel (oldFormData, updateIndex) {
            const o = { ...oldFormData }
            this.oldFormData = o
            this.updateIndex = updateIndex
            const json = o.model
            if (json) {
                this.statistic = json.statisticGroups || []
                this.querySign = json.tagGroups
                this.queryTerm = json.queryConditions
                this.topButtons = json.topButtons
                this.actionButtons = json.rowButtons
                this.column = json.queryColumns
                this.addFormData.querySql = json.querySql
                this.addFormData.defaultOrder = json.defaultOrder
                this.addFormData.paging = json.paging
                this.addFormData.isCheckbox = json.isCheckbox
                this.addFormData.subTitle = json.subTitle
                this.addFormData.width = json.width + ''
                this.addFormData.rowButtonsWidth = json.rowButtonsWidth
                this.addFormData.dataAccess = json.dataAccess || {}
                this.addFormData.primaryKey = json.primaryKey + ''
                this.addFormData.foreignKey = json.foreignKey + ''
            }
            this.visible = true
        },
        // 点击确认
        handleSure () {
            this.$refs.ref_buildDataForm.validate(valid => {
                if (valid) {
                    let text = {}
                    const {id: formId, type} = this.oldFormData
                    const {
                        querySign: tagGroups,
                        queryTerm: queryConditions,
                        column: queryColumns,
                        topButtons,
                        actionButtons: rowButtons,
                        statistic: statisticGroups
                    } = this
                    const textNormals = []
                    const textTabs = []

                    text = {
                        ...this.addFormData,
                        formId,
                        type,
                        tagGroups,
                        queryConditions,
                        queryColumns,
                        topButtons,
                        rowButtons,
                        statisticGroups,
                        normals: textNormals,
                        tabs: textTabs
                    }
                    this.$emit('ok', merge({}, text), this.updateIndex)
                    this.visible = false
                }
            })
        },
        // 打开新增查询标签模态框
        openQuerySignAdd () {
            this.$refs.ref_querySign.openModel()
        },
        // 打开修改查询标签模态框
        openQuerySignUpdate (row, updateIndex) {
            this.$refs.ref_querySign.openModel(row, updateIndex)
        },
        // 打开头部统计模态框
        openStatisticAdd () {
            this.$refs.ref_statistic.openModel()
        },
        // 打开修改头部统计模态框
        openStatisticAddUpdate (row, updateIndex) {
            this.$refs.ref_statistic.openModel(row, updateIndex)
        },
        // 打开新增查询条件模态框
        openQueryTermAdd () {
            this.$refs.ref_queryTerm.openModel()
        },
        // 打开修改查询标签模态框
        openQueryTermAddUpdate (row, updateIndex) {
            this.$refs.ref_queryTerm.openModel(row, updateIndex)
        },
        // 打开新增顶部按钮模态框
        openTopButtonAdd () {
            this.$refs.ref_topButton.openModel()
        },
        // 打开修改顶部按钮模态框
        openTopButtonUpdate (row, updateIndex) {
            this.$refs.ref_topButton.openModel(row, updateIndex)
        },
        // 打开新增操作按钮模态框
        openActionButtonAdd () {
            this.$refs.ref_actionButton.openModel()
        },
        // 打开修改操作按钮模态框
        openActionButtonUpdate (row, updateIndex) {
            this.$refs.ref_actionButton.openModel(row, updateIndex)
        },
        // 打开新增列模态框
        openColumnAdd () {
            this.$refs.ref_column.openModel()
        },
        // 打开修改列模态框
        openColumnUpdate (row, updateIndex) {
            this.$refs.ref_column.openModel(row, updateIndex)
        },
        // 删除查询标签时
        handleQuerySignTagClose (index) {
            // let delIndex = 0;
            // this.querySign.forEach((item, index) => {
            //     if (item.groupName === tag.groupName) {
            //         delIndex = index
            //     }
            // });
            this.querySign.splice(index, 1)
        },
        // 删除头部统计时
        handleStatisticTagClose (tag) {
            let delIndex = 0
            this.statistic.forEach((item, index) => {
                if (item.name === tag.name) {
                    delIndex = index
                }
            })
            this.statistic.splice(delIndex, 1)
        },
        // 删除查询条件时
        handleQueryTermTagClose (tag) {
            let delIndex = 0
            this.queryTerm.forEach((item, index) => {
                if (item.name === tag.name) {
                    delIndex = index
                }
            })
            this.queryTerm.splice(delIndex, 1)
        },
        // 删除顶部按钮时
        handleTopButtonTagClose (tag) {
            let delIndex = 0
            this.topButtons.forEach((item, index) => {
                if (item.name === tag.name) {
                    delIndex = index
                }
            })
            this.topButtons.splice(delIndex, 1)
        },
        // 删除操作按钮时
        handleActionButtonTagClose (tag) {
            let delIndex = 0
            this.actionButtons.forEach((item, index) => {
                if (item.name === tag.name) {
                    delIndex = index
                }
            })
            this.actionButtons.splice(delIndex, 1)
        },
        // 删除列信息
        delColumn (delIndex) {
            this.column.splice(delIndex, 1)
        },
        // 建模弹框关闭时
        onBuildModelClose () {
            this.$refs['ref_buildDataForm'].resetFields()
            this.ppData = []
            this.tabData = []
            this.ppRenderData = []
            this.tabRenderData = []
            this.statistic = []
            this.querySign = []
            this.topButtons = []
            this.actionButtons = []
            this.column = []
            this.queryTerm = []
        },
        // 新增查询标签成功
        onQuerySignOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.querySign.splice(updateIndex, 1, data)
            } else {
                this.querySign.push(data)
            }
        },
        // 新增头部统计成功
        onStatisticOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.statistic.splice(updateIndex, 1, { ...data })
            } else {
                this.statistic.push({ ...data })
            }
        },
        // 新增查询条件成功
        onQueryTermOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.queryTerm.splice(updateIndex, 1, data)
            } else {
                this.queryTerm.push(data)
            }
        },
        // 新增顶部按钮成功
        onTopButtonOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.topButtons.splice(updateIndex, 1, data)
            } else {
                this.topButtons.push(data)
            }
        },
        // 新增操作按钮成功
        onActionButtonOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.actionButtons.splice(updateIndex, 1, data)
            } else {
                this.actionButtons.push(data)
            }
        },
        // 新增列信息成功
        onColumnOk (data, updateIndex) {
            if (updateIndex !== undefined) {
                this.column.splice(updateIndex, 1, data)
            } else {
                this.column.push(data)
            }
        },
        // 关闭平铺类型的表单
        closePp (row) {
            const index = this.ppData.findIndex(item => item.value === row.value)
            this.ppData.splice(index, 1)
        },
        // 关闭tab类型的表单
        closeTab (row) {
            const index = this.tabData.findIndex(item => item.value === row.value)
            this.tabData.splice(index, 1)
        },
        onDraggableEnd () {},
        handleDataAccessTypeChange (val) {
            if (!val) {
                this.addFormData.dataAccess.deptSql = ''
                this.addFormData.dataAccess.selfSql = ''
            }
        },
        showDialogImg (imgKey) {
            this.dialogImageUrl = imgKeys[imgKey]
            this.dialogVisible = true
        }
    }
}
</script>
