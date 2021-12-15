import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { upms, cauth } from '@/api/index'

// 登录
export function Api_loginByUsername (params) {
    return request(`${ cauth }/oauth/token`, {
        method: 'get',
        params,
        headers: {
            'Authorization': 'Basic YXBwOmFwcA=='
        }
    })
}

// 退出登录
export function logout () {
    return request(`${ cauth }/token`, {
        method: 'delete',
        params: {
            accessToken: getToken()
        }
    })
}

// 用户信息
export function Api_UserDetail (token) {
    return request('/user/info', {
        method: 'get',
        params: { token }
    })
}

// 修改密码
export function Api_UserEditPassword (params) {
    return request(upms + '/system/users/password', {
        method: 'patch',
        params
    })
}

// 检查密码是否为默认密码
export function Api_UserDefaultPassword (params) {
    return request(upms + '/system/users/default-password-check', {
        method: 'post',
        params
    })
}

