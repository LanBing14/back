import request from '@/utils/request'
import { modelBase } from './index'

// 查询站内信列表
export function Api_MailFetchList (params) {
    return request(`${ modelBase }/system/mail/outbox/page`, {
        method: 'get',
        params
    })
}

// 查询站内信中心分页列表
export function Api_MailFetchPersonList (params) {
    return request(`${ modelBase }/system/mail/inbox/page`, {
        method: 'get',
        params
    })
}

// 新增站内信
export function Api_MailAdd (params) {
    return request(`${ modelBase }/system/mail`, {
        method: 'post',
        params
    })
}

// 新增并发布站内信
export function Api_MailAddDispatch (params) {
    return request(`${ modelBase }/system/mail/dispatch`, {
        method: 'post',
        params
    })
}

// 修改站内信
export function Api_MailUpdate (id, params) {
    return request(`${ modelBase }/system/mail/${ id }`, {
        method: 'put',
        params
    })
}

// 修改并发送站内信
export function Api_MailUpdateDispatch (id, params) {
    return request(`${ modelBase }/system/mail/dispatch/${ id }`, {
        method: 'put',
        params
    })
}

// 删除站内信
export function Api_MailDel (id) {
    return request(`${ modelBase }/system/mail/${ id }`, {
        method: 'delete',
        params: {
            id
        }
    })
}

// 撤消站内信
export function Api_MailUnPublish (id) {
    return request(`${ modelBase }/system/mail/withdraw/${ id }`, {
        method: 'patch',
        params: {
            id
        }
    })
}

// 获取单个站内信详情
export function Api_MailDetail (id) {
    return request(`${ modelBase }/system/mail/outbox/${ id }`, {
        method: 'get'
    })
}

// 获取单个信息中心消息
export function Api_MailDetailCenter (id) {
    return request(`${ modelBase }/system/mail/inbox/${ id }`, {
        method: 'get'
    })
}

// 查询系统信息分页列表
export function Api_MailFetchListCenter (params) {
    return request(`${ modelBase }/system/mail/inbox/page`, {
        method: 'get',
        params
    })
}

// 站内信数量
export function Api_MailYetReadNums () {
    return request(`${ modelBase }/system/mail/inbox/count`, {
        method: 'get'
    })
}
