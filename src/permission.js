import router from './router'
import {getRouterIns} from './router'
import store from './store'
// import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie
// import { Api_UserDefaultPassword } from '@/api/login'
// import {decode64} from '@/utils/base64'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/404'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (getToken()) { // determine if there has token
        /* has token*/
        if (to.path === '/login') {
            // next({path: '/'});
            next()
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (!store.getters.menusStatus) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetSysMenus', 'super').then(res => {
                    store.dispatch('GenerateRoutes', { menus: res })
                        .then(() => {
                            // const loginForm = {
                            //     username: decode64(localStorage.getItem('u')),
                            //     password: decode64(localStorage.getItem('p'))
                            // }
                            // Api_UserDefaultPassword(loginForm)
                            //     .then(res => {
                            //         if (res) {
                            //             next('/edit-pwd')
                            //         } else {
                            //             router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                            //             if (to.path === '/') { // 如果直接是根路径访问的，跳转到指定路由
                            //                 next('/admin')
                            //             } else {
                            //                 next({ ...to, replace: true })
                            //             }
                            //         }
                            //     })
                            // const router = getRouterIns();
                            // 添加其他项目路由前，重置 matcher
                            router.matcher = getRouterIns().matcher;
                            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                            if (to.path === '/') { // 如果直接是根路径访问的，跳转到指定路由
                                next('/admin')
                            } else {
                                next({ ...to, replace: true })
                            }
                        })
                }).catch(() => {
                    NProgress.done()
                })
            } else {
                next()
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            const toPath = to.path === '/'
                ? '/login'
                : `/login?redirect=${ to.path }`
            next(toPath) // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
