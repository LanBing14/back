import axios from 'axios'
import {stringify} from 'qs'
import {Message} from 'element-ui'
import router from '../router'
import store from '@/store'
import {getToken} from '@/utils/auth'
import {trimObject} from './index'

const errStatusMsg = {
    401: '登录失效或无权限(401)',
    504: '资源请求超时(504)',
    500: '服务器错误(500)'
}

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    timeout: 0, // request timeout
    headers: {
        Accept: 'application/json'
    }
})

service.interceptors.request.use(
    config => {
        if (config.method === 'get') {
            config.data = true
        }
        // config.headers['Authorization'] = getToken()
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        if (response.data.code === 478) {
            Message({
                message: response.data.msg,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(response.data.msg)
        }
        if (response.data.access_token) {
            return response
        }
        if (response.data.success) {
            return response.data
        } else {
            let errorMsg = '接口数据格式错误'
            if (response.data.error) {
                if (response.data.error_description) {
                    errorMsg = response.data.error_description
                } else {
                    errorMsg = response.data.error
                }
                Message({
                    message: errorMsg,
                    type: 'error',
                    duration: 5 * 1000
                })
            }
            return Promise.reject(errorMsg)
        }
    },
    errorResponse => {
        const {response: {status, data}} = errorResponse
        const {error} = data
        let msg = '未知错误'
        if (error) {
            msg = error
        } else if (errStatusMsg[status]) {
            msg = errStatusMsg[status]
        }
        if (status === 401) {
            msg = '用户登录失效'
        }
        if (error !== 'invalid_grant' && error !== 'unauthorized') {
            Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000
            })
        }
        if (status === 401) {
            store.dispatch('FedLogOut').then(() => {
                router.replace('/login')
            })
        }
        return Promise.reject(data)
    }
)
const request = function (url, option) {
    const newOptions = {
        url,
        ...option
    }
    const method = newOptions.method.toLowerCase()

    newOptions.params = trimObject(newOptions.params)
    newOptions.headers = {
        'Content-Type': !option.dataJson ? 'application/x-www-form-urlencoded' : 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + getToken(),
        ...newOptions.headers
    }

    if (
        method === 'post' ||
        method === 'put' ||
        method === 'patch' ||
        method === 'delete'
    ) {
        if (!(newOptions.params instanceof FormData)) {
            if (!newOptions.data) {
                newOptions.data = !option.dataJson ? stringify(newOptions.params, {indices: false}) : newOptions.params;
            }
        } else {
            // newOptions.body is FormData
            newOptions.data = newOptions.params
        }
        newOptions.method = 'post'
        newOptions.params = {
            _method: method
        }
    }
    return new Promise((resolve, reject) => {
        return service(newOptions).then(i => {
            resolve(i.data)
        }).catch(e => {
            reject(e)
        })
    })
}
// create an axios instance
// const service = axios.create({
//     // baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
//     // baseURL:'', // api 的 base_url
//     timeout: 5000, // request timeout
//     headers: {
//         // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
//     }
// });
//
// // request interceptor
// service.interceptors.request.use(
//     config => {
//         // Do something before request is sent
//         if (store.getters.token) {
//             // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
//             config.headers['X-Token'] = getToken()
//
//         }
//
//         config.headers['Authorization'] = getToken()
//         console.log(config)
//         return config
//     },
//     error => {
//         // Do something with request error
//         console.log(error) // for debug
//         Promise.reject(error)
//     }
// )
//
// // response interceptor
// service.interceptors.response.use(
//     response => response,
//     /**
//      * 下面的注释为通过在response里，自定义code来标示请求状态
//      * 当code返回如下情况则说明权限有问题，登出并返回到登录页
//      * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
//      * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
//      */
//         // response => {
//         //   const res = response.data
//         //   if (res.code !== 20000) {
//         //     Message({
//         //       message: res.message,
//         //       type: 'error',
//         //       duration: 5 * 1000
//         //     })
//         //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//         //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         //       // 请自行在引入 MessageBox
//         //       // import { Message, MessageBox } from 'element-ui'
//         //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//         //         confirmButtonText: '重新登录',
//         //         cancelButtonText: '取消',
//         //         type: 'warning'
//         //       }).then(() => {
//         //         store.dispatch('FedLogOut').then(() => {
//         //           location.reload() // 为了重新实例化vue-router对象 避免bug
//         //         })
//         //       })
//         //     }
//         //     return Promise.reject('error')
//         //   } else {
//         //     return response.data
//         //   }
//         // },
//     error => {
//         console.log('err' + error) // for debug
//         Message({
//             message: error.message,
//             type: 'error',
//             duration: 5 * 1000
//         })
//         return Promise.reject(error)
//     }
// )

export default request
// export default service
