import Layout from '@/views/layouts/admin/Layout'

export default {
    'cms': () => ({
        path: '/admin/cms',
        component: Layout,
        name: 'cms',
        meta: {
            title: '内容发布'
        }
    }),
    'sensitiveWord': () => ({
        path: 'sensitiveWord',
        component: () => import('@/views/admin/cms/sensitivewords/index'),
        name: 'sensitiveWord',
        meta: {
            title: '敏感词管理'
        }
    }),
    'document': () => ({
        path: 'document',
        component: () => import('@/views/admin/cms/document/index'),
        name: 'document',
        meta: {
            title: '文档管理'
        }
    }),
    'channel': () => ({
        path: 'channel',
        component: () => import('@/views/admin/cms/channels/index'),
        name: 'channel',
        meta: {
            title: '栏目管理'
        }
    }),
    'content': () => ({
        path: 'content',
        component: () => import('@/views/admin/cms/content/index'),
        name: 'content',
        meta: {
            title: '内容发布'
        }
    })
}
