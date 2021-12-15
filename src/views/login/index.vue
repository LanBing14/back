<template>
    <div class="login-container">
        <a-form
            ref="loginForm"
            :form="form"
            class="login-form"
            auto-complete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">系统登录</h3>
            </div>
            <a-alert
                v-if="loginError"
                :message="errorTip"
                type="error"
                show-icon
                style="margin-bottom: 18px;"
                @close="handleErrorTipClose"
            />

            <a-form-item prop="username">
        <span class="svg-container">
          <a-icon type="user"/>
        </span>
                <a-input
                    v-decorator="formDecorator.username"
                    placeholder="请输入账号/手机/邮箱"
                    name="username"
                    type="text"
                    auto-complete="on"
                />
            </a-form-item>

            <a-form-item prop="password">
        <span class="svg-container">
          <a-icon type="lock"/>
        </span>
                <a-input
                    :type="passwordType"
                    v-decorator="formDecorator.password"
                    placeholder="请输入密码"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
          <a-icon :type="passwordType?'eye-invisible':'eye'"/>
        </span>
            </a-form-item>

            <a-form-item prop="code">
        <span class="svg-container">
          <a-icon type="lock"/>
        </span>
                <a-input
                    v-decorator="formDecorator.code"
                    placeholder="验证码"
                    name="password"
                    auto-complete="off"
                    @keyup.enter.native="handleLogin"
                />
                <span class="change-code" @click="changeCode">
          <img :src="codeSrc" alt="验证码"/>
        </span>
            </a-form-item>

            <a-button
                :loading="loading"
                type="primary"
                style="width:100%;margin-bottom:30px;"
                @click.native.prevent="handleLogin"
            >登录
            </a-button>
            <!--<div class="tips">-->
            <!--<span>{{ $t('login.username') }} : admin</span>-->
            <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
            <!--</div>-->
            <!--<div class="tips">-->
            <!--<span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>-->
            <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
            <!--</div>-->
            <!--<a-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}-->
            <!--</a-button>-->
        </a-form>
        <!--<el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>-->
        <!--{{ $t('login.thirdpartyTips') }}-->
        <!--<br>-->
        <!--<br>-->
        <!--<br>-->
        <!--<social-sign/>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    // import {encode64} from '@/utils/base64'
    import CryptoJS from "crypto-js";

    export default {
        name: "Login",
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    username: [
                        "username",
                        {rules: [{required: true, message: "账号/手机/邮箱必填"}]}
                    ],
                    password: [
                        "password",
                        {rules: [{required: true, message: "密码必填"}]}
                    ],
                    code: [
                        "code",
                        {
                            rules: [
                                {required: true, message: "验证码必填"},
                                {max: 4, message: "验证码最大长度为4个字"}
                            ]
                        }
                    ]
                },
                key: "deskeyfor#90!she",
                content: "",
                loginForm: {
                    username: "",
                    password: "",
                    code: ""
                },
                //   loginRules: {
                //     username: [
                //       { required: true, trigger: "change", message: "用户名必填" }
                //     ],
                //     password: [{ required: true, trigger: "change", message: "密码必填" }],
                //     code: createRules(
                //       {
                //         msg: "验证码",
                //         required: true,
                //         max: 4
                //       },
                //       "change"
                //     )
                //   },
                passwordType: "password",
                loading: false,
                showDialog: false,
                redirect: undefined,
                randomNum: Math.random(),
                errorTip: undefined,
                loginError: false,
                passwordEditVisible: false
            };
        },
        computed: {
            userStore() {
                return this.$store.state.user;
            },
            codeSrc() {
                return `${this.userStore.codeUrl + this.userStore.loginInfo.randomStr}?${
                    this.randomNum
                }`;
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        created() {
            // window.addEventListener('hashchange', this.afterQRScan)
            // console.log(this.$store.state.app)
            // console.log(this.userStore)
            // this.codeUrl
        },
        destroyed() {
            // window.removeEventListener('hashchange', this.afterQRScan)
        },
        methods: {
            showPwd() {
                if (this.passwordType === "password") {
                    this.passwordType = "";
                } else {
                    this.passwordType = "password";
                }
            },
            changeCode() {
                this.randomNum = Math.random();
            },
            handleLogin() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true;
                        const postData = {...values};
                        postData.password = this.encryptByDES(values.password, this.key);
                        this.$store
                            .dispatch("LoginByUsername", postData)
                            .then(({expires_in, refresh_token}) => {
                                // if (expires_in < 43199) {
                                //     this.$store.dispatch("LoginByUsername", {
                                //         grant_type: 'refresh_token',
                                //         refresh_token
                                //     }).then(() => {
                                //       this.loginSuccess()
                                //     });
                                // } else {
                                this.loginSuccess()
                                // }
                            })
                            .catch(e => {
                                if (this.$isObject(e)) {
                                    this.loginError = true;
                                    this.errorTip = e.error_description;
                                } else {
                                    this.loginError = true;
                                    this.errorTip = e;
                                }
                                this.loading = false;
                            });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            loginSuccess() {
                this.loginError = false;
                this.loading = false;
                this.$router.push({path: this.redirect || "/admin"});
                this.$message.success("登录成功！");
            },
            handleErrorTipClose() {
                this.loginError = false;
            },
            // DES 解密 加密
            encryptByDES(message, key) {
                const keyHex = CryptoJS.enc.Utf8.parse(key);
                const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #eee;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .ant-input input {
            color: $cursor;

            &::first-line {
                color: $light_gray;
            }
        }
    }

    /* reset element-ui css */
    .login-container {
        .ant-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }

        .ant-input:focus {
            box-shadow: none;
        }

        .ant-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    /deep/ .has-error .ant-input, /deep/ .has-error .ant-input:hover {
        background-color: transparent;
    }

    .login-container {
        overflow: auto;
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: $bg;

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 520px;
            max-width: 100%;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 0 13px;
            color: $dark_gray;
            vertical-align: initial;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }

            .set-language {
                color: #fff;
                position: absolute;
                top: 5px;
                right: 0px;
            }
        }

        .show-pwd {
            position: absolute;
            right: -26px;
            top: -11px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 35px;
            bottom: 28px;
        }

        .change-code {
            position: absolute;
            right: -33px;
            top: -10px;
            font-size: 0;
            line-height: normal;
            cursor: pointer;
            user-select: none;
        }

        /deep/ .ant-form-item-with-help {
            margin-bottom: 24px;
        }

        /deep/ .ant-form-explain {
            position: absolute;
            font-size: 13px;
            margin-top: 2px;
            color: #f56c6c;
        }
    }
</style>
