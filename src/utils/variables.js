// 提示性文字
export const wordTips = {
    drawerLeaveTip: '离开页面会丢失当前编辑的内容，确定要离开吗？'
}

// 扩展的正则规则
export const patterns = {
    phone: /^((\d{7,8})|(0\d{2,3}-\d{7,8})|(1[3|4|5|6|7|8|9]\d{9}))$/, // 电话号，包括手机各座机
    mobile: /^1[3|4|5|6|7|8|9]\d{9}$/, // 手机号
    integer: /^[0-9]*$/, // 正整数
    float: /^\d+(?=\.{0,1}\d+$|$)/, // 整数或小数
    integer0: /^[1-9][0-9]*$/, // 大于0的整数
    z0: /^[a-zA-Z0-9]*$/, // 英文和数字
    a0cn: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 大小写字母、数字、中文
    EXP_ENG_NUM: /^[A-Za-z0-9]+$/, // 允许大小写字母和数字
    EXP_ENG_NUM_0: /^[A-Za-z0-9\-]+$/, // 允许大小写字母、数字和“-”
    EXP_ENG_NUM_1: /^[a-zA-z0-9_]+$/, // 允许大小写字母、数字和“_”
    EXP_ENG_NUM_2: /^[A-Za-z0-9_\-]+$/, // 允许大小写字母、数字、“_”和“-”
    EXP_ENG_NUM_3: /^[A-Za-z0-9_\-\,\(\)]+$/, // 允许大小写字母、数字、“_”、“-”“,”和“()”
    EXP_ENG_NUM_4: /^[A-Za-z0-9_\-\(\)]+$/, // 允许大小写字母、数字、“_”、“-”和“()”
    EXP_ENG_NUM_5: /^[A-Za-z0-9_\(\)]+$/, // 允许大小写字母、数字、“_”和“()”
    numberFloatUp: /(^[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/ // 正数，两位小数
}

// 通知公告和站内信的websocket的链接地址
export const websocketNoticeUrl = 'ws://localhost:8110/message/'

// el-switch的启用与禁用颜色
export const switchColors = {
    active: '#13ce66', // 激活
    inactive: '#ff4949' // 关闭
}

// api接口模块前辍
const apiFlag = process.env.VUE_APP_BASE_API === '/zuul'
export const upms = apiFlag ? '/upms' : ''
export const m = apiFlag ? '/m' : ''
export const quartz = apiFlag ? '/quartz' : ''
export const cms = apiFlag ? '/cms' : ''
export const fs = apiFlag ? '/fs' : ''
export const cauth = apiFlag ? '/cauth' : ''
export const fxb = apiFlag ? '/fxb' : ''
