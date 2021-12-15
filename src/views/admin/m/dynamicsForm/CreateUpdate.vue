<template>
    <Drawer
        ref="drawer"
        :title="filterTitle(modelStatus)"
        :visible.sync="visible"
        :on-ok="handleSure"
        :width="pageData.model && pageData.model.width * 100 + '%'"
        :onlyCloseBtn="modelStatus==='view'"
        :btn="drawerBtns"
        @close="onClose"
    >
        <CreateUpdateBody
            ref="ref_createUpdateBodyMain"
            :model-status="modelStatus"
            :model="datas[0]"
            :row-id="rowId"
            :form-id="formId"
        ></CreateUpdateBody>
        <el-tabs
            v-if="tabsDatas.length > 1"
            type="border-card"
            style="margin-top: 40px;"
        >
            <el-tab-pane
                v-for="(el, index) in tabsDatas"
                v-if="index !== 0"
                :key="index"
                :label="el.subTitle"
            >
                <CreateUpdateListBody
                    ref="ref_createUpdateListBody"
                    :pid="pageData.model.formId"
                    :row-id="rowId"
                    :page-data="el"
                >
                </CreateUpdateListBody>
            </el-tab-pane>
        </el-tabs>
        <CreateUpdateListBody
            v-else-if="tabsDatas.length === 1"
            ref="ref_createUpdateListBody"
            :pid="pageData.model.formId"
            :row-id="rowId"
            :page-data="tabsDatas[0]"
        >
        </CreateUpdateListBody>
        <slot></slot>
    </Drawer>
</template>

<script type="text/jsx">
import CreateUpdateBody from './components/CreateUpdateBody'
import CreateUpdateListBody from './components/CreateUpdateListBody'
import {
    Api_FormModelBuildDetail
} from '@/api/admin/m/index'

export default {
    name: 'CreateUpdate',
    components: {
        CreateUpdateBody,
        CreateUpdateListBody
    },
    props: {
        getTaskParams: Function // 获取流程任务的表单数据
    },
    data () {
        return {
            pageLoaded: false,
            modelType: undefined, // 新增上级部门或者子部门标识
            visible: false, // 是否显示
            postFormData: {}, // 传递后台数据
            rowId: '', // 当前记录id
            formId: '', // 当前模型页面的表单id
            taskId: '', // 流程相关的任务id，只在处理流程的时候才会有
            modelStatus: 'add', // 页面的状态，新增或修改
            pageData: {}, // 当前页面骨骼数据
            datas: [],
            tabsDatas: []
        }
    },
    computed: {
        drawerBtns () {
            if (this.pageData.model && this.pageData.model.buttons) {
                const btns = [
                    {
                        text: '关闭',
                        click: () => {
                            this.closeModel()
                        }
                    }]
                // 如果有配置的额外按钮
                this.pageData.model.buttons.forEach(item => {
                    btns.push({
                        text: item.name,
                        click: () => {
                            this.handleSure(item.params, item.url)
                        }
                    })
                })
                return btns
            }
            return []
        }
    },
    methods: {
        /**
         * 打开模态框
         * @param formId    表单id
         * @param modelStatus   弹框状态，'add'新增，'update'修改
         * @param rowId     当前数据的id
         * @param taskId     流程相关的任务id，只在处理流程的时候才会有
         */
        openModel (formId, modelStatus, rowId, taskId) {
            this.formId = formId
            this.modelStatus = modelStatus
            this.rowId = rowId
            this.taskId = taskId
            const loading = this.$openLoading()
            Api_FormModelBuildDetail(formId).then(res => {
                this.pageData = res
                if (res.model.columns.length) {
                    this.datas.push(res.model)
                }
                if (res.model.tabs.length) {
                    this.tabsDatas.push(...res.model.tabs)
                }
                loading.close()
                this.$nextTick(() => {
                    this.visible = true
                })
            }).catch(() => {
                loading.close()
            })
        },
        // 点击确认
        handleSure (p = [], url = '') {
            if (url) {
                url = url.replace('{formId}', this.formId)
                url = url.replace('{taskId}', this.taskId)
            }
            if (this.taskId) {
                const { cb: promise, data } = this.getTaskParams()
                promise.then(() => {
                    for (const key in data) {
                        p.push({
                            isTask: true,
                            key,
                            value: data[key]
                        })
                    }
                    this.$refs.ref_createUpdateBodyMain.handleSure(p, url, this.successCallback, () => {})
                })
            } else {
                this.$refs.ref_createUpdateBodyMain.handleSure(p, url, this.successCallback, () => {})
            }
        },
        successCallback (msg) {
            this.visible = false
            this.onClose()
            this.$message.success(msg);
            this.$emit('getList')
            this.$emit('getDepTree')
        },
        handlePostData (promiseRes) {
            const loading = this.$openLoading()
            promiseRes.then(msg => {
                this.visible = false
                this.onClose()
                this.$message.success(msg);
                this.$emit('getList')
                this.$emit('getDepTree')
                loading.close()
            }).catch(() => {
                loading.close()
            })
        },
        filterTitle (val) {
            const { model, title } = this.pageData
            let t = title
            if (model) {
                t = model.subTitle ? model.subTitle : title
            }
            if (val === 'add') {
                return t + '——新增'
            } else if (val === 'update') {
                return t + '——修改'
            } else if (val === 'view') {
                return t + '——查看'
            }
            return ''
        },
        closeModel () {
            this.visible = false
            this.onClose()
        },
        // 模态框关闭时
        onClose () {
            this.datas = []
            this.tabsDatas = []
            this.$emit('modelClose')
        }
    }
}
</script>

<style scoped lang="scss">
    .form-wrap {
        display: flex;
        flex-wrap: wrap;

        &:after {
            content: "";
            display: block;
            clear: both;
        }

        .el-form-item {
            float: left;
        }
    }

    .popup-select-data {
        display: inline-block;
        margin-left: 15px;
        vertical-align: middle;
    }
</style>
