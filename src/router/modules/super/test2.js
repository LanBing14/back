import Layout from '@/views/layouts/super/index'
import { Blank } from '@/router/index'

export default {
    'userTest2': () => ({
        path: '/super/testUser2',
        component: Layout,
        name: 'testUser2',
        meta: {
            title: '内容发布'
        }
    }),
    'userTest2Child1': () => ({
        path: 'userTest2Child1',
        component: Blank,
        name: 'userTest2Child1',
        // redirect: 'noredirect',
        meta: {
            title: '敏感词管理'
        },
        // children: [{
        //     path: '',
        //     name: 'userTest2Child1Index',
        //     component: () => import('@/views/super/testUser2/userTest2Test1/index'),
        //     meta: {
        //         title: '敏感词管理'
        //     }
        // }]
    }),
    'userTest2Child1Comp1': () => ({
        path: 'userTest2Child1Comp1',
        component: () => import('@/views/super/testUser2/userTest2Test1/Test2Comp'),
        name: 'userTest2Child1Comp1',
        meta: {
            title: '敏感词管理'
        }
    }),
    'userTest2Child1Comp2': () => ({
        path: 'userTest2Child1Comp2',
        component: () => import('@/views/super/testUser2/userTest2Test1/Test2Comp'),
        name: 'userTest2Child1Comp2',
        meta: {
            title: '敏感词管理'
        }
    })
}
