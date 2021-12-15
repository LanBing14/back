import request from '@/utils/request'
import { modelBase } from './index'

// 查询部门列表
export function Api_DepartmentsFetchList (params) {
    return request(`${ modelBase }/system/departments/page`, {
        method: 'get',
        params
    })
}

// 查询部门树
export function Api_DepartmentsFetchTree (ignoreId, code) {
    return request(`${ modelBase }/system/departments/tree`, {
        method: 'get',
        params: {
            ignoreId,
            saasCode: code
        }
    })
}

// 查询部门树(更新时)
export function Api_DepartmentsFetchTreeForUpdate (ignoreId, code) {
    return request(`${ modelBase }/system/departments/tree/root`, {
        method: 'get',
        params: {
            ignoreId,
            saasCode: code
        }
    })
}

// 新增部门
export function Api_DepartmentsAdd (params) {
    return request(`${ modelBase }/system/departments`, {
        method: 'post',
        params
    })
}

// 修改部门
export function Api_DepartmentsUpdate (id, params) {
    return request(`${ modelBase }/system/departments/${ id }`, {
        method: 'put',
        params
    })
}

// 删除部门
export function Api_DepartmentsDel (id) {
    return request(`${ modelBase }/system/departments/${ id }`, {
        method: 'delete'
    })
}

// 根据部门查询用户
export function Api_DepartmentsGetForFilter (ids) {
    return request(`${ modelBase }/system/departments/users?ids=${ ids }`, {
        method: 'get'
    })
}
