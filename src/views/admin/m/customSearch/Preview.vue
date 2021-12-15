<template>
    <el-dialog
        ref="drawer"
        title="表单预览"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        fullscreen
        @close="onClose"
    >
        <DynamicsForm ref="ref_dynamicsForm" :previewData="data" isPreview></DynamicsForm>
    </el-dialog>
</template>

<script>
import DynamicsForm from '@/views/admin/m/dynamicsForm/index'
export default {
    name: 'Preview',
    components: {
        DynamicsForm
    },
    props: {
        data: Object
    },
    data () {
        return {
            visible: false
        }
    },
    methods: {
        openPreview() {
            this.visible = true
        },
        onClose () {
            this.$emit("close")
        }
    }
}
</script>

<style scoped>

</style>
