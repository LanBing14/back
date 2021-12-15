import request from '@/utils/request'
import { modelBase } from './index'

// 查询敏感词分页列表
export function Api_SensitivewordsFetchList (params) {
    return request(`${ modelBase }/cms/sensitivewords/page`, {
        method: 'get',
        params
    })
}

// 新增敏感词
export function Api_SensitivewordsAdd (params) {
    return request(`${ modelBase }/cms/sensitivewords`, {
        method: 'post',
        params
    })
}

// 修改敏感词
export function Api_SensitivewordsUpdate (id, params) {
    return request(`${ modelBase }/cms/sensitivewords/${ id }`, {
        method: 'put',
        params
    })
}

// 删除敏感词
export function Api_SensitivewordsDel (id) {
    return request(`${ modelBase }/cms/sensitivewords/${ id }`, {
        method: 'delete'
    })
}

// 启用、禁用敏感词
export function Api_SensitivewordsChangeStatus (id, status) {
    const urlKind = status ? 'enable' : 'disable'
    return request(`${ modelBase }/cms/sensitivewords/${ urlKind }/${ id }`, {
        method: 'patch'
    })
}

// 刷新敏感词缓存
export function Api_SensitivewordsFreshenCache () {
    return request(`${ modelBase }/cms/sensitivewords/cache`, {
        method: 'put'
    })
}
