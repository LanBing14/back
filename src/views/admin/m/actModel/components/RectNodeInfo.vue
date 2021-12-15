<template>
    <div>
        <a-form ref="form" :form="form">
            <!--            <p class="form-info-split">-->
            <!--                <span class="l"></span>-->
            <!--                <span class="t">节点详情</span>-->
            <!--                <span class="r"></span>-->
            <!--            </p>-->
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="节点名称">
                <a-input v-decorator="formDecorator.name"/>
            </a-form-item>
        </a-form>
        <div style="text-align: center">
            <a-button type="primary" @click="save">保存节点信息</a-button>
        </div>
        <IconSelect ref="refIconSelect" :defaultSelect="form.icon" @handleOk="onIconOk"/>
    </div>
</template>

<script>
    import {merge} from 'lodash'
    import {Chrome as ChromePicker} from 'vue-color'
    import IconSelect from '@/components/IconSelect'
    import {Api_FormFormsCombobox, Api_ActModelGetCheckPerson} from '@/api/admin/m/index'

    export default {
        name: 'RectNodeInfo',
        components: {IconSelect, ChromePicker},
        props: {
            data: Object, // 节点数据
            selectData: Object // 列表中的当前行数据
        },
        data() {
            const createRules = this.$createRules
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    name: [
                        "name",
                        {
                            rules: createRules({
                                msg: "节点名称",
                                required: true,
                                max: 80
                            })
                        }
                    ],
                    // userIds: [
                    //     "userIds",
                    //     {
                    //         initialValue: [],
                    //         rules: createRules({
                    //             msg: "审核人",
                    //             required: true
                    //         }, 'change', 'array')
                    //     }
                    // ],
                },
                labelCol: {span: 5},
                wrapperCol: {span: 19},
                anchorPoints: [], // 节点的锚点信息，不用修改，接收即返回
                showCtrlPoints: false, // 是否显示锚点控制配置
                formKeyOptions: [], // 表单下拉框数据
                checkPersonOptions: [] // 审核人下拉框数据
            }
        },
        watch: {
            data(val) {
                if (val) {
                    this.mergeData(merge({}, val))
                }
            }
        },
        mounted() {
            Api_ActModelGetCheckPerson(this.$store.getters.selectSaasCode).then(res => {
                this.checkPersonOptions = res
            })
            this.mergeData(merge({}, this.data))
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData(d) {
                this.form.setFieldsValue({
                    name: d.label,
                    // userIds: d.data.userIds ? d.data.userIds : []
                })
            },
            // 保存节点数据
            save() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {metaInfo} = this.selectData
                        const metaInfoJSON = JSON.parse(metaInfo)
                        this.$emit('save', this.data.id, {
                            ...this.data,
                            label: values.name,
                            data: {
                                id: this.data.id,
                                type: 'startTask',
                                name: values.name,
                                // userIds: values.userIds || [],
                                formKey: metaInfoJSON.formKey || '',
                                callback: metaInfoJSON.callback || '',
                            }
                        })
                    }
                })
            },
            // 打开选择图标窗口
            selectIcon() {
                this.$refs.refIconSelect.openModel()
            },
            // 图标选择确定
            onIconOk({code}) {
                this.form.setFieldsValue({
                    icon: code
                })
                // this.form.icon = code
            },
            // 删除图标
            deleteIcon() {
                this.form.setFieldsValue({
                    icon: '',
                    iconColor: ''
                })
                // this.form.icon = ''
                // this.form.iconColor = ''
            },
            // addConditions() {
            //     this.form.conditions.push({})
            // },
            // delConditions(index) {
            //     if (this.form.conditions.length > 1) {
            //         this.form.conditions.splice(index, 1)
            //     }
            // },

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
