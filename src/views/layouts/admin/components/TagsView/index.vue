<template>
    <div
        id="tags-view-container"
        :class="{ isLR: isLR }"
        class="tags-view-container"
    >
    <span v-if="isLR" class="iconLeftWrap" @click="toLeft">
      <i class="iconfont icon-left"></i>
    </span>
        <span v-if="isLR" class="iconRightWrap" @click="toRight">
      <i class="iconfont icon-right"></i>
    </span>
        <ScrollPane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                tag="span"
                class="tags-view-item"
                @click.native="reload(tag)"
                @contextmenu.prevent.native="openMenu(tag, $event)"
            >
                {{ tag.title }}
                <svg-icon
                    v-if="!tag.meta.affix"
                    type="icon-close"
                    @click.prevent.stop="closeSelectedTag(tag)"
                />
            </router-link>
        </ScrollPane>
        <ul
            v-show="visible"
            :style="{ left: left + 'px', top: top + 'px' }"
            class="contextmenu"
        >
            <li @click="refreshSelectedTag(selectedTag)">刷新</li>
            <li
                v-if="!(selectedTag.meta && selectedTag.meta.affix)"
                @click="closeSelectedTag(selectedTag)"
            >
                关闭
            </li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags(selectedTag)">关闭所有</li>
        </ul>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import ScrollPane from "./ScrollPane";
    import path from "path";

    export default {
        components: {ScrollPane},
        data() {
            const selectCode = this.$store.getters.selectSaasCode
            return {
                visible: false,
                top: 0,
                left: 0,
                selectedTag: {},
                affixTags: [],
                timer: null,
                selectSaasCode: selectCode
            };
        },
        computed: {
            ...mapState({
                isLR: state => state.tagsView.isLR,
                scrollbarWrap: state => state.tagsView.scrollbarWrap
            }),
            visitedViews() {
                return this.$store.state.tagsView.visitedViews;
            },
            routes() {
                return this.$store.state.permission.adminRouters;
            }
        },
        watch: {
            '$store.getters.selectSaasCode'(val) {
                this.closeAllTags(this.selectedTag)
            },
            $route() {
                this.addTags();
                this.moveToCurrentTag();
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener("click", this.closeMenu);
                } else {
                    document.body.removeEventListener("click", this.closeMenu);
                }
            }
        },
        mounted() {
            this.initTags();
            this.addTags();
            const wrap = this.$refs.scrollPane.$el;
            const view = this.$refs.scrollPane.$el.querySelector(".__view");
            this.$store.commit("tagsView/INIT_DOM", {
                wrap,
                view
            });
            window.addEventListener("resize", this.onresize, false);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
            this.bindLR();
        },
        methods: {
            //  重新加载页面
            reload(route){
               if(route.path === this.$route.path){
                  this.$emit('reload')
               }
            },
            isActive(route) {
                return route.path === this.$route.path;
            },
            filterAffixTags(routes, basePath = "/") {
                let tags = [];
                routes.forEach(route => {
                    if (route.meta && route.meta.affix) {
                        const tagPath = path.resolve(basePath, route.path);
                        tags.push({
                            fullPath: tagPath,
                            path: tagPath,
                            name: route.name,
                            meta: {...route.meta}
                        });
                    }
                    if (route.children) {
                        const tempTags = this.filterAffixTags(route.children, route.path);
                        if (tempTags.length >= 1) {
                            tags = [...tags, ...tempTags];
                        }
                    }
                });
                return tags;
            },
            initTags() {
                const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
                for (const tag of affixTags) {
                    // Must have tag name
                    if (tag.name) {
                        this.$store.dispatch("tagsView/addVisitedView", tag);
                    }
                }
            },
            addTags() {
                const {name} = this.$route;
                if (name) {
                    this.$store.dispatch("tagsView/addView", this.$route);
                    this.$nextTick(() => {
                        this.$store.commit("tagsView/DIS_LR");
                    });
                }
                return false;
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag;
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag);
                            // when query is different then update
                            if (tag.to.fullPath !== this.$route.fullPath) {
                                this.$store.dispatch("tagsView/updateVisitedView", this.$route);
                                this.$nextTick(() => {
                                    this.$store.commit("tagsView/DIS_LR");
                                });
                            }
                            break;
                        }
                    }
                });
            },
            refreshSelectedTag(view) {
                this.$store.dispatch("tagsView/delCachedView", view).then(() => {
                    const {fullPath} = view;
                    this.$nextTick(() => {
                        this.$router.replace({
                            path: "/redirect" + fullPath
                        });
                    });
                });
            },
            closeSelectedTag(view) {
                this.$store
                    .dispatch("tagsView/delView", view)
                    .then(({visitedViews}) => {
                        this.$nextTick(() => {
                            this.$store.commit("tagsView/DIS_LR");
                        });
                        if (this.isActive(view)) {
                            this.toLastView(visitedViews, view);
                        }
                    });
            },
            closeOthersTags() {
                this.$router.push(this.selectedTag);
                this.$store
                    .dispatch("tagsView/delOthersViews", this.selectedTag)
                    .then(() => {
                        this.moveToCurrentTag();
                    });
            },
            closeAllTags(view) {
                this.$store.dispatch("tagsView/delAllViews").then(({visitedViews}) => {
                    this.$nextTick(() => {
                        this.$store.commit("tagsView/DIS_LR");
                    });
                    if (this.affixTags.some(tag => tag.path === view.path)) {
                        return;
                    }
                    this.toLastView(visitedViews, view);
                });
            },
            toLastView(visitedViews, view) {
                const latestView = visitedViews.slice(-1)[0];
                if (latestView) {
                    this.$router.push(latestView).catch(err => {
                        err
                    });
                } else {
                    // now the default is to redirect to the home page if there is no tags-view,
                    // you can adjust it according to your needs.
                    if (view.name === "Dashboard") {
                        // to reload home page
                        this.$router.replace({path: "/redirect" + view.fullPath});
                    } else {
                        this.$router.push("/");
                    }
                }
            },
            openMenu(tag, e) {
                const menuMinWidth = 105;
                const offsetTop = this.$el.getBoundingClientRect().top; // container margin top
                const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
                const offsetWidth = this.$el.offsetWidth; // container width
                const maxLeft = offsetWidth - menuMinWidth; // left boundary
                const left = e.clientX - offsetLeft + 15; // 15: margin right

                if (left > maxLeft) {
                    this.left = maxLeft;
                } else {
                    this.left = left;
                }
                this.top = e.clientY - offsetTop;
                this.visible = true;
                this.selectedTag = tag;
            },
            closeMenu() {
                this.visible = false;
            },
            // 绑定resize事件
            onresize() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$store.commit("tagsView/DIS_LR");
                }, 200);
            },
            // 解绑resize事件
            bindLR() {
                window.removeEventListener("resize", this.onresize);
            },
            // 向左
            toLeft() {
                this.scrollbarWrap.scrollLeft -= 100;
            },
            toRight() {
                this.scrollbarWrap.scrollLeft += 100;
            }
        }
    };
</script>

<style lang="less" scoped>
    /*@import "~@/styles/element-variables.scss";*/

    .isLR {
        padding: 0 20px;
    }

    .tags-view-container {
        position: relative;
        /*z-index: 1;*/
        height: 49px;
        width: 100%;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        background-color: #4b9df3;

        .tags-view-wrapper {
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border: 1px solid #d8dce5;
                color: #fff;
                background: transparent;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 12px;
                margin-top: 10px;
                margin-bottom: 10px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;

                &:first-of-type {
                    margin-left: 40px;
                }

                &:last-of-type {
                    margin-right: 15px;
                }

                &.active {
                    background-color: #fff;
                    color: #85b36c;
                    border-color: #fff;

                    /*&::before {*/
                    /*content: '';*/
                    /*background: #fff;*/
                    /*display: inline-block;*/
                    /*width: 8px;*/
                    /*height: 8px;*/
                    /*border-radius: 50%;*/
                    /*position: relative;*/
                    /*margin-right: 2px;*/
                    /*}*/
                }
            }
        }

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;

                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style lang="less">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                transform-origin: 100% 50%;

                &:before {
                    transform: scale(0.6);
                    display: inline-block;
                    vertical-align: -3px;
                }

                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }

    .iconLeftWrap,
    .iconRightWrap {
        position: absolute;
        top: 0;
        width: 20px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        cursor: pointer;

        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .iconLeftWrap {
        left: 0;
    }

    .iconRightWrap {
        right: 0;
    }
</style>
