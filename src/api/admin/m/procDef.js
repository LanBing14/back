import request from '@/utils/request'
import { modelBase } from './index'
import {upms} from "@/utils/variables";

// 查询分页流程定义
export function Api_ProcDefGetList (params) {
    return request(`${ upms }/workflow/proc-def/page`, {
        method: 'get',
        params
    })
}

// 读取流程定义相关资源
export function Api_ProcDefResource (params) {
    return request(`${ modelBase }/workflow/proc-def/resource`, {
        method: 'get',
        params
    })
}

// 激活流程定义
export function Api_ProcDefActivation (params) {
    return request(`${ modelBase }/workflow/proc-def/activation`, {
        method: 'patch',
        params
    })
}

// 挂起流程定义
export function Api_ProcDefSuspension (params) {
    return request(`${ modelBase }/workflow/proc-def/suspension`, {
        method: 'patch',
        params
    })
}

// 流程图的外链地址
export function Api_ProcDefLinkUrlPicture (id) {
    return `${process.env.VUE_APP_BASE_API}${ modelBase }/workflow/proc-def/resource?processDefinitionId=${ id }&resourceType=image`
}

// 	bpmn.xml的外链地址
export function Api_ProcDefLinkUrlBpmn (id) {
    return `${process.env.VUE_APP_BASE_API}${ modelBase }/workflow/proc-def/resource?processDefinitionId=${ id }&resourceType=xml`
}
