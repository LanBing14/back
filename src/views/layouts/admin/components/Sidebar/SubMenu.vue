<template>
    <a-sub-menu :key="resolvePath(menuInfo.alias||menuInfo.path)" v-bind="$props" v-on="$listeners">
        <template slot="title">
            <Item
                v-if="menuInfo.meta"
                :icon="menuInfo.meta.icon||menuInfo.meta.icon"
                :title="menuInfo.meta.title"/>
        </template>
        <template v-for="item in menuInfo.children">
            <template v-if="!item.hidden">
                <a-menu-item v-if="!item.children || hasOneShowingChild(item.children,item)" :key="resolvePath(item.alias||item.path)">
                    <Item
                        v-if="item.meta"
                        :icon="item.meta.icon||item.meta.icon"
                        :title="item.meta.title"/>
                </a-menu-item>
                <sub-menu v-else-if="!hasOneShowingChild(item.children,item)" :key="resolvePath(item.alias||item.path)" :menu-info="item" :base-path="resolvePath(item.alias||item.path)"/>
            </template>
        </template>
    </a-sub-menu>
</template>
<script>
    import {Menu} from 'ant-design-vue';
    import path from 'path'
    import {isExternal} from '@/utils'
    import AppLink from './Link'
    import Item from './Item'


    export default {
        name: 'SubMenu',
        components: {
            AppLink,
            Item
        },
        // must add isSubMenu: true
        isSubMenu: true,
        props: {
            ...Menu.SubMenu.props,
            basePath: {
                type: String,
                default: ''
            },
            // Cannot overlap with properties within Menu.SubMenu.props
            menuInfo: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                onlyOneChild: null
            }
        },
        methods: {
            hasOneShowingChild(children, parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        // Temp set(will be used if only has one showing child)
                        this.onlyOneChild = item
                        return true
                    }
                })

                // When there is only one child router, the child router is displayed by default
                if (showingChildren.length === 1) {
                    return true
                }

                // Show parent if there are no child router to display
                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
                    return true
                }

                return false
            },
            resolvePath(routePath) {
                if (this.isExternalLink(routePath)) {
                    return routePath
                }
                return path.resolve(this.basePath, routePath)
            },
            isExternalLink(routePath) {
                return isExternal(routePath)
            }
        }
    };
</script>
