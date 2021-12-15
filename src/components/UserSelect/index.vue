<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-row>
          <a-col :span="12">
            <a-radio-group v-model="kind">
              <a-radio-button value="1">部门</a-radio-button>
              <a-radio-button value="2">角色</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="12">
            <InputSearch
              ref="inputSearch"
              :fetchDataFn="Api_UserGetForSearch"
              :data.sync="selectSearchResList"
              @selectChange="selectChange"
              placeholder="请输入名称"
            ></InputSearch>
          </a-col>
        </a-row>
        <a-row class="select-left">
          <div v-show="kind==='1'">
            <a-tree
              ref="depTree"
              :treeData="depData"
              :highlight-current="true"
              node-key="id"
              expand-on-click-node
              check-on-click-node
              show-checkbox
              check-strictly
              default-expand-all
              @select="checkChange"
            />
          </div>
          <div v-show="kind==='2'">
            <!-- <a-checkbox-group v-model="roleCheckList">
              <ul class="roleList">
                <li v-for="el in roleData" :key="el.id">
                  <span>{{ el.label }}</span>
                  <a-checkbox :value="el.value" @change="roleChange(el.value)">&nbsp;</a-checkbox>
                </li>
              </ul>
            </a-checkbox-group>-->
            <a-radio-group :options="roleData" v-model="roleCheckList" @change="roleChange">
              <span slot="label" slot-scope="{value}">{{value}}</span>
            </a-radio-group>
          </div>
        </a-row>
      </a-col>
      <a-col :span="12" style="padding-left: 20px;">
        <div class="title-border-left">待选人员</div>
        <div v-loading="loadingWaitChoose" class="people-wrap">
          <vue-scroll>
            <ul class="wait-choose">
              <li v-for="el in waitChooseList" :key="el.id" @click="addWaitChecked(el);">
                <a>{{ el.name + (el.username ? ('（'+el.username+'）') : '') }}</a>
              </li>
              <li v-if="waitChooseList.length===0" style="text-align: center">暂无数据</li>
            </ul>
          </vue-scroll>
        </div>
        <div class="title-border-left" style="margin-top: 20px;">已选人员</div>
        <div class="people-wrap">
          <vue-scroll>
            <ul class="be-choose">
              <li v-for="el in waitCheckedList" :key="el.id">
                <a>{{ el.name + (el.username ? ('（'+el.username+'）') : '') }}</a>
                <label class="status-label" @click="handleDel(el.id)">
                  <i class="close el-icon-close"></i>
                </label>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import InputSearch from "./InputSearch";
import {
  Api_DepartmentsFetchTree, // 查询部门树
  Api_RolesCombobox, // 查询角色列表
  Api_UserGetForSearch,
  Api_DepartmentsGetForFilter,
  Api_RolesGetForFilter
} from "@/api/admin/system/index";

export default {
  name: "UserSelect",
  components: { InputSearch },
  data() {
    return {
      Api_UserGetForSearch,
      username: "",
      kind: "1",
      loadingWaitChoose: false, // 待选区的loading加载状态
      selectOptions: [], // 根据搜索文字查询的option
      selectLoading: false, // 远程搜索loading状态
      selectSearchResList: [], // 远程搜索返回的结果数据

      depData: [], // 左侧部门数据
      roleData: [
        {
          // 左侧角色数据
          label: "我是人",
          value: "aaa"
        },
        {
          label: "我是w",
          value: "bbb"
        }
      ],
      depCheckList: [], // 左侧筛选条件部门选中的数据
      roleCheckList: "", // 左侧筛选条件角色选中的数据
      waitChooseList: [], // 右侧待选数据
      waitCheckedList: [] // 右侧选中的数据
    };
  },
  mounted() {
    // 获取左侧树部门
    Api_DepartmentsFetchTree('', this.$store.getters.selectSaasCode).then(res => {
      this.depData = this.$turnTreeData(res);
    });
    // 获取左侧角色列表
    Api_RolesCombobox({saasCode: this.$store.getters.selectSaasCode}).then(res => {
      this.roleData = res;
    });
  },
  methods: {
    // 部门树节点选中事件
    checkChange(node) {
      const currKey = node[0];
      //   this.$refs.depTree.setCheckedKeys([currKey]);
      this.loadingWaitChoose = true;
      Api_DepartmentsGetForFilter(currKey)
        .then(res => {
          this.waitChooseList = res;
          this.loadingWaitChoose = false;
        })
        .catch(() => {
          this.loadingWaitChoose = false;
        });
      this.roleCheckList = "";
    },
    // 角色列表选中切换事件
    roleChange(v) {
      console.log(v);
      this.roleCheckList = v.target.value;
      this.loadingWaitChoose = true;
      Api_RolesGetForFilter(v.target.value)
        .then(res => {
          this.waitChooseList = res;
          this.loadingWaitChoose = false;
        })
        .catch(() => {
          this.loadingWaitChoose = false;
        });
      // console.log(this.$refs.depTree)
      //   this.$refs.depTree && this.$refs.depTree.setCheckedKeys([]);
    },
    // 更新选中人员数据
    updateSelected(newDataList) {
      this.waitCheckedList = newDataList;
    },
    // 右侧待选人员选中事件
    addWaitChecked(row) {
      const { id } = row;
      let flag = false;
      // let index = 0;
      this.waitCheckedList.forEach(item => {
        if (item.id === id) {
          flag = true;
          // index = i;
        }
      });
      if (flag) {
        // this.waitCheckedList.splice(index, 1)
      } else {
        this.waitCheckedList.push(Object.assign({}, row));
      }
    },
    addWaitChecked2(row) {
      const { id } = row;
      let flag2 = false;
      let index2 = 0;
      const inputSearchSelectedData = this.$refs.inputSearch.getCurSelectData();
      const inputSearchDefaultSelectedData = [...inputSearchSelectedData];
      inputSearchDefaultSelectedData.forEach((item, i) => {
        if (item.id === id) {
          flag2 = true;
          index2 = i;
        }
      });
      if (flag2) {
        inputSearchDefaultSelectedData.splice(index2, 1);
      } else {
        inputSearchDefaultSelectedData.push(Object.assign({}, row));
      }
    },
    // 右侧已选择人员删除事件
    handleDel(value) {
      this.waitCheckedList = this.waitCheckedList.filter(item => {
        return item.id !== value;
      });
    },
    // 根据选中的待选人员显示对应的选中状态
    filterWaitChoose(value) {
      let flag = false;
      this.waitCheckedList.forEach(item => {
        if (item.id === value) {
          flag = true;
        }
      });
      return flag;
    },
    // 搜索数据改变时
    selectChange(row) {
      for (let i = 0; i < this.selectSearchResList.length; i++) {
        if (row.id === this.selectSearchResList[i].id) {
          this.addWaitChecked(this.selectSearchResList[i]);
          break;
        }
      }
    },
    // 返回当前已选择的人员
    getSelectData() {
      return this.waitCheckedList;
    },
    // 重置所有数据状态
    reset() {
      this.waitChooseList = [];
      this.waitCheckedList = [];
      //   this.$refs.depTree.setCheckedKeys([]);
      this.$refs.inputSearch.clearInputVal();
    }
  }
};
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "../../styles/element-variables.scss";

.select-left {
  overflow: hidden;
  padding: 15px 0;

  /deep/ .a-checkbox {
    position: absolute;
    right: 0;
  }
}

/*左侧角色列表*/
ul.roleList {
  padding-left: 0;

  li {
    cursor: pointer;
    overflow: hidden;
    font-size: 14px;
    padding: 5px 8px;

    &:hover {
      background-color: #f5f7fa;
    }

    .a-checkbox {
      margin-right: 8px;
    }

    /deep/ .a-checkbox__label {
      display: none;
    }
  }
}

/*标题左边线*/
.title-border-left {
  border-left: 3px solid $--color-primary;
  padding: 2px 10px;
  margin: 4px 0 10px 0;
}

.people-wrap {
  height: 200px;
  border: 1px solid #ebeef5;

  /deep/ .el-scrollbar__wrap {
    max-height: 200px;
  }
}

/*待选人员*/
ul.wait-choose,
ul.be-choose {
  list-style: none;
  padding: 10px;
  margin: 0;

  li + li {
    border-top: 1px solid #ebeef5;
  }

  li {
    overflow: hidden;
    padding: 5px 8px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:hover {
      background-color: #f5f7fa;
    }

    a {
      display: inline-block;
      float: left;
      max-width: calc(100% - 20px);
    }

    .status-label {
      float: right;

      i {
        cursor: pointer;
      }

      i.success {
        color: #67c23a;
      }
    }
  }
}
/deep/ .ant-radio-wrapper {
  line-height: 32px;
  display: block;
}
</style>
