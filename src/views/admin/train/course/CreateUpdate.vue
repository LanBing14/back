<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增培训课程':'修改培训课程'"
        :onOk="handleSure"
        width="680px"
        @close="onClose"
    >
        <a-form-model ref="form" :model="formData" :rules="formRules">
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程名称"
                prop="name">
                <a-input v-model="formData.name" placeholder="请输入课程名称"/>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程类型"
                prop="type">
                <a-select v-model="formData.type" placeholder="请选择课程类型">
                    <a-select-option
                        v-for="el in typeOptions"
                        :key="el.value"
                        :value="el.value"
                    >
                        {{ el.label }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="讲师"
                prop="teacherId"
            >
                <a-select v-model="formData.teacherId" placeholder="请选择讲师">
                    <a-select-option
                        v-for="el in teacherIdOptions"
                        :key="el.id"
                        :value="el.id"
                    >
                        {{ el.name }} | {{el.idCard}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程价格"
                prop="price"
            >
                <a-input v-model="formData.price" placeholder="请输入课程价格" suffix="元" read-only
                         style="width: 150px;"/>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="标题图片"
                prop="picurl"
            >
                <Upload
                    v-model="formData.picurl"
                    :limit="1"
                    actionType="image"
                    fileType="png,gif,jpeg,jpg"
                    listType="picture-card"
                >
                    <div slot="tip" class="slot-tip">
                        请上传png、gif、jpeg、jpg格式的图片
                    </div>
                </Upload>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程介绍"
                prop="intro"
            >
                <a-textarea v-model="formData.intro" :rows="4" placeholder="请输入课程介绍"/>
            </a-form-model-item>
            <a-form-model-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程列表"
                prop="lessonList"
            >
                <a-row :gutter="20" type="flex" class="t">
                    <a-col>
                        <a-icon type="menu" class="sort" style="opacity: 0"/>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            课时名称
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-model-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            视频
                            <a-tooltip
                                class="item"
                                effect="dark"
                                title="只能上传mp4格式"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-model-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            课时时长
                        </a-form-model-item>
                    </a-col>
                    <a-col>
                        <a-form-model-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            <a-button type="primary" icon="plus" shape="circle" @click="add"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div ref="ref_list">
                    <a-row v-for="(domain, index) in formData.lessonList" :key="domain.id" :gutter="20"
                           type="flex">
                        <a-col>
                            <a-icon type="menu" class="sort" style="cursor: move"/>
                        </a-col>
                        <a-col :span="10">
                            <a-form-model-item
                                :prop="'lessonList.'+index+'.name'"
                                :rules="[
                                  { required: true, message: '请输入课时名称', trigger: 'change' },
                                  { max:100, message: '课时名称最大长度100', trigger: 'change' },
                                ]">
                                <a-input v-model="domain.name"/>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="5">
                            <a-form-model-item
                                :prop="'lessonList.'+index+'.fileUrl'"
                                :rules="[{
                                            type: 'array'
                                        }]" style="text-align: center;padding-top: 3px;">
                                <div v-if="domain.fileUrl.length && domain.fileUrl[0].status === 'done'" class="flex">
                                    <div class="flex-primary">
                                        <i class="iconfont icon-video cursor" @click="showVideo(domain.fileUrl)"></i>
                                    </div>
                                    <i class="iconfont icon-close" @click="removeVideo(index)"></i>
                                </div>
                                <Upload
                                    v-else
                                    v-model="domain.fileUrl"
                                    :limit="1"
                                    :show-file-list="true"
                                    :file-size="50"
                                    actionType="video"
                                    fileType="mp4,avi"
                                    class="upload-no-button"
                                    @change="fileChange($event, index)"
                                >
                                    <div slot="trigger">
                                        <a-button v-if="!domain.loading" type="primary">
                                            选择文件
                                        </a-button>
                                    </div>
                                </Upload>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="5">
                            <a-form-model-item
                                :prop="'lessonList.'+index+'.durationSecond'"
                                :rules="$createRules({
                                    msg: '课时时长',
                                    integer: true
                                })">
                                <a-input v-model="domain.durationSecond" suffix="秒" disabled/>
                            </a-form-model-item>
                        </a-col>
                        <a-col>
                            <a-form-model-item>
                                <a-button icon="minus" shape="circle" @click="del(index)"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model-item>
        </a-form-model>
      <a-modal
            v-model="modalVisible"
            :title="courseTitle"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :footer="null"
            :closable="false"
            @cancel="onModalClose"
            width="1000px"
        > 
            <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
                @play="onPlayerPlay($event)"
                style="width: 100%;"
            >
            </video-player>
      </a-modal> 
    </Drawer>
</template>

<script>
    import {merge} from 'lodash'
    import Sortable from 'sortablejs';
    import Upload from '@/components/Upload'
    import {
        Api_CoursesAdd,
        Api_CoursesUpdate,
        Api_CoursesDetail,
        Api_TeachersList
    } from "@/api/admin/train/index";

    export default {
        name: "CreateUpdate",
        components: {Upload},
        props: {
            modelStatus: {
                type: String,
                default: ""
            },
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            },
            typeOptions: Array
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                modalVisible: false,
                player: null,
                courseTitle: '',
                teacherIdOptions: [], // 下拉框选择，根据“获取所有讲师列表”接口
                formData: {
                    name: '',
                    type: undefined,
                    price: '0',
                    teacherId: undefined,
                    intro: '',
                    picurl: [],
                    lessonList: [{
                        id: '',
                        name: '',
                        fileUrl: [],
                        durationSecond: '',
                        loading: false
                    }]
                },
                formRules: {
                    name: createRules({
                        msg: "培训课程名称",
                        required: true,
                        max: 100
                    }),
                    type: createRules({
                        msg: "课程类型",
                        required: true,
                    }),
                    price: createRules({
                        msg: "课程价格",
                        numberFloatUp: true,
                        max: 100
                    }),
                    intro: createRules({
                        msg: "课程介绍",
                        max: 300
                    }),
                    lessonList: [{
                        type: 'array',
                        required: true,
                        message: '请至少添加一条课程',
                        trigger: 'change'
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                playerOptions: {
                    // 播放速度
                    playbackRates: [0.5, 1.0, 1.5, 2.0],
                    // 如果true,浏览器准备好时开始回放。
                    autoplay: true,
                    // 默认情况下将会消除任何音频。
                    muted: false,
                    // 导致视频一结束就重新开始。
                    loop: false,
                    // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    preload: 'auto',
                    language: 'zh-CN',
                    // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    aspectRatio: '16:9',
                    // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    fluid: true,
                    sources: [
                        {
                            // 类型
                            type: 'video/mp4',
                            // url地址
                            src: ''
                        }],
                    // 你的封面地址
                    poster: '',
                    // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    notSupportedMessage: '此视频暂无法播放，请稍后再试',
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        // 全屏按钮
                        fullscreenToggle: true
                    }
                },
            };
        },
        created() {
            Api_TeachersList().then(res => {
                this.teacherIdOptions = res
            })
        },
        mounted() {
            const $list = this.$refs.ref_list
            new Sortable($list, {
                handle: '.sort',
                onUpdate: (e) => {
                    const newIndex = e.newIndex
                    const oldIndex = e.oldIndex
                    const nItem = this.formData.lessonList.splice(oldIndex, 1)
                    this.formData.lessonList.splice(newIndex, 0, nItem[0])
                }
            });
        },
        methods: {
            fileChange(files, index) {
                if (files.length) {
                    if (files[0].status === 'uploading') {
                        this.formData.lessonList[index].loading = true
                    } else if (files[0].status === 'done') {
                        this.formData.lessonList[index].loading = false
                        this.setFileInfo(files[0].originFileObj, (duration) => {
                            this.formData.lessonList[index].durationSecond = parseInt(duration)
                        })
                    }
                } else {
                    this.formData.lessonList[index].durationSecond = 0
                }
            },
            setFileInfo(file, cb) {
                const video = document.createElement('video');
                video.preload = 'metadata';
                const URL = window.URL || window.webkitURL;
                video.onloadedmetadata = function () {
                    URL.revokeObjectURL(video.src);
                    const duration = video.duration;
                    cb && cb(duration)
                }
                video.src = URL.createObjectURL(file);
            },
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail(id);
                }
            },
            // 点击确认
            handleSure() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = merge({}, this.formData)
                        postData.price = parseFloat(postData.price)
                        postData.picurl = postData.picurl.map(i => i.response.url)[0]
                        let lessonListFileUrl = true
                        postData.lessonList.forEach(i => {
                            const url = i.fileUrl.map(f => f.url)[0]
                            if (!url) {
                                lessonListFileUrl = false
                            }
                            i.fileUrl = url
                            delete i.loading
                        })
                        if (!lessonListFileUrl) {
                            this.$message.warning('请为每个课程上传视频！')
                            return
                        }
                        const promiseRes =
                            modelStatus === "add"
                                ? Api_CoursesAdd(postData)
                                : Api_CoursesUpdate(id, {
                                    ...postData,
                                    version
                                });
                        const loading = this.$openLoading();
                        promiseRes
                            .then(msg => {
                                this.visible = false;
                                this.onClose();
                                this.$message.success(msg);
                                this.$emit("getList");
                                loading.close();
                            })
                            .catch((e) => {
                                console.log(e);
                                loading.close();
                            });
                    }
                });
            },
            // 获取单条数据信息
            getDetail(id) {
                Api_CoursesDetail(id).then(res => {
                    // const keys = Object.keys(this.form.getFieldsValue())
                    const keys = Object.keys(this.formData)
                    keys.forEach(key => {
                        let value = res[key]
                        if (key === 'picurl') {
                            value = value ? [{
                                url: process.env.VUE_APP_FILE_API + value,
                                name: '-',
                            }] : []
                        }
                        if (key === 'lessonList') {
                            this.formData[key] = res.lessonVoList.map(i => ({
                                id: i.id,
                                name: i.name,
                                fileUrl: [{
                                    url: i.fileUrl,
                                    name: '-',
                                    status: 'done'
                                }],
                                durationSecond: i.durationSecond,
                                loading: false
                            }))
                        } else {
                            this.formData[key] = value
                        }
                    })
                })
            },
            // 添加授权
            add() {
                this.formData.lessonList.push({
                    id: '',
                    name: '',
                    fileUrl: [],
                    durationSecond: '',
                    loading: false
                })
            },
            // 删除
            del(index) {
                this.formData.lessonList.splice(index, 1);
            },
            onPlayerPlay(player) {
                this.player = player
            },
            showVideo(urls) {
                let url = ''
                if (urls[0] && urls[0].url) {
                    url = `${urls[0].url}`
                    this.playerOptions.sources[0].src = url
                    this.modalVisible = true
                    if (this.player) {
                        this.player.currentTime(0)
                        this.player.play()
                    }
                }
            },
            onModalClose() {
                if (this.player) {
                    this.player.pause()
                }
            },
            removeVideo(index) {
                this.formData.lessonList[index].fileUrl = []
                this.formData.lessonList[index].durationSecond = ''
                if (this.player) {
                    this.player.pause()
                }
            },
            onClose() {
                this.formData.lessonList = [{
                    id: '',
                    name: '',
                    fileUrl: [],
                    durationSecond: '',
                    loading: false
                }]
                this.$nextTick(() => {
                    this.$refs.form.resetFields();
                })
                this.player = null
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dictionary-list {
        div {
            &::after {
                content: "";
                display: block;
                clear: both;
            }
        }

        .a-form-item {
            float: left;
            margin-right: 10px;

            label {
                text-align: center;
                padding-right: 0;
            }
        }

        input {
            width: 100px;
        }
    }

    /deep/ .upload-no-button .ant-upload.ant-upload-select {
        display: block;
    }
</style>
