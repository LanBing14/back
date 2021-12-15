<template>
  <Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="selectData.name+'——建模'"
    :btn="drawerBtns"
    fullscreen
  >
    <div class="wrap">
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
            :width="width"
            :height="height"
            :data="data"
            :grid="grid"
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
              <!--                            <i v-if="!isDefaultModelInfo" class="el-icon-circle-close" @click="backDefaultModelInfo"/>-->
            </div>
            <a-alert v-if="isDefaultModelInfo" message="暂未选择节点" type="info" show-icon></a-alert>
            <template v-else>
              <component
                ref="modelInfoBody"
                :is="modelInfoKey"
                :data="currentNodeData"
                @save="saveNode"
              />
            </template>
          </vue-scroll>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { Util } from "@antv/g6";
import G6Editor from "@/components/G6Editor";
import dataMenu from "./dataMenu";
import DiamondNodeInfo from "./components/DiamondNodeInfo";
import RectNodeInfo from "./components/RectNodeInfo";
import TextNodeInfo from "./components/TextNodeInfo";
import LineInfo from "./components/LineInfo";
import { switchColors } from "@/utils/variables";
import {
  Api_SupervisionGetModel,
  Api_SupervisionGetModelUpdate
} from "@/api/admin/m/index";

export default {
  name: "ModelBuild",
  components: {
    G6Editor,
    RectNodeInfo,
    DiamondNodeInfo,
    TextNodeInfo,
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
      currentNodeData: null // 点击当前图形节点时的数据
    };
  },
  computed: {
    width() {
      return window.innerWidth - 150 - 350;
    },
    height() {
      return window.innerHeight - 45 - 45;
    }
  },
  mounted() {
    this.editor = this.$refs.editor;
  },
  methods: {
    openModel() {
      this.visible = true;
      Api_SupervisionGetModel(this.selectData.id).then(res => {
        const { model } = res;
        if (model) {
          if (model.nodes) {
            model.nodes.forEach(item => {
              item.anchorPoints = JSON.parse(item.anchorPoints);
              item.size = JSON.parse(item.size);
            });
          }
          if (model.edges) {
            model.edges.forEach(item => {
              if (item.style.lineDash) {
                item.style.lineDash = item.style.lineDash.split(" ");
              }
            });
          }
          delete model.id;
          this.data = model;
        }
      });
    },
    // 抓取元素
    dragstart(e, row) {
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
      const { pageX, pageY } = e;
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
            const model = {
              ...row,
              id: Util.uniqueId(),
              x: point.x,
              y: point.y
            };
            this.editor.addItem("node", model);
          }
        } catch (e) {}
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
      const { nodes, edges } = data;
      const notValidateNodes = nodes.filter(
        n => n.shape === "rectNode" && !n.formId
      ); // 不通过的节点
      const notValidateEdges = edges.filter(e => !e.sql); // 不通过的线
      if (notValidateNodes.length) {
        const names = notValidateNodes.map(n => n.label);
        notValidateNodes.forEach(({ id }) => {
          const node = this.editor.graph.findById(id);
          this.nodeError(node);
        });
        this.$message.warning("(" + names.join("、") + ")节点配置不正确");
        return;
      }
      if (notValidateEdges.length) {
        notValidateEdges.forEach(({ id }) => {
          const edge = this.editor.graph.findById(id);
          this.edgeError(edge);
        });
        this.$message.warning("连接线配置不正确");
        return;
      }
      nodes.forEach(item => {
        if (item.shape !== "textNode") {
          item.anchorPoints = JSON.stringify(item.anchorPoints);
          item.size = JSON.stringify(item.size);
        }
      });
      edges.forEach(item => {
        if (item.style.lineDash) {
          item.style.lineDash = item.style.lineDash.join(" ");
        }
      });
      const loading = this.$openLoading();
      Api_SupervisionGetModelUpdate(this.selectData.id, {
        text: JSON.stringify(data)
      })
        .then(msg => {
          this.$message.success(msg);
          loading.close();
          this.visible = false;
          this.onDrawerClose();
        })
        .catch(() => {
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
        _attrs: { lineWidth, stroke }
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
        switch (type) {
          case "rectNode":
            k = "RectNodeInfo";
            break;
          case "diamondNode":
            k = "DiamondNodeInfo";
            break;
          case "textNode":
            k = "TextNodeInfo";
            break;
          case "line":
            k = "LineInfo";
            break;
          default:
            break;
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
      this.grid = false;
      this.isDefaultModelInfo = true;
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
  margin: 0 -10px;
  padding: 0 10px 3px;
}

.title-info {
  text-align: center;
  height: 30px;
  line-height: 30px;
  transition: all 0.2s;
  margin: 0;
  display: inline-block;
  width: 4em;
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
    height: 100%;
    padding: 15px 6px;
    border-right: 1px solid #d2d4d4;
    background-color: #f5f5f5;
  }

  .mid {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .right {
    height: 100%;
    width: 350px;
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
