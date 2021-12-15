<template>
    <a-layout :class="classObj">
        <Navbar></Navbar>
        <a-layout>
            <sidebar @reload="reload"/>
            <div class="main-container">
                <a-layout class="app-container">
                    <TagsView @reload="reload"/>
                    <AppMain :key="key"></AppMain>
                </a-layout>
            </div>
        </a-layout>
    </a-layout>
</template>

<script>
    import {Navbar, Sidebar, AppMain, TagsView} from './components'
    import ResizeMixin from './mixin/ResizeHandler'

    export default {
        data(){
            return {
                key:0,
                isRouterAlive: true,
            }
        },
        name: 'Layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            TagsView
        },
        mixins: [ResizeMixin],
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            }
        },
        created() {
            this.$store.dispatch('getPersonInfo');
        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('closeSideBar', {withoutAnimation: false})
            },
            reload() {
                this.key++
                // this.isRouterAlive = false;
                // this.$nextTick(() => (this.isRouterAlive = true));
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

        &.mobile.openSidebar {
            position: fixed;
            top: 0;
        }
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 100;
    }
</style>
