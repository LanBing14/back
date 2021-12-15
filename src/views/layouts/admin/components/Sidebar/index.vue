<template>
    <div class="sidebar-container">
        <vue-scroll>
            <a-layout-sider v-model="isCollapse" :trigger="null" collapsible width="180px" style="background: #fff">
                <!--        <el-scrollbar wrap-class="scrollbar-wrapper">-->
                <div class="scroll-logo">
                    <img src="~@/assets/images/logo-default.png" alt="">
                </div>
                <a-menu
                    v-model="selectedKeys"
                    mode="inline"
                    theme="dark"
                    :defaultOpenKeys="defaultOpenKeys"
                    :inlineCollapsed="isCollapse"
                    :openKeys="openKeys"
                    @select="onMenuSelect"
                    @openChange="onOpenChange"
                >
                    <template v-for="item in admin_routers">
                        <template v-if="!item.hidden">
                            <a-menu-item v-if="item.children && item.children.length===1 && item.onlyShowSelf" :key="item.path">
                                <Item
                                    v-if="item.meta"
                                    :icon="item.meta.icon||item.meta.icon"
                                    :title="item.meta.title"/>
                            </a-menu-item>
                            <SubMenu v-else :menu-info="item" :key="item.path"   @click.native="reload" :base-path="item.path"></SubMenu>
                        </template>
                    </template>
                </a-menu>
            </a-layout-sider>
        </vue-scroll>
    </div>
</template>

<script>

    import {mapGetters, mapState} from 'vuex'
    import Item from './Item'
    import SubMenu from './SubMenu'
    import variables from '@/styles/variables.less'

    export default {
        components: {SubMenu, Item},
        data() {
            return {
                // collapsed: false,
                openKeys: [],
                caceOpenKeys: [],
                selectedKeys: [this.$route.path]
            }
        },
        computed: {
            ...mapGetters([
                'admin_routers',
                'sidebar'
            ]),
            ...mapState([
                'global'
            ]),
            isCollapse() {
                return !this.sidebar.opened
            },
            variables() {
                return variables;
            },
            defaultOpenKeys() {
                const find = this.findOpenKeys()
                this.openKeys = find
                return find
            },
            rootSubmenuKeys() {
                const a = this.admin_routers.map(i => i.alias || i.path)
                return a
            }
        },
        watch: {
            defaultOpenKeys(val) {
                this.openKeys = [...val]
            },
            isCollapse(val) {
                if (val) {
                    this.caceOpenKeys = this.openKeys
                    this.openKeys = []
                } else {
                    this.openKeys = this.caceOpenKeys
                }
            },
            'global.selectSaasCode'() {
                this.selectedKeys = []
            }
        },
        mounted() {
        },
        methods: {
            reload() {
                this.$emit('reload')
            },



            onMenuSelect({key}) {
                this.$router.push(key)
            },
            toggleCollapsed() {
                this.collapsed = !this.collapsed
            },
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.openKeys = openKeys
                } else {
                    this.openKeys = latestOpenKey ? [latestOpenKey] : []
                }
                // this.caceOpenKeys = [...this.openKeys]
            },
            findOpenKeys(currentRouters, parentPath, paths) {
                const p = currentRouters || this.admin_routers
                const pathArr = paths || []
                let findPath = ''
                for (let k = 0; k < p.length; k++) {
                    const r = p[k];
                    if (!r.hidden) {
                        if (r.children) {
                            this.findOpenKeys(r.children, r.alias || r.path, pathArr)
                        }
                        if (this.$route.path === (r.alias || r.path)) {
                            findPath = parentPath
                            findPath && pathArr.push(findPath)
                            break;
                        }
                    }
                }
                return pathArr
            }
        }
    }
</script>
<style scoped lang="less">
    @import '~@/styles/variables.less';

    .scroll-logo {
        text-align: center;
        height: @logoWrapHeight;
        background-color: @subMenuBg;
        transition: all 0.2s;

        img {
            margin-top: 14px;
        }
    }
</style>
<style>
    .ant-menu-dark.ant-menu-submenu-popup {
        max-height: 90vh;
        overflow: auto;
    }
</style>
