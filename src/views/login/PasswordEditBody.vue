<template>
    <div>
        <div class="logoText">CITGCPLATFORM</div>
        <a-alert
            v-if="!isAutoPwd"
            title="当前密码为默认密码，请进行修改密码！"
            type="warning"
            class="alert-tip"
            :closable="false"
            show-icon>
        </a-alert>
        <div class="edit-wrap">
            <a-form-model :model="formData" :rules="formRules"
                          :label-col="{span: 5}"
                          :wrapper-col="{span: 19}"
                          ref="ruleForm" label-width="100px" style="margin: 0 0 20px 0;">
                <h2 style="font-weight: normal">修改密码</h2>
                <a-form-model-item label="原密码" prop="oldPassword">
                    <a-input v-model="formData.oldPassword" type="password" auto-complete="false"></a-input>
                </a-form-model-item>
                <a-form-model-item label="新密码" prop="newPassword">
                    <a-input v-model="formData.newPassword" type="password" auto-complete="false">
                        <template slot="suffix">
                            <a-tooltip
                                class="item"
                                effect="dark"
                                title="支持大、小写英文、数字、特殊字符(. @ # $ % ^ & *)"
                            >
                                <i class="a-input__icon iconfont icon-info-circle-fill"></i>
                            </a-tooltip>
                        </template>
                    </a-input>
                    <div class="safeLev-wrap">
                        <div :class="{low:safeLev===1,mid:safeLev===2, high:safeLev===3}" class="safeLev-bg"></div>
                        <div class="flex">
                            <div class="flex-primary">低</div>
                            <div class="flex-primary">中</div>
                            <div class="flex-primary">高</div>
                        </div>
                    </div>
                </a-form-model-item>
            </a-form-model>
            <div style="text-align: center">
                <a-button type="primary" @click="save" :loading="loginLoading">保存修改</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Api_UserEditPassword } from '@/api/login'

export default {
    name: 'PasswordEdit',
    data () {
        const createRules = this.$createRules
        return {
            visible: false,
            loginLoading: false,
            isAutoPwd: true,
            formData: {
                oldPassword: '',
                newPassword: ''
            },
            formRules: {
                oldPassword: createRules({
                    msg: '原密码',
                    required: true
                }),
                newPassword: createRules({
                    msg: '新密码',
                    required: true,
                    min: 6,
                    validator: this.validatorNew
                })
            },
            verify: [ // 验证新密码规则
                /[0-9]+/, // 数字
                /[a-z]+/, // 英文(小)
                /[A-Z]+/, // 英文(大)
                /[\.\$\*\?\^!@#%&]+/ // 英文(大)
            ],
            safeLev: 1 // 密码安全等级
        }
    },
    mounted () {
        this.isAutoPwd = this.$route.query.hasOwnProperty('a')
    },
    methods: {
        openModel () {
            this.visible = true
        },
        save () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (this.safeLev === 1) {
                        this.$message.warning('密码安全等级至少为中级！')
                        return
                    }
                    // dssdsdsdsd@
                    Api_UserEditPassword(this.formData).then(res => {
                        this.$message.success(res + '请重新登录！')
                        this.$router.replace({
                            path: '/login'
                        })
                    })
                }
            })
        },
        validatorNew (rule, value, callback) {
            if (value === '') {
                this.safeLev = 1
                callback(new Error('请输入新密码'))
            } else {
                let verifyNum = 0
                this.verify.forEach(item => {
                    if (item.test(value)) {
                        verifyNum++
                    }
                })
                switch (verifyNum) {
                    case 0:
                    case 1:
                    case 2:
                        this.safeLev = 1
                        break
                    case 3:
                        this.safeLev = 2
                        break
                    case 4:
                        this.safeLev = 3
                        break
                }
                this.safeLev = verifyNum
                if (verifyNum < 2) {
                    callback(new Error('请至少输入两种类型字符的密码'))
                } else {
                    callback()
                }
            }
        },
        onClose () {

        }
    }
}
</script>
<style>
    #app {
        background-color: #f5f7fa;
    }
</style>
<style scoped lang="scss">
    .alert-tip{
        width: 50%;
        margin: 40px auto;
    }
    .logoText {
        color: #2c75d4;
        background-color: #fff;
        padding: 15px 20px 16px 44px;
        font-size: 22px;
        box-shadow: 0 5px 7px rgba(0, 0, 0, .1);
    }

    .edit-wrap {
        background-color: #fff;
        max-width: 402px;
        height: 300px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        box-shadow: 0 0 6px rgba(0, 0, 0, .6);
        margin: 50px auto;
        padding: 15px;
        position: relative;
    }

    .login-container .a-form-model-item {
        border: none;
        background: transparent;
        color: #454545;
    }

    .login-container .a-input input {
        border: 1px solid #dcdfe6;
    }

    .safeLev-wrap {
        margin-top: 15px;
        position: relative;

        .flex {
            position: relative;
            z-index: 10;
        }

        & > div > div {
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #dcdfe6;

            & + div {
                border-left-color: transparent;
            }
        }

        .safeLev-bg {
            position: absolute;
            top: 0;
            width: 33.33%;
            height: 30px;
            transition: all 0.2s;
        }

        .low {
            background-color: red;
            left: 0;
        }

        .mid {
            background-color: wheat;
            left: 33.33%;
        }

        .high {
            background-color: palegreen;
            left: 66.66%;
        }
    }
</style>
