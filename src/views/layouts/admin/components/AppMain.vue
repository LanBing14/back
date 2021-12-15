<template>
<section class="app-main">
    <transition
        name="fade-transform"
        mode="out-in">
        <keep-alive :include="cachedViews">
            <router-view :key="key"/>
        </keep-alive>
    </transition>
</section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            cachedViews() {
                return this.$store.state.tagsView.cachedViews
            },
            key() {
                return this.$route.fullPath
            }
        }
    }
</script>

<style scoped lang="less">
    @import '~@/styles/variables.less';
    .app-main {
        /*94 = navbar + tags-view = 50 +44 */
        --bg: @navTagsViewHeight + @navHeight;
        height: calc(100vh - 108px);
        width: 100%;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
    }
</style>

