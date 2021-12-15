<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="selectData.name+'配置'"
        :btn="btns"
        width="50%"
        @close="onModelClose"
    >
        <el-row>
            <!--<el-col :md="leftFormOpened ? 8 : 2" :lg="leftFormOpened ? 6 : 1">
                <div class="left-top">
                    <div class="flex">
                        <div class="flex-primary">
                            <h2 class="interface-title">平铺</h2>
                        </div>
                    </div>
                    <div class="left-content">
                        <Draggable
                            v-model="ppRenderData"
                            v-bind="draggableOptions"
                            :group="{ name: 'people', pull: 'clone', put: false }"
                            class="left-ul-wrap"
                        >
                            <transition-group
                                tag="ul"
                                name="fade-in-up"
                                mode="out-in"
                                appear
                            >
                                <li
                                    v-for="(el, index) in ppRenderData"
                                    :key="el.id"
                                    class="drag-icon flex"
                                    @click="handleUpdateFormBuildPP(el, index)"
                                >
                                    <div class="flex-primary">{{ el.name }}</div>
                                    <div @click.stop="closePp(el)">
                                        <i class="iconfont icon-close"></i>
                                    </div>
                                </li>
                            </transition-group>
                        </Draggable>
                    </div>
                </div>
                <div class="left-bottom">
                    <div class="flex">
                        <div class="flex-primary">
                            <h2 class="interface-title">tab</h2>
                        </div>
                    </div>
                    <div class="left-content">
                        <Draggable
                            v-model="tabRenderData"
                            v-bind="draggableOptions"
                            :group="{ name: 'people', pull: 'clone', put: false }"
                            class="left-ul-wrap"
                        >
                            <transition-group
                                tag="ul"
                                name="fade-in-up"
                                mode="out-in"
                                appear
                            >
                                <li
                                    v-for="(el, index) in tabRenderData"
                                    :key="el.id"
                                    class="drag-icon"
                                    @click="handleUpdateFormBuildTab(el, index)"
                                >
                                    {{ el.name }}
                                </li>
                            </transition-group>
                        </Draggable>
                    </div>
                </div>
            </el-col>-->
            <el-col class="right-col-wrap">
                <BuildFormBody ref="ref_buildFormBody" :data="formModelData"></BuildFormBody>
            </el-col>
        </el-row>
        <!--tab表单建模修改-->
        <BuildList ref="ref_formBuildEditTab" @ok="onFormBuildEditOkTab"/>
        <Preview v-if="previewData" ref="ref_preview" :data="previewData" @close="onPreviewClose"></Preview>
    </Drawer>
</template>

<script>
import { merge } from 'lodash'
import vuedraggable from 'vuedraggable'
// import Hamburger from '@/components/Hamburger'
import BuildList from './components/BuildList' // 平铺表单或tab表单建模修改
import BuildFormBody from './components/BuildFormBody' // 平铺表单或tab表单建模修改
import Preview from './Preview' // 预览组件

import {
    Api_FormFormsCustomListView,
    Api_FormFormsCustomListSave,
    Api_FormDetail
} from '@/api/admin/m/index'

export default {
    name: 'Disposed',
    components: {
        Draggable: vuedraggable,
        // Hamburger,
        BuildList,
        BuildFormBody,
        Preview
    },
    props: {
        selectData: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        const createRules = this.$createRules

        return {
            formId: null,
            visible: false,
            dialogVisible: false,
            leftFormOpened: true,
            formModelData: null,
            previewData: null,
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
            btns: [
                {
                    text: '关闭',
                    click: () => {
                        this.visible = false
                        this.onModelClose()
                    }
                },
                {
                    text: '预览',
                    type: 'primary',
                    click: () => {
                        this.handlePreview()
                    }
                },
                {
                    text: '确定',
                    type: 'primary',
                    click: () => {
                        this.handleSure()
                    }
                }
            ],
            ppRenderData: [], // 平铺的选中数据(用于页面渲染)
            ppData: [], // 平铺的选中数据
            tabRenderData: [], // tab的选中数据(用于页面渲染)
            tabData: [] // tab的选中数据
        }
    },
    methods: {
        // 打开模态框
        openModel () {
            const { id: rowId } = this.selectData
            const loading = this.$openLoading()
            Api_FormFormsCustomListView(rowId).then(res => {
                const { listModel, customList } = res
                this.formModelData = res
                if (listModel.normals) {
                    listModel.normals.map((item, index) => {
                        Api_FormDetail(item.formId).then(detailRes => {
                            this.ppRenderData.push({
                                ...detailRes,
                                data: {
                                    listModel: item,
                                    customList: customList && customList.normals && customList.normals[index]
                                }
                            })
                        })
                        // this.leftFormOpened = true
                    })
                }
                if (listModel.tabs) {
                    listModel.tabs.map((item, index) => {
                        Api_FormDetail(item.formId).then(detailRes => {
                            this.tabRenderData.push({
                                ...detailRes,
                                data: {
                                    listModel: item,
                                    customList: customList && customList.tabs && customList.tabs[index]
                                }
                            })
                        })
                        // this.leftFormOpened = true
                    })
                }

                this.visible = true
                loading.close()
            }).catch(() => {
                loading.close()
            })
        },
        // 抽屉确认
        handleSure () {
            const modelTabs = this.tabRenderData.filter(item => item.data.customList).map(item => item.data.customList)
            const buildFormBodyData = {
                ...this.$refs.ref_buildFormBody.getData(),
                tabs: modelTabs,
                normals: []
            }

            const loading = this.$openLoading()

            Api_FormFormsCustomListSave(this.selectData.id, { text: JSON.stringify(buildFormBodyData) }).then(msg => {
                this.$message.success(msg);
                this.visible = false
                loading.close()
                this.$emit('getList')
                this.onModelClose()
            }).catch(() => {
                loading.close()
            })
        },
        // 抽屉预览
        handlePreview () {
            const modelTabs = this.tabRenderData.filter(item => item.data.customList).map(item => item.data.customList)
            const customList = merge({}, {
                ...this.$refs.ref_buildFormBody.getData(),
                tabs: modelTabs,
                normals: []
            })
            const listModel = merge({}, this.formModelData.listModel)
            this.previewData = {
                customList,
                listModel
            }
            this.$nextTick(() => {
                this.$refs.ref_preview.openPreview()
            })
        },
        // 预览关闭
        onPreviewClose () {
            console.log(12321)
            this.previewData = null
        },
        // 平铺表单修改建模
        handleUpdateFormBuildPP () {
        },
        // tab表单修改建模
        handleUpdateFormBuildTab (row, updateIndex) {
            this.$refs.ref_formBuildEditTab.openModel(row.data, updateIndex)
        },
        // 平铺表单建模修改确认事件
        onFormBuildEditOkPP () {
        },
        // tab表单建模修改确认事件
        onFormBuildEditOkTab (newDataModel, updateIndex) {
            this.tabRenderData[updateIndex].data.customList = newDataModel
        },
        // toggleSideBar () {
        //     this.leftFormOpened = !this.leftFormOpened
        // },
        showDialogImg () {
            this.dialogVisible = true
        },
        // 抽屉关闭时
        onModelClose () {
            this.$refs['ref_buildFormBody'].clearData()
            this.tabRenderData = []
        }
    }
}
</script>
<style scoped lang="scss">
    @import "~@/styles/element-variables.scss";
    @import "~@/styles/variables.scss";

    .right-col-wrap{
        padding-left: 40px;
        position: relative;
        /*&::before{*/
        /*    content: '';*/
        /*    position: absolute;*/
        /*    left: 19px;*/
        /*    width: 1px;*/
        /*    height: 100%;*/
        /*    background-color: rgba(227, 228, 228, 0.6);*/
        /*    box-shadow: 0px 0 3px rgba(227, 228, 228, 0.6);*/
        /*}*/
    }
    .left-top{
        margin-top: 74px;
        margin-bottom: 18px;
    }
    .left-item + .left-item {
        margin-top: 20px;
    }

    .item-area {
        padding: 15px;
        background-color: $bgGreey;
    }
    .interface-title{
        margin-bottom: 6px;
    }
    .left-content, .right-content {
        height: 300px;
        overflow: auto;
        overflow-x: hidden;
        background: $bgGreey;
        padding: 15px 10px;
    }

    .right-content {
        padding-top: 15px;
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
            margin: 0;
        }

        li {
            border: 1px solid #ebeef5;
            padding: 5px 15px;
            cursor: move;
            background-color: #fff;

            &:first-child {
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
            }

            &:last-child {
                border-bottom-left-radius: 3px;
                border-bottom-right-radius: 3px;
            }
        }

        li + li {
            border-top: 0;
        }

        .sortable-chosen {
            background-color: $--color-primary;
            color: #fff;
        }
    }

    .right-ul-wrap {
        height: 100%;

        ul {
            margin: 0;
            height: 100%;
        }
    }
</style>
