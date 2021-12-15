import {
    Api_NoticeYetReadNums,
    Api_NoticeDetail,
    Api_MailYetReadNums,
    Api_NoticeReadDetail,
    Api_MailDetailCenter,
    Api_UserGetPersonInfo
} from '@/api/admin/system/index'

const global = {
    state: {
        saasCode: 'super',
        personInfo: {}, // 登录人信息数据
        noticeMessageNums: null, // 未读的通知公告数量
        noticeDetailVisible: false, // 公告详情显示状态
        noticeDetailData: {}, // 公告详情数据
        mailMessageNums: null, // 未读的系统消息数量,
        mailDetailVisible: false, // 站内信详情显示状态
        mailDetailData: {}, // 站内信详情数据
        selectSaasCode: 'super' // 当前选中的站编码
    },
    mutations: {
        // 保存所选中站点的code值
        SAVE_SELECTSASSCODE: (state, string) => {
            state.selectSaasCode = string
        },
        // 保存登录人信息
        SAVE_PERSONINFO: (state, data) => {
            state.personInfo = data
        },
        // 保存公告未读数量
        SAVE_NOTICE_READNUMS: (state, num) => {
            state.noticeMessageNums = num
        },
        // 保存消息未读数量
        SAVE_MAIL_READNUMS: (state, num) => {
            state.mailMessageNums = num
        },
        // 切换公告详情显示状态
        TOGGLE_noticeDetailVisible: (state, flag) => {
            state.noticeDetailVisible = flag
        },
        // 保存公告详情数据
        SAVE_noticeDetailData: (state, data) => {
            state.noticeDetailData = data;
        },
        // 切换站内信详情显示状态
        TOGGLE_mailDetailVisible: (state, flag) => {
            state.mailDetailVisible = flag
        },
        // 保存站内信详情数据
        SAVE_mailDetailData: (state, data) => {
            state.mailDetailData = data;
        }
    },
    actions: {
        // 获取当前登录人信息
        getPersonInfo(a) {
            const {commit} = a
            return new Promise((resolve, reject) => {
                Api_UserGetPersonInfo().then(res => {
                    commit('SAVE_PERSONINFO', res)
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        // 获取未读公告数量
        getNoticeNums({commit}) {
            return new Promise((resolve, reject) => {
                Api_NoticeYetReadNums().then(res => {
                    commit('SAVE_NOTICE_READNUMS', res)
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        // 获取公告详情
        getNoticeDetail({commit}, id) {
            return new Promise((resolve, reject) => {
                Api_NoticeDetail(id).then(res => {
                    commit('SAVE_noticeDetailData', res)
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        // 提交阅读记录
        putNoticeRead(_, id) {
            return new Promise((resolve, reject) => {
                Api_NoticeReadDetail(id).then(res => {
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        // 获取站内信详情
        getMailDetail({commit}, id) {
            return new Promise((resolve, reject) => {
                Api_MailDetailCenter(id).then(res => {
                    commit('SAVE_mailDetailData', res)
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        // 获取未读站内信数量
        getMailNums({commit}) {
            return new Promise((resolve, reject) => {
                Api_MailYetReadNums().then(res => {
                    commit('SAVE_MAIL_READNUMS', res)
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            })
        }
    }
}
export default global;
