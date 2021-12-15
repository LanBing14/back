import Layout from '@/views/layouts/admin/Layout'

export default {
    'creditService': () => ({
        path: '/admin/creditService',
        component: Layout,
        name: 'creditService',
        meta: {
            title: '信用服务',
            icon: 'lock'
        }
    }),
    'attestation': () => ({
        path: 'attestation',
        component: () => import('@/views/admin/creditService/attestation/index'),
        name: 'attestation',
        meta: {
            title: '企业认证',
            icon: 'icon-windows-fill'
        }
    })
}
