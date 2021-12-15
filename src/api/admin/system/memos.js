import request from '@/utils/request'
import { modelBase } from './index'

// 备忘录

// 添加/修改
export function Api_MemosAddUpdate(params) {
    return request(`${ modelBase }/system/memos`, {
        method: 'post',
        params
    })
}

// 查询
export function Api_MemosDetail(params) {
    return request(`${ modelBase }/system/memos/list`, {
        method: 'get',
        params
    })
}

// 删除
export function Api_MemosDelete(params) {
    return request(`${ modelBase }/system/memos`, {
        method: 'delete',
        params
    })
}
