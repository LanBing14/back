<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增培训课程':'修改培训课程'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="dataForm" :form="form">
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程名称"
                prop="name">
                <a-input v-decorator="formDecorator.name" placeholder="请输入课程名称"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程类型"
                prop="idCard">
                <a-select v-decorator="formDecorator.type" placeholder="请选择课程类型">
                    <a-select-option
                        v-for="el in typeOptions"
                        :key="el.value"
                        :value="el.value"
                    >
                        {{ el.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="讲师">
                <a-select v-decorator="formDecorator.teacherId" placeholder="请选择讲师">
                    <a-select-option
                        v-for="el in teacherIdOptions"
                        :key="el.id"
                        :value="el.id"
                    >
                        {{ el.name }} | {{el.idCard}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程价格">
                <a-input v-decorator="formDecorator.price" placeholder="请输入课程价格" suffix="元" read-only
                         style="width: 150px;"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="标题图片">
                <Upload
                    v-decorator="formDecorator.picurl"
                    :limit="1"
                    actionType="image"
                    fileType="png,gif,jpeg,jpg"
                    listType="picture-card"
                >
                    <div slot="tip" class="slot-tip">
                        请上传png、gif、jpeg、jpg格式的图片
                    </div>
                </Upload>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程介绍">
                <a-textarea v-decorator="formDecorator.intro" :rows="4" placeholder="请输入课程介绍"/>
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="课程列表">
                <input v-decorator="formDecorator.lessonList" type="text" style="display: none">
                <a-row :gutter="20" type="flex" class="t">
                    <a-col>
                        <a-icon type="menu" class="sort" style="opacity: 0"/>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            课时名称
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            视频
                            <a-tooltip
                                class="item"
                                effect="dark"
                                title="只能上传mp4、avi格式"
                            >
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            课时时长
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item :wrapper-col="{span: 24}" style="text-align: center;margin-bottom: 0;">
                            <a-button type="primary" icon="plus" shape="circle" @click="add"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <div ref="ref_list">
                    <a-row v-for="(domain, index) in form.getFieldValue('lessonList')" :key="index" :gutter="20"
                           type="flex">
                        <input v-decorator="[`[lessonList].${index}.id`]" type="text" style="display: none">
                        <a-col>
                            <a-icon type="menu" class="sort" style="cursor: move"/>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item>
                                <a-input v-decorator="[`[lessonList].${index}.name`, {
                                rules:[
                                  { required: true, message: '请输入课时名称', trigger: 'change' },
                                  { max:100, message: '课时名称最大长度100', trigger: 'change' },
                                ]
                            }]"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="5">
                            <a-form-item style="text-align: center;padding-top: 3px;">
                                <Upload
                                    v-show="!filesListObj[index]||!filesListObj[index].length"
                                    v-decorator="[`[lessonList].${index}.fileUrl`, {
                                        initialValue: [],
                                        rules:[{
                                            type: 'array'
                                        }]
                                    }]"
                                    :limit="1"
                                    :show-file-list="false"
                                    actionType="video"
                                    fileType="mp4,avi"
                                    class="upload-no-button"
                                    @change="fileChange($event, index)"
                                >
                                </Upload>
                                <div v-if="filesListObj[index]&&filesListObj[index].length" class="flex">
                                    <div class="flex-primary">
                                        <i class="iconfont icon-video" @click="showVideo(index)"></i>
                                    </div>
                                    <i class="iconfont icon-close" @click="removeVideo(index)"></i>
                                </div>
                            </a-form-item>
                        </a-col>
                        <a-col :span="7">
                            <a-form-item>
                                <a-input v-decorator="[`[lessonList].${index}.durationSecond`,{
                                rules:$createRules({
                                    msg: '课时时长',
                                    integer: true
                                })
                            }]" suffix="秒"/>
                            </a-form-item>
                        </a-col>
                        <a-col>
                            <a-form-item>
                                <a-button icon="minus" shape="circle" @click="del(index)"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-item>
        </a-form>
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
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: [
                        "name",
                        {
                            rules: createRules({
                                msg: "培训课程名称",
                                required: true,
                                max: 100
                            })
                        }
                    ],
                    type: [
                        "type",
                        {
                            rules: createRules({
                                msg: "课程类型",
                                required: true,
                            })
                        }
                    ],
                    price: [
                        "price",
                        {
                            initialValue: '0',
                            rules: createRules({
                                msg: "课程价格",
                                numberFloatUp: true,
                                max: 100
                            })
                        }
                    ],
                    teacherId: ["teacherId"],
                    intro: [
                        "intro",
                        {
                            rules: createRules({
                                msg: "课程介绍",
                                max: 300
                            })
                        }
                    ],
                    picurl: ["picurl", {
                        initialValue: []
                    }],
                    lessonList: ['lessonList', {
                        preserve: true,
                        rules: [{
                            type: 'array',
                            required: true,
                            message: '请至少添加一条课程',
                            trigger: 'change'
                        }],
                        initialValue: [
                            {
                                id: '',
                                name: '',
                                fileUrl: [],
                                durationSecond: ''
                            }
                        ]
                    }]
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                filesListObj: {},
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
            // this.form.getFieldDecorator('lessonList', this.formDecorator.lessonList[1]);
            Api_TeachersList().then(res => {
                this.teacherIdOptions = res
            })
        },
        mounted() {
            new Sortable(this.$refs.ref_list, {
                handle: '.sort',
                onEnd: (e) => {
                    const {oldIndex, newIndex} = e
                    const lessonList = merge([], this.form.getFieldsValue().lessonList)
                    // this.filesListObj[oldIndex] = lessonList[newIndex].fileUrl
                    // this.filesListObj[newIndex] = lessonList[oldIndex].fileUrl
                    // const addItem = lessonList.splice(oldIndex, 1)[0]
                    // lessonList.splice(newIndex, 0, addItem)
                    // this.form.setFieldsValue({
                    //     lessonList
                    // })
                    // console.log(oldIndex, newIndex, lessonList);
                    // setTimeout(() => {
                    //     lessonList.forEach((item, index) => {
                    //         this.form.setFieldsValue({
                    //             [`[lessonList].${index}.id`]: item.id,
                    //             [`[lessonList].${index}.name`]: item.name,
                    //             [`[lessonList].${index}.fileUrl`]: item.fileUrl,
                    //             [`[lessonList].${index}.durationSecond`]: item.durationSecond,
                    //         })
                    //     })
                    // }, 1000)
                }
            });
        },
        methods: {
            fileChange(files, index) {
                this.filesListObj[index] = files
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
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = {
                            ...values,
                            price: this.$add(values.price, 100)
                        };
                        postData.picurl = postData.picurl.map(i => i.response.url)[0]
                        postData.lessonList.forEach(i => {
                            i.fileUrl = i.fileUrl.map(f => f.response.url)[0]
                        })
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
                            .catch(() => {
                                loading.close();
                            });
                    }
                });
            },
            // 获取单条数据信息
            getDetail(id) {
                Api_CoursesDetail(id).then(res => {
                    const keys = Object.keys(this.form.getFieldsValue())
                    keys.forEach(key => {
                        let value = res[key]
                        if (key === 'picurl') {
                            value = value ? [{
                                url: value,
                                name: '-'
                            }] : []
                        }
                        if (key === 'lessonList') {
                            this.form.setFieldsValue({
                                lessonList: res.lessonVoList.map(i => ({
                                    id: i.id,
                                    name: i.name,
                                    fileUrl: i.fileUrl,
                                    durationSecond: i.durationSecond
                                }))
                            })
                        } else {
                            this.form.setFieldsValue({
                                [key]: value
                            })
                        }
                    })
                    res.lessonVoList.forEach((item, index) => {
                        this.filesListObj[index] = [{
                            url: item.fileUrl,
                            name: '-'
                        }]
                        this.form.setFieldsValue({
                            [`[lessonList].${index}.id`]: item.id,
                            [`[lessonList].${index}.name`]: item.name,
                            [`[lessonList].${index}.durationSecond`]: item.durationSecond,
                            [`[lessonList].${index}.fileUrl`]: [{
                                url: item.fileUrl,
                                name: '-'
                            }],
                        })
                    })
                })
            },
            // 添加授权
            add() {
                const {lessonList} = this.form.getFieldsValue()
                lessonList.push({
                    id: '',
                    name: '',
                    fileUrl: [],
                    durationSecond: ''
                })
                this.form.setFieldsValue({
                    lessonList
                })
            },
            // 删除授权
            del(index) {
                const {lessonList} = this.form.getFieldsValue()
                lessonList.splice(index, 1);
                this.form.setFieldsValue({
                    lessonList
                })
                lessonList.forEach((item, index) => {
                    this.form.setFieldsValue({
                        [`[lessonList].${index}.id`]: item.id,
                        [`[lessonList].${index}.name`]: item.name,
                        [`[lessonList].${index}.fileUrl`]: item.fileUrl,
                        [`[lessonList].${index}.durationSecond`]: item.durationSecond,
                    })
                })
            },
            onPlayerPlay(player) {
                this.player = player
            },
            showVideo(index) {
                const lessonList = this.form.getFieldValue('lessonList')
                this.playerOptions.sources[0].src = lessonList[index].fileUrl
                this.modalVisible = true
                if (this.player) {
                    this.player.currentTime(0)
                    this.player.play()
                }
            },
            onModalClose() {
                if (this.player) {
                    this.player.pause()
                }
            },
            removeVideo(index) {
                this.form.setFieldsValue({
                    [`[lessonList].${index}.fileUrl`]: []
                })
                this.filesListObj[index] = null
                if (this.player) {
                    this.player.pause()
                }
            },
            onClose() {
                this.form.resetFields();
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
