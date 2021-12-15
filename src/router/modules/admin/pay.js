import Layout from '@/views/layouts/admin/Layout'

export default {
    'pay': () => ({
        path: '/admin/pay',
        component: Layout,
        name: 'pay',
        meta: {
            title: '支付中心'
        }
    }),

    'creditReportOrder': () => ({
        path: 'creditReportOrder',
        component: () => import('@/views/admin/pay/creditReportOrder/index'),
        name: 'creditReportOrder',
        meta: {
            title: '信用报告订单'
        }
    })
}
