import request from '@/utils/request'
import {modelBase} from './index'

// 分页查询培训课程
export function Api_CoursesFetchList(params) {
    return request(`${modelBase}/training/courses/page`, {
        method: 'get',
        params
    })
}

// 新增培训课程
export function Api_CoursesAdd(params) {
    return request(`${modelBase}/training/courses`, {
        method: 'post',
        dataJson: true,
        params
    })
}

// 修改培训课程
export function Api_CoursesUpdate(id, params) {
    return request(`${modelBase}/training/courses/${id}`, {
        method: 'put',
        dataJson: true,
        params
    })
}

// 删除培训课程
export function Api_CoursesDelete(id) {
    return request(`${modelBase}/training/courses/${id}`, {
        method: 'delete'
    })
}

// 获取单个培训课程信息
export function Api_CoursesDetail(id) {
    return request(`${modelBase}/training/courses/${id}`, {
        method: 'get'
    })
}

// 发布培训课程
export function Api_CoursesPublish(id) {
    return request(`${modelBase}/training/courses/publish/${id}`, {
        method: 'patch'
    })
}

// 撤销发布培训课程
export function Api_CoursesWithdraw(id) {
    return request(`${modelBase}/training/courses/withdraw/${id}`, {
        method: 'patch'
    })
}
