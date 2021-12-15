import request from '@/utils/request'
import {upms as modelBase} from '@/utils/variables'

// 分页查询信用报告订单
export function Api_ReportOrderGetList(params) {
    return request(`${modelBase}/pay/orders/credit-report/page`, {
        method: 'get',
        params
    })
}

// 删除
export function Api_ReportOrderDelete(id) {
    return request(`${modelBase}/pay/orders/${id}`, {
        method: 'delete'
    })
}

// 标记为已付款
export function Api_ReportOrderSign(id) {
    return request(`${modelBase}/pay/orders/${id}`, {
        method: 'put'
    })
}

// 标记为已付款
export function Api_ReportCreate(orderNo) {
    return request(`/fxb/credit-report/credit-report/${orderNo}`, {
        method: 'post'
    })
}

// 支付订单分页查询
export function Api_PayOrderGetList(params) {
    return request(`${modelBase}/pay/orders/orderPage`, {
        method: 'get',
        params
    })
}
