import Layout from '@/views/layouts/super/index'
import { Blank } from '@/router/index'

export default {
    'userTest3': () => ({
        path: '/super/testUser3',
        component: Layout,
        name: 'userTest3',
        meta: {
            title: '内容发布'
        }
    }),
    'userTest3Child1': () => ({
        path: 'userTest3Child1',
        component: Blank,
        name: 'userTest3Child1',
        redirect: 'noredirect',
        meta: {
            title: '敏感词管理'
        },
        children: [{
            path: '',
            name: 'userTest3Child1Index',
            component: () => import('@/views/super/testUser3/userTest3Test1/index'),
            meta: {
                title: '敏感词管理'
            }
        }]
    })
}
