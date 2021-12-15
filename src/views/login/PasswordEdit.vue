<template>
    <el-dialog
        ref="drawer"
        title="修改密码"
        :visible.sync="visible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="500px"
    >
        <PasswordEditBody @success="saveSuccess"></PasswordEditBody>
        <!--            <div slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="visible = false">-->
        <!--                    取 消-->
        <!--                </el-button>-->
        <!--                <el-button type="primary" @click="handleSure()">-->
        <!--                    确 定-->
        <!--                </el-button>-->
        <!--            </div>-->
    </el-dialog>
</template>

<script>
import PasswordEditBody from './PasswordEditBody'

export default {
    name: 'PasswordEdit',
    components: {
        PasswordEditBody
    },
    props: {
        isAutoPwd: Boolean
    },
    data () {
        return {
            visible: false
        }
    },
    mounted () {
        if (!this.isAutoPwd) {
            this.visible = true
        }
    },
    methods: {
        openModel () {
            this.visible = true
        },
        saveSuccess () {

        }
    }
}
</script>

<style scoped lang="scss">
    .edit-wrap {
        max-width: 400px;
        height: 300px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        box-shadow: 0 0 6px rgba(0, 0, 0, .6);
        margin: auto;
        padding: 15px;
        position: relative;
        top: 100px;
    }

    .login-container .el-form-item {
        border: none;
        background: transparent;
        color: #454545;
    }

    .login-container .el-input input {
        border: 1px solid #dcdfe6;
    }

    .safeLev-wrap {
        margin-top: 15px;
        position: relative;

        & > div {
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
            width: 90px;
            height: 30px;
            transition: all 0.2s;
            z-index: -1;
        }

        .low {
            background-color: red;
            left: 0;
        }

        .mid {
            background-color: wheat;
            left: 90px;
        }

        .high {
            background-color: palegreen;
            left: 180px;
        }
    }
</style>
