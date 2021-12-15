<template>
  <component
    :is="compKey"
    :row="rowData"
    :checkbox-data="checkboxData"
    :visible.sync="visible"
    @ok="handleSure"
  ></component>
</template>

<script>
import { merge } from "lodash"
import custormComponents from "@/utils/custormComponents"

export default {
  name: "Custom",
  components: {
    ...custormComponents
  },
  props: {
    compKey: String, // 组件名
    isOther: Boolean,
    checkboxData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      rowData: {} // 当前详情数据
    }
  },
  methods: {
    openModel(row) {
      this.rowData = merge({}, row)
      this.visible = true
    },
    handleSure() {
      this.$emit("getList")
      if (this.isOther) {
        this.$emit("onOther")
      }
    },
    onClose() {}
  }
}
</script>

<style scoped></style>
