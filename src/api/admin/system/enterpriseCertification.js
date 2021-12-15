import request from "@/utils/request";
import { modelBase } from "./index";

// 企业认证分页列表
export function Api_enterpriseList(params) {
    return request(`/fxb/enterprise-cert`, {
        method: "get",
        params
    });
}

// 获取企业认证详情
export function Api_enterpriseDetail(id, params) {
    return request(`/fxb/enterprise-cert/${id}`, {
        method: "get",
        params
    });
}

// 企业认证审核
export function Api_enterpriseAudit(id, status, params) {
    return request(`/fxb/enterprise-cert/${id}/${status}`, {
        method: "put",
        params
    });
}
