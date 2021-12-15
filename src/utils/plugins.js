import { createRules } from './validate'
import {
    dateFormat,
    limitTime,
    isObject,
    isArray,
    isFunction,
    trimObject,
    getStyle,
    openLoading,
    toFixed,
    add,
    subtract,
    multiply,
    divide,
    turnTreeData,
    toMoney,
    turnTime
} from './index'

export default {
    install (Vue) {
        // 添加实例方法
        // 创建表单验证规则
        Vue.prototype.$createRules = createRules

        // 时间格式化方法
        Vue.prototype.$dateFormat = dateFormat
        // 打开loading层
        Vue.prototype.$openLoading = openLoading

        // trim
        Vue.prototype.$trim = function (str) {
            return str.replace(/^\s+|\s+$/g, '')
        }

        // 获取dom元素css样式
        Vue.prototype.$getStyle = getStyle

        // 获取相对路径
        Vue.prototype.$getRelativePath = function (url) {
            if (url.indexOf(':') === -1) {
                return url
            }
            url = url.split(':')[1]
            url = url.substring(url.indexOf('/'))
            return url
        }

        // 限制时间，通常在时间控件的开始和结束时间两者间使用
        Vue.prototype.$limitTime = limitTime

        Vue.prototype.$trimObject = trimObject

        // 检测变量是否是对象
        Vue.prototype.$isObject = isObject

        // 检测变量是否是数组
        Vue.prototype.$isArray = isArray

        // 检测变量是否是方法
        Vue.prototype.$isFunction = isFunction

        // 修改toFixed，小数的四舍五入的问题
        Vue.prototype.$toFixed = toFixed

        // 加减乘除
        Vue.prototype.$add = add
        Vue.prototype.$subtract = subtract
        Vue.prototype.$multiply = multiply
        Vue.prototype.$divide = divide

        // 转换tree中的数据，添加antd中树组件需要的title和key字段
        Vue.prototype.$turnTreeData = turnTreeData
        // 将数字转换为金钱格式(元)(2位)
        Vue.prototype.$toMoney = toMoney;
        Vue.prototype.$turnTime = turnTime;
    }
}
