import Layout from "@/views/layouts/admin/Layout";

export default {
    m: () => ({
        path: "/admin/m",
        component: Layout,
        name: "m",
        meta: {
            title: "通用建模管理"
        }
    }),
    database: () => ({
        path: "database",
        component: () => import("@/views/admin/m/databases/index"),
        name: "database",
        meta: {
            title: "数据库管理"
        }
    }),
    validationRule: () => ({
        path: "validationRule",
        component: () => import("@/views/admin/m/validationRule/index"),
        name: "validationRule",
        meta: {
            title: "验证规则管理"
        }
    }),
    form: () => ({
        path: "form",
        component: () => import("@/views/admin/m/form/index"),
        name: "form",
        meta: {
            title: "表单管理"
        }
    }),
    customSearch: () => ({
        path: "customSearch",
        component: () => import("@/views/admin/m/customSearch/index"),
        name: "customSearch",
        meta: {
            title: "自定义查询"
        }
    }),
    supervision: () => ({
        path: "supervision",
        component: () => import("@/views/admin/m/supervision/index"),
        name: "supervision",
        meta: {
            title: "监管模型"
        }
    }),
    actModel: () => ({
        path: "actModel",
        component: () => import("@/views/admin/m/actModel/index"),
        name: "actModel",
        meta: {
            title: "流程模型管理"
        },
        otherRole: true
    }),
    procDef: () => ({
        path: "procDef",
        component: () => import("@/views/admin/m/procDef/index"),
        name: "procDef",
        meta: {
            title: "流程定义管理"
        },
        otherRole: true
    }),
    dynamicsForm: () => ({
        path: "dynamicsForm",
        component: () => import("@/views/admin/m/dynamicsForm/index"),
        name: "dynamicsForm",
        meta: {
            title: "动态表单"
        }
    }),
    echarts: () => ({
        path: "echarts",
        component: () => import("@/views/admin/m/echarts/index"),
        name: "echarts",
        meta: {
            title: "图表配置"
        }
    }),
    report: () => ({
        path: "report",
        component: () => import("@/views/admin/m/customReport/index"),
        name: "report",
        meta: {
            title: "报表配置"
        }
    }),
    echartsTest: () => ({
        path: "echartsTest",
        component: () => import("@/views/admin/m/echarts/Test"),
        name: "echartsTest",
        meta: {
            title: "图表配置测试"
        }
    }),
    channel: () => ({
        path: "channel",
        component: () => import("@/views/admin/system/channel/index"),
        name: "channel",
        meta: {
            title: "合作渠道"
        }
    }),
    reportProduct: () => ({
        path: "reportProduct",
        component: () => import("@/views/admin/train/reportProduct/index"),
        name: "reportProduct",
        meta: {
            title: "报告产品"
        }
    }),
    vipVersion: () => ({
        path: "vipVersion",
        component: () => import("@/views/admin/train/vipVersion/index"),
        name: "vipVersion",
        meta: {
            title: "会员版本"
        }
    }),
    payOrder: () => ({
        path: "payOrder",
        component: () => import("@/views/admin/pay/payOrder/index"),
        name: "payOrder",
        meta: {
            title: "支付订单"
        }
    }),
    enterpriseCertification: () => ({
        path: "enterpriseCertification",
        component: () => import("@/views/admin/enterpriseCertification/index"),
        name: "enterpriseCertification",
        meta: {
            title: "企业认证"
        }
    })
};
