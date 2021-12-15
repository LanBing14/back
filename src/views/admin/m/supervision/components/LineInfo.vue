<template>
    <div>
        <el-form :rules="formRules" ref="form" :model="form" label-width="5em">
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">基础信息</span>
                <span class="r"></span>
            </p>
            <el-form-item label="sql" prop="sql">
                <el-input v-model="form.sql" :rows="4" type="textarea"/>
            </el-form-item>
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">图形线详情</span>
                <span class="r"></span>
            </p>
            <el-form-item label="线形" prop="shape">
                <el-select v-model="form.shape" style="width: 100%;">
                    <el-option label="折线" value="polyline2"></el-option>
                    <el-option label="直线" value="line"></el-option>
                    <el-option label="贝塞尔曲线" value="cubic"></el-option>
                    <el-option label="轻微曲线" value="quadratic"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="虚线" prop="style.lineDash">
                <el-select v-model="form.style.lineDash" style="width: 100%;">
                    <el-option label="—————" value=""></el-option>
                    <el-option label="-------------" value="4 2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="线宽" prop="style.lineWidth">
                <el-input v-model.number="form.style.lineWidth">
                    <el-button slot="append">px</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色" prop="style.stroke">
                <el-color-picker v-model="form.style.stroke" show-alpha></el-color-picker>
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
    name: 'EMonitorInfo',
    props: {
        data: Object
    },
    data () {
        const createRules = this.$createRules
        return {
            formRules: {
                sql: createRules({
                    msg: 'sql',
                    required: true
                })
            },
            form: {
                sql: '',
                shape: '',
                style:{
                    stroke:'',
                    lineWidth: 1,
                    lineDash: ''
                },
            }
        }
    },
    watch: {
        data (val) {
            if (val) {
                this.mergeData(merge({}, val))
            }
        }
    },
    mounted () {
        this.mergeData(merge({}, this.data))
    },
    methods: {
        // 添加锚点
        addPos () {
            this.form.points.push()
        },
        // 删除锚点
        delPos (delIndex) {
            if (this.form.points.length > 1) {
                this.form.points.splice(delIndex, 1)
            }
        },
        // 合并父组件传递过来的默认数据
        mergeData (d) {
            this.form.sql = d.sql
            this.form.shape = d.shape
            this.form.style.stroke = d.style.stroke
            this.form.style.lineWidth = d.style.lineWidth
            this.form.style.lineDash = d.style.lineDash ? d.style.lineDash.join(' ') : ''
        },
        // 保存节点数据
        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const f = merge({}, this.form)
                    const d = {
                        sql: f.sql,
                        shape: f.shape,
                        style: {
                            stroke: f.style.stroke,
                            lineWidth: f.style.lineWidth,
                            lineDash: f.style.lineDash ? f.style.lineDash.split(' ') : ''
                        }
                    }
                    this.$emit('save', this.data.id, d)
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .el-input-group__append {
        .el-select {
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
