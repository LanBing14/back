import request from '@/utils/request'
import { modelBase } from './index'

// 查询菜单列表
export function Api_MenuFetchList (params) {
    return request(`${ modelBase }/system/menus/page`, {
        method: 'get',
        params
    })
}

// 查询菜单树
export function Api_MenuFetchTree (ignoreId) {
    return request(`${ modelBase }/system/menus/tree`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 查询菜单树(更新时)
export function Api_MenuTreeForUpdate (ignoreId) {
    return request(`${ modelBase }/system/menus/tree/root`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 新增菜单
export function Api_MenuAdd (params) {
    return request(`${ modelBase }/system/menus`, {
        method: 'post',
        params
    })
}

// 修改菜单
export function Api_MenuUpdate (id, params) {
    return request(`${ modelBase }/system/menus/${ id }`, {
        method: 'put',
        params
    })
}

// 删除菜单
export function Api_MenuDel (id) {
    return request(`${ modelBase }/system/menus/${ id }`, {
        method: 'delete'
    })
}

// 更新授权
export function Api_MenuUpdateAuthority (id, params) {
    return request(`${ modelBase }/system/menus/${ id }/permissions`, {
        method: 'post',
        params
    })
}
