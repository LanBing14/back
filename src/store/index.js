// import Vue from 'vue'
// import Vuex from 'vuex'
// import app from './modules/app'
// import errorLog from './modules/errorLog'
// import permission from './modules/permission'
// import tagsView from './modules/tagsView'
// import user from './modules/user'
// import global from './modules/global'
// import getters from './getters'
//
// Vue.use(Vuex)
//
// const store = new Vuex.Store({
//     modules: {
//         app,
//         errorLog,
//         permission,
//         tagsView,
//         user,
//         global
//     },
//     getters
// })
//
// export default store

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

const store = new Vuex.Store({
    modules,
    getters
})

export default store
