<template>
    <div>
        <el-form ref="form" :rules="formRules" :model="form" label-width="5em">
            <p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点详情</span>
                <span class="r"></span>
            </p>
            <el-form-item label="节点名称" prop="name">
                <el-input v-model="form.label"/>
            </el-form-item>
            <el-form-item label="表单" prop="formId">
                <el-select v-model="form.formId">
                    <el-option
                        v-for="item in formIdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="统计块">
                <div v-for="(domain, index) in form.conditions" :key="index" class="list-item">
                    <el-form-item
                        :prop="'conditions.' + index + '.min'"
                        :rules="$createRules({
                             msg: '最小值',
                             float: true
                        })"
                    >
                        <el-input v-model="domain.min" placeholder="最小值"/>
                    </el-form-item>
                    <div style="flex: 0;height: 28px;line-height: 28px;font-size: 18px;margin: 0 5px 26px;">
                        <el-tooltip content="大于等于左侧，小于等于右侧" class="item" effect="dark">
                            <span>~</span>
                        </el-tooltip>
                    </div>
                    <el-form-item
                        :prop="'conditions.' + index + '.max'"
                        :rules="$createRules({
                             msg: '最小值',
                             float: true
                        })"
                    >
                        <el-input v-model="domain.max" placeholder="最大值"/>
                    </el-form-item>
                    <el-form-item
                        :prop="'conditions.' + index + '.color'"
                        style="width: 40px; flex: none;"
                    >
                        <el-color-picker v-model="domain.color" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item class="action">
                        <el-button type="success" icon="el-icon-plus" circle @click="addConditions"/>
                        <el-button icon="el-icon-minus" circle @click="delConditions(index)"/>
                        <!--                        <i class="el-icon-plus" @click="addConditions"></i>-->
                        <!--                        <i class="el-icon-minus" @click="delConditions(index)"></i>-->
                    </el-form-item>
                </div>
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
            <el-form-item label="圆角" prop="radius">
                <el-input v-model.number="form.radius">
                    <el-button slot="append">px</el-button>
                    <!--                    <el-select v-model="form.radiusUnit" slot="append">-->
                    <!--                        <el-option label="px" value="px"></el-option>-->
                    <!--                    </el-select>-->
                </el-input>
            </el-form-item>
            <el-form-item label="边框" prop="radius">
                <div class="flex">
                    <div class="border-wrap flex-primary" style="display: inline-block;">
                        <el-form-item prop="lineWidth" label-width="0">
                            <el-input v-model.number="form.lineWidth">
                                <el-button slot="append">px</el-button>
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-color-picker v-model="form.stroke" show-alpha></el-color-picker>
                </div>
            </el-form-item>
            <el-form-item label="图标" prop="icon" class="icon-choose-wrap">
                <template v-if="form.icon">
<!--                    <i :class="iconName" :style="{color:form.iconColor}" class="iconfont"></i>-->
                    <i :style="{color:form.iconColor}" class="iconfont" v-html="form.icon"></i>
                    <el-button type="primary" @click="deleteIcon">删除图标</el-button>
                    <!--                    <el-tooltip content="清除图标" class="item" effect="dark">-->
                    <!--                        <i class="iconfont icon-close-circle" @click="deleteIcon"></i>-->
                    <!--                    </el-tooltip>-->
                </template>
                <el-button type="primary" @click="selectIcon">选择图标</el-button>
                <el-color-picker v-model="form.iconColor" show-alpha></el-color-picker>
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
        <IconSelect ref="refIconSelect" :defaultSelect="form.icon" @handleOk="onIconOk"/>
    </div>
</template>

<script>
import { merge } from 'lodash'
import IconSelect from '@/components/IconSelect'
import { Api_FormFormsCombobox } from '@/api/admin/m/index'
import { switchColors } from '@/utils/variables'

export default {
    name: 'RectNodeInfo',
    components: { IconSelect },
    props: {
        data: Object
    },
    data () {
        const createRules = this.$createRules
        return {
            switchColors,
            showCtrlPoints: false, // 是否显示锚点控制配置
            formIdOptions: [],
            formRules: {
                formId: createRules({
                    msg: '表单ID',
                    required: true
                })
            },
            form: {
                icon: '',
                iconColor: '',
                label: '',
                labelColor: '',
                size: {
                    w: '',
                    h: ''
                },
                radius: '',
                fill: '',
                lineWidth: '',
                stroke: '',
                formId: '',
                conditions: [{}],
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
        Api_FormFormsCombobox(0).then(res => {
            this.formIdOptions = res
        })
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
                } else if (key === 'conditions' || key === 'anchorPoints') {
                    this.form[key] = [{
                        min: '',
                        max: '',
                        color: ''
                    }]
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
        },
        // 打开选择图标窗口
        selectIcon () {
            this.$refs.refIconSelect.openModel()
        },
        // 删除图标
        deleteIcon () {
            this.form.icon = ''
            this.form.iconColor = ''
        },
        addConditions () {
            this.form.conditions.push({})
        },
        delConditions (index) {
            if (this.form.conditions.length > 1) {
                this.form.conditions.splice(index, 1)
            }
        },
        // 图标选择确定
        onIconOk ({code}) {
            this.form.icon = code
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
        align-items: center;

        & > div {
            flex: 1;
            text-align: center;
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

    .icon-choose-wrap i {
        color: #000;
    }

    .label-right /deep/ {
        label {
            text-align: center;
        }
    }
</style>
