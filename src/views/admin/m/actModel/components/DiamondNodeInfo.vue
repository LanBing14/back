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
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="审核人">
                <a-select v-decorator="formDecorator.userIds" mode="multiple" placeholder="请选择">
                    <a-select-option
                        v-for="item in checkPersonOptions"
                        :key="item.id"
                        :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="角色">
                <a-select v-decorator="formDecorator.roleIds" mode="multiple" placeholder="请选择">
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
            </a-form-item>
        </a-form>
        <div style="text-align: center">
            <a-button type="primary" @click="save">保存节点信息</a-button>
        </div>
    </div>
</template>

<script>
    import {merge} from 'lodash'
    import {Api_RolesCombobox} from '@/api/admin/system/index'
    import {Api_ActModelGetCheckPerson} from "@/api/admin/m";

    export default {
        name: 'EMonitorInfo',
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
                    dept: [
                        "dept",
                        {
                            initialValue: false,
                            valuePropName: 'checked'
                        }
                    ],
                    roleIds: [
                        "roleIds",
                        {
                            initialValue: [],
                            rules: createRules({
                                msg: "角色",
                                // required: true
                            }, 'change', 'array')
                        }
                    ],
                    userIds: [
                        "userIds",
                        {
                            initialValue: [],
                            rules: createRules({
                                msg: "审核人",
                                // required: true
                            }, 'change', 'array')
                        }
                    ]
                },
                labelCol: {span: 5},
                wrapperCol: {span: 19},
                roleIdOptions: [], // 角色下拉框数据
                checkPersonOptions: [], // 审核人下拉框数据
                formKeyOptions: [], // 表单下拉框数据
                anchorPoints: [], // 节点的锚点信息，不用修改，接收即返回
                showCtrlPoints: false, // 是否显示锚点控制配置
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
            Api_RolesCombobox({
                saasCode: this.$store.getters.selectSaasCode
            }).then(res => {
                this.roleIdOptions = res
            })
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
                    dept: d.data.dept,
                    roleIds: d.data.roleIds ? d.data.roleIds : [],
                    userIds: d.data.userIds ? d.data.userIds : [],
                })
            },
            // 保存节点数据
            save() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        if(!values.userIds.length && !values.roleIds.length){
                            this.$message.warning('“审核人”和“角色”必须选择一项')
                            return
                        }
                        const {metaInfo} = this.selectData
                        const metaInfoJSON = JSON.parse(metaInfo)
                        this.$emit('save', this.data.id, {
                            ...this.data,
                            label: values.name,
                            data: {
                                id: this.data.id,
                                type: 'userTask',
                                name: values.name,
                                dept: values.dept || false,
                                userIds: values.userIds || [],
                                roleIds: values.roleIds || [],
                                formKey: metaInfoJSON ? metaInfoJSON.formKey : '',
                                callback: metaInfoJSON ? metaInfoJSON.callback : '',
                            }
                        })
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
