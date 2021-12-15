import request from '@/utils/request'
import { modelBase, fxb } from './index'

// 分页列表
export function Api_ProductsFetchList(params) {
    return request(`${fxb}/report/products/page`, {
        method: 'get',
        params
    })
}
// 处理
export function Api_ProductsTodo(params) {
    return request(`${fxb}/report/products/edit`, {
        method: 'patch',
        params
    })
}
