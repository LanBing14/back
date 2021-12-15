<template>
    <div v-on="$listeners" :class="{active: active}" class="more">
        <div class="more-content">
            <span><i :class="[icon]" class="iconfont "></i></span>
            <span>more</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MoreEnter',
    props: {
        icon: {
            type: String,
            default: 'icon-arrowright'
        },
        active: {
            type: Boolean
        }
    },
    data () {
        return {}
    }
}
</script>

<style scoped lang="scss">
    .more {
        font-size: 12px;
        border-radius: 15px;
        cursor: pointer;
        color: #aaa;
        border: 1px solid #aaa;
        text-align: center;
        transition: all 0.2s ease-out;
        overflow: hidden;

        .more-content {
            display: flex;
            align-items: center;
            width: 200%;
            transform: translate(-50%);
            transition: all 0.2s ease-out;

            span {
                width: 100%;
            }
        }

        &:hover,&.active {
            background-color: #4B9DF3;
            color: #fff;
            border-color: #4B9DF3;
        }

        &:hover .more-content,&.active .more-content {
            transform: translate(0);
        }
    }
</style>
