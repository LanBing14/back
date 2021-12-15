<template>
    <div class="upload-wrap">
        <viewer :images="fileListUrls"
                @inited="inited"
                class="viewer"
                ref="viewer"
                style="display: none;"
        >
            <template slot-scope="scope">
                <img v-for="src in scope.images" :src="src" :key="src">
            </template>
        </viewer>
        <a-upload
            ref="uploader"
            :action="actionBaseUrl+curUploadFileNum"
            @change="change"
            @preview="handlePreview"
            :fileList="fileList"
            :list-type="listType"
            :file-type="fileType"
            :file-size="fileSize"
            :before-upload="beforeUpload"
            :remove="beforeRemove"
            :showUploadList="showFileList"
            :data="postData"
            :limit="limit"
            :on-exceed="handleExceed"
            :on-change="change"
            :customRequest="httpRequest"
            :multiple="multiple"
            :disabled="disabled"
            :class="{'upload-disabled': disabled}"
            class="upload-demo"
        >
            <template v-if="!disabled">
                <i v-if="listType === 'picture-card'" class="el-icon-plus"></i>
                <slot v-else name="trigger">
                    <a-button type="primary">
                        选择文件
                    </a-button>
                </slot>
            </template>
        </a-upload>
        <div class="upload-tip">
            <slot name="tip"></slot>
        </div>
    </div>
</template>

<script>
    import {uniqueId} from 'lodash';
    import {Message} from 'element-ui';
    import {Api_upload, Api_fileUrl} from '@/api/admin/index';
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer/src/component.vue';

    export default {
        name: 'Upload',
        components: {
            Viewer
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: Array, // 不需要主动传入，值是通过v-model注入
            // 默认传过来的数据
            defaultList: Array,
            actionType: {// 附件的种类(all, doc, image, video)，属于图片或文档或视频或不限制
                type: String,
                default: () => 'all'
            },
            autoUpload: {// 是否自动上传
                type: Boolean,
                default: () => true
            },
            postData: { // 上传时附带的额外参数
                type: Object,
                default: () => null
            },
            // 是否支持多选文件
            multiple: {
                type: Boolean,
                default: () => true
            },
            fileType: {// 附件后辍类型,","号分割
                type: String,
                default: () => ''
            },
            fileSize: {// 文件大小
                type: Number,
                default: () => 10
            },
            listType: {// 文件列表显示的风格类型
                type: String,
                default: () => 'text' // text/picture/picture-card
            },
            disabled: Boolean,
            showFileList: { // 是否显示已上传的文件列表
                type: Boolean,
                default: () => true
            },
            limit: Number, // 最大上传个数
            tip: String, // 附件上传的提示
            success: Function, // 文件上传成功的回调
            remove: Function, // 文件移除之后的回调
            error: Function, // 文件上传失败的回调
            delAlert: {// 删除文件时是否进行提示确认
                type: Boolean,
                default: () => true
            },
            // 文件名称最大长度
            maxFileNameLength: {
                type: Number,
                default: 50
            }
        },
        data() {
            return {
                fileList: [], // 存放文件数据列表
                documentFowList: [], // 存放文件流
                curUploadFileNum: -1, // 传递给后台的图片顺序
                fileListUrls: [], // 文件列表的url地址集合
                $viewer: null,
                timerTip: null // 超出最大上传时的延时器
            };
        },
        computed: {
            // 上传的服务器url
            actionBaseUrl: function () {
                let actionBaseUrl = Api_fileUrl();
                if (this.actionType === 'doc') {
                    actionBaseUrl += 'doc/';
                } else if (this.actionType === 'image') {
                    actionBaseUrl += 'image/';
                } else if (this.actionType === 'video') {
                    actionBaseUrl += 'video/';
                }
                return actionBaseUrl;
            }
        },
        watch: {
            value(val) {
                this.setFileList(val)
                this.fileList = [...val];
            }
        },
        beforeDestroy() {
            clearTimeout(this.timerTip)
        },
        methods: {
            setFileList(val) {
                val.forEach(item => {
                    if (!item.uid) {
                        item.uid = uniqueId();
                        item.status = 'done';
                        item.response = {
                            url: item.url
                        }
                    }
                    if (!item.url && item.response) {
                        item.url = item.response.url;
                    }
                });
                this.fileListUrls = val.filter(item => item.status === 'done').map(i => `${i.url}`)
            },
            // 获取当前上传的文件列表信息
            getListData() {
                return this.fileList;
            },
            // 上传失败
            // handleError(err) {
            //     Message({
            //         message: err,
            //         type: 'error',
            //         duration: 3 * 1000
            //     });
            // },
            // 文件预览
            handlePreview(file) {
                if (file.status !== 'done') {
                    return;
                }
                if (this.listType === 'picture-card') {
                    const index = this.fileListUrls.findIndex(i => i === `${file.url}`);
                    this.$viewer.view(index);
                    return;
                }
                this.$emit('onPreview');
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            // 上传之前
            beforeUpload(file, fileList) {
                const {fileType, fileSize} = this;
                if (this.limit && (this.fileList.length + 1 > this.limit || fileList.length > this.limit)) {
                    clearTimeout(this.timerTip)
                    this.timerTip = setTimeout(() => {
                        this.$message.error(`上传的文件数量最大为${this.limit}个！`);
                    }, 100)
                    return false;
                }
                if (file.name.split('.')[0].length > this.maxFileNameLength) {
                    this.$message.error(`文件名称长度不能大于${this.maxFileNameLength}!`);
                    return false
                }
                if (fileType) {
                    const h = file.name.split('.').pop();
                    const typeFlag = this.isCurrFileType(h);
                    if (!typeFlag) {
                        this.$message.error('上传的文件格式不正确！');
                        return false
                    }
                }
                if (fileSize) {
                    const isLtM = this.isValideFileSize(file.size);
                    if (!isLtM) {
                        fileSizeFlag = false;
                        this.$message.error(`上传的文件大小不能超过 ${fileSize} MB!`);
                        return false
                    }
                }

                if (!this.autoUpload) {
                    this.fileList = [...this.fileList, file];
                    return false;
                }
            },
            // 移除之前
            beforeRemove(file) {
                const h = file.name.split('.').pop();
                if (this.delAlert && this.isCurrFileType(h) && this.isValideFileSize(file.size) && file.name.split('.')[0].length < this.maxFileNameLength) {
                    return this.$confirm(`确定移除 ${file.name}？`);
                }
            },
            // 判断是否是正确的文件格式
            isCurrFileType(type) {
                const {fileType} = this;
                if (!fileType) {
                    return true;
                }
                const fileTypeArr = fileType.split(',');
                return fileTypeArr.indexOf(type) !== -1;
            },
            // 文件大小是否正确
            isValideFileSize(size) {
                return size / 1024 / 1024 <= this.fileSize;
            },
            // 文件上传发生变化
            change({fileList}) {
                const updateList = fileList.filter(item => item.status)
                this.setFileList(updateList)
               
                this.emitChange(updateList);
            },
            // 通知v-model改变value值
            emitChange(fileList) {
                this.$emit("change", fileList);
            },
            // 自定义的上传事件
            httpRequest(file) {
                
                this.curUploadFileNum++;
                const newFormData = new FormData();
                newFormData.append('file', file.file);
                const onprogress = (e) => {
                    if (e.total > 0) {
                        e.percent = e.loaded / e.total * 100;
                    }
                    file.onProgress(e);
                };
                Api_upload(this.actionBaseUrl + this.curUploadFileNum, newFormData, onprogress).then(res => {
                    file.onSuccess(res);
                }).catch(e => {
                    file.onError(e);
                    // this.handleError(e);
                });
            },
            // 主动提交文件
            submit() {
                this.fileList.forEach(file => {
                    this.httpRequest(file);
                });
            },
            // 生成图片查看器
            inited(viewer) {
                this.$viewer = viewer;
            }
        }
    };
</script>

<style lang="scss">
    .upload-demo {
        line-height: normal;
    }

    .upload-disabled .el-upload.el-upload--text {
        display: none;
    }

    .upload-tip {
        font-size: 12px;
        margin: 3px 0 10px;
        line-height: normal;

        p {
            margin: 0;
        }

        &:empty {
            display: none;
        }
    }

    .el-upload-list__item:first-child {
        margin-top: 0;
    }
</style>
