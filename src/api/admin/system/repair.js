import request from '@/utils/request';
import { modelBase, fxb } from './index';

// 获取分页列表
export function Api_RepairFetchList(params) {
	return request(`${fxb}/ecm/credit/repair`, {
		method: 'get',
		params
	});
}
// 处理
export function Api_RepairTodo(id, params) {
	return request(`${fxb}/ecm/credit/repair/${id}`, {
		method: 'patch',
		params
	});
}
// 查看
export function Api_RepairDetail(id) {
	return request(`${fxb}/ecm/credit/repair/${id}`, {
		method: 'get'
	});
}
// 查看历史
export function Api_RepairHistoryDetail(id,params) {
	return request(`${fxb}/ecm/credit/repair/history/${id}`, {
		method: 'get',
		params
	});
}
//获取数量
export function Api_RepairFetchCount() {
	return request(`${fxb}/ecm/credit/repair/count`, {
		method: 'get'
	});
}
