<template>
    <!--新增或修改-->
    <DynamicsFormCreateUpdate
        ref="ref_createUpdateModel"
        :getTaskParams="getTaskParams"
        @getList="getList"
        @modelClose="modelClose">
        <el-alert :closable="false" title="流程信息" type="success" style="margin: 20px 0;"/>
        <TableWrapper
            ref="child"
            :data="historyData"
            :filterGroup="false"
            :columns="tableCol"
            :tableProps="{border:true}"
            style="margin-bottom: 20px;"
        />
        <el-form
            ref="dataForm"
            v-if="modelStatus!=='view'"
            :model="postFormData"
            :rules="postFormRules"
            label-position="right"
            label-width="8em"
            class="form-wrap"
        >
            <el-form-item label="意见" prop="processRemark">
                <el-input v-model="postFormData.processRemark" :rows="4" type="textarea"/>
            </el-form-item>
        </el-form>
        <div class="processImg-wrap">
            <img :src="imgUrl" alt="" />
        </div>
    </DynamicsFormCreateUpdate>
</template>

<script type="text/jsx">
import TableWrapper from '@/components/TableWrapper'
import DynamicsFormCreateUpdate from '@/views/admin/m/dynamicsForm/CreateUpdate'
import {
    Api_ToDealHistory,
    Api_ToDealProcessImage
} from '@/api/admin/m/index'

export default {
    name: 'Todo',
    components: {
        DynamicsFormCreateUpdate,
        TableWrapper
    },
    props: {
        row: Object,
        todoVisible: Boolean,
        formId: String,
        taskId: String,
        modelStatus: String,
        viewId: String
    },
    data () {
        const createRules = this.$createRules
        return {
            historyData: [],
            postFormData: {
                processRemark: ''
            },
            postFormRules: {
                processRemark: createRules({
                    msg: '意见',
                    required: true,
                    max: 300
                })
            },
            tableCol: [
                {
                    key: 'taskDefName',
                    label: '流程节点',
                    width: 150
                }, {
                    key: 'operateUser',
                    label: '操作人',
                    width: 150
                }, {
                    key: 'processOperateDesc',
                    label: '操作',
                    width: 150
                }, {
                    key: 'modifyDate',
                    label: '操作时间',
                    width: 150,
                    render: (h, data, row) => {
                        return row.processOperateDesc ? row.createDate : ''
                    }
                }, {
                    key: 'processRemark',
                    label: '意见'
                }]
        }
    },
    computed: {
        imgUrl () {
            return Api_ToDealProcessImage(this.viewId)
        }
    },
    watch: {
        todoVisible (val) {
            if (val) {
                this.open()
            }
        }
    },
    mounted () {
        this.open()
    },
    methods: {
        // 打开弹框
        open () {
            this.getHistory()
            this.$refs.ref_createUpdateModel.openModel(this.formId, this.modelStatus, this.viewId, this.taskId)
        },
        getList () {
            this.$emit('ok')
        },
        // 获取历史信息
        getHistory () {
            Api_ToDealHistory({
                businessKey: this.viewId
            }).then(res => {
                this.historyData = res
            })
        },
        modelClose () {
            this.$emit('update:todoVisible', false)
        },
        // 获取当前流程任务的表单数据
        getTaskParams () {
            return {
                cb: this.$refs['dataForm'].validate(),
                data: this.postFormData
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .processImg-wrap {
        background-color: #F5F6FA;
    }
    .el-table th{
        background-color: #F5F7FA;
    }
</style>
