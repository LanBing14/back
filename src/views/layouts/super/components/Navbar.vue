<template>
    <div class="nav-wrap" :style="{backgroundColor: backgroundColor}">
        <div v-for="(el,index) in super_routers" :key="el.id">
            <!--            {{ el.meta && el.meta.title }}-->
            <!--            <template v-if="hasOneShowingChild(el.children, el)&& (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!el.alwaysShow">-->
            <!--                <app-link :to="resolvePath(onlyOneChild.alias||onlyOneChild.path)" :new-window="el.window" :query="el.query">-->
            <!--                    <span v-if="onlyOneChild.meta">-->
            <!--&lt;!&ndash;                        <i v-if="onlyOneChild.meta.icon||el.meta.icon" :class="[onlyOneChild.meta.icon||el.meta.icon]" class="iconfont"></i>&ndash;&gt;-->
            <!--                        {{ onlyOneChild.meta.title }}-->
            <!--                    </span>-->
            <!--                </app-link>-->
            <!--            </template>-->
            <!--            <template v-else>-->
            <!--                <div  v-if="el.meta" @click="selectRoute(el)">-->
            <!--                    <i v-if="el.meta.icon" :class="[el.meta.icon]" class="iconfont"></i>-->
            <!--                    {{ el.meta.title }}-->
            <!--                </div>-->
            <router-link :to="el.path" active-class="navMenuActive" class="router-a" :exact="index===0" @click.native="selectRoute(el)">
                <i v-if="el.meta" :class="[el.meta.icon]" class="iconfont"></i>
                {{ el.meta && el.meta.title }}
            </router-link>
            <!--            </template>-->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils'
// import Sidebar from './Sidebar/index'
// import AppLink from './Sidebar/Link'

export default {
    name: 'Navbar',
    props: {
        backgroundColor: String,
        textColor: String,
        activeTextColor: String
    },
    data () {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            logoWidth: 200,
            navRightWidth: 200,
            onlyOneChild: null
        }
    },
    computed: {
        ...mapGetters([
            'super_routers'
        ])
    },
    mounted () {
        const navMenuActive = this.$el.getElementsByClassName('navMenuActive')[0]
        navMenuActive && navMenuActive.click()
    },
    methods: {
        selectRoute (el) {
            this.$emit('changeRoute', el)
        },
        hasOneShowingChild (children, parent) {
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
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        },
        resolvePath (routePath) {
            if (this.isExternalLink(routePath)) {
                return routePath
            }
            return path.resolve(routePath)
        },
        isExternalLink (routePath) {
            return isExternal(routePath)
        }
    }
}
</script>

<style scoped lang="scss">
    .nav-wrap {
        height: 54px;
        box-shadow: 0 4px 43px rgba(30, 104, 234, 0.18);
        border-radius: 8px;
        background-color: #fff;
        margin-bottom: 20px;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        & > div {
            display: inline-block;
            padding: 0 25px;
            height: 100%;

            & > a, & > span {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }
        }

        .logo-wrap {
            float: left;
            height: 100%;
        }

        .nav-body {
            float: left;
            height: 100%;
        }

        .nav-right {
            min-width: 200px;
            float: right;
        }

        .router-a {
            color: #000;
            font-weight: bold;

            &.navMenuActive {
                background-image: -webkit-linear-gradient(bottom, #417FF1, #55FFF8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

</style>
