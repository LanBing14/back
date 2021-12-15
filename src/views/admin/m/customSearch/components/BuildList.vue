<template>
    <el-dialog
        ref="drawer"
        :title="oldFormData.name"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1300px"
        @close="onBuildModelClose"
    >
        <BuildFormBody ref="ref_buildFormBody" :data="formModelData"></BuildFormBody>

        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="primary" @click="handleSure">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import vuedraggable from 'vuedraggable'
import BuildFormBody from './BuildFormBody' // 平铺表单或tab表单建模修改

export default {
    name: 'BuildList',
    components: {
        BuildFormBody
    },
    data () {
        const createRules = this.$createRules
        return {
            formModelData: null,
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
                subTitle: ''
            },
            oldFormData: {},
            updateIndex: 0,
            statisticGroupsSource: [], // 左侧“头部统计块”数据源
            tagGroupsSource: [], // 左侧“查询标签”数据源
            queryConditionsSource: [], // 左侧“查询条件”数据源
            queryColumnsSource: [], // 左侧“列信息”数据源
            statisticGroupsTarget: [], // 左侧“头部统计块”数据源
            tagGroupsTarget: [], // 左侧“查询标签”数据源
            queryConditionsTarget: [], // 左侧“查询条件”数据源
            queryColumnsTarget: [] // 左侧“列信息”数据源
        }
    },
    methods: {
        // 打开模态框
        openModel (oldFormData, updateIndex) {
            this.formModelData = oldFormData
            this.updateIndex = updateIndex
            this.visible = true
        },
        // 点击确认
        handleSure () {
            const buildFormData = this.$refs.ref_buildFormBody.getData()
            this.$emit('ok', { ...buildFormData }, this.updateIndex)
            this.formModelData = null
            this.visible = false
        },
        // 建模弹框关闭时
        onBuildModelClose () {
            this.$refs['ref_buildFormBody'].clearData()
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~@/styles/element-variables.scss";
    @import "~@/styles/variables.scss";

    .fr {
        float: left;
    }

    .querySign-table {
        margin: 0 -10px;

        td {
            padding: 0 10px;
        }
    }

    .item-area {
        padding: 28px 15px;
        background-color: $bgGreey;

        /deep/ .el-form-item__content {
            display: flex;
        }

        .content {
            flex: 1;
        }

        & > .el-form-item {
            margin-bottom: 5px;
            margin-top: 5px;
        }

        &::after {
            content: "";
            display: block;
            clear: both;
        }
    }

    .interface-title {
        clear: both;
        font-weight: normal;
        margin-top: 0.48rem;
        margin-bottom: 0.16rem;
        border-left: 3px solid #2395f1;
        padding-left: 8px;
    }

    .left-top {
        margin-bottom: 20px;

        .actions {
            float: right;
        }
    }

    .pp-checkbox-item {
        width: 100%;

        & + & {
            margin-top: 6px;
        }
    }

    .icon-close {
        font-size: 14px;
        color: #ff5248;
        cursor: pointer;
    }

    .left-content {
        height: 300px;
        overflow: auto;
        overflow-x: hidden;
        padding-right: 10px;
    }

    .left-ul-wrap {
        ul {
            list-style: none;
            padding-left: 2em;
        }

        li {
            border: 1px solid #ccc;
            padding: 2px 6px;
            border-radius: 3px;
        }

        li + li {
            margin-top: 10px;
        }

        .sortable-chosen {
            background-color: $--color-primary;
            color: #fff;
        }
    }

    .border-dashed {
        border: 1px dashed #464444;
        padding: 8px 0;
        border-radius: 4px;
        margin-right: 10px;
    }
</style>
<style>
    .pp-popover {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
    }
</style>
