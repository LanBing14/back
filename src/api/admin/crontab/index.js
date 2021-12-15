import request from '@/utils/request';
import { quartz as modelBase } from '@/api/index';

// 获取分页定时任务列表
export function Api_CrontabsFetchList(params) {
	return request(`${modelBase}/quartz/crontabs/page`, {
		method: 'get',
		params
	});
}

// 获取任务下拉列表
export function Api_CrontabsGetJobsList() {
	return request(`${modelBase}/quartz/crontabs/jobs/combobox`, {
		method: 'get'
	});
}

// 新增定时任务
export function Api_CrontabsAdd(params) {
	return request(`${modelBase}/quartz/crontabs`, {
		method: 'post',
		params
	});
}

// 暂停任务
export function Api_CrontabsPause(triggerName) {
	return request(`${modelBase}/quartz/crontabs/pause`, {
		method: 'patch',
		params: {
			triggerName
		}
	});
}
// 恢复任务
export function Api_CrontabsResume(triggerName) {
	return request(`${modelBase}/quartz/crontabs/resume`, {
		method: 'patch',
		params: {
			triggerName
		}
	});
}

// 删除任务
export function Api_CrontabsDel(triggerName) {
	return request(`${modelBase}/quartz/crontabs`, {
		method: 'delete',
		params: {
			triggerName
		}
	});
}
