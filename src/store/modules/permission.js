import { merge } from 'lodash'
import { asyncNotfound, constantRouterMap, menuIdComponents } from '@/router'
import LayoutAdmin from '@/views/layouts/admin/Layout'
import LayoutSuper from '@/views/layouts/super/index'
import { Blank } from '@/router/index'

import { isExternal } from '@/utils'

/**
 * 递归过滤异步路由表，返回对应菜单的路由表
 * @param menus
 * @returns {Array}
 */
function filterAsyncRouter (menus) {
    const res = []
    menus.forEach(menu => {
        let route = menuIdComponents[menu.key]
        if (menu.url) {
            if (route) {
                route = route()
                if (menu.url.indexOf('?') !== -1) {
                    const queryIndex = menu.url.indexOf('?')
                    route.query = menu.url.substring(queryIndex + 1)
                    menu.url = menu.url.substring(0, queryIndex)
                }
                route.path = menu.url
                route.window = menu.window
                route.meta && (route.meta.icon = menu.icon)
                route.meta && (route.meta.title = menu.name)
                if (menu.layout && !menu.children.length) {
                    const childComponent = route.component
                    route.children = [
                        {
                            path: isExternal(route.path) ? route.path : '',
                            component: childComponent,
                            meta: {
                                icon: menu.icon,
                                title: menu.name
                            }
                        }]
                    route.component = menu.layout
                }
                if (route.redirect === 'noredirect') {
                    route.children[0].meta &&
                    (route.children[0].meta.icon = menu.icon)
                    route.children[0].meta &&
                    (route.children[0].meta.title = menu.name)
                }
                // route.name = route.name + new Date().getTime() +
                //     parseInt(Math.random() * 1000)
                if (menu.children && menu.children.length) {
                    const childFirstMenu = menu.children[0]
                    route.alwaysShow = true
                    route.redirect = childFirstMenu.url
                    if (!menu.layout) {
                        route.component = Blank
                    }
                    res.push({
                        ...route,
                        children: filterAsyncRouter([...menu.children])
                    })
                } else {
                    res.push({
                        ...route
                    })
                }
            } else {
                res.push({
                    path: '',
                    window: isExternal(menu.url),
                    meta:{
                        icon: menu.icon,
                        title: menu.name
                    },
                    children: [
                        {
                            path: menu.url,
                            meta: {
                                icon: menu.icon,
                                title: menu.name
                            }
                        }]
                })
            }

        }
    })
    return res
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        adminRouters: [],
        superRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            // state.routers = constantRouterMap.concat(routers)
        },
        SET_ADMIN_ROUTERS: (state, routers) => {
            // state.addRouters = routers
            state.adminRouters = [].concat(routers)
        },
        SET_SUPER_ROUTERS: (state, routers) => {
            // state.addRouters = routers
            state.superRouters = [].concat(routers)
        }
    },
    actions: {
        GenerateRoutes ({ commit }, data) {
            return new Promise(resolve => {
                const { menus } = data
                commit('SET_ROUTERS', [])
                if (menus.length) {
                    const accessedRouters = []
                    menus.forEach(i => {
                        const mergeSelf = merge({}, i)
                        mergeSelf.children = []
                        const children = i.children
                        if (i.key === 'admin') {
                            children.forEach(c => {
                                c.layout = LayoutAdmin
                            })
                        } else if (i.key === 'super') {
                            children.forEach(c => {
                                c.layout = LayoutSuper
                            })
                        }

                        const rootMenus = filterAsyncRouter([mergeSelf])
                        const childMenus = filterAsyncRouter(children)
                        const resultMenus = [...rootMenus, ...childMenus]
                        if (i.key === 'admin') {
                            commit('SET_ADMIN_ROUTERS', resultMenus)
                        } else if (i.key === 'super') {
                            commit('SET_SUPER_ROUTERS', resultMenus)
                        }
                        accessedRouters.push(...resultMenus)
                    })
                    accessedRouters.push(asyncNotfound)
                    commit('SET_ROUTERS', accessedRouters)
                }
                commit('SET_MENUSSTATUS', true)
                resolve()
            })
        }
    }
}

export default permission
