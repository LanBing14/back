import request from '@/utils/request'
import { stringify } from 'qs'
import { modelBase } from './index'

// 接口分类：动态表单管理

// 分页列表
export function Api_DynamicsFormGetPage (params) {
    const paramsBak = { ...params }
    const { id } = paramsBak
    delete paramsBak.id
    delete paramsBak.tagGroups
    return request(
        `${ modelBase }/form/models/${ id }/page?${ stringify(paramsBak) }`, {
            method: 'post',
            data: {
                tagGroups: params.tagGroups
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
}

// 普通列表，无分页
export function Api_DynamicsFormGetList (params) {
    const paramsBak = { ...params }
    const { id } = paramsBak
    delete paramsBak.id
    delete paramsBak.tagGroups
    return request(
        `${ modelBase }/form/models/${ id }/list?${ stringify(paramsBak) }`, {
            method: 'post',
            data: {
                tagGroups: params.tagGroups
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
}

// 根据前端请求的sql返回结果
export function Api_DynamicsFormSqlSelect (id, params, otherUrlParams) {
    // return request('${modelBase}/form/models/select?tableId=' + id + (otherUrlParams ? '&' + otherUrlParams : ''), {
    return request(
        `${ modelBase }/form/models/select?tableId=${ id }${ otherUrlParams
            ? '&' +
            otherUrlParams
            : '' }`, {
            method: 'post',
            data: params,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        })
}

// 获取表单模型view的记录结果
export function Api_DynamicsFormDetail (id, formId) {
    return request(`${ modelBase }/form/models/view/${ id }`, {
        method: 'get',
        params: {
            formId
        }
    })
}

// 通用表单新增或修改内容
export function Api_DynamicsFormAddUpdate (url, id, params) {
    let postUrl = `${ modelBase }/form/models/${ id }`
    if (url) {
        postUrl = url
    }
    return request(postUrl, {
        method: 'post',
        params
    })
}

// 通用表单删除
export function Api_DynamicsFormDelete (table, id, params) {
    return request(`${ modelBase }/form/models/${ table }/${ id }`, {
        method: 'delete',
        params
    })
}

// 获取列表编辑表单模型记录结果
export function Api_DynamicsFormListEdit (id, params) {
    return request(`${ modelBase }/form/models/list-edit/${ id }`, {
        method: 'get',
        params
    })
}

// 获取列表编辑表单模型记录结果
export function Api_DynamicsFormExport (formId, params, urlParams) {
    const urlParamsBak = { ...urlParams }
    const { id } = urlParamsBak
    delete urlParamsBak.id
    delete urlParamsBak.tagGroups
    return request(`${ modelBase }/form/models/${formId}/export-query-data?${ stringify(urlParamsBak) }`, {
        method: 'post',
        data: {
            ...params,
            tagGroups: urlParams.tagGroups
        },
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}
