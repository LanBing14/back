import Layout from '@/views/layouts/super/index'

export default {
    'testUser1': () => ({
        path: '/super/testUser1',
        component: Layout,
        meta: {
            title: '测试1'
        },
        redirect: 'noredirect', // 当当前菜单即为本身时使用这种方式处理路由
        children: [
            {
                path: '',
                component: () => import('@/views/super/testUser1/index'),
                name: 'testUser1',
                meta: {title: 'testUser1', icon: 'clipboard'}
            }
        ]
    })
}
