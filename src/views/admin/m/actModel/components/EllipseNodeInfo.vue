<template>
    <div>
        <a-form ref="form" :form="form" :labelCol="labelCol"
                :wrapperCol="wrapperCol">
            <!--            <p class="form-info-split">-->
            <!--                <span class="l"></span>-->
            <!--                <span class="t">节点详情</span>-->
            <!--                <span class="r"></span>-->
            <!--            </p>-->
            <a-form-item label="节点名称">
                <a-input v-decorator="formDecorator.name"/>
            </a-form-item>
            <!--<a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="角色">
                <a-select v-decorator="formDecorator.roleId" placeholder="请选择">
                    <a-select-option
                        v-for="item in roleIdOptions"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否同部门">
                <a-switch v-decorator="formDecorator.dept"/>
            </a-form-item>-->
            <!--<p class="form-info-split">
                <span class="l"></span>
                <span class="t">节点图形基础信息</span>
                <span class="r"></span>
            </p>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="文本颜色">
                <ColorPicker v-decorator="formDecorator.fill" show-alpha size="small"
                             style="margin-top: 4px;"></ColorPicker>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="字体大小">
                <a-input v-decorator="formDecorator.size"></a-input>
            </a-form-item>-->
        </a-form>
        <div style="text-align: center">
            <a-button type="primary" @click="save">保存节点信息</a-button>
        </div>
    </div>
</template>

<script>
    import { merge } from 'lodash'
    import {Api_RolesCombobox} from "@/api/admin/system";
    export default {
        name: 'TextInfo',
        props: {
            data: Object
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
                    ]
                },
                labelCol: {span: 5},
                wrapperCol: {span: 19},
                formKeyOptions: [], // 表单下拉框数据
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
                this.form.setFieldsValue({
                    name: d.label
                })
            },
            // 保存节点数据
            save() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        // const {metaInfo} = this.selectData
                        // const metaInfoJSON = JSON.parse(metaInfo)
                        this.$emit('save', this.data.id, {
                            ...this.data,
                            label: values.name,
                            data: {
                                id: this.data.id,
                                type: 'endTask',
                                name: values.name,
                                // formKey: metaInfoJSON.formKey || '',
                                // callback: metaInfoJSON.callback || '',
                            }
                        })
                    }
                })

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
