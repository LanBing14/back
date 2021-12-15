import { getToken, setToken, removeToken } from '@/utils/auth'
import { getRandomStr } from '@/utils/index'
import {
    Api_loginByUsername,
    logout,
    Api_UserDetail
} from '@/api/login'
import { Api_getKaptcha } from '@/api/admin/index'
import { Api_getMenus } from '@/api/admin/system/index'

// 获取randomStr
const randomStr = getRandomStr()

const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: ['admin'],
        setting: {
            articlePlatform: []
        },
        loginInfo: {
            randomStr: randomStr,
            grant_type: 'password'
        },
        codeUrl: Api_getKaptcha(),
        menusStatus: false,
        menus: []
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },

        SET_MENUS: (state, menus) => {
            state.menus = menus
        },
        SET_RANDOMSTR: (state) => {
            state.loginInfo.randomStr = getRandomStr()
        },
        SET_MENUSSTATUS: (state, status) => {
            state.menusStatus = status
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername ({ commit, state }, userInfo) {
            const { loginInfo } = state
            return new Promise((resolve, reject) => {
                Api_loginByUsername({ ...loginInfo, ...userInfo, roleType:'0'})
                    .then(response => {
                            commit('SET_TOKEN', response.access_token)
                            setToken(response.access_token)
                            resolve(response)
                    })
                    .catch(error => {
                        commit('SET_RANDOMSTR')
                        reject(error)
                    })
            })
        },

        // 获取菜单
        GetSysMenus ({ commit }, saasCode) {
            return new Promise((resolve, reject) => {
                Api_getMenus(saasCode).then(response => {
                    commit('SET_MENUS', response)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo ({ commit, state }) {
            return new Promise((resolve, reject) => {
                Api_UserDetail(state.token).then(response => {
                    if (!response) { // 由于mockjs 不支持自定义状态码只能这样hack
                        reject('error')
                    }
                    const data = response

                    if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('getInfo: roles must be a non-null array !')
                    }

                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    resolve(response)
                }).catch(error => {
                    commit('SET_RANDOMSTR')
                    reject(error)
                })
            })
        },

        // 第三方验证登录
        // LoginByThirdparty({ commit, state }, code) {
        //   return new Promise((resolve, reject) => {
        //     commit('SET_CODE', code)
        //     loginByThirdparty(state.status, state.email, state.code).then(response => {
        //       commit('SET_TOKEN', response.data.token)
        //       setToken(response.data.token)
        //       resolve()
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        // 登出
        LogOut ({ commit, dispatch, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_MENUSSTATUS', false)
                    dispatch('tagsView/delAllViews')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut ({ commit, dispatch }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                commit('SET_MENUSSTATUS', false)
                dispatch('tagsView/delAllViews')
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles ({ commit, dispatch }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                Api_UserDetail(role).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.roles)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
                    resolve()
                })
            })
        }
    }
}

export default user
