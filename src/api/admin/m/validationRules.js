import request from '@/utils/request'
import { modelBase } from './index'

// 查询分页验证规则
export function Api_ValidationRulesGetList (params) {
    return request(`${ modelBase }/db/validationRules/page`, {
        method: 'get',
        params
    })
}

// 获取验证规则信息
export function Api_ValidationRulesDetail (id) {
    return request(`${ modelBase }/db/validationRules/${ id }`, {
        method: 'get'
    })
}

// 新增验证规则
export function Api_ValidationRulesAdd (params) {
    return request(`${ modelBase }/db/validationRules`, {
        method: 'post',
        params
    })
}

// 修改验证规则
export function Api_ValidationRulesUpdate (id, params) {
    return request(`${ modelBase }/db/validationRules/${ id }`, {
        method: 'put',
        params
    })
}

// 删除验证规则
export function Api_ValidationRulesDel (id) {
    return request(`${ modelBase }/db/validationRules/${ id }`, {
        method: 'delete'
    })
}

// 验证规则下拉框
export function Api_ValidationRulesCombobox () {
    return request(`${ modelBase }/db/validationRules/combobox`, {
        method: 'get'
    })
}
