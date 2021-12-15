<template>
    <div>
        <el-form
            ref="ref_buildDataForm"
            :rules="addFormRules"
            :model="addFormData"
            label-position="right"
            label-width="6em"
        >
            <el-form-item label="副标题" prop="subTitle" class="item-area">
                <template slot="label">
                    副标题
                    <i
                        class="iconfont icon-image icon-image-extend"
                        @click="showDialogImg('subTitle')"
                    ></i>
                </template>
                <el-input v-model="addFormData.subTitle" style="width: auto"/>
            </el-form-item>
            <el-row>
                <el-col :span="12" style="padding-right: 24px;">
                    <div class="left-item">
                        <h2 class="interface-title">头部统计块(原)</h2>
                        <div class="left-content">
                            <Draggable
                                v-model="statisticGroupsSource"
                                v-bind="draggableOptions"
                                group="statisticGroups"
                                class="left-ul-wrap"
                                @choose="statisticGroupsOnChoose"
                            >
                                <transition-group tag="ul" appear>
                                    <li
                                        v-for="(el, index) in statisticGroupsSource"
                                        :key="el"
                                        class="drag-icon"
                                        @click="statisticGroupsAdd(el, index)"
                                    >
                                        <i class="iconfont icon-fund-fill"></i> {{ el }}
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                        <div class="data-tip-icon"><i class="iconfont icon-export"></i><i class="iconfont icon-Import"></i></div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">查询标签(原)</h2>
                        <div class="left-content">
                            <Draggable
                                v-model="tagGroupsSource"
                                v-bind="draggableOptions"
                                group="tagGroups"
                                class="left-ul-wrap"
                                @choose="tagGroupsSourceOnChoose"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in tagGroupsSource"
                                        :key="el"
                                        class="drag-icon"
                                        @click="tagGroupsGroupsAdd(el, index)"
                                    >
                                        <i class="iconfont icon-tag-fill"></i> {{ el }}
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                        <div class="data-tip-icon"><i class="iconfont icon-export"></i><i class="iconfont icon-Import"></i></div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">查询条件(原)</h2>
                        <div class="left-content">
                            <Draggable
                                v-model="queryConditionsSource"
                                v-bind="draggableOptions"
                                group="queryConditions"
                                class="left-ul-wrap"
                                @choose="queryConditionsOnChoose"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in queryConditionsSource"
                                        :key="el"
                                        class="drag-icon"
                                        @click="queryConditionsAdd(el, index)"
                                    >
                                        <i class="iconfont icon-EURO-circle-fill"></i> {{ el }}
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                        <div class="data-tip-icon"><i class="iconfont icon-export"></i><i class="iconfont icon-Import"></i></div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">列信息(原)</h2>
                        <div class="left-content">
                            <Draggable
                                v-model="queryColumnsSource"
                                v-bind="draggableOptions"
                                group="queryColumns"
                                class="left-ul-wrap"
                                @choose="queryColumnsOnChoose"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in queryColumnsSource"
                                        :key="el"
                                        class="drag-icon"
                                        @click="queryColumnsAdd(el, index)"
                                    >
                                        <i class="iconfont icon-poweroff-circle-fill"></i> {{ el }}
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                        <div class="data-tip-icon"><i class="iconfont icon-export"></i><i class="iconfont icon-Import"></i></div>
                    </div>
                </el-col>
                <el-col :span="12" style="padding-left: 24px;">
                    <div class="left-item">
                        <h2 class="interface-title">头部统计块(新)</h2>
                        <div class="right-content">
                            <Draggable
                                v-model="statisticGroupsTarget"
                                v-bind="draggableOptions"
                                group="statisticGroups"
                                class="right-ul-wrap"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in statisticGroupsTarget"
                                        :key="el"
                                        class="drag-icon flex"
                                    >
                                        <div class="flex-primary"><i class="iconfont icon-fund-fill"></i> {{ el }}</div>
                                        <div @click.stop="statisticGroupsClose(index)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">查询标签(新)</h2>
                        <div class="right-content">
                            <Draggable
                                v-model="tagGroupsTarget"
                                v-bind="draggableOptions"
                                group="tagGroups"
                                class="right-ul-wrap"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in tagGroupsTarget"
                                        :key="el"
                                        class="drag-icon flex"
                                    >
                                        <div class="flex-primary"><i class="iconfont icon-tag-fill"></i> {{ el }}</div>
                                        <div @click.stop="tagGroupsClose(index)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">查询条件(新)</h2>
                        <div class="right-content">
                            <Draggable
                                v-model="queryConditionsTarget"
                                v-bind="draggableOptions"
                                group="queryConditions"
                                class="right-ul-wrap"
                            >
                                <transition-group tag="ul" :sort="false" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in queryConditionsTarget"
                                        :key="el"
                                        class="drag-icon flex"
                                    >
                                        <div class="flex-primary"><i class="iconfont icon-EURO-circle-fill"></i> {{ el }}</div>
                                        <div @click.stop="queryConditionsClose(index)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                    <div class="left-item">
                        <h2 class="interface-title">列信息(新)</h2>
                        <div class="right-content">
                            <Draggable
                                v-model="queryColumnsTarget"
                                v-bind="draggableOptions"
                                group="queryColumns"
                                class="right-ul-wrap"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li
                                        v-for="(el, index) in queryColumnsTarget"
                                        :key="el"
                                        class="drag-icon flex"
                                    >
                                        <div class="flex-primary"><i class="iconfont icon-poweroff-circle-fill"></i> {{ el }}</div>
                                        <div @click.stop="queryColumnsClose(index)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" width="80%">
            <img src="@/assets/images/tips/statistic-block.jpg" width="100%" alt=""/>
        </el-dialog>
    </div>
</template>

<script>
import { pullAll } from 'lodash'
import vuedraggable from 'vuedraggable'

export default {
    name: 'BuildFormBody',
    components: {
        Draggable: vuedraggable
    },
    props: {
        data: Object
    },
    data () {
        const createRules = this.$createRules

        return {
            visible: false,
            dialogVisible: false,
            leftFormOpened: false,
            draggableOptions: {
                // vuedraggable的配置
                animation: 200,
                handle: '.drag-icon'
            },
            addFormRules: {
                subTitle: createRules({
                    msg: '副标题',
                    max: 50
                })
            },
            addFormData: {
                // 新增的数据
                subTitle: '',
                formId: ''
            },
            statisticGroupsSource: [], // 左侧“头部统计块”数据源
            statisticGroupsTarget: [], // 右侧“头部统计块”目标对象
            statisticGroupsSourceDragRow: null, // 左侧“头部统计块”数据源，抓起时的数据

            tagGroupsSource: [], // 左侧“查询标签”数据源
            tagGroupsTarget: [], // 右侧“查询标签”目标对象
            tagGroupsSourceDragRow: null, // 左侧“查询标签”数据源，抓起时的数据

            queryConditionsSource: [], // 左侧“查询条件”数据源
            queryConditionsTarget: [], // 右侧“查询条件”目标对象
            queryConditionsSourceDragRow: null, // 左侧“查询条件”数据源，抓起时的数据

            queryColumnsSource: [], // 左侧“列信息”数据源
            queryColumnsTarget: [], // 右侧“列信息”目标对象
            queryColumnsSourceDragRow: null, // 左侧“列信息”数据源，抓起时的数据

            ppRenderData: [], // 平铺的选中数据(用于页面渲染)
            ppData: [], // 平铺的选中数据
            tabRenderData: [], // tab的选中数据(用于页面渲染)
            tabData: [] // tab的选中数据
        }
    },
    watch: {
        data (data) {
            if (data) {
                this.initData()
            }
        }
    },
    mounted () {
        if (this.data) {
            this.initData()
        }
    },
    methods: {
        // 打开模态框
        initData () {
            const { listModel, customList } = this.data
            this.addFormData.subTitle = listModel.subTitle
            this.addFormData.formId = listModel.formId
            const statisticGroupsSource = listModel.statisticGroups ? listModel.statisticGroups.map(i => i.name) : []
            const tagGroupsSource = listModel.tagGroups ? listModel.tagGroups.map(i => i.groupName) : []
            const queryConditionsSource = listModel.queryConditions ? listModel.queryConditions.map(i => i.conditionTitle) : []
            const queryColumnsSource = listModel.queryColumns ? listModel.queryColumns.map(i => i.show ? i.annotation : null) : []

            if (customList) {
                const statisticGroupsTarget = customList.statisticGroups
                const tagGroupsTarget = customList.tagGroups
                const queryConditionsTarget = customList.queryConditions
                const queryColumnsTarget = customList.queryColumns

                this.statisticGroupsTarget = statisticGroupsTarget
                this.tagGroupsTarget = tagGroupsTarget
                this.queryConditionsTarget = queryConditionsTarget
                this.queryColumnsTarget = queryColumnsTarget

                this.statisticGroupsSource = pullAll(statisticGroupsSource, statisticGroupsTarget)
                this.tagGroupsSource = pullAll(tagGroupsSource, tagGroupsTarget)
                this.queryConditionsSource = pullAll(queryConditionsSource, queryConditionsTarget)
                this.queryColumnsSource = pullAll(queryColumnsSource, queryColumnsTarget)
            } else {
                this.statisticGroupsSource = statisticGroupsSource
                this.tagGroupsSource = tagGroupsSource
                this.queryConditionsSource = queryConditionsSource
                this.queryColumnsSource = queryColumnsSource
            }
        },
        // 生成数据
        getData () {
            const data = {
                ...this.addFormData,
                statisticGroups: this.statisticGroupsTarget,
                tagGroups: this.tagGroupsTarget,
                queryConditions: this.queryConditionsTarget,
                queryColumns: this.queryColumnsTarget
            }
            return data
        },
        // 左侧“头部统计块”点击事件
        statisticGroupsAdd (el, index) {
            if (this.statisticGroupsTarget.indexOf(el) === -1) {
                this.statisticGroupsSource.splice(index, 1)
                this.statisticGroupsTarget.push(el)
            }
        },
        // 左侧“头部统计块”抓起事件
        statisticGroupsOnChoose (a) {
            const { oldIndex } = a
            this.statisticGroupsSourceDragRow = this.statisticGroupsSource[oldIndex]
        },
        // 右侧“头部统计块”删除事件
        statisticGroupsClose (index) {
            const delData = this.statisticGroupsTarget.splice(index, 1)
            this.statisticGroupsSource.push(delData[0])
        },
        // 左侧“查询标签”点击事件
        tagGroupsGroupsAdd (el, index) {
            if (this.tagGroupsTarget.indexOf(el) === -1) {
                this.tagGroupsSource.splice(index, 1)
                this.tagGroupsTarget.push(el)
            }
        },
        // 左侧“查询标签”抓起事件
        tagGroupsSourceOnChoose (a) {
            const { oldIndex } = a
            this.tagGroupsSourceDragRow = this.tagGroupsSource[oldIndex]
        },
        // 右侧“查询标签”删除事件
        tagGroupsClose (index) {
            const delData = this.tagGroupsTarget.splice(index, 1)
            this.tagGroupsSource.push(delData[0])
        },
        // 右侧“查询标签”禁止重复数据
        tagGroupsSourcePutFunc () {
            const dragRow = this.tagGroupsSourceDragRow
            return this.tagGroupsTarget.indexOf(dragRow) === -1
        },
        // 左侧“查询条件”点击事件
        queryConditionsAdd (el, index) {
            if (this.queryConditionsTarget.indexOf(el) === -1) {
                this.queryConditionsSource.splice(index, 1)
                this.queryConditionsTarget.push(el)
            }
        },
        // 左侧“查询条件”抓起事件
        queryConditionsOnChoose (a) {
            const { oldIndex } = a
            this.queryConditionsSourceDragRow = this.queryConditionsSource[oldIndex]
        },
        // 右侧“查询条件”删除事件
        queryConditionsClose (index) {
            const delData = this.queryConditionsTarget.splice(index, 1)
            this.queryConditionsSource.push(delData[0])
        },
        // 右侧“查询条件”禁止重复数据
        queryConditionsPutFunc () {
            const dragRow = this.queryConditionsSourceDragRow
            return this.queryConditionsTarget.indexOf(dragRow) === -1
        },
        // 左侧“列信息”点击事件
        queryColumnsAdd (el, index) {
            if (this.queryColumnsTarget.indexOf(el) === -1) {
                this.queryColumnsSource.splice(index, 1)
                this.queryColumnsTarget.push(el)
            }
        },
        // 左侧“列信息”抓起事件
        queryColumnsOnChoose (a) {
            const { oldIndex } = a
            this.queryColumnsSourceDragRow = this.queryColumnsSource[oldIndex]
        },
        // 右侧“列信息”删除事件
        queryColumnsClose (index) {
            const delData = this.queryColumnsTarget.splice(index, 1)
            this.queryColumnsSource.push(delData[0])
        },
        // 右侧“列信息”禁止重复数据
        queryColumnsPutFunc () {
            const dragRow = this.queryColumnsSourceDragRow
            return this.queryColumnsTarget.indexOf(dragRow) === -1
        },
        // 清除数据
        clearData () {
            this.$refs['ref_buildDataForm'].resetFields()
            this.statisticGroupsSource = []
            this.tagGroupsSource = []
            this.queryConditionsSource = []
            this.queryColumnsSource = []
            this.statisticGroupsTarget = []
            this.tagGroupsTarget = []
            this.queryConditionsTarget = []
            this.queryColumnsTarget = []
        },

        toggleSideBar () {
            this.leftFormOpened = !this.leftFormOpened
        },
        showDialogImg () {
            this.dialogVisible = true
        }
    }
}
</script>

<style scoped lang="scss">
    @import "~@/styles/element-variables.scss";
    @import "~@/styles/variables.scss";

    .interface-title {
        background-color: #f5f7fa;
        border: none;
        border-bottom: 1px solid #ebeef5;
        font-size: 16px;
        margin: 0;
        padding: 8px 15px;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .left-item {
        position: relative;
        border: 1px solid #ebeef5;
        border-radius: 4px;
    }

    .left-item + .left-item {
        margin-top: 20px;
    }

    .item-area {
        padding: 15px;
        background-color: $bgGreey;
    }

    .left-content, .right-content {
        height: 300px;
        overflow: auto;
        overflow-x: hidden;
        padding: 15px 10px;
    }

    .icon-close {
        font-size: 14px;
        color: #ff5248;
        cursor: pointer;
    }

    .left-ul-wrap, .right-ul-wrap {
        ul {
            list-style: none;
            padding-left: 0;
            border-radius: 3px;
        }

        li {
            border: 1px solid #ebeef5;
            padding: 5px 10px;
            cursor: move;
            background-color: #fff;
            border-radius: 4px;
        }

        li + li {
            margin-top: 10px;
        }

        .sortable-chosen {
            background-color: $--color-primary;
            color: #fff;
        }
    }

    .left-ul-wrap, .right-ul-wrap {
        height: 100%;

        ul {
            margin: 0;
            height: 100%;
        }
    }

    .data-tip-icon {
        position: absolute;
        right: -34px;
        top: 50%;

        i {
            font-size: 22px;
            display: block;
            color: #919192;
        }
    }
</style>
