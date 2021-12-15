import 'babel-polyfill';
import Vue from 'vue'
import moment from 'moment';
import 'moment/locale/zh-cn';
// import Element from 'element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css'
// import './styles/element-variables.scss'
import 'viewerjs/dist/viewer.css'
// import '@/styles/variables.scss';
// import '@/styles/mixin.scss';
// import '@/styles/transition.scss';
// import '@/styles/element-ui.scss';
// import '@/styles/sidebar.scss';
// import '@/styles/icon.scss';
// import '@/styles/btn.scss';
// import '@/styles/patch.scss';
// import "@/styles/form-build.scss";
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'


import './components' // 注册全局组件


// import './icons' // icon
// import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data

import plugins from './utils/plugins' // 注册全局插件
// import wholeDirectives from "./directive/index" // 注册全局指令
// import * as filters from './filters' // global filters
Vue.use(plugins);
// Vue.use(wholeComponents);
// Vue.use(wholeDirectives);
// Vue.use(Element, {
//     size: 'mini' // set element-ui default size
// });

// register global utility filters.
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key])
// })

Vue.config.productionTip = false
moment.locale('zh-cn');

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
