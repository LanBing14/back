import request from "@/utils/request";
import { modelBase } from "./index";

// 查询站点列表
export function Api_SaasFetchList(params) {
    return request(`${modelBase}/system/saas/page`, {
        method: "get",
        params
    });
}

// 新增站点
export function Api_SaasAdd(params) {
    return request(`${modelBase}/system/saas`, {
        method: "post",
        params
    });
}

// 修改站点
export function Api_SaasUpdate(id, params) {
    return request(`${modelBase}/system/saas/${id}`, {
        method: "put",
        params
    });
}

// 删除站点
export function Api_SaasDel(id, code) {
    return request(`${modelBase}/system/saas/${id}`, {
        method: "delete",
        params: { code: code }
    });
}

// 刷新站点
export function Api_SaasFreshen() {
    return request(`${modelBase}/system/saas/cache`, {
        method: "post"
    });
}

// 查询单个的站点信息
export function Api_SaasDetail(id) {
    return request(`${modelBase}/system/saas/${id}`, {
        method: "get"
    });
}

// 站点权限配置
export function Api_SaasAudit(id, params) {
    return request(`${modelBase}/system/saas/${id}`, {
        method: "patch",
        params
    });
}
