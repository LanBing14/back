<template>
<el-dialog
    v-el-drag-dialog
    :visible.sync="dialogTableVisible"
    :title="title"
    @dragDialog="handleDrag"
    @close="close"
>
    <slot/>
    <div slot="footer">
        <slot name="footer" />
    </div>
</el-dialog>
</template>

<script>
    import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

    export default {
        name: 'Dialog',
        directives: {elDragDialog},
        props: {
            handleDrag: {
                type: Function,
                default: () => () => {
                }
            },
            close: {
                type: Function,
                default: () => () => {
                }
            }
        },
        data() {
            return {
                title: '',
                dialogTableVisible: false
            }
        },
        methods: {
            doOpen: function () {
                this.dialogTableVisible = true;
            },
            doClose: function () {
                this.dialogTableVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>
