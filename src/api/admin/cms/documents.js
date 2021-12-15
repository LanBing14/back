import request from '@/utils/request'
import { modelBase } from './index'

// 查询文档分页列表
export function Api_DocumentFetchList (params) {
    return request(`${ modelBase }/cms/documents/page`, {
        method: 'get',
        params
    })
}

// 新增文档
export function Api_DocumentAdd (params) {
    return request(`${ modelBase }/cms/documents`, {
        method: 'post',
        params
    })
}

// 修改文档
export function Api_DocumentUpdate (id, params) {
    return request(`${ modelBase }/cms/documents/${ id }`, {
        method: 'put',
        params
    })
}

// 删除文档
export function Api_DocumentDel (id) {
    return request(`${ modelBase }/cms/documents/${ id }`, {
        method: 'delete'
    })
}

// 单个文档查看
export function Api_DocumentDetail (id) {
    return request(`${ modelBase }/cms/documents/${ id }`, {
        method: 'get'
    })
}

// 发布文档
export function Api_DocumentPublish (id) {
    return request(`${ modelBase }/cms/documents/publish/${ id }`, {
        method: 'patch'
    })
}

// 撤销文档
export function Api_DocumentUnPublish (id) {
    return request(`${ modelBase }/cms/documents/withdraw/${ id }`, {
        method: 'patch'
    })
}

// 下载文档次数+1
export function Api_DocumentDownloadCount (id) {
    return request(`${ modelBase }/cms/documents/${ id }`, {
        method: 'patch'
    })
}
