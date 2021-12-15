import Layout from '@/views/layouts/admin/Layout'

export default {
    'train': () => ({
        path: '/admin/train',
        component: Layout,
        name: 'train',
        meta: {
            title: '培训管理',
            icon: 'lock'
        }
    }),
    'teacher': () => ({
        path: 'teacher',
        component: () => import('@/views/admin/train/teacher/index'),
        name: 'teacher',
        meta: {
            title: '讲师管理',
            icon: 'icon-windows-fill'
        }
    }),
    'course': () => ({
        path: 'course',
        component: () => import('@/views/admin/train/course/index'),
        name: 'course',
        meta: {
            title: '课程管理',
            icon: 'icon-windows-fill'
        }
    }),
    'learning': () => ({
        path: 'learning',
        component: () => import('@/views/admin/train/learning/index'),
        name: 'learning',
        meta: {
            title: '学习记录',
            icon: 'icon-windows-fill'
        }
    }),
}
