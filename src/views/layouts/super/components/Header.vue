<template>
    <div class="header-wrap">
        <div class="content">
            <h1 class="sys-title">系统名称系统名称</h1>
            <div class="c">
                <el-row>
                    <el-col :span="3">
                        <div class="user-head-pic"></div>
                    </el-col>
                    <el-col :span="12">
                        <div class="clearfix">
                            <div class="info-item"><span>姓名：</span><span>张三丰</span></div>
                            <div class="info-item"><span>年龄：</span><span>123</span></div>
                            <div class="info-item"><span>电话：</span><span>0001101110</span></div>
                            <div class="info-item"><span>住址：</span><span>天上人间</span></div>
                        </div>
                    </el-col>
                    <el-col :span="9">
                        <div class="btn-wrap">
                            <el-button class="btn" icon="el-icon-search">搜索</el-button>
                        </div>
                        <div class="btn-wrap">
                            <el-button class="btn" icon="el-icon-unlock">修改密码</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style scoped lang="scss">
    @import "src/styles/mixin.scss";

    .header-wrap {
        height: 340px;
        background: url("~@/assets/super/header_bg.png") no-repeat center;
        background-size: cover;
        color: #fff;

        .content {
            @include superContent;
        }

        .sys-title {
            margin: 0;
            padding: 20px 0;
            text-shadow: 0 2px 3px #333;
        }

        .user-head-pic {
            width: 80px;
            height: 80px;
            background-color: palegreen;
            border-radius: 50%;
            overflow: hidden;
        }

        .info-item {
            float: left;
            width: 50%;
            margin-bottom: 24px;
            color: rgba(255, 255, 255, .9);
        }

        .btn-wrap {
            text-align: right;
            margin-bottom: 27px;

            button {
                min-width: 100px;
                text-align: left;
                color: #00BFF3;
                height: 35px;
            }
        }
    }
</style>
