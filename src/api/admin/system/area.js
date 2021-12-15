import request from '@/utils/request'
import { modelBase } from './index'

// 查询区域列表
export function Api_AreaFetchList (params) {
    return request(`${ modelBase }/system/areas/page`, {
        method: 'get',
        params
    })
}

// 查询区域树
export function Api_AreaFetchTree (ignoreId) {
    return request(`${ modelBase }/system/areas/tree`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 查询区域树(更新时)
export function Api_AreaFetchTreeForUpdate (ignoreId) {
    return request(`${ modelBase }/system/areas/tree/root`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 新增区域
export function Api_AreaAdd (params) {
    return request(`${ modelBase }/system/areas`, {
        method: 'post',
        params
    })
}

// 修改区域
export function Api_AreaUpdate (id, params) {
    return request(`${ modelBase }/system/areas/${ id }`, {
        method: 'put',
        params
    })
}

// 删除区域
export function Api_AreaDel (id) {
    return request(`${ modelBase }/system/areas/${ id }`, {
        method: 'delete'
    })
}
