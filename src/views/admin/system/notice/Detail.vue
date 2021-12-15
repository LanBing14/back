<template>
<a-modal
    title="公告详情"
    v-model="noticeDetailVisible"
    :modal="false"
    :close-on-click-modal="false"
    fullscreen
    @close="close"
>
    <div class="wrap">
        <div class="top-body">
            <h3 class="title">{{ noticeData.title }}</h3>
            <div class="sub-title">
                <span>发布人：{{ noticeData.creator }}</span>&nbsp;&nbsp;
                <span>发布时间：{{ noticeData.publishTime }}</span>&nbsp;&nbsp;
                <span>浏览次数：{{ noticeData.viewTimes }}</span>
            </div>
            <div v-html="noticeData.txt" class="content" ></div>
            <div v-if="!noticeData.txt" class="content-nothing">
                <img src="../../../../assets/images/word-nothing.png" alt="">
            </div>
        </div>
        <div class="files-info">
            <p class="files-info-tip">附件信息：</p>
            <ul>
                <li
                    v-for="el in noticeData.attachments"
                    :key="el.id"
                >
                    <span>{{ el.originalName }}</span>
                    <a :href="el.url" target="_blank" download>
                        <a-button type="primary" icon="download">下载</a-button>
                    </a>
                </li>
            </ul>
            <a-alert
                v-if="!noticeData.attachments"
                :closable="false"
                title="暂无附件"
                type="info">
            </a-alert>
        </div>
    </div>
</a-modal>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'NoticeDetail',
        // filters: {
        //     turnDate(val) {
        //         console.log(this)
        //         return this.$dateFormat(val)
        //     }
        // },
        computed: {
            ...mapGetters([
                'noticeDetailVisible',
                'noticeDetailData'
            ]),
            noticeData() {
                return this.noticeDetailData
            }
        },
        methods: {
            close() {
                this.$store.commit('TOGGLE_noticeDetailVisible', false)
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
