<template>
    <Drawer
        ref="drawer"
        title="test组件标题"
        :visible.sync="drawerVisible"
        :onOk="handleSure"
        @close="onClose">
        wrwer
    </Drawer>
</template>

<script>
    export default {
        name: "Test",
        props: {
            row: Object,
            visible: Boolean
        },
        data() {
            return {
                drawerVisible: this.visible
            }
        },
        watch: {
            visible(val) {
                this.drawerVisible = val;
            }
        },
        methods: {
            handleSure() {
                this.$emit('ok');
                this.$emit('update:visible', false)
            },
            onClose() {
                this.$emit('update:visible', false)
            }
        }
    }
</script>

<style scoped>

</style>
