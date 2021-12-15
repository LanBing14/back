import request from '@/utils/request'
import { modelBase } from './index'

// 查询内容分页列表
export function Api_ContentsFetchList (params) {
    return request(`${modelBase}/cms/contents/page`, {
        method: 'get',
        params
    })
}

// 新增内容
export function Api_ContentsAdd (params) {
    return request(`${modelBase}/cms/contents`, {
        method: 'post',
        params
    })
}

// 修改内容
export function Api_ContentsUpdate (id, params) {
    return request(`${modelBase}/cms/contents/${ id }`, {
        method: 'put',
        params
    })
}

// 删除内容
export function Api_ContentsDel (id) {
    return request(`${modelBase}/cms/contents/${ id }`, {
        method: 'delete'
    })
}

// 单个内容查看
export function Api_ContentsDetail (id) {
    return request(`${modelBase}/cms/contents/${ id }`, {
        method: 'get'
    })
}

// 发布内容
export function Api_ContentsPublish (id) {
    return request(`${modelBase}/cms/contents/publish/${ id }`, {
        method: 'patch'
    })
}

// 撤销内容
export function Api_ContentsUnPublis (id) {
    return request(`${modelBase}/cms/contents/withdraw/${ id }`, {
        method: 'patch'
    })
}

// 获取内容模板下拉列表
export function Api_ContentsTemplateCombobox () {
    return request(`${modelBase}/cms/contents/template/combobox`, {
        method: 'get'
    })
}

// 提取关键词
export function Api_ContentsTQKeywords (params) {
    return request(`${modelBase}/cms/lucene/keywords`, {
        method: 'get',
        params
    })
}

