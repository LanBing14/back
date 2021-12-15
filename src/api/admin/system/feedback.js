import request from '@/utils/request'
import { modelBase } from './index'

// 分页查询客户反馈
export function Api_FeedbacksFetchList(params) {
    return request(`${modelBase}/system/feedbacks/page`, {
        method: 'get',
        params
    })
}

// 新增客户反馈
export function Api_FeedbacksAdd(params) {
    return request(`${modelBase}/system/feedbacks`, {
        method: 'post',
        params
    })
}
// 处理客户反馈
export function Api_FeedbacksDealWith(id, params) {
    return request(`${modelBase}/system/feedbacks/${id}`, {
        method: 'patch',
        params
    })
}

