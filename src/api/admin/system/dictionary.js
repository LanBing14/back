import request from '@/utils/request'
import { modelBase } from './index'

// 查询字典列表
export function Api_DictionaryFetchList (params) {
    return request(`${ modelBase }/system/dictionaries/page`, {
        method: 'get',
        params
    })
}

// 新增字典
export function Api_DictionariesAdd (params) {
    return request(`${ modelBase }/system/dictionaries`, {
        method: 'post',
        params
    })
}

// 修改字典
export function Api_DictionariesUpdate (id, params) {
    return request(`${ modelBase }/system/dictionaries/${ id }`, {
        method: 'put',
        params
    })
}

// 删除字典
export function Api_DictionaryDel (id) {
    return request(`${ modelBase }/system/dictionaries/${ id }`, {
        method: 'delete',
        params: {
            id
        }
    })
}

// 刷新字典
export function Api_DictionaryFreshen () {
    return request(`${ modelBase }/system/dictionaries/cache`, {
        method: 'post'
    })
}

