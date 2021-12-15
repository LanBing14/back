import request from '@/utils/request'
import { modelBase } from './index'

// 查询日志列表
export function Api_LogFetchList (params) {
    return request(`${ modelBase }/system/logs/page`, {
        method: 'get',
        params
    })
}

// 获取日志参数
export function Api_LogFetchParams (id) {
    return request(`${ modelBase }/system/logs/${ id }/params`, {
        method: 'get'
    })
}
