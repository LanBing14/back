<template>
    <div class="page-head-wrap">
        <div class="title-infos">
            <div class="title">
                <span class="titleText">{{ titleText }}</span>
                <breadcrumb class="breadcrumb-container"/>
            </div>
            <div class="actions">
                <a-button
                    v-for="(el, $index) in actionBtns"
                    :key="$index"
                    :icon="el.icon"
                    :type="el.type || 'primary'"
                    class="filter-item"
                    plain
                    @click="el.click"
                >
                    {{ el.text }}
                </a-button>
            </div>
        </div>
        <div class="filter-container">
            <slot/>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '@/components/Breadcrumb'

    export default {
        name: 'PageHead',
        components: {
            Breadcrumb
        },
        props: {
            title: {
                type: String,
                default: undefined
            },
            actionBtns: {
                type: Array,
                default: undefined
            }
        },
        computed: {
            titleText() {
                const {title} = this.$route.meta;
                return this.title || title
            }
        }
    }
</script>

<style scoped lang="less">
    /*@import '../../styles/element-variables.scss';*/

    .page-head-wrap {
        padding: 0 20px;
    }

    .title-infos {
        height: 72px;
        line-height: 72px;
        font-size: 0;

        &::after {
            content: '';
            display: block;
            clear: both;
        }
    }

    .title {
        display: inline-block;
        padding-left: 25px;
        height: 72px;
        .titleText{
            display: inline-block;
            font-size: 20px;
            margin-right: 15px;
        }
        .breadcrumb-container{
            display: inline-block;
        }
    }

    .actions {
        float: right;
        button{
            vertical-align: middle;
        }
    }
    /*.filter-container{*/
    /*/deep/ .el-input, /deep/ .el-select{*/
    /*overflow: hidden;*/
    /*input{*/
    /*float: left;*/
    /*height: 30px;*/
    /*line-height: 30px;*/
    /*}*/
    /*}*/
    /*}*/
</style>
