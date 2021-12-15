<template>
    <component
        :is="compKey"
        :row="rowData"
        :formId="formId"
        :taskId="taskId"
        :viewId="viewId"
        :modelStatus="modelStatus"
        :todoVisible.sync="visible"
        @ok="handleSure"
    ></component>
</template>

<script>
import { merge } from 'lodash'
import custormComponents from '@/utils/todoCustormComponents'

export default {
    name: 'Custom',
    components: {
        ...custormComponents
    },
    props: {
        formId: String,
        taskId: String,
        viewId: String,
        modelStatus: String,
        compKey: String, // 组件名
        isOther: Boolean
    },
    data () {
        return {
            visible: false,
            rowData: {} // 当前详情数据
        }
    },
    methods: {
        openModel (row) {
            this.rowData = merge({}, row)
            this.visible = true
        },
        handleSure () {
            this.$emit('getList')
            if (this.isOther) {
                this.$emit('onOther')
            }
        },
        onClose () {}
    }
}
</script>

<style scoped></style>
