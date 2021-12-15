import request from '@/utils/request'
import { upms as modelBase } from '@/api/index'

// 图表分页列表
export function Api_EchartsGetList (params) {
    return request(`${ modelBase }/chart/charts/page`, {
        method: 'get',
        params
    })
}

// 新增图表基础数据
export function Api_EchartsAdd (params) {
    return request(`${ modelBase }/chart/charts`, {
        method: 'post',
        params
    })
}
// 修改图表基础数据
export function Api_EchartsUpdate (id, params) {
    return request(`${ modelBase }/chart/charts/${id}`, {
        method: 'put',
        params
    })
}

// 删除图表
export function Api_EchartsDelete (id) {
    return request(`${ modelBase }/chart/charts/${id}`, {
        method: 'delete'
    })
}

// 新增、修改图表模型
export function Api_EchartsModel (id, params) {
    return request(`${ modelBase }/chart/charts/model/${id}`, {
        method: 'post',
        params
    })
}

// 获取图表模型
export function Api_EchartsModelDetail (id) {
    return request(`${ modelBase }/chart/charts/model/${id}`, {
        method: 'get'
    })
}

// 复制图表
export function Api_EchartsModelCopy (id) {
    return request(`${ modelBase }/chart/charts/copy/${id}`, {
        method: 'post'
    })
}
