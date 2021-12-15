<template>
    <VueCkeditor
        v-model="contentHtml"
        :config="config"
        :read-only-mode="readonly"
        :instance-ready-callback="readyCallback"
        @blur="onBlur($event)"
        @focus="onFocus($event)"
        @contentDom="onContentDom($event)"
        @dialogDefinition="onDialogDefinition($event)"
        @fileUploadRequest="onFileUploadRequest($event)"
        @fileUploadResponse="onFileUploadResponse($event)"/>
</template>

<script>
import VueCkeditor from 'vue-ckeditor2'

export default {
    components: { VueCkeditor },
    model:{
        prop: 'value',
        event: 'change'
    },
    props: {
        // 正文内容，供给vue的v-model使用，不需要传入
        value: String,
        // 高度
        ckHeight: {
            type: Number,
            default () {
                return 200
            }
        },
        // // 正文内容
        content: String,
        // 图片上传的地址
        imageUploadUrl: {
            type: String,
            default () {
                return `${process.env.VUE_APP_BASE_API}/fs/fs/attachments/image/0`
            }
        },
        // 实例初始化完成后的回调
        readyCallback: Function,
        // 是否只读
        readonly: Boolean,
        // 是否是自动高度
        autoHeight: Boolean
    },
    data () {
        const autoHeight = this.autoHeight
        const config = {
            toolbar: 'Full',
            // toolbar: [
            //     ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']
            // ],
            height: 0,
            autoGrow_minHeight: this.ckHeight,
            filebrowserImageUploadUrl: this.imageUploadUrl
        }
        if (autoHeight) {
            // config.extraPlugins = 'autogrow';
            // config.autoGrow_minHeight = 200;
        }
        return {
            contentHtml: '',
            config
        }
    },
    watch: {
        value (val) {
            this.contentHtml = val
        },
        contentHtml (val) {
            this.$emit('change', val)
        }
    },
    methods: {
        // 获取富文本内容
        getContent () {
            return this.contentHtml
        },
        setContent (val) {
            this.contentHtml = val
        },
        onBlur () {

        },
        onFocus () {
            // console.log(evt);
        },
        onContentDom () {
            // console.log(evt);
        },
        onDialogDefinition () {
            // console.log(evt);
        },
        onFileUploadRequest () {
            // console.log(evt);
        },
        onFileUploadResponse () {
            // console.log(evt);
        }
    }
}
</script>
