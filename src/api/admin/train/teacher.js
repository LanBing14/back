import request from '@/utils/request'
import {modelBase} from './index'

// 分页查询培训讲师
export function Api_TeachersFetchList(params) {
    return request(`${modelBase}/training/teachers/page`, {
        method: 'get',
        params
    })
}

// 新增培训讲师
export function Api_TeachersAdd(params) {
    return request(`${modelBase}/training/teachers`, {
        method: 'post',
        params
    })
}

// 修改培训讲师
export function Api_TeachersUpdate(id, params) {
    return request(`${modelBase}/training/teachers/${id}`, {
        method: 'post',
        params
    })
}

// 删除培训讲师
export function Api_TeachersDelete(id) {
    return request(`${modelBase}/training/teachers/${id}`, {
        method: 'delete'
    })
}

// 查询单个培训讲师信息
export function Api_TeachersDetail(id) {
    return request(`${modelBase}/training/teachers/${id}`, {
        method: 'get'
    })
}

// 获取所有讲师列表
export function Api_TeachersList() {
    return request(`${modelBase}/training/teachers/list`, {
        method: 'get'
    })
}
