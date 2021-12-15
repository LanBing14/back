import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
import Layout from '@/views/layouts/admin/Layout'
import LayoutSuper from '@/views/layouts/super/index'
import adminRouters from './modules/admin/index'
import superRouters from './modules/super/index'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                  当设置 true 的时候该路由不会再侧边栏出现如401，login等页面，或者如一些编辑页面/edit/1。(默认 false)
 * alwaysShow: true              当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 若你想不管路由下面的 children 声明的个数都显示你的根路由
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noredirect          当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'            设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
    affix: false                 如果设置为true,则在tab导航中为不可关闭项
  }
 **/

// 空白组件，用于承载多级菜单下的路由组件
export const Blank = () => import('@/views/blank');

// 常规路由，不需要动态获取
export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: '/edit-pwd',
        component: () => import('@/views/login/PasswordEditBody'),
        hidden: true
    },
    // 模型预览
    {
        path: '/model/view',
        component: () => import('@/views/admin/m/actModel/ModelBuildPreview'),
        hidden: true
    }
];

// 生成router实例
export const getRouterIns = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
// 导出路由对象
export default getRouterIns()

// 菜单key对应的路由组件
export const menuIdComponents = {
    'blank': () => ({
        path: '',
        component: Blank,
        name: '',
        meta: {
            title: ''
        }
    }),
    ...adminRouters,
    ...superRouters
};

// 404路由的路径
export const asyncNotfound = {path: '*', redirect: '/404', hidden: true};

// 动态路由（弃用）
// export const asyncRouterMap = [
//     {
//         id: '0100',
//         path: '/system',
//         component: Layout,
//         redirect: '/system/user',
//         name: 'system',
//         alwaysShow: true,
//         meta: {
//             title: '系统管理',
//             icon: 'lock',
//             noCache: true
//         },
//         children: [
//             {
//                 id: '0101',
//                 path: 'user',
//                 component: () => import('@/views/admin/system/user/index'),
//                 name: 'user',
//                 meta: {
//                     title: '用户管理',
//                     icon: 'icon-windows-fill'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0102',
//                 path: 'role',
//                 component: () => import('@/views/admin/system/role/index'),
//                 name: 'role',
//                 meta: {
//                     title: '角色管理'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0103',
//                 path: 'department',
//                 component: () => import('@/views/admin/system/department/index'),
//                 name: 'department',
//                 meta: {
//                     title: '部门管理'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0104',
//                 path: 'menu',
//                 component: () => import('@/views/admin/system/menu/index'),
//                 name: 'menu',
//                 meta: {
//                     title: '菜单管理'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0105',
//                 path: 'dictionary',
//                 component: () => import('@/views/admin/system/dictionary/index'),
//                 name: 'dictionary',
//                 meta: {
//                     title: '字典管理'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0106',
//                 path: 'holiday',
//                 component: () => import('@/views/admin/system/holiday/index'),
//                 name: 'holiday',
//                 meta: {
//                     title: '节假日管理'
//                     // noCache: true
//                 }
//             }, {
//                 id: '0107',
//                 path: 'log',
//                 component: () => import('@/views/admin/system/log/index'),
//                 name: 'log',
//                 meta: {
//                     title: '日志管理'
//                     // noCache: true
//                 }
//             }
//         ]
//     },
//     {path: '*', redirect: '/404', hidden: true}
// ]
