<template>
    <div
        ref="dragContentWrap"
        style="height: 100%;"
    >
        <G6Editor ref="editor" :data="data" view @zoom="onZoom"></G6Editor>
        <div :class="{show: showPer, hide: hidePer}" class="scale-per">
            {{ $multiply(zoom, 100) }}%
        </div>
    </div>
</template>

<script>
import G6Editor from '@/components/G6Editor'

export default {
    name: 'ModelBuildPreview',
    components: {
        G6Editor
    },
    props: {},
    data () {
        return {
            data: {},
            zoom: 1,
            showPer: false,
            hidePer: false,
            timerShow: null, // 显示百分比延时器
            timerHide: null, // 隐藏百分比延时器
        }
    },
    mounted () {
        const previewData = sessionStorage.getItem('modelPreviewData')
        if (previewData) {
            this.data = JSON.parse(previewData)
        }
    },
    beforeDestroy(){
        clearTimeout(this.timerShow)
        clearTimeout(this.timerHide)
    },
    methods: {
        onZoom (zoom) {
            this.zoom = zoom
            this.showPer = false
            this.showPer = true
            this.hidePer = false
            clearTimeout(this.timerShow)
            clearTimeout(this.timerHide)
            this.timerShow = setTimeout(()=>{
                this.hidePer = true
                this.timerHide = setTimeout(()=>{
                    this.showPer = false
                    this.hidePer = false
                }, 1000)
            }, 1000)
        }
    }
}
</script>
<style scoped lang="scss">
    .scale-per {
        position: absolute;
        top: 15px;
        right: 15px;
        color: #fff;
        padding: 8px 18px;
        background-color: rgba(0, 0, 0, 0.65);
        display: none;
        &.show {
            display: block;
            opacity: 1;
        }
        &.hide{
            transition: opacity 1s;
            opacity: 0;
        }
    }
</style>
