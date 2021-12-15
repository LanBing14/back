import request from '@/utils/request'
import { modelBase } from './index'

// 查询节假日列表
export function Api_HolidayFetchList (params) {
    return request(`${ modelBase }/system/holidays/page`, {
        method: 'get',
        params
    })
}

// 保存节假日
export function Api_HolidayAdd (params) {
    return request(`${ modelBase }/system/holidays`, {
        method: 'post',
        params:{
            saasCode: 'super',
            ...params
        }
    })
}


// 删除节假日
export function Api_HolidayDel (id) {
    return request(`${ modelBase }/system/holidays/${ id }`, {
        method: 'delete'
    })
}

// 刷新节假日
export function Api_HolidayFreshen () {
    return request(`${ modelBase }/system/holidays/cache`, {
        method: 'post'
    })
}

// 查询节假日
export function Api_HolidayList (params) {
    return request(`${ modelBase }/system/holidays/list`, {
        method: 'get',
        params
    })
}

