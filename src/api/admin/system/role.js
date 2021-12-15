import request from '@/utils/request'
import { modelBase } from './index'

// 查询角色列表
export function Api_RolesFetchList (params) {
    return request(`${ modelBase }/system/roles/page`, {
        method: 'get',
        params
    })
}

// 新增角色
export function Api_RolesAdd (params) {
    return request(`${ modelBase }/system/roles`, {
        method: 'post',
        params
    })
}

// 修改单个角色信息
export function Api_RolesUpdate (id, params) {
    return request(`${ modelBase }/system/roles/${ id }`, {
        method: 'put',
        params
    })
}

// 查询角色组合框
export function Api_RolesCombobox (params) {
    return request(`${ modelBase }/system/roles/combobox`, {
        method: 'get',
        params
    })
}

// 获取单个角色户信息
export function Api_RolesDetail (id) {
    return request(`${ modelBase }/system/roles/${ id }`, {
        method: 'get'
    })
}

// 删除单个角色信息
export function Api_RolesDel (id) {
    return request(`${ modelBase }/system/roles/${ id }`, {
        method: 'delete'
    })
}

// 查询角色菜单权限树
export function Api_RolesGetPermissions (id) {
    return request(`${ modelBase }/system/roles/${ id }/permissions`, {
        method: 'get'
    })
}

// 更新角色菜单权限树
export function Api_RolesUpdatePermissions (id, permissionIds) {
    return request(`${ modelBase }/system/roles/${ id }/permissions`, {
        method: 'post',
        params: {
            permissionIds: permissionIds
        }
    })
}

// 新增角色数据授权
export function Api_RolesAddDataPerms (id, dataPerms) {
    return request(`${ modelBase }/system/roles/${ id }/data-perms`, {
        method: 'post',
        params: {
            dataPerms
        }
    })
}

// 获取角色数据授权
export function Api_RolesGetDataPerms (id) {
    return request(`${ modelBase }/system/roles/${ id }/data-perms`, {
        method: 'get'
    })
}

// 查询角色列表(有过滤条件)
export function Api_RolesGetForFilter (id) {
    return request(`${ modelBase }/system/roles/${ id }/users`, {
        method: 'get'
    })
}

// 查询角色菜单权限树
export function Api_VipGetPermissions (id) {
    return request(`${ modelBase }/system/member/versions/${ id }/permissions`, {
        method: 'get'
    })
}
// 会员功能授权
export function Api_VipAddDataPerms (id, permissionIds) {
    return request(`${ modelBase }/system/member/versions/${id}/permissions`, {
        method: 'post',
        params: {
            permissionIds
        }
    })
}
