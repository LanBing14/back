import request from '@/utils/request'
import { modelBase } from './index'

// 查询分页监管模型
export function Api_SupervisionGetList (params) {
    return request(`${ modelBase }/supervision/supervisions/page`, {
        method: 'get',
        params
    })
}

// 获取监管模型信息
export function Api_SupervisionGetDetail (id) {
    return request(`${ modelBase }/supervision/supervisions/${ id }`, {
        method: 'get'
    })
}

// 新增监管模型
export function Api_SupervisionAdd (params) {
    return request(`${ modelBase }/supervision/supervisions`, {
        method: 'post',
        params
    })
}

// 修改监管模型
export function Api_SupervisionUpdate (id, params) {
    return request(`${ modelBase }/supervision/supervisions/${ id }`, {
        method: 'put',
        params
    })
}

// 删除监管模型
export function Api_SupervisionDelete (id) {
    return request(`${ modelBase }/supervision/supervisions/${ id }`, {
        method: 'delete'
    })
}

// 获取监管建模信息
export function Api_SupervisionGetModel (id) {
    return request(`${ modelBase }/supervision/supervisions/model/${ id }`, {
        method: 'get'
    })
}

// 保存监管建模
export function Api_SupervisionGetModelUpdate (id, params) {
    return request(`${ modelBase }/supervision/supervisions/modeling/${ id }`, {
        method: 'post',
        params
    })
}

// 复制监管模型
export function Api_SupervisionGetModelCopy (id) {
    return request(`${ modelBase }/supervision/supervisions/copy/${ id }`, {
        method: 'post'
    })
}
