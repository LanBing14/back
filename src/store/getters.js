const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    status: state => state.user.status,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    menus: state => state.user.menus, // self
    menusStatus: state => state.user.menusStatus, // self
    // permission_routers: state => state.permission.routers,
    admin_routers: state => state.permission.adminRouters,
    super_routers: state => state.permission.superRouters,
    addRouters: state => state.permission.addRouters,
    errorLogs: state => state.errorLog.logs,

    selectSaasCode: state => state.global.selectSaasCode,
    saasCode: state => state.global.saasCode,
    personInfo: state => state.global.personInfo,
    noticeMessageNums: state => state.global.noticeMessageNums,
    noticeDetailVisible: state => state.global.noticeDetailVisible,
    noticeDetailData: state => state.global.noticeDetailData,
    mailMessageNums: state => state.global.mailMessageNums,
    mailDetailVisible: state => state.global.mailDetailVisible,
    mailDetailData: state => state.global.mailDetailData
}
export default getters
