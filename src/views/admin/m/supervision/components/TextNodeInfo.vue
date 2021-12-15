<template>
    <div>
        <el-form ref="form" :model="form" label-width="5em">
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点详情</span>
                <span class="r"></span>
            </p>
            <el-form-item label="节点名称" prop="label">
                <el-input v-model="form.label" />
            </el-form-item>
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点图形基础信息</span>
                <span class="r"></span>
            </p>
            <el-form-item label="文本颜色" prop="fill">
                <el-color-picker v-model="form.fill" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="字体大小" prop="fontSize">
                <el-input v-model="form.size"></el-input>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="save">保存节点信息</el-button>
        </div>
    </div>
</template>

<script>
    import { merge } from 'lodash'
    export default {
        name: 'TextInfo',
        props: {
            data: Object
        },
        data() {
            return {
                form: {
                    label: '',
                    fill: '',
                    size: ''
                }
            }
        },
        watch: {
            data(val) {
                this.mergeData(merge({}, val))
            }
        },
        mounted() {
            this.mergeData(merge({}, this.data))
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData(d) {
                this.form.label = d.label
                this.form.fill = d.fill
                this.form.size = d.size
            },
            // 保存节点数据
            save() {
                this.$emit('save', this.data.id, merge({}, this.form))
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-input-group__append{
        .el-select{
            width: 65px;
        }
    }
    .form-info-split {
        color: #999;
        font-size: 12px;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;

        .l, .r {
            flex: 1;
            border-top: 1px dashed currentColor;
        }

        .t {
            margin: 0 8px;
        }
    }

    .border-wrap {
        display: inline-block;
        width: 80px;
        margin-right: 10px;

        .el-form-item {
            margin-bottom: 0;
        }
    }

    .el-color-picker {
        vertical-align: middle;
    }

    .list-item {
        display: flex;

        & > div {
            flex: 1;
            text-align: center;
            padding: 0 5px;
        }

        /deep/ .el-form-item__label {
            width: 100% !important;
        }

        .action {
            flex: initial;
            margin-right: 0;

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }

    .label-right /deep/ {
        label {
            text-align: center;
        }
    }
</style>
