<template>
    <a-modal
        title="站内信详情"
        :visible="mailDetailVisible"
        :modal="false"
        :close-on-click-modal="false"
        fullscreen
        width="80%"
        @cancel="close"
    >
        <div class="wrap">
            <div class="top-body">
                <h3 class="title">{{ mailData.title }}</h3>
                <div class="sub-title">
                    <span>发送人：{{ mailData.senderName }}</span>&nbsp;&nbsp;
                    <span>发送时间：{{ mailData.sendTime }}</span>&nbsp;&nbsp;
                    <span>浏览次数：{{ mailData.viewTimes }}</span>
                </div>
                <div class="content" v-html="mailData.txt"></div>
                <div v-if="!mailData.txt" class="content-nothing">
                    <img src="../../../../assets/images/word-nothing.png" alt="">
                </div>
            </div>

            <div class="files-info">
                <p class="files-info-tip">附件信息：</p>
                <ul>
                    <li
                        v-for="el in mailData.attachments"
                        :key="el.id"
                    >
                        <span>{{ el.originalName }}</span>
                        <a :href="el.url" target="_blank" download>
                            <a-button type="primary" icon="download">下载</a-button>
                        </a>
                    </li>
                </ul>
                <a-alert
                    v-if="!mailData.attachments"
                    :closable="false"
                    message="暂无附件"
                    type="info">
                </a-alert>
            </div>
        </div>
        <div slot="footer">
            <a-button @click="close">取消</a-button>
        </div>
    </a-modal>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'MailDetail',
        computed: {
            ...mapGetters([
                'mailDetailVisible',
                'mailDetailData'
            ]),
            mailData() {
                return this.mailDetailData
            }
        },
        methods: {
            close() {
                this.$store.commit('TOGGLE_mailDetailVisible', false)
            }
        }
    }
</script>

<style scoped lang="scss">
    /deep/ .el-dialog {
        line-height: normal;
    }

    /deep/ .el-dialog__body {
        padding-top: 0;
    }

    .wrap {
        line-height: normal;

        .top-body {
            background-color: #eee;
            padding: 20px;
            margin-top: 10px;
        }
    }

    .title {
        margin-top: 0;
    }

    .title, .sub-title {
        text-align: center;
    }

    .content {
        padding: 15px 0;

        p {
            margin: 0;
        }
    }

    .files-info {
        margin-top: 35px;

        .files-info-tip {
            margin-bottom: 4px;
        }

        ul {
            margin-top: 0;
            list-style: none;
            padding-left: 0;

            li {
                a {

                }
            }
        }
    }
</style>
