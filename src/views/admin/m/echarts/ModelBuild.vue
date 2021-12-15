<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="titleInfo"
        :onOk="handleSure"
        fullscreen
        class="drawer-wrap"
        @close="onClose"
    >
        <div class="left">
            <div class="editor-title">
                <div class="editor-info">
                    <span>图表配置</span>
                    <span v-if="isErrorOption" class="error-tip">编辑内容出错！</span>
                </div>
                <div class="editor-action">
                    <a-button @click="codeFormat">代码整理</a-button>
                    <a-button @click="updateData">生成图表</a-button>
                </div>
            </div>
            <div style="height:calc(100% - 30px);">
                <AceEditor
                    ref="aceEditorOption"
                    v-model="contentOption"
                    :options="options"
                    lang="javascript"
                    theme="textmate"
                    width="100%"
                    height="calc(70% - 30px)"
                    @init="editorInit"
                    @input="editorChangeOption"
                />
                <div class="editor-title" style="border-top: 1px solid #e8e8e8;">
                    <div class="editor-info">
                        <span style="margin: 0 20px;">接口查询参数方法</span>
                        <span v-if="isErrorQuery" class="error-tip">编辑内容出错！</span>
                    </div>
                    <div class="editor-action"></div>
                </div>
                <AceEditor
                    ref="aceEditorQuery"
                    v-model="contentQuery"
                    lang="javascript"
                    theme="textmate"
                    width="100%"
                    height="30%"
                    @init="editorInit"
                    @input="editorChangeQuery"
                />
            </div>
        </div>
        <div class="right" style="padding: 10px;">
            <EchartsComp ref="ref_echarts" :option="echartOption"></EchartsComp>
        </div>
    </Drawer>
</template>

<script>
    import echarts from "echarts";
    import AceEditor from "@/components/Vue2-ace-editor";
    import EchartsComp from "@/components/Echarts";
    import {ajax} from "@/utils/index";

    import {Api_EchartsModel, Api_EchartsModelDetail} from "@/api/admin/m/index";

    export default {
        name: "Model",
        components: {
            AceEditor,
            EchartsComp
        },
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
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                echartOption: {},
                typeData: [],
                addFormRules: {
                    type: createRules({
                        msg: "图表类型",
                        required: true
                    }),
                    startDate: createRules({
                        msg: "起止时间",
                        required: true
                    })
                },
                addFormData: {
                    // 新增图表的表单数据
                },

                options: {
                    // enableBasicAutocompletion: false,   //启用基本自动完成功能
                    // enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    // enableSnippets: false,  //启用代码段
                },
                contentOption: "", // 编辑器内容(option)
                contentQuery: "", // 编辑器内容(查询条件)
                isErrorOption: false, // 编辑内容是否有错(option)
                isErrorQuery: false // 编辑内容是否有错(查询条件)
            };
        },
        computed: {
            titleInfo() {
                const {name} = this.selectData;
                return `${name}——建模`;
            }
        },
        beforeDestroy() {
            delete window.query;
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                Api_EchartsModelDetail(id).then(({js, param}) => {
                    this.contentOption = js || "";
                    this.contentQuery = param || "";
                    if (param) {
                        this.getQueryDataObject(param);
                    }
                    if (!js) {
                        this.contentOption = [
                            '// 可用的的变量：echarts(echarts对象)、ajax(接口请求)、setOption(生成echarts)、Ins(当前组件实例)',
                            '// 请在接口调用成功后执行图表生成方法setOption',
                            '// setOption(option)',
                            ''
                        ].join('\n')
                    }
                });
            },
            // 代码整理
            codeFormat(){

            },
            // 更新编辑器数据
            updateData() {
                this.getQueryDataObject(this.contentQuery);
                this.getEditorDataObject(this.contentOption);
            },
            // 设置图表option
            setOption(option) {
                if (option) {
                    this.echartOption = option;
                }
            },
            // 点击确认
            handleSure() {
                const {id, version} = this.selectData;
                const promiseRes = Api_EchartsModel(id, {
                    js: this.contentOption,
                    param: this.contentQuery,
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
            },

            // 编辑器change事件(option)
            editorChangeOption(v) {
                this.getEditorDataObject(
                    v,
                    () => {
                        this.isErrorOption = false;
                    },
                    e => {
                        this.isErrorOption = true;
                    }
                );
            },
            // 编辑器change事件(查询条件)
            editorChangeQuery(v) {
                this.getQueryDataObject(
                    v,
                    () => {
                        this.isErrorQuery = false;
                    },
                    () => {
                        this.isErrorQuery = true;
                    }
                );
            },
            // 加载代码编辑器需要的模块
            editorInit: function () {
                // require('brace/ext/searchbox')
                require("brace/ext/language_tools"); //language extension prerequsite...
                // require('brace/mode/html')
                require("brace/mode/javascript"); //language
                // require('brace/mode/less')
                // require('brace/theme/textmate')
                // require('brace/snippets/javascript') //snippet
            },
            // 编辑器内容转换为js可执行代码
            getEditorDataObject(val, success, error) {
                try {
                    new Function("echarts", "ajax", "setOption", 'Ins', val)(
                        echarts,
                        ajax,
                        this.setOption,
                        this
                    );
                    success && success();
                } catch (e) {
                    console.log(e);
                    error && error(e);
                }
            },
            // 接口查询参数方法内容转换为js可执行代码，生成query值
            getQueryDataObject(val, success, error) {
                try {
                    new Function(val)();
                    success && success();
                } catch (e) {
                    error && error(e);
                }
            },
            onClose() {
                this.contentOption = "";
                this.contentQuery = "";
                this.echartOption = {};
                if (window.option) {
                    delete window.option;
                }
                this.$refs.ref_echarts.clear();
            }
        }
    };
</script>

<style lang="scss" scoped>
    /deep/ .el-scrollbar__view {
        padding: 0;
    }

    .left {
        height: calc(100vh - 45px);
        width: 50%;
        float: left;
        border-right: 1px solid #ccc;

        .editor-title {
            position: relative;
            z-index: 1;
            height: 30px;
            display: flex;
            background-color: #f3f3f3;
            -webkit-box-shadow: -3px 2px 3px rgba(148, 146, 146, 0.2);
            -moz-box-shadow: -3px 2px 3px rgba(148, 146, 146, 0.2);
            box-shadow: -3px 2px 3px rgba(148, 146, 146, 0.2);

            .editor-info {
                flex: 1;
                display: flex;
                align-items: center;

                & > span {
                    padding: 0 10px;
                }

                .error-tip {
                    color: red;
                }
            }

            .editor-action {
                .a-button {
                    height: 30px;
                    border-radius: 0;
                }
            }
        }
    }

    .right {
        height: calc(100vh - 45px);
        float: right;
        width: 50%;
        background-color: #f3f3f3;
    }

    .drawer-wrap {
        /deep/ .__view {
            padding: 0;
        }
    }
</style>
