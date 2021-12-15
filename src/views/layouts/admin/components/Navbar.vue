<template>
    <a-layout-header class="navbar">
        <span class="logoText">CITGCPLATFORM</span>
        <Hamburger
            :toggle-click="toggleSideBar"
            :is-active="sidebar.opened"
            class="hamburger-container"
        />
        <!--<breadcrumb class="breadcrumb-container"/>-->

        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <a-select
                    :allowClear="true"
                    showSearch
                    :value="value"
                    placeholder="请输入站点"
                    style="width: 350px"
                    :defaultActiveFirstOption="false"
                    :showArrow="false"
                    :filterOption="false"
                    @search="getMenuOptions"
                    @change="handleChange"
                    :notFoundContent="null"
                    ref="option"
                >
                    <a-select-option v-for="items in menuOptions" :key="items.id" :code="items.code">{{items.name}}
                    </a-select-option>
                </a-select>
                <!--                <ErrorLog class="errLog-container right-menu-item"/>-->
                <div class="international right-menu-item" @click="handleOpenNotice()">
                    <a-tooltip
                        popper-class="mm-tooltip"
                        title="通知公告"
                        effect="dark"
                        placement="bottom"
                    >
                        <a-badge
                            :class="{ 'no-show': !noticeMessageNums }"
                            :value="noticeMessageNums"
                        >
                            <i class="iconfont icon-notification"></i>
                        </a-badge>
                    </a-tooltip>
                </div>
                <div class="international right-menu-item" @click="handleOpenMail()">
                    <a-tooltip
                        popper-class="mm-tooltip"
                        title="系统消息"
                        effect="dark"
                        placement="bottom"
                    >
                        <a-badge
                            :class="{ 'no-show': !mailMessageNums }"
                            :value="mailMessageNums"
                        >
                            <i class="iconfont icon-mail"></i>
                        </a-badge>
                    </a-tooltip>
                </div>
                <!--<a-tooltip-->
                <!--title="全屏"-->
                <!--effect="dark"-->
                <!--placement="bottom">-->
                <!--<screenfull class="screenfull right-menu-item"/>-->
                <!--</a-tooltip>-->

                <!--<a-tooltip-->
                <!--title="布局大小"-->
                <!--effect="dark"-->
                <!--placement="bottom">-->
                <!--<size-select class="international right-menu-item"/>-->
                <!--</a-tooltip>-->

                <!--<lang-select class="international right-menu-item"/>-->
                <div v-if="isSuperAdmin" class="international right-menu-item">
                    <a-tooltip title="图标" effect="dark" placement="bottom">
                        <i class="iconfont icon-image" @click="selectIcon"></i>
                    </a-tooltip>
                </div>
                <!--                <div v-if="isSuperAdmin" class="international right-menu-item">-->
                <!--                    <a-tooltip title="换肤" effect="dark" placement="bottom">-->
                <!--                        <ThemePicker class="theme-switch"/>-->
                <!--                    </a-tooltip>-->
                <!--                </div>-->
            </template>

            <a-dropdown :trigger="['click']" class="avatar-container right-menu-item" placement="bottomCenter">
                <div class="avatar-wrapper">
                    <img src="@/assets/images/admin-headpic.png" class="user-avatar"/>
                    <a-tooltip
                        :title="personInfo.name + '(' + personInfo.username + ')'"
                        effect="dark"
                        placement="bottom"
                    >
                        <span class="name-info"> {{ personInfo.name + '(' + personInfo.username + ')'}}</span>
                    </a-tooltip>
                    <i class="el-icon-caret-bottom"/>
                </div>
                <a-menu slot="overlay" style="max-width: 100px;margin: auto;">
                    <a-menu-item>
                        <router-link to="/admin">首页</router-link>
                    </a-menu-item>
                    <a-menu-divider/>
                    <a-menu-item>
                        <router-link to="/edit-pwd?a">修改密码</router-link>
                    </a-menu-item>
                    <a-menu-divider/>
                    <a-menu-item @click="logout">
                        退出登录
                    </a-menu-item>
                </a-menu>
                <!--                <a-dropdown-menu slot="overlay">-->
                <!--                    <router-link to="/admin">-->
                <!--                        <a-dropdown-item>-->
                <!--                            首页-->
                <!--                        </a-dropdown-item>-->
                <!--                    </router-link>-->
                <!--                    <router-link to="/edit-pwd?a">-->
                <!--                        <a-dropdown-item divided>-->
                <!--                            <span style="display:block;">修改密码</span>-->
                <!--                        </a-dropdown-item>-->
                <!--                    </router-link>-->
                <!--                    <a-dropdown-item divided>-->
                <!--                        <span style="display:block;" @click="logout">退出登录</span>-->
                <!--                    </a-dropdown-item>-->
                <!--                </a-dropdown-menu>-->
            </a-dropdown>
        </div>
        <NoticeViewList ref="noticeViewList"/>
        <MailViewList ref="mailViewList"/>
        <NoticeDetail/>
        <MailDetail/>
        <IconSelect ref="refIconSelect"/>

        <!--        <PasswordEdit ref="passwordEdit" isAutoPwd></PasswordEdit>-->
    </a-layout-header>
</template>

<script>
    import {mapGetters} from 'vuex';
    // import Breadcrumb from '@/components/Breadcrumb'
    // import PasswordEdit from '@/views/login/PasswordEditBody'
    import Hamburger from '@/components/Hamburger';
    // import ErrorLog from '@/components/ErrorLog'
    // import Screenfull from '@/components/Screenfull'
    // import SizeSelect from '@/components/SizeSelect'
    // import LangSelect from '@/components/LangSelect'
    import ThemePicker from '@/components/ThemePicker'
    import NoticeViewList from '@/views/admin/system/notice/ViewList';
    import NoticeDetail from '@/views/admin/system/notice/Detail';
    import MailViewList from '@/views/admin/system/mail/ViewList';
    import MailDetail from '@/views/admin/system/mail/Detail';
    import IconSelect from '@/components/IconSelect';
    import {websocketNoticeUrl} from '@/utils/variables';
    import {
        Api_SaasDetail,
        Api_SaasFetchList,
        Api_getMenus
    } from '@/api/admin/system/index';

    export default {
        components: {
            // Breadcrumb,
            Hamburger,
            // PasswordEdit,
            // ErrorLog,
            // Screenfull,
            // SizeSelect,
            // LangSelect,
            ThemePicker,
            NoticeViewList,
            NoticeDetail,
            MailViewList,
            MailDetail,
            IconSelect
        },
        data() {
            return {
                noticeTimer: null,
                noticeWs: null,
                menuOptions: [],
                value: undefined
            };
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'name',
                'avatar',
                'device',
                'noticeMessageNums',
                'mailMessageNums',
                'personInfo'
            ]),
            // // 是否是‘weizhiadmin’这个超级管理员
            isSuperAdmin() {
                return this.$store.getters.personInfo.username === 'weizhiadmin';
            }
        },
        watch: {
            'personInfo.id'(val) {
                this.mockWebsocket(val);
            }
        },
        beforeDestroy() {
            clearInterval(this.noticeTimer);
            this.noticeWs && this.noticeWs.close(); // 关闭websocket
        },
        created() {
            Api_SaasDetail(1).then(res => {
                this.value = res.name;
                // this.$store.commit('SAVE_SELECTSASSCODE', '')
            })
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('toggleSideBar');
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    this.$message.success('退出成功！');
                    this.$router.replace({path: '/login'});
                    // location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                });
            },
            // 打开通知公告列表
            handleOpenNotice() {
                this.$refs.noticeViewList.show();
            },
            // 打开商站内信列表
            handleOpenMail() {
                this.$refs.mailViewList.show();
            },
            mockWebsocket(userId) {
                this.$store.dispatch('getNoticeNums');
                this.$store.dispatch('getMailNums');

                if (this.noticeWs) {
                    return;
                }
                if ('WebSocket' in window) {
                    // 打开一个 web socket
                    this.noticeWs = new WebSocket(websocketNoticeUrl + userId);
                    const noticeWs = this.noticeWs;
                    noticeWs.onopen = () => {
                        // Web Socket 已连接上，使用 send() 方法发送数据
                        this.noticeTimer = setInterval(() => {
                            noticeWs.send(userId);
                        }, 1000 * 2);
                    };
                    noticeWs.onmessage = evt => {
                        // 接收的数据
                        const received_msg = JSON.parse(evt.data);
                        this.$store.commit('SAVE_NOTICE_READNUMS', received_msg.noticeSize);
                        this.$store.commit('SAVE_MAIL_READNUMS', received_msg.inboxSize);
                    };
                    noticeWs.onclose = function () {
                        // 关闭 websocket
                    };
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '当前浏览器不支持webscoket，无法接收邮箱和公告消息'
                    });
                }
            },
            // 打开选择图标窗口
            selectIcon() {
                this.$refs.refIconSelect.openModel();
            },
            // 获取下拉站点
            getMenuOptions(value) {
                Api_SaasFetchList({name: value,saas:true, currentPage: 1, pageSize: 5}).then(res => {
                    this.menuOptions = res.data
                }).catch(() => {
                    console.log(111111)
                });
            },
            filterRouters(routers, display) {
                routers.forEach(route => {
                    if (!display) {
                        if (route.otherRole) {
                            route.hidden = false
                        } else {
                            route.hidden = true
                        }
                    } else {
                        if (route.path === "/admin") {
                            route.hidden = true
                        } else {
                            route.hidden = false
                        }
                    }
                    if (route.children) {
                        this.filterRouters(route.children, display)
                    }
                })
                return routers
            },
            // 根据站点获取菜单
            handleChange(value, option) {
                const admin_routers = this.$store.getters.admin_routers
                if (value && value !== "1") {
                    this.$store.commit('SAVE_SELECTSASSCODE', option.data.attrs.code)
                    this.value = value;
                    const filters = this.filterRouters(admin_routers, false)
                    this.$store.commit('SET_ADMIN_ROUTERS', filters)
                } else {
                    this.value = undefined;
                    this.$store.commit('SAVE_SELECTSASSCODE', 'super')
                    const filters = this.filterRouters(admin_routers, true)
                    this.$store.commit('SET_ADMIN_ROUTERS', filters)
                    Api_SaasDetail(1).then(res => {
                        this.value = res.name;
                    })
                }
            }
        }
    };
</script>

<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/styles/variables.less";

    /deep/ .no-show {
        sup {
            display: none;
        }

        showMenus {
            display: none;
        }
    }

    .navbar {
        padding: 0;
        height: @navHeight;
        line-height: @navHeight;
        border-radius: 0 !important;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 102;
        background-color: #fff;

        .ant-badge {
            vertical-align: middle;
        }

        .logoText {
            color: #2c75d4;
            float: left;
            padding: 0 20px 0 44px;
            font-size: 22px;
        }

        .hamburger-container {
            float: left;

            /deep/ .hamburger {
                position: absolute;
                top: 50%;
                margin-top: -10px;
            }
        }

        .breadcrumb-container {
            float: left;
        }

        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }

        .right-menu {
            float: right;
            height: 100%;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                margin: 0 8px;
                cursor: pointer;
            }

            .screenfull {
                height: 20px;
            }

            .international {
                vertical-align: top;
            }

            .avatar-container {
                height: 50px;
                margin-right: 30px;

                &.avatar-wrapper {
                    position: relative;

                    .user-avatar {
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        position: relative;
                        vertical-align: middle;
                    }

                    .name-info {
                        vertical-align: middle;
                        max-width: 120px;
                        display: inline-block;
                        line-height: normal;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding-left: 5px;
                    }

                    .el-icon-caret-bottom {
                        cursor: pointer;
                        position: absolute;
                        right: -20px;
                        top: 50%;
                        margin-top: -6px;
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .right-menu {
        .iconfont {
            font-size: 22px;
            vertical-align: middle;
        }
    }

    .el-badge {
        line-height: normal;
    }
</style>
<style></style>
