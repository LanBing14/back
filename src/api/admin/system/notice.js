import request from '@/utils/request'
import { modelBase } from './index'

// 查询公告列表
export function Api_NoticeFetchList (params) {
    return request(`${ modelBase }/system/notices/page`, {
        method: 'get',
        params
    })
}

// 查询公告中心分页列表
export function Api_NoticeFetchPersonList (params) {
    return request(`${ modelBase }/system/notices/read/page`, {
        method: 'get',
        params
    })
}

// 新增公告
export function Api_NoticeAdd (params) {
    return request(`${ modelBase }/system/notices`, {
        method: 'post',
        params
    })
}

// 修改公告
export function Api_NoticeUpdate (id, params) {
    return request(`${ modelBase }/system/notices/${ id }`, {
        method: 'put',
        params
    })
}

// 发布公告
export function Api_NoticePublish (id, params) {
    return request(`${ modelBase }/system/notices/publish/${ id }`, {
        method: 'patch',
        params
    })
}

// 撤消公告
export function Api_NoticeUnPublish (id) {
    return request(`${ modelBase }/system/notices/withdraw/${ id }`, {
        method: 'patch'
    })
}

// 删除公告
export function Api_NoticeDel (id) {
    return request(`${ modelBase }/system/notices/${ id }`, {
        method: 'delete'
    })
}

// 获取单个公告
export function Api_NoticeDetail (id) {
    return request(`${ modelBase }/system/notices/${ id }`, {
        method: 'get'
    })
}

// 阅读单个公告
export function Api_NoticeReadDetail (id) {
    return request(`${ modelBase }/system/notices/read/${ id }`, {
        method: 'get'
    })
}

// 未读公告数量
export function Api_NoticeYetReadNums () {
    return request(`${ modelBase }/system/notices/count`, {
        method: 'get'
    })
}
