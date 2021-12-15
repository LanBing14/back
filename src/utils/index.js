import {trim, merge} from 'lodash'
import {stringify} from 'qs'
// import { Loading } from 'element-ui'
import Loading from '@/components/loading/index'
import {getToken} from '@/utils/auth'
import {upms} from './variables'

// 转化时间
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 格式化时间
export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

// 获取url中的参数
export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1
        } else {
            len += 0.5
        }
    }
    return Math.floor(len)
}

export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

export function param(json) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

export const pickerOptions = [
    {
        text: '今天',
        onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().toDateString())
            end.setTime(start.getTime())
            picker.$emit('pick', [start, end])
        }
    },
    {
        text: '最近一周',
        onClick(picker) {
            const end = new Date(new Date().toDateString())
            const start = new Date()
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
        }
    },
    {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date(new Date().toDateString())
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
        }
    },
    {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date(new Date().toDateString())
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
        }
    }
]

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

// 获取随机数字符串
export function getRandomStr() {
    const curDateTime = new Date().getTime()
    const randomNum = parseInt(Math.random()) * 100000
    return `${curDateTime + randomNum}`
}

// 时间戳格式化
export function dateFormat(timeStamp = '', fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!timeStamp) {
        return ''
    }
    const date = new Date(timeStamp)
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1,
                (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(
                    ('' + o[k]).length)))
        }
    }
    return fmt
}

// 限制时间
export function limitTime(maxmin, sourceTimeDate, limitDateStr) {
    if (limitDateStr) {
        if (maxmin === 'max') {
            return sourceTimeDate.getTime() > new Date(limitDateStr).getTime()
        } else {
            return sourceTimeDate.getTime() < new Date(limitDateStr).getTime()
        }
    } else {
        return false
    }
}

// 对象原型字符串
function getObjectProp(o) {
    return Object.prototype.toString.call(o).toLowerCase().slice(8, -1)
}

export function isObject(o) {
    return getObjectProp(o) === 'object'
}

export function isArray(o) {
    return getObjectProp(o) === 'array'
}

export function isFunction(o) {
    return getObjectProp(o) === 'function'
}

// 去除对象中每一项的前后空格
export function trimObject(o) {
    if (isObject(o)) {
        for (const key in o) {
            if (isObject(o[key]) || isArray(o[key])) {
                o[key] = trimObject(o[key])
            } else {
                o[key] = trim(o[key])
            }
        }
    } else if (isArray(o)) {
        o = o.map(item => {
            if (isObject(item) || isArray(item)) {
                return trimObject(item)
            } else {
                return trim(item)
            }
        })
    }
    return o
}

// 获得dom样式
export function getStyle(ele, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[prop]
    } else {
        return ele.currentStyle[prop]
    }
}

// loading
export function openLoading(params = {}) {
    const options = {
        lock: true,
        text: '加载中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    }
    return Loading.service(merge({}, options, params))
}

// 修改toFixed，小数的四舍五入的问题
export function toFixed(num, s = 0) {
    const times = Math.pow(10, s)
    let des = num * times
    des = parseInt(des, 10) / times
    return des + ''
}

/*
   * 判断obj是否为一个整数
*/
function isInteger(obj) {
    return Math.floor(obj) === obj
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
function toInteger(floatNum) {
    const ret = {times: 1, num: 0}
    if (isInteger(floatNum)) {
        ret.num = floatNum
        return ret
    }
    const strfi = floatNum + ''
    const dotPos = strfi.indexOf('.')
    const len = strfi.substr(dotPos + 1).length
    const times = Math.pow(10, len)
    const intNum = parseInt(floatNum * times + 0.5, 10)
    ret.times = times
    ret.num = intNum
    return ret
}

/*
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
 *
 */
function operation(a, b, op) {
    const o1 = toInteger(a)
    const o2 = toInteger(b)
    const n1 = o1.num
    const n2 = o2.num
    const t1 = o1.times
    const t2 = o2.times
    const max = t1 > t2 ? t1 : t2
    let result = null
    switch (op) {
        case 'add':
            if (t1 === t2) { // 两个小数位数相同
                result = n1 + n2
            } else if (t1 > t2) { // o1 小数位 大于 o2
                result = n1 + n2 * (t1 / t2)
            } else { // o1 小数位 小于 o2
                result = n1 * (t2 / t1) + n2
            }
            return result / max
        case 'subtract':
            if (t1 === t2) {
                result = n1 - n2
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2)
            } else {
                result = n1 * (t2 / t1) - n2
            }
            return result / max
        case 'multiply':
            result = (n1 * n2) / (t1 * t2)
            return result
        case 'divide':
            result = (n1 / n2) * (t2 / t1)
            return result
    }
}

// 加减乘除
export function add(a, b) { // 加
    return operation(a, b, 'add')
}

export function subtract(a, b) { // 减
    return operation(a, b, 'subtract')
}

export function multiply(a, b) { // 乘
    return operation(a, b, 'multiply')
}

export function divide(a, b) { // 除
    return operation(a, b, 'divide')
}

// 简易版原生ajax
export function ajax({url, type = 'get', data = {}, dataType = 'form', async = true, success, error}) {
    if (!url) return
    const xhr = new XMLHttpRequest()
    const dataStr = stringify(data)
    const setHeader = () => {
        xhr.setRequestHeader("Content-type", "application/" + (dataType === "json" ? "json" : "x-www-form-urlencoded"));
        xhr.setRequestHeader('Authorization', 'Bearer ' + getToken())
    }
    url = process.env.VUE_APP_BASE_API + url
    if (type === 'get') {
        xhr.open('get', url + '?' + dataStr, async)
        setHeader()
        xhr.send()
    } else if (type === 'post') {
        xhr.open('post', url, async)
        setHeader()
        xhr.send(dataStr)
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let d = xhr.responseText
            if (dataType === 'json' || dataType === 'form') {
                try {
                    d = JSON.parse(d)
                } catch (e) {

                }
                if (d.success) {
                    success && success(d.data)
                } else {
                    error && error(d)
                }
            } else {
                success && success(d)
            }
        } else if (xhr.status !== 200) {
            error && error(xhr.status)
        }
    }
}

// 获取线段中点
export function getLineCenter(startPoint, endPoint) {
    const x = Math.abs(startPoint.x - endPoint.x)
    const y = Math.abs(startPoint.y - endPoint.y)
    const cx = parseInt(x / 2)
    const cy = parseInt(y / 2)
    let px = 0
    let py = 0
    if (startPoint.x > endPoint.x) {
        px = startPoint.x - cx
    } else {
        px = startPoint.x + cx
    }
    if (startPoint.y > endPoint.y) {
        py = startPoint.y - cy
    } else {
        py = startPoint.y + cy
    }
    return {
        x: px,
        y: py
    }
}

export function Unicode_Str(unicode) {
    var result = [];
    var strArr = unicode.split('\\u');
    for (var i = 0, len = strArr.length; i < len; i++) {
        if (strArr[i]) {
            result.push(String.fromCharCode(parseInt(strArr[i], 16)))
        }
    }
    return result.join('');
}

// 转换tree中的数据，添加antd中树组件需要的title和key字段
export function turnTreeData(data) {
    if (!data) {
        return [];
    }
    data.forEach(item => {
        item.key = item.id;
        item.title = item.label;
        if (item.children && item.children.length) {
            turnTreeData(item.children);
        }
    })
    return data
}


function getFloat(number, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) {
        return Math.round(number);
    }
    number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); // 四舍五入
    number = Number(number).toFixed(n); // 补足位数
    return number;
}

// 将数字转换为金钱格式(元)(2位)
export function toMoney(num, n = 2) {
    // 金钱数字为空时，将数字转为'-'
    if (num === null || num === undefined || num === "") {
        return "-";
    }
    num = Number(num);
    const m2 = getFloat(num, n).split(".")[1];
    num = num.toFixed(n);
    num = parseFloat(num);
    num = num.toLocaleString();
    num = num.split(".")[0];
    return num + "." + m2; // 返回的是字符串23,245.12保留2位小数
}

// 根据秒数转换成时分秒
export function turnTime(timeNumer) {
    if (!timeNumer) {
        return 0
    }
    const h = parseInt(timeNumer / 3600)
    const m = parseInt(timeNumer / 60) % 60
    const s = timeNumer % 3600 % 60
    return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2)
}
