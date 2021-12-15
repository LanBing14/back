import drag from "./el-dragDialog/drag"

const directives = [{ name: "el-drag-dialog", dir: drag }]

export default {
  install(Vue) {
    directives.forEach(d => {
      Vue.directive(d.name, d.dir)
    })
  }
}
