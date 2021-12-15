import Layout from '@/views/layouts/admin/Layout'

export default {
    'crontab': () => ({
        path: '/admin/quartz',
        component: Layout,
        name: 'quartz',
        children: [
            {
                path: 'crontab',
                component: () => import('@/views/admin/crontab/index'),
                name: 'crontab',
                meta: {title: '定时任务管理', icon: 'clipboard'}
            }
        ]
    })
}
