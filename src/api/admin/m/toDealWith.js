import request from '@/utils/request'
import { modelBase } from './index'
import { upms } from '@/api/index';

// 查询分页待办任务
export function Api_TodoGetList (params) {
    return request(`${ upms }/workflow/todo/page`, {
        method: 'get',
        params
    })
}

// 查询分页待办任务
export function Api_DoneGetList (params) {
    return request(`${ upms }/workflow/done/page`, {
        method: 'get',
        params
    })
}
// 查询分页我的申请
export function Api_ApplyGetList (params) {
    return request(`${ upms }/workflow/my/page`, {
        method: 'get',
        params
    })
}

// 查询业务记录的流程历史
export function Api_ToDealHistory (params) {
    return request(`${ upms }/workflow/biz-history/list`, {
        method: 'get',
        params
    })
}

// 根据业务ID查看流程流向图
export function Api_ToDealProcessImage (businessKey) {
    return `${process.env.VUE_APP_BASE_API}${ modelBase }/workflow/process/image/${businessKey}`
}
