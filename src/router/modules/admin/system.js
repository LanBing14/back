import Layout from "@/views/layouts/admin/Layout";

export default {
    system: () => ({
        path: "/admin/system",
        component: Layout,
        name: "system",
        meta: {
            title: "系统管理",
            icon: "lock"
        },
        otherRole: true
    }),
    deploy: () => ({
        path: "/admin/deploy",
        component: Layout,
        name: "deploy",
        meta: {
            title: "配置管理",
            icon: "lock"
        },
        otherRole: true
    }),
    user: () => ({
        path: "user",
        component: () => import("@/views/admin/system/user/index"),
        name: "user",
        meta: {
            title: "用户管理",
            icon: "icon-windows-fill"
        },
        otherRole: true
    }),
    userQuery: () => ({
        path: "userQuery",
        component: () => import("@/views/admin/system/userQuery/index"),
        name: "userQuery",
        meta: {
            title: "用户查询",
            icon: "icon-windows-fill"
        }
    }),
    repair:()=>({
        path: "repair",
        component: () => import("@/views/admin/system/repair/index"),
        name: "repair",
        meta: {
            title: "信用修复",
            icon: "icon-scissor"
        }
    }),
    // 新增的站点管理
    saas: () => ({
        path: "saas",
        component: () => import("@/views/admin/system/saas/index"),
        name: "saas",
        meta: {
            title: "站点管理",
            icon: "icon-windows-fill"
        }
    }),
    role: () => ({
        path: "role",
        component: () => import("@/views/admin/system/role/index"),
        name: "role",
        meta: {
            title: "角色管理"
        },
        otherRole: true
    }),
    department: () => ({
        path: "department",
        component: () => import("@/views/admin/system/department/index"),
        name: "department",
        meta: {
            title: "部门管理"
        },
        otherRole: true
    }),
    menu: () => ({
        path: "menu",
        component: () => import("@/views/admin/system/menu/index"),
        name: "menu",
        meta: {
            title: "菜单管理"
        }
    }),
    dictionary: () => ({
        path: "dictionary",
        component: () => import("@/views/admin/system/dictionary/index"),
        name: "dictionary",
        meta: {
            title: "字典管理"
        }
    }),
    holiday: () => ({
        path: "holiday",
        component: () => import("@/views/admin/system/holiday/index"),
        name: "holiday",
        meta: {
            title: "节假日管理"
        }
    }),
    log: () => ({
        path: "log",
        component: () => import("@/views/admin/system/log/index"),
        name: "log",
        meta: {
            title: "日志管理"
        }
    }),
    notice: () => ({
        path: "notice",
        component: () => import("@/views/admin/system/notice/index"),
        name: "notice",
        meta: {
            title: "公告管理"
        }
    }),
    mail: () => ({
        path: "mail",
        component: () => import("@/views/admin/system/mail/index"),
        name: "mail",
        meta: {
            title: "消息管理"
        }
    }),
    area: () => ({
        path: "area",
        component: () => import("@/views/admin/system/area/index"),
        name: "area",
        meta: {
            title: "区域管理"
        }
    }),
    feedback: () => ({
        path: "feedback",
        component: () => import("@/views/admin/system/feedback/index"),
        name: "feedback",
        meta: {
            title: "客户反馈"
        }
    }),
    crontab: () => ({
        path: "crontab",
        component: () => import("@/views/admin/crontab/index"),
        name: "crontab",
        meta: {
            title: "定时任务管理"
        }
        // children: [
        //     {
        //         path: 'crontab',
        //         component: () => import('@/views/admin/crontab/index'),
        //         name: 'crontab',
        //         meta: {title: '定时任务管理', icon: 'clipboard'}
        //     }
        // ]
    })
};
