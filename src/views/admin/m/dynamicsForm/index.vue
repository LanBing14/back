<!--<template>-->
<!--    <component :is="currentComp" :pageData="pageData"></component>-->
<!--</template>-->

<script type="text/jsx">
import { merge } from 'lodash'
import List from './List'
import ListEdit from './components/ListEdit'
import {
    // Api_FormModelBuildDetail,
    Api_FormFormsCustomListView
} from '@/api/admin/m/index'

export default {
    name: 'DynamicsFormIndex',
    // components: { List, ListEdit },
    props: {
        isPreview: Boolean, // 当前是预览形式的表单
        previewData: Object, // 预览表单模型的数据
        listFormId: String, // 如果当前有从外界传入表单id
        hasHead: {
            type: Boolean,
            default: () => true
        } // 是否需要头部
    },
    data () {
        return {
            pageType: '0',
            pageData: null
        }
    },
    computed: {
        currentComp () {
            return this.pageType === '0' ? 'List' : 'ListEdit'
        }
    },
    created () {
        if (this.isPreview) {
            this.initData(merge({}, this.previewData))
        } else {
            const { id: formId } = this.$route.query
            Api_FormFormsCustomListView(this.listFormId || formId).then(res => {
                this.initData(res)
            })
        }

        // Api_FormModelBuildDetail(formId).then(res => {
        //     if (res.model) {
        //         this.pageType = res.model.type
        //         this.pageData = { ...res }
        //     }
        // })
    },
    methods: {
        initData (res) {
            const { listModel, customList } = res
            if (customList) {
                this.setResData(listModel, customList)
                listModel.tabs.forEach((item, index) => {
                    this.setResData(item, customList.tabs[index])
                })
            }
            this.pageType = res.listModel.type
            this.pageData = { ...res.listModel }
        },
        setResData (model, customList) {
            model.subTitle = customList.subTitle
            const statisticGroups = model.statisticGroups.filter(i => {
                return customList.statisticGroups.find(c => c === i.name)
            })
            model.statisticGroups = customList.statisticGroups.map(item => {
                return statisticGroups.find(i => {
                    return i.name === item
                })
            })
            const tagGroups = model.tagGroups.filter(i => {
                return customList.tagGroups.find(c => c === i.groupName)
            })
            model.tagGroups = customList.tagGroups.map(item => {
                return tagGroups.find(i => {
                    return i.groupName === item
                })
            })
            const queryConditions = model.queryConditions.filter(i => {
                return customList.queryConditions.find(c => c === i.conditionTitle)
            })
            model.queryConditions = customList.queryConditions.map(item => {
                return queryConditions.find(i => {
                    return i.conditionTitle === item
                })
            })
            const queryColumns = model.queryColumns.filter(i => {
                return customList.queryColumns.find(c => c === i.annotation)
            })
            model.queryColumns = customList.queryColumns.map(item => {
                return queryColumns.find(i => {
                    return i.annotation === item
                })
            })
        }
    },
    render () {
        let comp = (this.pageType === '0' ? <List pageData={ this.pageData } isPreview={this.isPreview} hasHead={this.hasHead}/> : <ListEdit pageData={ this.pageData
        }/>)
        if (this.isPreview) {
            comp = <div>
                { comp }
                <div class='preview-mask'></div>
            </div>
        }
        return comp
    }
}
</script>

<style scoped lang="scss">
    @import '~@/styles/variables.scss';

    .preview-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

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
