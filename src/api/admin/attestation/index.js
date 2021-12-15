import request from '@/utils/request'
import {upms, fxb} from '@/api/index';


// cp获取企业认证历史
export function Api_EnterpriseCerthistory(id) {
    return request(`${fxb}/enterprise-cert/history/${id}`, {
        method: 'get'
    })
}

// 通用处理任务
export function Api_ProcessesComplete(taskId, params) {
    return request(`${upms}/processes/task-complete/${taskId}`, {
        method: 'post',
        params
    })
}

// 通用退回任务
export function Api_ProcessesReturn(taskId, params) {
    return request(`${upms}/processes/task-return/${taskId}`, {
        method: 'post',
        params
    })
}


// 用户信息
export function Api_ProcessesPerson(id) {
    return request(`${upms}/system/users/user-info/${id}`, {
        method: 'get'
    })
}

