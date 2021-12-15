<template>
    <Drawer
        ref="drawer"
        :title="modelStatus"
        :visible.sync="visible"
        :onOk="createData"
        @close="onClose"
    >
        <a-form-model
            ref="form"
            :model="addFormData"
        >
            <div
                :wrapper-col="{span: 24}"
                class="authority-list"
            >
                <a-row :gutter="20" class="t">
                    <a-col :span="10">
                        <a-form-model-item
                            :label-col="{span: 24}"
                            label="权限编码"
                            style="text-align: center;line-height: 40px;margin-bottom: 0;"
                        />
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item
                            :label-col="{span: 24}"
                            label="权限值"
                            style="text-align: center;line-height: 40px;margin-bottom: 0;"
                        />
                    </a-col>
                    <a-col :span="4">
                        <a-form-model-item :label-col="{span: 0}" style="margin-bottom: 0;">
                            <a-button type="primary" icon="plus" shape="circle" @click="add"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row v-for="(domain, index) in addFormData.permissions" :key="domain.uid" :gutter="20">
                    <a-col :span="10">
                        <a-form-model-item :prop="`permissions.${index}.id`" :rules="[
                                  { required: true, message: '请输入权限编码', trigger: 'change' },
                                  { max:50, message: '权限编码最大长度50', trigger: 'change' },
                                  {validator:validatorCode, trigger: 'change' }
                                ]">
                            <a-input v-model="domain.id"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item :prop="`permissions.${index}.name`" :rules="[
                                  { required: true, message: '请输入权限值', trigger: 'change' },
                                  { max:100, message: '权限值最大长度100', trigger: 'change' }
                                ]">
                            <a-input v-model="domain.name"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-model-item>
                            <a-button icon="minus" shape="circle" @click="del(index)"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </div>
        </a-form-model>
    </Drawer>
</template>

<script>
    import {merge} from 'lodash'
    import {
        Api_MenuUpdateAuthority
    } from '@/api/admin/system/index';

    export default {
        name: 'Authority',
        props: {
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                visible: false,
                // 表单验证规则
                addFormRules: {},
                addFormData: {
                    saasCode: undefined,
                    permissions: [{
                        uid: +new Date(),
                        id: '',
                        name: ''
                    }]
                }
            };
        },
        computed: {
            p() {
                return merge([], this.selectData.permissions);
            },
            modelStatus() {
                return `菜单"${this.selectData.name}"授权`
            }
        },
        methods: {
            // 打开模态框
            openModel() {
                this.visible = true;
                this.$nextTick(() => {
                    this.addFormData.permissions = merge([], this.selectData.permissions)
                })
            },
            // 创建或更新授权数据
            createData() {
                const {id} = this.selectData;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const postData = this.addFormData
                        const permissionsDatas = postData.permissions.map(item => {
                            return `${item.id};${item.name}`;
                        });
                        const loading = this.$openLoading();
                        Api_MenuUpdateAuthority(id, {
                            permissions: permissionsDatas.join(',')
                        }).then(msg => {
                            this.visible = false;
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                            this.close()
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            // 验证是否有中文
            validatorCode(rule, value, callback) {
                if (value === '') {
                    callback(new Error('权限编码不能含有中文'));
                } else {
                    var regex = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
                    if ((regex.test(value))) {
                        callback(new Error('权限编码不能含有中文'));
                    } else {
                        callback();
                    }
                }
            },
            // 添加授权
            add() {
                this.addFormData.permissions.push({
                    uid: +new Date(),
                    id: '',
                    name: ''
                })
            },
            // 删除授权
            del(index) {
                this.addFormData.permissions.splice(index, 1)
            },
            // 模态框关闭时
            onClose() {
                this.$refs.form.resetFields()
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .authority-list {
        .t {
            .ant-form-item-label {
                text-align: center;
            }
        }

        div {
            &::after {
                content: '';
                display: block;
                clear: both;
            }
        }

        .el-form-item {
            float: left;
            margin-right: 10px;

            label {
                text-align: center;
                padding-right: 0;
            }
        }

    }
</style>
