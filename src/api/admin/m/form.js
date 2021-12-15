import request from '@/utils/request'
import { modelBase } from './index'

// 接口分类：表单管理

// 分页列表
export function Api_FormGetList (params) {
    return request(`${ modelBase }/form/forms/page`, {
        method: 'get',
        params
    })
}

// 新增
export function Api_FormAdd (params) {
    return request(`${ modelBase }/form/forms`, {
        method: 'post',
        params
    })
}

// 修改
export function Api_FormUpdate (id, params) {
    return request(`${ modelBase }/form/forms/${ id }`, {
        method: 'put',
        params
    })
}

// 删除
export function Api_FormDel (id) {
    return request(`${ modelBase }/form/forms/${ id }`, {
        method: 'delete'
    })
}

// 详情
export function Api_FormDetail (id) {
    return request(`${ modelBase }/form/forms/${ id }`, {
        method: 'get'
    })
}

// 发布
export function Api_FormPublish (id) {
    return request(`${ modelBase }/form/forms/publish/${ id }`, {
        method: 'patch'
    })
}

// 撤消发布
export function Api_FormUnPublish (id) {
    return request(`${ modelBase }/form/forms/withdraw/${ id }`, {
        method: 'patch'
    })
}

// 建模
export function Api_FormModelBuild (id, params) {
    return request(`${ modelBase }/form/forms/modeling/${ id }`, {
        method: 'post',
        params
    })
}

// 建模详情
export function Api_FormModelBuildDetail (id, params) {
    return request(`${ modelBase }/form/forms/model/${ id }`, {
        method: 'get',
        params
    })
}

// 表单下拉框
export function Api_FormFormsCombobox (type = '') {
    return request(`${ modelBase }/form/forms/combobox?type=${ type }`, {
        method: 'get'
    })
}

// 复制表单
export function Api_FormFormsCopy (id) {
    return request(`${ modelBase }/form/forms/copy/${ id }`, {
        method: 'post'
    })
}

// 获取自定义查询模型
export function Api_FormFormsCustomListView (id) {
    return request(`${ modelBase }/form/forms/custom-list/${ id }`, {
        method: 'get'
    })
}

// 获取自定义查询模型
export function Api_FormFormsCustomListSave (id, params) {
    return request(`${ modelBase }/form/forms/custom-list/${ id }`, {
        method: 'post',
        params
    })
}

// 导入
export function Api_FormImport () {
    return `${process.env.VUE_APP_BASE_API}${ modelBase }/form/forms/import`
}

// 导出
export function Api_FormExport (id, name, title, type) {
    return `${process.env.VUE_APP_BASE_API}${ modelBase }/form/forms/export?id=${ id }&name=${ name }&title=${ title }&type=${ type }`
}
