import request from '@/utils/request'
import { modelBase, fxb } from './index'

// 分页列表
export function Api_VersionFetchList(params) {
    return request(`${modelBase}/system/member/versions/page`, {
        method: 'get',
        params
    })
}
// 处理
export function Api_VersionTodo(params) {
    return request(`${modelBase}/system/member/versions/edit`, {
        method: 'put',
        params
    })
}
