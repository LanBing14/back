<template slot>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        title="查看流程图"
        only-close-btn
        fullscreen
    >
        <a-row style="margin: -20px;">
            <a-col :span="6">
                <AceEditor
                    ref="aceEditorOption"
                    v-model="json"
                    lang="javascript"
                    theme="textmate"
                    width="100%"
                    height="calc(100vh - 45px)"
                    @init="editorInit"
                />
            </a-col>
            <a-col ref="main" :span="18" style="height: 100%;">
                <G6Editor v-if="data" ref="editor" :width="width" :height="height" :data="data" view></G6Editor>
            </a-col>
        </a-row>

    </Drawer>
</template>

<script>
    import AceEditor from "@/components/Vue2-ace-editor";
    import G6Editor from '@/components/G6Editor'
    import {Api_ActModelGetModel} from "@/api/admin/m";
    import dataMenu from "@/views/admin/m/actModel/dataMenu";

    export default {
        name: "CreateUpdate",
        components: {AceEditor, G6Editor},
        props: {},
        data() {
            return {
                visible: false,
                height: window.innerHeight - 45,
                width: window.innerWidth,
                data: null,
                json: ''
            };
        },
        methods: {
            // 打开模态框
            openModel(row) {
                Api_ActModelGetModel(row.id, 'wf_procdef').then(res=>{
                    let {text: model} = res;
                    if (model) {
                        model = JSON.parse(model)
                        const json = JSON.parse(res.text)
                        if (model.tasks) {
                            model.tasks = model.tasks.map(item => {
                                const findRes = dataMenu.find(i => i.type === item.type)
                                return {
                                    ...findRes,
                                    id: item.id,
                                    label: item.name,
                                    x: item.x,
                                    y: item.y,
                                    data: {
                                        ...item
                                    }
                                }
                            });
                        }
                        if (model.lines) {
                            model.lines = model.lines.map(item => {
                                return {
                                    id: item.id,
                                    shape: item.type,
                                    type: 'edge',
                                    source: item.startId,
                                    target: item.endId,
                                    points: item.points,
                                    data: {
                                        ...item
                                    }
                                }
                            });
                        }
                        this.data = {
                            nodes: model.tasks,
                            edges: model.lines
                        }
                        this.json = JSON.stringify(json, null, 2)
                        this.visible = true
                        const {width} = this.$refs.main.$el.getBoundingClientRect()
                        console.log(width);
                        this.width = width
                    }
                })
            },
            // 加载代码编辑器需要的模块
            editorInit: function () {
                require('brace/ext/language_tools') //language extension prerequsite...
                require('brace/mode/javascript')    //language
            }
        }
    };
</script>

<style scoped>
</style>
