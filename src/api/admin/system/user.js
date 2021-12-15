import request from '@/utils/request'
import { modelBase } from './index'

// 获取菜单
export function Api_getMenus(saasCode) {
  return request(`${ modelBase }/system/users/menus`, {
    method: 'get',
    params: {
      saasCode,
      roleType: '0'
    }
  })
}

// 新增用户
export function Api_UserAdd(params) {
  return request(`${ modelBase }/system/users`, {
    method: 'post',
    params
  })
}

// 获取用户列表
export function Api_UserFetchList(query) {
  return request(`${ modelBase }/system/users/page`, {
    method: 'get',
    params: query
  })
}

// 更改用户启用/停用状态
export function Api_UserChangeStatus(status, id) {
  const urlKind = status === '1' ? 'enable' : 'disable'
  return request(`${ modelBase }/system/users/${ urlKind }/${id}`, {
    method: 'patch'
  })
}

// 获取单个用户信息
export function Api_UserDetail(id) {
  return request(`${ modelBase }/system/users/${ id }`, {
    method: 'get'
  })
}

// 修改单个用户信息
export function Api_UserUpdate(id, params) {
  return request(`${ modelBase }/system/users/${ id }`, {
    method: 'put',
    params
  })
}

// 删除单个用户信息
export function Api_UserDel(ids) {
  return request(`${ modelBase }/system/users/${ ids }`, {
    method: 'delete'
  })
}

// 重置单个用户信息
export function Api_UserReset(ids) {
  return request(`${ modelBase }/system/users/password-reset`, {
    method: 'patch',
    params: {
      ids
    }
  })
}

// 查询用户菜单权限树
export function Api_UserGetPermissions(id) {
  return request(`${ modelBase }/system/users/${ id }/permissions`, {
    method: 'get'
  })
}

// 更新用户菜单权限树
export function Api_UserUpdatePermissions(id, permissionIds) {
  return request(`${ modelBase }/system/users/${ id }/permissions`, {
    method: 'post',
    params: {
      permissionIds: permissionIds
    }
  })
}

// 根据名称查询用户
export function Api_UserGetForSearch(name) {
  return request(`${ modelBase }/system/users/list?name=${ name }`, {
    method: 'get'
  })
}

// 获取当前登录用户信息
export function Api_UserGetPersonInfo() {
  return request(`${ modelBase }/system/users/self`, {
    method: 'get'
  })
}