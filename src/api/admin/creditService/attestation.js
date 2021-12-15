import request from '@/utils/request'
import {modelBase} from './index'

// 分页列表
export function Api_AttestationList(params) {
    return request(`${modelBase}/quartz/crontabs/page`, {
        method: 'get',
        params
    })
}

// 详情
export function Api_AttestationDetail(params) {
    return request(`${modelBase}/quartz/crontabs/page`, {
        method: 'get',
        params
    })
}
