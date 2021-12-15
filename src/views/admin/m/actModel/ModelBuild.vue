<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="selectData.name+'——建模'"
        :btn="drawerBtns"
        fullscreen
    >
        <div class="wrap" style="margin: -20px;">
            <div class="con">
                <div class="left">
                    <div
                        v-for="el in list"
                        :key="el.type"
                        class="drag-item"
                        draggable="true"
                        @dragstart="dragstart($event, el)"
                    >
                        <i v-if="el.icon" :class="[el.icon]" class="iconfont"></i>
                        {{ el.label }}
                    </div>
                </div>
                <div ref="mid" class="mid">
                    <div class="work">
                        <div>
                            <a-tooltip slot="suffix" effect="dark" title="放大">
                                <i class="iconfont icon-plus-circle" @click="scale(true)"></i>
                            </a-tooltip>
                            <a-tooltip slot="suffix" effect="dark" title="当前画布缩放比例">
                                <span style="width: 45px;text-align: center;">{{ $multiply(curZoom, 100) }}%</span>
                            </a-tooltip>
                            <a-tooltip slot="suffix" effect="dark" title="缩小">
                                <i class="iconfont icon-minus-circle" @click="scale(false)"></i>
                            </a-tooltip>
                        </div>
                        <div>
                            <a-tooltip slot="suffix" effect="dark" title="网格辅助线">
                                <a-switch
                                    v-model="grid"
                                    :active-color="switchColors.active"
                                    :inactive-color="switchColors.inactive"
                                />
                            </a-tooltip>
                        </div>
                    </div>
                    <G6Editor
                        ref="editor"
                        :disHeight="45"
                        :data="data"
                        :grid="grid"
                        :width.sync="width"
                        :height.sync="height"
                        @dragover="dragover"
                        @drop="drop"
                        @nodeSelect="nodeSelect"
                        @zoom="onZoom"
                    ></G6Editor>
                </div>
                <div class="right">
                    <vue-scroll wrap-class="scrollbar-wrapper">
                        <div class="flex title-tip">
                            <div class="flex-primary">
                                <h5 :class="{defaultModel:isDefaultModelInfo}" class="title-info">节点信息</h5>
                            </div>
                        </div>
                        <a-alert
                            v-if="isDefaultModelInfo"
                            message="暂未选择节点"
                            type="info"
                            show-icon
                            style="margin: 20px;"
                        ></a-alert>
                        <div v-else style="padding: 10px;">
                            <component
                                ref="modelInfoBody"
                                :is="modelInfoKey"
                                :data="currentNodeData"
                                :selectData="selectData"
                                :lineTypes="lineTypes"
                                @save="saveNode"
                            />
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script>
    import {uniqueId, isObject} from "lodash";
    import G6Editor from "@/components/G6Editor";
    import dataMenu from "./dataMenu";
    import DiamondNodeInfo from "./components/DiamondNodeInfo";
    import RectNodeInfo from "./components/RectNodeInfo";
    import EllipseNodeInfo from "./components/EllipseNodeInfo";
    import LineInfo from "./components/LineInfo";
    import {switchColors} from "@/utils/variables";
    import {
        Api_ActModelGetModel,
        Api_ActModelGetModelUpdate
    } from "@/api/admin/m/index";
    import {Api_comboboxDict} from '@/api/admin/index'

    export default {
        name: "ModelBuild",
        components: {
            G6Editor,
            RectNodeInfo,
            DiamondNodeInfo,
            EllipseNodeInfo,
            LineInfo
        },
        props: {
            selectData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                switchColors,
                visible: false,
                list: dataMenu,
                curZoom: 1,
                editor: null,
                grid: true, // 是否生成网格辅助线
                width: 0,
                height: 0,
                data: {},
                drawerBtns: [
                    {
                        text: "关闭",
                        click: () => {
                            this.visible = false;
                            this.onDrawerClose();
                        }
                    },
                    {
                        text: "预览",
                        type: "primary",
                        click: () => {
                            const d = this.editor.getData();
                            sessionStorage.setItem("modelPreviewData", JSON.stringify(d));
                            window.open("/model/view");
                        }
                    },
                    {
                        text: "确定",
                        type: "primary",
                        click: () => {
                            this.handleSure();
                        }
                    }
                ],
                isDefaultModelInfo: true, // 指示当前是否为默认模型信息，false时指示当前是具体节点的模型信息
                modelInfoKey: "", // 模型详情信息组件名key
                currentNodeData: null, // 点击当前图形节点时的数据
                lineTypes: [] // 线的类型
            };
        },
        mounted() {
            this.editor = this.$refs.editor;
            this.width = window.innerWidth - 150 - 450;
            this.height = window.innerHeight - 90;
            Api_comboboxDict('line_type').then(res => {
                this.lineTypes = res
            })
        },
        methods: {
            openModel() {
                this.visible = true;
                Api_ActModelGetModel(this.selectData.id, 'wf_actmodel').then(res => {
                    let {text: model} = res;
                    if (model) {
                        model = JSON.parse(model)
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
                                    shape: item.type ? (item.type === '0' ? 'line' : 'polyline2') : 'line',
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
                        };
                    }
                });
            },
            // 抓取元素
            dragstart(e, row) {
                console.log(e,'llll');
                console.log(row,'行');
                e.dataTransfer.setData("Text", JSON.stringify(row));
            },
            dragover(e) {
                e.preventDefault();
            },
            onZoom(zoom) {
                this.curZoom = Number(zoom);
            },
            // 放置元素
            drop(e) {
                e.preventDefault();
                const {pageX, pageY} = e;
                let row = e.dataTransfer.getData("Text");
                const editorOffset = this.editor.$el.getBoundingClientRect();
                const editorLeft = pageX - editorOffset.left;
                const editorTop = pageY - editorOffset.top;
                if (row) {
                    try {
                        row = JSON.parse(row);
                        if (row.shape) {
                            const point = this.editor.graph.getPointByCanvas(
                                editorLeft,
                                editorTop
                            );
                            const id = uniqueId()
                            const model = {
                                ...row,
                                id,
                                x: point.x,
                                y: point.y,
                                data: {
                                    id,
                                    x: point.x,
                                    y: point.y,
                                    type: row.type,
                                    name: row.label,
                                }
                            };
                            this.editor.addItem("node", model);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            // 手动放大/缩小画布, type: true 放大，false 缩小
            scale(type) {
                if (type) {
                    this.curZoom = this.$add(this.curZoom, 0.1);
                } else {
                    this.curZoom = this.$subtract(this.curZoom, 0.1);
                }
                this.editor.graph.zoomTo(this.curZoom);
            },
            // 保存节点或线编辑的信息
            saveNode(nodeId, nodeData) {
                this.editor.updateItem(nodeId, nodeData);
                this.$message.success("更新节点信息成功！");
            },
            // 抽屉确认
            handleSure() {
                
                const data = this.editor.getData(); // 获取所有节点/线数据

                let {nodes: tasks, edges: lines} = data;
            
                tasks = tasks.map(item => {
                    return {
                        ...item.data,
                        x: item.x,
                        y: item.y,
                    }
                });
                var linesWrap=[];
                lines.map(item=>{
                    
                     if(item.shape=='line'){
                         linesWrap.push(item)
                     }
                })
               
                linesWrap = linesWrap.map(item => {
                    return {
                        ...item.data,
                        startId: isObject(item.source) ? item.source.getModel().id : item.source,
                        endId: isObject(item.target) ? item.target.getModel().id : item.target,
                        points: item.points
                    }
                });
                const loading = this.$openLoading();
                Api_ActModelGetModelUpdate(this.selectData.id, 'wf_actmodel', {
                    saasCode: this.$store.getters.selectSaasCode,
                    text: JSON.stringify({
                        tasks,
                        lines:linesWrap
                    })
                }).then(() => {
                    this.$message.success('保存成功');
                    loading.close();
                    this.visible = false;
                    this.onDrawerClose();
                }).catch(() => {
                    loading.close();
                });
            },
            // 节点错误
            nodeError(node) {
                // 获取该节点上的第一个图形
                const shape = node.getKeyShape();
                let diff = 0;
                const step = 1;
                // 该图形的动画
                shape.animate(
                    {
                        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
                        onFrame(ratio) {
                            const matrix = Util.mat3.create();
                            if (ratio <= 0.2) {
                                diff += step;
                            } else if (ratio > 0.2 && ratio <= 0.4) {
                                diff -= step;
                            } else if (ratio > 0.4 && ratio <= 0.6) {
                                diff += step;
                            } else if (ratio > 0.6 && ratio <= 0.8) {
                                diff -= step;
                            } else if (ratio > 0.8 && ratio <= 0.99) {
                                diff += step;
                            } else {
                                diff = 0;
                            }
                            const toMatrix = Util.transform(matrix, [["t", diff, 0]]);
                            return {
                                matrix: toMatrix
                            };
                        }
                    },
                    800,
                    "easeLinear"
                ); // 一次动画持续的时长为 3000，动画效果为 'easeCubic'
            },
            // 线错误
            edgeError(edge) {
                // 获取该节点上的第一个图形
                const shape = edge.getKeyShape();
                const {
                    _attrs: {lineWidth, stroke}
                } = shape;
                let newStroke = "red";
                let diff = 0;
                const step = 0.2;
                // 该图形的动画
                shape.animate(
                    {
                        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
                        onFrame(ratio) {
                            if (ratio <= 0.2) {
                                diff += step;
                            } else if (ratio > 0.2 && ratio <= 0.4) {
                                diff -= step;
                            } else if (ratio > 0.4 && ratio <= 0.6) {
                                diff += step;
                            } else if (ratio > 0.6 && ratio <= 0.8) {
                                diff -= step;
                            } else if (ratio > 0.8 && ratio <= 0.99) {
                                diff += step;
                            } else {
                                diff = 0;
                                newStroke = stroke;
                            }
                            return {
                                lineWidth: lineWidth + diff,
                                stroke: newStroke
                            };
                        }
                    },
                    800,
                    "easeLinear"
                ); // 一次动画持续的时长为 3000，动画效果为 'easeCubic'
            },
            // 节点或线被选择
            nodeSelect(data, type, selected) {
                if (selected) {
                    this.currentNodeData = data;
                    this.isDefaultModelInfo = false;
                    let k = "";
                    switch (data.type) {
                        case "startTask":
                            k = "RectNodeInfo";
                            break;
                        case "userTask":
                            k = "DiamondNodeInfo";
                            break;
                        case "endTask":
                            k = "EllipseNodeInfo";
                            break;
                        default:
                            break;
                    }
                    if (type === 'line') {
                        k = "LineInfo";
                    }
                    this.modelInfoKey = k;
                } else {
                    this.currentNodeData = null;
                    this.isDefaultModelInfo = true;
                    this.modelInfoKey = null;
                }
            },
            // 从具体节点模型信息中返回默认的主信息
            backDefaultModelInfo() {
                this.isDefaultModelInfo = true;
                this.modelInfoKey = "";
                this.currentNodeData = null;
            },
            onDrawerClose() {
                this.curZoom = 1;
                this.isDefaultModelInfo = true;
                this.data = {}
                this.$refs.editor.clear();
            }
        }
    };
</script>
<style lang="scss" scoped>
    /deep/ .drawer-body .vue-scroll__view {
        height: 100%;
        padding: 0;
    }

    .vue-scroll {
        height: 100%;
    }

    /deep/ .scrollbar-wrapper {
        overflow-x: hidden !important;

        .vue-scroll__view {
            height: 100%;
            padding: 10px;
        }
    }
</style>
<style lang="scss" scoped>
    .title-tip {
        border-bottom: 1px solid #ccc;
        padding: 0 10px;
        height: 45px;
        line-height: 45px;
    }

    .title-info {
        text-align: center;
        height: 30px;
        line-height: 30px;
        transition: all 0.2s;
        margin: 0;
        display: inline-block;
    }

    .defaultModel {
        display: block;
        width: 100%;
    }

    .wrap,
    .con,
    .droppable-wrap {
        height: 100%;
        position: relative;
    }

    .con {
        &::after {
            content: "";
            display: block;
            clear: both;
        }

        display: flex;

        .left {
            width: 150px;
            padding: 15px 6px;
            border-right: 1px solid #d2d4d4;
            background-color: #f5f5f5;
        }

        .mid {
            flex: 1;
            overflow: hidden;
        }

        .right {
            width: 450px;
            height: calc(100vh - 45px);
            background-color: #f5f5f5;
            border-left: 1px solid #dad8d8;
        }
    }

    .el-tabs__nav {
        & > div {
            width: 50%;
        }
    }

    .action i {
        cursor: pointer;

        &.el-icon-plus:hover {
            color: green;
        }

        &.el-icon-minus:hover {
            color: red;
        }
    }

    .drag-item {
        padding: 6px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
        font-size: 14px;
        margin-bottom: 5px;

        &:nth-child(2n + 1) {
            background-color: rgba(176, 224, 230, 0.5);
            border-color: #dad8d8;
        }

        &:hover {
            border-color: #5483bf;
            border-radius: 30px;
        }
    }

    .work {
        border-bottom: 1px solid #d2d4d4;
        padding: 8px;
        height: 45px;
        background-color: rgba(176, 224, 230, 0.5);
        text-align: right;

        & > div {
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            vertical-align: middle;
        }

        i {
            font-size: 18px;
            cursor: pointer;
        }
    }
</style>
