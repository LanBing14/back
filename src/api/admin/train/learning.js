import request from '@/utils/request'
import {modelBase} from './index'

// 分页查询学习记录
export function Api_LearningFetchList(params) {
    return request(`${modelBase}/training/learning/page`, {
        method: 'get',
        params
    })
}

// 分页查询个人学习记录
export function Api_LearningFetchListSelf(params) {
    return request(`${modelBase}/training/learning/self-page`, {
        method: 'get',
        params
    })
}
