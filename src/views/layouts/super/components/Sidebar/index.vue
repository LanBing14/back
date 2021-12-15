<template>
<!--    <el-scrollbar wrap-class="scrollbar-wrapper">-->
    <div class="menu-wrap">
        <el-menu
            ref="menu"
            :show-timeout="200"
            :default-active="$route.path"
            :style="{width:menuWidth?menuWidth+'px':'auto'}"
            text-color="#000"
            active-text-color="#449EF3"
        >
            <sidebar-item
                ref="sidebarItem"
                v-for="route in curRoutes"
                :key="route.path"
                :item="route"
                :base-path="route.path"/>
        </el-menu>
    </div>
<!--    </el-scrollbar>-->
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
    components: { SidebarItem },
    props: {
        curRoutes: Array,
        textColor: String,
        activeTextColor: {
            type: String,
            default: () => '#fff'
        }
    },
    data () {
        return {
            menuWidth: ''
        }
    },
    computed: {
        ...mapGetters([
            'super_routers',
            'sidebar'
        ]),
        isCollapse () {
            return !this.sidebar.opened
        }
    },
    // mounted() {
    //
    // },
    watch: {
        // curRoutes () {
        //     const menu = this.$refs.menu
        //     const sidebarItems = this.$refs.sidebarItem
        //     const menuWrapWidth = parseFloat(this.getStyle(menu.$el, 'width'))
        //     let itemsWidth = 0
        //     sidebarItems.forEach(item => {
        //         const w = parseFloat(this.getStyle(item.$el, 'width'))
        //         itemsWidth += w
        //     })
        //     console.log(itemsWidth, menuWrapWidth)
        //     if (itemsWidth > menuWrapWidth) {
        //         this.menuWidth = itemsWidth
        //     }
        // }
    },
    methods: {
        getStyle (dom, prop) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[prop]
            } else {
                return dom.currentStyle[prop]
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" scoped lang="scss">
    #app .menu-wrap {
        background-color: #fff;
        min-height: 600px;
        padding: 20px 0;
        width: 180px;
        overflow: hidden;
        /deep/ .el-submenu.is-active{
            &>div.el-submenu__title{
                background-color: rgba(30, 104, 234, 0.09);
                color: #449EF3 !important;
                position: relative;
                &::before{
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0;
                    width: 3px;
                    height: 100%;
                    background-image: linear-gradient(bottom, #417FF1,  #55FFF8);
                }
            }

        }
        .el-menu-item{
            height: 44px;
            line-height: 44px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        /deep/ .el-menu-item.is-active{
            background-color: rgba(30, 104, 234, 0.09);
            color: #449EF3;
            position: relative;
            /*&::before{*/
            /*    content: '';*/
            /*    display: block;*/
            /*    position: absolute;*/
            /*    left: 0;*/
            /*    width: 3px;*/
            /*    height: 100%;*/
            /*    background-image: linear-gradient(bottom, #417FF1,  #55FFF8);*/
            /*}*/
        }
    }

    /deep/ .el-submenu__icon-arrow {
        right: 6px;
        margin-top: -4px;
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
        background-color: rgba(0, 0, 0, .1);
    }

    .el-submenu__title {
        height: 60px;
        line-height: 60px;
    }

</style>
