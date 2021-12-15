import request from '@/utils/request';
import { modelBase, fxb } from './index';

// 分页查询合作渠道
export function Api_ChannelFetchList(params) {
	return request(`${fxb}/ecm/channel/cooperation/page`, {
		method: 'get',
		params
	});
}
// 数量
export function Api_ChannelFetchCount(status) {
	return request(`${fxb}/ecm/channel/cooperation/count/${status}`, {
		method: 'get'
	});
}
// 新增
export function Api_ChannelAdd(params) {
	return request(`${fxb}/ecm/channel/cooperation/sendCooperationMail`, {
		method: 'post',
		params
	});
}
// 处理
export function Api_ChannelTodo(id, params) {
	return request(`${fxb}/ecm/channel/cooperation/${id}`, {
		method: 'patch',
		params
	});
}
// 查看
export function Api_ChannelDetail(id) {
	return request(`${fxb}/ecm/channel/cooperation/${id}`, {
		method: 'get'
	});
}
