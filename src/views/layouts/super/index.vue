<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="super-wrap">
            <Header></Header>
            <div class="content">
                <Navbar @changeRoute="changeRoute"></Navbar>
                <el-container>
                    <Sidebar :curRoutes="curRoutes"></Sidebar>
                    <el-main>
                        <AppMain/>
                    </el-main>
                </el-container>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import { Navbar, AppMain, Header } from './components'
import Sidebar from './components/Sidebar/index'

export default {
    name: 'SuperLayout',
    components: { Navbar, AppMain, Sidebar, Header },
    data () {
        return {
            curRoutes: [],
            basePath: ''
        }
    },
    computed: {
        sidebar () {
            return this.$store.state.app.sidebar
        },
        device () {
            return this.$store.state.app.device
        },
        classObj () {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        }
    },
    methods: {
        handleClickOutside () {
            this.$store.dispatch('closeSideBar', { withoutAnimation: false })
        },
        changeRoute (parentRoute) {
            this.curRoutes = parentRoute.children
            this.basePath = parentRoute.path
            console.log(parentRoute)
        }
    }
}
</script>
<style>
    /*.el-scrollbar{*/
    /*    height: 100%;*/
    /*}*/
    /*.scrollbar-wrapper{*/

    /*    overflow-x: hidden;*/
    /*}*/
</style>
<style scoped lang="scss">
    @import "src/styles/mixin.scss";

    .el-scrollbar{
        height: 100%;
        /deep/ .scrollbar-wrapper{
            overflow-x: hidden;
        }
    }

    .super-wrap{
        background-color: #F6F8FF;
        min-height: 100%;
    }
    .el-header {
        padding: 0;
    }

    .content{
        @include superContent;
        position: relative;
        z-index: 1;
        top: -27px;
    }
</style>
