<template>
    <div class="app-container">
        <template v-if="pageDataLoaded">
            <PageHead v-if="!isPreview&&hasHead"></PageHead>
            <div style="padding: 0 20px;">
                <template v-if="datas.length>1">
                    <el-tabs type="border-card">
                        <el-tab-pane v-for="(el, index) in datas" :key="index" :label="el.subTitle">
                            <ListBody
                                ref="ref_ListBody"
                                :page-data="el"
                                is-other
                                @fetchOtherData="fetchOtherData"
                            ></ListBody>
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <template v-else>
                    <ListBody :pageData="datas[0]"></ListBody>
                </template>
            </div>
        </template>
    </div>
</template>

<script type="text/jsx">
import PageHead from '@/components/PageHead'
import ListBody from './components/ListBody'

export default {
    name: 'DynamicsFormList',
    components: { PageHead, ListBody },
    props: {
        isPreview: Boolean, // 是否预览
        pageData: Object, // 页面数据
        hasHead: {
            type: Boolean,
            default: () => true
        } // 是否需要头部
    },
    data () {
        return {
            formId: null, // 页面的表单id
            pageDataLoaded: false, // 页面数据是否已加载
            datas: []
        }
    },
    watch: {
        pageData (data) {
            this.initPage(data)
        }
    },
    mounted () {
        if (this.pageData) {
            this.initPage(this.pageData)
        }
    },
    methods: {
        initPage (model) {
            this.datas.push(model)
            if (model.tabs.length) {
                this.datas.push(...model.tabs)
            }
            this.$nextTick(() => {
                this.pageDataLoaded = true
            })
        },
        fetchOtherData (mergeFormId) {
            this.datas.forEach((item, index) => {
                if (item.formId !== mergeFormId) {
                    this.$refs.ref_ListBody[index].getList()
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
    @import '~@/styles/variables.scss';

    .el-tab-pane /deep/ {
        .page-content {
            padding-left: 0;
            padding-right: 0;
        }

        .search-area {
            padding: 0;
        }
    }

    .mallki-text {
        color: #fff;
    }

    .queryTags-wrap {
        padding: 13px 15px 0 15px;
        margin-bottom: 0;
        background-color: $bgGreey;

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

    }

    .statistic-item {
        text-align: center;
        color: #fff;
        margin-bottom: 15px;
        flex: 1;

        &:nth-child(3n) {
            .statistic-item-content {
                background-color: #44B6AE;
            }
        }

        &:nth-child(3n+1) {
            .statistic-item-content {
                background-color: #FACD91;
            }
        }

        &:nth-child(3n+2) {
            .statistic-item-content {
                background-color: #F2A6AF;
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
