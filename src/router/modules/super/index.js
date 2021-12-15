import Layout from '@/views/layouts/super/index'
import testRouter from './test'
import test2Router from './test2'
import test3Router from './test3'
export default {
    'super': () => ({
        path: '/super',
        component: Layout,
        // hidden: true,
        meta: {
            title: '超级管理'
        },
        name: 'super',
        redirect: 'super/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/super/home/index'),
                name: 'super-dashboard',
                meta: {
                    title: '首页',
                    icon: 'dashboard',
                    noCache: true,
                    affix: true
                }
            }
        ]
    }),
    ...testRouter,
    ...test2Router,
    ...test3Router
}
