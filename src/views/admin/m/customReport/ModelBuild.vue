<template>
  <Drawer
    ref="drawer"
    title="配置"
    :visible.sync="visible"
    :onOk="handleSure"
    fullscreen
    @close="onClose"
  >
    <div class="wrap flex">
      <div class="left area">
        <div class="top">
          <h5 draggable="true">可选字段</h5>
          <a-tree
            :treeData="treeTop"
            draggable
            :allow-drag="allowDragTop"
            :allow-drop="allowDropTop"
            @dragenter="onDragEnter"
            @drop="onDrop"
          ></a-tree>
        </div>
        <div class="bottom flex">
          <div class="bottom-item">
            <h5>分组字段</h5>
            <ul>
              <li v-for="(el, index) in group" :key="index">{{ el.name }}</li>
            </ul>
          </div>
          <div class="bottom-item" style="min-height: 200px">
            <h5>定义列</h5>
            <a-tree ref="treeBottom" :treeData="treeBottom" draggable :allow-drop="allowDropBottom"></a-tree>
            <div
              :class="{show: treeMaskShow}"
              class="tree-mask"
              @drop="onDragend"
              @dragover="onDragover"
            ></div>
          </div>
        </div>
      </div>
      <div class="right flex-primary"></div>
    </div>
  </Drawer>
</template>

<script>
import { merge } from "lodash";

export default {
  name: "ModelBuild",
  data() {
    return {
      visible: false,
      group: [],
      treeTop: [
        {
          key: "0",
          title: "一级 1",
          children: [
            {
              key: "00",
              pid: "0",
              title: "二级 1-1",
              children: [
                {
                  key: "000",
                  pid: "00",
                  title: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          key: "1",
          title: "一级 2",
          children: [
            {
              key: "10",
              pid: "1",
              title: "二级 2-1",
              children: [
                {
                  key: "100",
                  pid: "10",
                  title: "三级 2-1-1"
                }
              ]
            },
            {
              key: "11",
              pid: "1",
              title: "二级 2-2",
              children: [
                {
                  key: "101",
                  pid: "11",
                  title: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          key: "2",
          title: "一级 3",
          children: [
            {
              key: "20",
              pid: "2",
              title: "二级 3-1",
              children: [
                {
                  key: "200",
                  pid: "20",
                  title: "三级 3-1-1"
                }
              ]
            },
            {
              key: "21",
              title: "二级 3-2",
              children: [
                {
                  key: "201",
                  pid: "21",
                  title: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      treeBottom: [
        {
          key: 0,
          title: "顶级",
          children: []
        }
      ],
      selectNode: null, // 拖动的树节点
      treeMaskShow: false // 下面树蒙层
    };
  },
  mounted() {},
  methods: {
    openModel() {
      this.visible = true;
    },
    allowDragTop({ data: { children } }) {
      return !(children && children.length);
    },
    allowDropTop() {
      return false;
    },
    // allowDrop(draggingNode, dropNode, type){
    //     return true
    // },
    dragOver(dragNode, node, event) {
      console.log(dragNode, node, event);
    },
    dragEnter() {
      console.log(1);
    },
    handleSure() {},
    onClose() {},
    // 上边树开始拖拽
    dragStartTop(node) {
      this.selectNode = node;
      this.treeMaskShow = true;
    },
    // 上面树拖拽结束
    dragEndTop(node, endNode) {
      this.selectNode = null;
      this.treeMaskShow = false;
    },
    // 拖拽放进树
    onDragend(e) {
      const node = this.selectNode;
      const choosedTrees = this.treeBottom[0].children;
      const isExist = this.isExistTree(node.data.pid, choosedTrees);
      if (isExist.flag) {
        console.log(isExist);
      } else {
        const p = this.findParent(node);
        choosedTrees.push(p);
      }
    },
    // 拖拽悬浮
    onDragover(ev) {
      ev.preventDefault();
    },
    // 底部树
    allowDropBottom() {
      return true;
    },
    // 已选择的树中是否已存在当前要放进去的节点
    isExistTree(nodePid, arr) {
      let flag = false;
      let findNode = null;
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.id === nodePid) {
          flag = true;
          findNode = item;
          break;
        } else if (item.children) {
          const r = this.isExistTree(item.id, item.children);
          flag = r.flag;
          findNode = r.node;
          if (r.flag) {
            break;
          }
        }
      }
      return {
        flag,
        node: findNode
      };
    },
    // 查找父级
    findParent(node, parent) {
      let p = parent || {};

      if (
        node.parent &&
        this.$isObject(node.data) &&
        this.$isObject(node.parent.data)
      ) {
        const pdata = merge({}, node.parent.data);
        delete pdata.children;
        p = pdata;
        p.children = [node.data];
        return this.findParent(merge({}, node.parent), p);
      }

      return p;
    },
    onDragEnter(info) {
      console.log(info);
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    onDrop(info) {
      console.log(info);
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.treeTop];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      this.treeTop = data;
    }
  }
};
</script>

<style scoped lang="scss">
.left {
  width: 30%;

  .bottom-item {
    position: relative;
    width: 50%;
    margin: 5px;

    .tree-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;

      &.show {
        display: block;
      }
    }
  }
}
</style>
