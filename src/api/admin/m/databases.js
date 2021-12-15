import request from '@/utils/request'
import { modelBase } from './index'

// 获取数据库列表数据
export function Api_DatabasesGetTreeList () {
    return request(`${ modelBase }/db/databases/page`, {
        method: 'get'
    })
}

// 获取单个数据库详情
export function Api_DatabasesGetInfo (id) {
    return request(`${ modelBase }/db/databases/${ id }`, {
        method: 'get'
    })
}

// 新增数据库
export function Api_DatabasesAdd (params) {
    return request(`${ modelBase }/db/databases`, {
        method: 'post',
        params
    })
}

// 修改数据库
export function Api_DatabasesUpdate (id, params) {
    return request(`${ modelBase }/db/databases/${ id }`, {
        method: 'put',
        params
    })
}

//  删除数据库
export function Api_DatabasesDelete (id) {
    return request(`${ modelBase }/db/databases/${ id }`, {
        method: 'delete'
    })
}

// 测试数据库连接
export function Api_DatabasesConnection (params) {
    return request(`${ modelBase }/db/databases/connection`, {
        method: 'post',
        params
    })
}

// 查询分页表
export function Api_DatabasesTables (params) {
    return request(`${ modelBase }/db/tables/page`, {
        method: 'get',
        params
    })
}

// 新增表
export function Api_DatabasesTablesAdd (params) {
    return request(`${ modelBase }/db/tables`, {
        method: 'post',
        params
    })
}

// 修改表
export function Api_DatabasesTablesUpdate (id, params) {
    return request(`${ modelBase }/db/tables/${ id }`, {
        method: 'put',
        params
    })
}

// 删除表
export function Api_DatabasesTablesDelete (id) {
    return request(`${ modelBase }/db/tables/${ id }`, {
        method: 'delete'
    })
}

// 把表标记为已创建
export function Api_DatabasesTablesSign (id) {
    return request(`${ modelBase }/db/tables/mark/${ id }`, {
        method: 'patch'
    })
}

// 创建表
export function Api_DatabasesTablesCreation (id) {
    return request(`${ modelBase }/db/tables/creation/${ id }`, {
        method: 'patch'
    })
}

// 查询表字段
export function Api_DatabasesTablesColumnsGet (params) {
    return request(`${ modelBase }/db/columns/list`, {
        method: 'get',
        params
    })
}

// 维护表字段
export function Api_DatabasesTablesaColumnsUpdate (params) {
    return request(`${ modelBase }/db/columns`, {
        method: 'post',
        params
    })
}

// 维护表字段
export function Api_DatabasesTablesaDictionaryColumns () {
    return request(`${ modelBase }/db/columns/dictionary/combobox`, {
        method: 'get'
    })
}

// 查询数据库下拉框列表
export function Api_DatabasesCombobox (params) {
    return request(`${ modelBase }/db/databases/combobox`, {
        method: 'get',
        params
    })
}

// 查询数据库表下拉框列表
export function Api_DatabasesTablesCombobox (params) {
    return request(`${ modelBase }/db/tables/combobox`, {
        method: 'get',
        params
    })
}

// 获取单个表字段信息
export function Api_DatabasesTablesColumns (name) {
    return request(`${ modelBase }/db/columns`, {
        method: 'get',
        params: {
            name
        }
    })
}
