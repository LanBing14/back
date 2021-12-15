<template>
    <div>
        <el-form ref="form" :model="form" label-width="5em">
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点详情</span>
                <span class="r"></span>
            </p>
            <el-form-item label="节点名称" prop="label">
                <el-input v-model="form.label"/>
            </el-form-item>
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点图形基础信息</span>
                <span class="r"></span>
            </p>
            <el-form-item label="宽度" prop="size.w">
                <el-input v-model.number="form.size.w">
                    <el-button slot="append">px</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="高度" prop="size.h">
                <el-input v-model.number="form.size.h">
                    <el-button slot="append">px</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="边框">
                <div class="flex">
                    <div class="border-wrap flex-primary" style="display: inline-block;">
                        <el-form-item prop="lineWidth" label-width="0">
                            <el-input v-model.number="form.lineWidth"/>
                        </el-form-item>
                    </div>
                    <el-color-picker v-model="form.stroke" show-alpha></el-color-picker>
                </div>
            </el-form-item>
            <el-form-item label="文本颜色" prop="labelColor">
                <el-color-picker v-model="form.labelColor" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色" prop="fill">
                <el-color-picker v-model="form.fill" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="锚点配置">
                <el-switch
                    v-model="showCtrlPoints"
                    :active-color="switchColors.active"
                    :inactive-color="switchColors.inactive"
                    style="margin-top: 4px;"
                />
            </el-form-item>
            <template v-if="showCtrlPoints">
                <p class="form-info-split">
                    <span class="l"></span>
                    <span class="t">节点图形锚点信息</span>
                    <span class="r"></span>
                </p>
                <el-form-item label-width="0">
                    <div class="label-right list-item" style="margin-bottom: 10px;">
                        <div style="text-align: center;padding-right: 4px;">锚点x</div>
                        <div style="text-align: center;padding-left: 4px;">锚点y</div>
                        <div class="action" style="width: 60px;">
                            <el-button type="success" icon="el-icon-plus" circle style="opacity: 0;z-index: -1;position: relative;"/>
                            <el-button icon="el-icon-minus" circle style="opacity: 0;z-index: -1;position: relative;"/>
                        </div>
                    </div>
                    <div v-for="(domain, index) in form.anchorPoints" :key="domain.key" class="list-item">
                        <el-form-item
                            :prop="'anchorPoints.' + index + '.x'"
                            style="padding-right: 4px;"
                        >
                            <el-input v-model="domain.x"/>
                        </el-form-item>
                        <el-form-item
                            :prop="'anchorPoints.' + index + '.y'"
                            style="padding-left: 4px;"
                        >
                            <el-input v-model="domain.y"/>
                        </el-form-item>
                        <el-form-item class="action" style="width: 60px;">
                            <el-button type="success" icon="el-icon-plus" circle @click="addPos"/>
                            <el-button icon="el-icon-minus" circle @click="delPos(index)"/>
                        </el-form-item>
                    </div>
                </el-form-item>
            </template>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="save">保存节点信息</el-button>
        </div>
    </div>
</template>

<script>
import { merge } from 'lodash'
import { switchColors } from '@/utils/variables'

export default {
    name: 'EMonitorInfo',
    props: {
        data: Object
    },
    data () {
        return {
            switchColors,
            showCtrlPoints: false, // 是否显示锚点控制配置
            form: {
                label: '',
                labelColor: '',
                size: {
                    w: '',
                    h: ''
                },
                fill: '',
                lineWidth: '',
                stroke: '',
                anchorPoints: [
                    {
                        x: '',
                        y: ''
                    }]
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
            this.form.anchorPoints.push({})
        },
        // 删除锚点
        delPos (delIndex) {
            this.form.anchorPoints.splice(delIndex, 1)
        },
        // 合并父组件传递过来的默认数据
        mergeData (d) {
            for (const key in this.form) {
                if (key === 'size') {
                    this.form[key].w = ''
                    this.form[key].h = ''
                } else if (key === 'anchorPoints') {
                    this.form[key] = [{}]
                } else {
                    this.form[key] = ''
                }
            }
            const anchorPoints = d.anchorPoints.map(item => ({
                x: item[0],
                y: item[1]
            }))
            merge(this.form, {
                ...d,
                anchorPoints,
                size: {
                    w: d.size[0],
                    h: d.size[1]
                }
            })
        },
        // 保存节点数据
        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const formData = merge({}, this.form)
                    formData.anchorPoints = formData.anchorPoints.map(item => ([item.x, item.y]))
                    formData.size = [formData.size.w, formData.size.h]
                    this.$emit('save', this.data.id, formData)
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
            button {
                padding: 2px;
                height: 20px;
                position: relative;
                top: 3px;
            }
        }
    }

    .label-right /deep/ {
        label {
            text-align: center;
        }
    }
</style>
