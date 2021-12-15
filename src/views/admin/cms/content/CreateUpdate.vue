<template>
    <Drawer
        ref="drawer"
        :title="modelStatus | filterModelTitle(form.getFieldValue('type'))"
        :visible.sync="visible"
        :onOk="handleSure"
        fullscreen
        @close="onClose"
    >
        <a-form
            ref="dataForm"
            :form="form"
            class="form"
        >
            <!--            type为‘0’时是文本内容的展现形式-->
            <a-row :gutter="20" class="row-wrap">
                <a-col :span="16">
                    <div class="title-area">
                        <a-form-item
                            :label-col="{span: 4}"
                            :wrapper-col="{span: 18}"
                            label="标题">
                            <a-input
                                v-decorator="formDecorator.title"
                                placeholder="请输入标题"
                            />
                        </a-form-item>
                        <a-form-item
                            :label-col="{span: 4}"
                            :wrapper-col="{span: 18}"
                            label="短标题">
                            <a-input
                                v-decorator="formDecorator.shortTitle"
                                placeholder="请输入短标题"
                            />
                        </a-form-item>
                        <a-form-item
                            :label-col="{span: 4}"
                            :wrapper-col="{span: 18}"
                            label="副标题">
                            <a-input
                                v-decorator="formDecorator.subtitle"
                                placeholder="请输入副标题"
                            />
                        </a-form-item>
                    </div>
                    <div class="content">
                        <a-form-item v-if="form.getFieldValue('type')==='0'" class="el-form-item-required">
                            <Ckeditor ref="Ckeditor" v-decorator="formDecorator.text" :ckHeight="513"/>
                        </a-form-item>
                        <a-form-item
                            v-else-if="form.getFieldValue('type')==='1'"
                            :label-col="{span: 3}"
                            :wrapper-col="{span: 20}"
                            :required="false"
                            label="图文"
                        >
                            <div v-for="(el,index) in form.getFieldValue('slides')"
                                 :key="index"
                                 class="image-text-list">
                                <div class="image-text-primary">
                                    <a-form-item>
                                        <a-input v-decorator="[`[slides].${index}.title`,{rules:[{required:true,message:'标题必填'}]}]" placeholder="请输入图文标题"
                                                 style="margin-bottom: 10px;"/>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-input v-decorator="[`[slides].${index}.description`,{rules:[{required:true,message:'描述必填'}]}]" :rows="4"
                                                 type="textarea"
                                                 placeholder="请输入图文描述"/>
                                    </a-form-item>
                                    <a-form-item>
                                        <Upload ref="ref_imageTextListUpload"
                                                v-decorator="[`[slides].${index}.img`, {preserve:true,initialValue:[]}]"
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
                                </div>
                                <div class="image-text-actions">
                                    <a-button type="success" icon="plus" circle @click="addRecord"/>
                                    <a-button v-if="index !== 0" icon="minus" circle @click="delRecord(index)"/>
                                </div>
                            </div>
                        </a-form-item>
                        <a-form-item
                            v-else
                            :label-col="{span: 3}"
                            :wrapper-col="{span: 20}"
                            label="视频">
                            <Upload
                                ref="ref_videoUpload"
                                v-decorator="formDecorator.video"
                                :limit="1"
                                :fileSize="100"
                                @onFileChange="onVideoChange"
                                actionType="video"
                                fileType="mp4"
                            >
                                <span slot="tip" class="slot-tip" style="margin-left: 10px;">请上传mp4、flv格式的视频</span>
                            </Upload>
                        </a-form-item>
                        <video-player v-if="playerOptions.sources[0].src" class="video-player vjs-custom-skin"
                                      ref="videoPlayer"
                                      :playsinline="true"
                                      :options="playerOptions">
                        </video-player>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="right-box">
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="作者">
                            <a-input
                                v-decorator="formDecorator.author"
                                placeholder="请输入作者"
                            />
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="栏目"
                            class="el-form-item-required">
                            <a-tree
                                ref="treeEdit"
                                v-decorator="formDecorator.channelIds"
                                :treeData="treeData"
                                autoExpandParent
                                checkable
                                checkStrictly
                                defaultExpandAll
                                @check="handleCheckChange"
                            >
                            </a-tree>
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="模板">
                            <a-select v-decorator="formDecorator.template" placeholder="请选择板目" filterable>
                                <a-select-option
                                    v-for="el in templateOptions"
                                    :key="el.id"
                                    :value="el.value"
                                >
                                    {{el.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="标题图片">
                            <Upload ref="ref_titlePic"
                                    v-decorator="formDecorator.titleImg"
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
                            label="内容属性" prop="attribute">
                            <!--                            v-model="sign"-->
                            <a-checkbox-group v-decorator="formDecorator.attribute">
                                <!--                                <a-checkbox :value="index">{{ el.title }}</a-checkbox>-->
                                <a-checkbox v-for="(el, index) in signOptions" :value="el.value" :key="index">
                                    {{ el.label }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="tag词" prop="tags">
                            <InputBox v-decorator="formDecorator.tags" tip="tag词"></InputBox>
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="关键词" prop="keyWords">
                            <InputBox v-decorator="formDecorator.keyWords" tip="关键词"></InputBox>
                            <a-button v-loading="keywordLoading" class="keyword-btn" @click="getKeywords">
                                提取关键词
                            </a-button>
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="摘要" prop="summary">
                            <a-input
                                v-decorator="formDecorator.summary"
                                :rows="4"
                                type="textarea"
                                placeholder="请输入摘要"
                            />
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="来源" prop="origin">
                            <a-input
                                v-decorator="formDecorator.origin"
                                placeholder="请输入来源"
                            />
                        </a-form-item>
                        <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="来源链接" prop="originUrl">
                            <a-input
                                v-decorator="formDecorator.originUrl"
                                placeholder="请输入来源链接"
                            />
                        </a-form-item>
                    </div>
                </a-col>
            </a-row>
        </a-form>
    </Drawer>
</template>

<script>
    // import VideoPlayer from 'vue-video-player'
    // import 'vue-video-player/src/custom-theme.css'
    // import 'video.js/dist/video-js.css'
    import Ckeditor from '@/components/Ckeditor';
    import Upload from '@/components/Upload';
    import InputBox from '@/components/InputBox';
    import {
        Api_ChannelsFetchTree,
        Api_ChannelsGetKeyWords,
        Api_ContentsAdd,
        Api_ContentsUpdate,
        Api_ContentsDetail,
        Api_ContentsTemplateCombobox, // 获取内容模板下拉列表,
        Api_ContentsTQKeywords // 获取关键词
    } from '@/api/admin/cms/index';

    export default {
        name: 'CreateUpdate',
        components: {Ckeditor, Upload, InputBox},
        filters: {
            filterModelTitle(val, type) {
                let str = val === 'add' ? '新增' : '修改';

                if (type === '0') {
                    str += '普通内容';
                } else if (type === '1') {
                    str += '图文内容';
                } else if (type === '2') {
                    str += '视频内容';
                } else {
                    str += '音频内容';
                }
                return str;
            }
        },
        props: {
            modelStatus: String,
            selectData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                fileArr: [],
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                formDecorator: {
                    title: ['title', {
                        rules: createRules({
                            msg: '标题',
                            required: true,
                            max: 100
                        })
                    }],
                    template: ['template', {
                        rules: createRules({
                            msg: '模板',
                            required: true
                        })
                    }],
                    channelIds: ['channelIds', {
                        valuePropName: 'checkedKeys',
                        rules: [{
                            message: '请选择栏目',
                            required: true,
                            type: 'array'
                        }]
                    }],
                    type: ['type', {preserve: true, initialValue: '0'}],
                    text: ['text', {
                        rules: createRules({
                            msg: '内容',
                            required: true
                        })
                    }],
                    shortTitle: ['shortTitle', {
                        rules: createRules({
                            msg: '短标题',
                            max: 40
                        }),
                    }],
                    subtitle: ['subtitle', {
                        rules: createRules({
                            msg: '副标题',
                            max: 40
                        }),
                    }],
                    attribute: ['attribute', {rules: [{type: 'array'}]}],
                    titleImg: ['titleImg', {initialValue: []}],
                    author: ['author', {
                        rules: createRules({
                            msg: '作者',
                            max: 100
                        }),
                    }],
                    origin: ['origin', {
                        rules: createRules({
                            msg: '来源',
                            max: 100
                        })
                    }],
                    originUrl: ['originUrl', {
                        rules: createRules({
                            msg: '来源链接',
                            max: 100
                        })
                    }],
                    summary: ['summary', {
                        rules: createRules({
                            msg: '摘要',
                            max: 300
                        })
                    }],
                    slides: ['slides', {
                        preserve: true,
                        initialValue: [
                            { // 图文集列表数据
                                title: '',
                                description: '',
                                img: []
                            }
                        ],
                        rules: [{
                            type: 'array',
                            required: true,
                            message: '请选择至少添加一条有效的图文'
                            // validator: this.validatorSlides
                        }]
                    }],
                    video: ['video', {
                        rules: [{
                            message: '请上传视频',
                            required: true,
                            type: 'array'
                        }]
                    }],
                    tags: ['tags', {initialValue: []}],
                    keyWords: ['keyWords', {initialValue: []}],
                },

                modelType: undefined,
                keywordLoading: false,
                treeData: [], // 栏目树的数据
                visible: false, // 是否显示
                addFormData: {// 新增栏目的表单数据
                    title: '', // 栏目名称，长度100
                    template: '', // 模板
                    channelIds: '', // 栏目id集合
                    type: '0', // 内容类型,0：普通，1：图片集，2：视频，3：音频
                    text: '', // 文本内容
                    shortTitle: '', // 短标题
                    subtitle: '', // 副标题
                    attribute: '', // 内容属性：内容属性复选框属性相加的值,1：图片，2：视频，4：音频，8：附件，16：置顶，32：热点，64：推荐
                    titleImg: '', // 标题图片地址：只有一张
                    author: '', // 作者名
                    origin: '', // 来源
                    originUrl: '', // 来源链接
                    summary: '', // 摘要
                    slides: ' ',
                    imageTextList: [
                        { // 图文集列表数据
                            title: '',
                            description: '',
                            imgs: []
                        }],
                    video: ' ',
                    tags: [],
                    keyWords: []
                },
                addFormRules: { // 表单验证规则
                    title: createRules({
                        msg: '标题',
                        required: true,
                        max: 100
                    }),
                    shortTitle: createRules({
                        msg: '短标题',
                        max: 40
                    }),
                    subtitle: createRules({
                        msg: '副标题',
                        max: 40
                    }),
                    author: createRules({
                        msg: '作者',
                        max: 100
                    }),
                    origin: createRules({
                        msg: '来源',
                        max: 100
                    }),
                    originUrl: createRules({
                        msg: '来源链接',
                        max: 100
                    }),
                    summary: createRules({
                        msg: '摘要',
                        max: 300
                    }),
                    template: createRules({
                        msg: '模板',
                        required: true
                    }),
                    channelIds: createRules({
                        msg: '栏目',
                        validator: this.validatorDep
                    }),
                    slides: createRules({
                        msg: '图文',
                        validator: this.validatorSlides
                    }),
                    text: createRules({
                        msg: '内容',
                        // validator: this.validatorText
                        // required: true
                    }),
                    video: createRules({
                        msg: '视频',
                        required: true,
                        // validator: this.validatorVideo
                    })
                },
                playerOptions: {
                    // 播放速度
                    playbackRates: [0.5, 1.0, 1.5, 2.0],
                    // 如果true,浏览器准备好时开始回放。
                    autoplay: false,
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
                // 图文的规则
                imageTextListRules: {
                    title: createRules({
                        msg: '图文标题',
                        max: 50
                    }),
                    description: createRules({
                        msg: '图文描述',
                        max: 300
                    })
                },
                defaultFileList: [],
                defaultVideoList: [],
                templateOptions: [], // 模版下拉的option数据
                defaultContentTxt: undefined, // 默认的详情里的富文本内容
                sign: [], // 标签
                signOptions: [
                    {
                        label: '图片',
                        value: 1
                    }, {
                        label: '视频',
                        value: 2
                    }, {
                        label: '音频',
                        value: 4
                    }, {
                        label: '附件',
                        value: 8
                    }, {
                        label: '置顶',
                        value: 16
                    }, {
                        label: '热点',
                        value: 32
                    }, {
                        label: '推荐',
                        value: 64
                    }] // 标签option
            };
        },
        watch: {
            sign(val) {
                let num = 0;
                val.forEach(item => {
                    num += item;
                });
                this.addFormData.attribute = num;
            }
        },
        created() {
            this.form = this.$form.createForm(this);
            this.form.getFieldDecorator('type', this.formDecorator.type[1]);
            this.form.getFieldDecorator('slides', this.formDecorator.slides[1]);
            Api_ChannelsFetchTree().then(res => {
                this.treeData = this.$turnTreeData(res);
            });
            Api_ContentsTemplateCombobox().then(res => {
                this.templateOptions = res;
            });
        },
        methods: {
            // 打开模态框
            openModel(modelType, type) {
                const {id} = this.selectData;
                if (modelType === 'add') { // 是新增节假日
                    this.visible = true;
                    let attribute = [];
                    if (type === '1') {
                        attribute = [this.signOptions[0].value];
                    } else if (type === '2') {
                        attribute = [this.signOptions[1].value];
                    } else if (type === '3') {
                        attribute = [this.signOptions[2].value];
                    }
                    this.form.setFieldsValue({
                        attribute
                    });
                } else if (modelType === 'update') { // 是修改节假日
                    this.getDetail(id);
                }
                this.form.setFieldsValue({
                    type
                });
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.form.getFieldsValue();
                        let promiseRes = null;

                        let num = 0;
                        postData.attribute.forEach(item => {
                            num += item;
                        });
                        postData.attribute = num;
                        if (postData.type === '1') {
                            const slidesArr = postData.slides.map((item, index) => {
                                return {
                                    ...item,
                                    sequence: index,
                                    img: item.img[0] ? item.img[0].response.url : ''
                                };
                            });
                            postData.slides = JSON.stringify(slidesArr);
                        } else if (postData.type === '2') {
                            postData.video = postData.video[0] ? postData.video[0].response.url : '';
                        }
                        if (postData.type !== '1') {
                            delete postData.slides;
                        }
                        if (postData.titleImg[0]) {
                            postData.titleImg = postData.titleImg[0].response.url;
                        }
                        console.log(postData);
                        if (modelStatus === 'add') { // 是新增子栏目
                            promiseRes = Api_ContentsAdd({
                                ...postData
                            });
                        } else { // 是修改子栏目
                            promiseRes = Api_ContentsUpdate(id, {
                                ...postData,
                                version
                            });
                        }
                        this.handlePostData(promiseRes);
                    }
                });
            },
            handlePostData(promiseRes) {
                const loading = this.$openLoading();
                promiseRes.then(msg => {
                    this.visible = false;
                    this.onClose();
                    this.$message.success(msg);
                    this.$emit('getList');
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 生成有效的图文数据集合
            getValidImageTextList() {
                const arr = [];
                const ref_imageTextListUpload = this.$refs.ref_imageTextListUpload;
                this.addFormData.imageTextList.forEach((item, index) => {
                    const listData = ref_imageTextListUpload[index].getListData();
                    const url = listData.length ? this.$getRelativePath(listData[0].url) : '';
                    const copyItem = {...item};
                    delete copyItem.img;
                    item.title && item.description && arr.push({
                        ...copyItem,
                        sequence: index,
                        img: url
                    });
                });
                return arr;
            },
            // 获取详情
            getDetail(id) {
                const loading = this.$openLoading();
                Api_ContentsDetail(id).then(res => {
                    loading.close();
                    const data = {};
                    data.title = res.title;
                    data.subtitle = res.subtitle;
                    data.shortTitle = res.shortTitle;
                    data.template = res.template;
                    data.author = res.author;
                    data.origin = res.origin;
                    data.originUrl = res.originUrl;
                    data.summary = res.summary;
                    if (res.titleImg && res.titleImg.length) {
                        data.titleImg = res.titleImg.map((item) => {
                            return {
                                name: item.originalName,
                                url: `${item.url}`
                            };
                        });
                    }
                    if (res.channelList) {
                        data.channelIds = res.channelList.map(item => {
                            return item.id;
                        });
                    }
                    // 过滤找出默认选中的'标签'数据
                    res.attribute ? data.attribute = this.signOptions.filter(item => {
                        return item.value & res.attribute;
                    }).map(item => {
                        return item.value;
                    }) : null;
                    if (res.type === '0') {
                        data.text = res.text.text;
                    } else if (res.type === '1' && res.slides) {
                        data.slides = res.slides.map((item, index) => {
                            const img = item.img.map(i => {
                                return {
                                    name: i.originalName,
                                    url: `${i.url}`
                                };
                            });
                            const s = {
                                title: item.title,
                                description: item.description,
                                img: img
                            };
                            this.form.setFieldsValue({
                                [`[slides].${index}`]: s
                            });
                            return s;
                        });
                    } else if (res.type === '2' && res.video) {
                        data.video = res.video.map(item => {
                            return {
                                name: item.originalName,
                                url: `${item.url}`
                            };
                        });
                        this.playerOptions.sources[0].src = data.video[0].prefix + data.video[0].url;
                    }
                    console.log(data);
                    this.form.setFieldsValue(data);
                    Api_ChannelsGetKeyWords(id).then(res => {
                        const keywordObj = res[0];
                        if (keywordObj) {
                            let {keyWords, tags} = keywordObj;
                            if (keyWords) {
                                keyWords = keyWords.replace(/[\[\]]/g, '')
                                this.form.setFieldsValue({
                                    keyWords: keyWords ? keyWords.split(',') : []
                                });
                            }
                            if (tags) {
                                tags = tags.replace(/[\[\]]/g, '')
                                this.form.setFieldsValue({
                                    tags: tags ? tags.split(',') : []
                                });
                            }
                        }
                    });
                    this.visible = true;
                }).catch((e) => {
                    console.log(e);
                    loading.close();
                });
            },
            handleCheckChange(_, {node, checked}) {
                const {id} = node.dataRef;
                this.form.setFieldsValue({
                    channelIds: checked ? [id] : []
                });
            },
            validatorSlides(rule, value, callback) {
                const arr = this.getValidImageTextList();
                if (!arr.length) {
                    callback(new Error('请选择至少添加一条有效的图文'));
                } else {
                    callback();
                }
            },
            onVideoChange(files) {
                let previewVideo = '';
                if (files.length) {
                    previewVideo = process.env.VUE_APP_BASE_API + files[0].url;
                } else {
                    previewVideo = '';
                }
                this.playerOptions.sources[0].src = previewVideo;
            },
            // 提取关键词
            getKeywords() {
                this.keywordLoading = true;
                Api_ContentsTQKeywords({
                    queryStr: this.form.getFieldValue('title')
                }).then(res => {
                    this.form.setFieldsValue({
                        keyWords: res
                    });
                    this.keywordLoading = false;
                }).catch(() => {
                    this.keywordLoading = false;
                });
            },
            // 添加一条新的数据
            addRecord() {
                this.form.setFieldsValue({
                    slides: [
                        ...this.form.getFieldValue('slides'),
                        { // 图文集列表数据
                            title: '',
                            description: '',
                            img: []
                        }
                    ]
                })
            },
            // 删除一条新的数据
            delRecord(index) {
                const slides = this.form.getFieldValue('slides')
                if (slides.length > 1) {
                    slides.splice(index, 1);
                    this.form.setFieldsValue({
                        slides: slides
                    })
                }
            },
            // 模态框关闭时
            onClose() {
                this.form.resetFields();
                this.playerOptions.sources[0].src = ''
            }
        }
    };
</script>

<style lang="scss" scoped>

    @media screen and (min-width: 1600px) {
        .form {
            margin: 0 7%;
        }
    }

    .image-text-list {
        display: flex;
        margin-right: 15px;

        & + .image-text-list {
            margin-top: 19px;
            padding-top: 25px;
            border-top: 1px dashed #ccc;
        }

        .image-text-primary {
            flex: 1;
            margin-right: 15px;

            .el-textarea {
                margin-bottom: 10px;
            }
        }

        .image-text-actions {
            min-width: 65px;
        }
    }

    .title-area {
        background-color: #fff;
        padding: 15px 10% 15px 10%;
        margin-bottom: 15px;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12);
    }

    .content {
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12);
        background-color: #fff;
        padding-top: 15px;
        padding-bottom: 15px;
        min-height: 672px;
    }

    .el-form-item.el-form-item--mini:last-child {
        margin-bottom: 0;
    }

    .drawer-wrap /deep/ .__view {
        background-color: #f6f7f9;
    }

    /deep/ .ckeditor > div {
        border: none;
        box-shadow: none;

        .cke_bottom {
            background-color: #fff;
        }
    }

    .right-box {
        padding: 15px 15px 15px 0;
        background-color: #fff;
        box-shadow: 0 0px 3px 0 rgba(0, 0, 0, .12);

        .keyword-btn {
            float: right;
            margin-top: 10px;
        }
    }

    .row-wrap {
        margin-bottom: 26px;
    }

    .video-player {
        width: 85%;
        margin: auto;
    }
</style>
