import request from '@/utils/request';
import {upms, cauth, fs} from '@/api/index';

/* 以下为全局接口定义*/

// 文件上传
export function Api_upload(url, file, onUploadProgress) {
    return request(url, {
        method: 'post',
        params: file,
        onUploadProgress
    });
}

// 查询字典select数据
export function Api_comboboxDict(dictCode, ser = upms, exValue) {
    return request(`${ser}/combobox/${dictCode}`, {
        method: 'get',
        params: {
            exValue
        }
    });
}

// 查询数据权限名称清单
export function Api_getDataAccessName() {
    return request(`/combobox/data-access-name/list`, {
        method: 'get'
    });
}

// 附件上传的基础地址
export function Api_fileUrl() {
    return `${fs}/fs/attachments/`;
}

// 获取附件信息
export function Api_getAttachments(type, linkId) {
    return request(`${fs}/fs/attachments/${type}/${linkId}`, {
        method: 'get'
    });
}

// 验证码地址
export function Api_getKaptcha() {
    return `${process.env.VUE_APP_BASE_API}${cauth}/auth/kaptcha/`;
}
