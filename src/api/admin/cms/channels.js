import request from '@/utils/request'
import { modelBase } from './index'

// 获取栏目列表
export function Api_ChannelsFetchList (params) {
    return request(`${ modelBase }/cms/channels/page`, {
        method: 'get',
        params
    })
}

// 获取栏目树
export function Api_ChannelsFetchTree (ignoreId) {
    return request(`${ modelBase }/cms/channels/tree`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 获取栏目树(有根节点)
export function Api_ChannelsFetchTreeRoot (ignoreId) {
    return request(`${ modelBase }/cms/channels/tree/root`, {
        method: 'get',
        params: {
            ignoreId
        }
    })
}

// 新增栏目
export function Api_ChannelsAdd (params) {
    return request(`${ modelBase }/cms/channels`, {
        method: 'post',
        params
    })
}

// 修改栏目
export function Api_ChannelsUpdate (id, params) {
    return request(`${ modelBase }/cms/channels/${ id }`, {
        method: 'put',
        params
    })
}

// 获取单个栏目
export function Api_ChannelsFetchDetail (id) {
    return request(`${ modelBase }/cms/channels/${ id }`, {
        method: 'get'
    })
}

// 删除栏目
export function Api_ChannelsDel (id) {
    return request(`${ modelBase }/cms/channels/${ id }`, {
        method: 'delete'
    })
}

// 发布栏目
export function Api_ChannelsPublish (id) {
    return request(`${ modelBase }/cms/channels/publish/${ id }`, {
        method: 'patch'
    })
}

// 撤消发布
export function Api_ChannelsUnPublish (id) {
    return request(`${ modelBase }/cms/channels/withdraw/${ id }`, {
        method: 'patch'
    })
}

// 获取关键词
export function Api_ChannelsGetKeyWords(id) {
    return request(`${ modelBase }/cms/lucene/${ id }`, {
        method: 'get'
    })
}

