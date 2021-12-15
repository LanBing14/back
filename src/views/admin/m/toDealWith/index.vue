<template>
    <div class="dealWith-wrap">
        <div v-show="!isFull" class="tabs-wrap">
            <div class="actions">
                <div>
                    <a-tooltip class="item" effect="dark" title="刷新表格">
                        <i class="iconfont icon-sync" @click="freshenList(true)"></i>
                    </a-tooltip>
                </div>
                <MoreEnter
                    icon="icon-fullscreen"
                    @click="onMoreEnter()"
                />
            </div>
            <a-tabs v-model="tabName">
                <a-tab-pane tab="待办事项" key="todo" forceRender>
                    <TodoBody ref="ref_todoBodyMin" type="min" @openCustom="handleOpenCustom"></TodoBody>
                </a-tab-pane>
                <a-tab-pane tab="已办事项" key="done" forceRender>
                    <DoneBody ref="ref_doneBodyMin" type="min" @openCustom="handleOpenCustom"></DoneBody>
                </a-tab-pane>
                <a-tab-pane tab="我的申请" key="apply" forceRender>
                    <ApplyBody ref="ref_applyBodyMin" type="min" @openCustom="handleOpenCustom"></ApplyBody>
                </a-tab-pane>
            </a-tabs>
        </div>
        <TodoBody
            v-if="isFullTodo"
            ref="ref_todoBodyMax"
            :class="{entry: isFullTodo}"
            type="max"
            @openCustom="handleOpenCustom"
            @exist="onMoreExist"
        />
        <DoneBody
            v-if="isFullDone"
            ref="ref_doneBodyMax"
            :class="{entry: isFullDone}"
            type="max"
            @openCustom="handleOpenCustom"
            @exist="onMoreExist"
        />
        <ApplyBody
            v-if="isFullApply"
            ref="ref_applyBodyMax"
            :class="{entry: isFullApply}"
            type="max"
            @openCustom="handleOpenCustom"
            @exist="onMoreExist"
        />
        <Custom
            ref="ref_custom"
            :formId="formId"
            :taskId="taskId"
            :viewId="viewId"
            :compKey="compKey"
            :modelStatus="modelStatus"
            @getList="freshenList"
        >
        </Custom>
    </div>
</template>

<script type="text/jsx">
    import MoreEnter from '@/components/MoreEnter';
    import Custom from './Custom';
    import TodoBody from './components/TodoBody';
    import DoneBody from './components/DoneBody';
    import ApplyBody from './components/ApplyBody';

    export default {
        name: 'ToDealWith',
        components: {
            MoreEnter,
            Custom,
            TodoBody,
            DoneBody,
            ApplyBody
        },
        data() {
            return {
                compKey: '',
                tabName: 'todo',
                isTodoMoreQuery: false, // 待办，高级查询条件
                customVisible: false, // 配置的页面是否要显示了
                isFullTodo: false, // 待办全屏
                isFullDone: false, // 已办全屏
                isFullApply: false, // 我的申请全屏

                todoPageSize: 5, // 待办——分页数
                donePageSize: 5, // 已办——分页数

                doneQuery: {}, // 已办——查询条件
                modelStatus: '',
                formId: '', // 通用表单模型id
                taskId: '', // 流程id
                viewId: '', // 当前此条记录id
                curFullScreenKey: '' // 当前进入全部展示的是表格
            };
        },
        computed: {
            isFull() { // 待办/已办，是否有全屏的
                if (this.isFullTodo) {
                    return true;
                } else if (this.isFullDone) {
                    return true;
                } else if (this.isFullApply) {
                    return true;
                }
                return false;
            }
        },
        mounted() {
            this.$refs.ref_todoBodyMin.loadData();
            this.$refs.ref_doneBodyMin.loadData();
            this.$refs.ref_applyBodyMin.loadData();
        },
        methods: {
            // 刷新所有表格数据
            freshenList(isSingle) {
                if (isSingle) {
                    if (this.tabName === 'todo') {
                        this.$refs.ref_todoBodyMin.loadData();
                    }
                    if (this.tabName === 'done') {
                        this.$refs.ref_doneBodyMin.loadData();
                    }
                    if (this.tabName === 'apply') {
                        this.$refs.ref_applyBodyMin.loadData();
                    }
                    return;
                }
                this.$refs.ref_todoBodyMin && this.$refs.ref_todoBodyMin.loadData();
                this.$refs.ref_todoBodyMax && this.$refs.ref_todoBodyMax.loadData();
                this.$refs.ref_doneBodyMin && this.$refs.ref_doneBodyMin.loadData();
                this.$refs.ref_doneBodyMax && this.$refs.ref_doneBodyMax.loadData();
                this.$refs.ref_applyBodyMin && this.$refs.ref_applyBodyMin.loadData();
                this.$refs.ref_applyBodyMax && this.$refs.ref_applyBodyMax.loadData();
            },
            // 待办/已办——进入更多数据页面
            onMoreEnter() {
                if (this.tabName === 'todo') {
                    this.isFullTodo = true;
                }
                if (this.tabName === 'done') {
                    this.isFullDone = true;
                }
                if (this.tabName === 'apply') {
                    this.isFullApply = true;
                }
            },
            onMoreExist(key) {
                if (key === 'todo') {
                    this.isFullTodo = false;
                }
                if (key === 'done') {
                    this.isFullDone = false;
                }
                if (key === 'apply') {
                    this.isFullApply = false;
                }
            },
            // 打开配置的处理页面
            handleOpenCustom(row, modelStatus) {
                this.modelStatus = modelStatus;
                const {form_key, business_key, id} = row;
                if (form_key) {
                    const [compKey, compParams] = form_key.split('?');
                    if (!compKey) {
                        this.$message.warning('该流程未正确配置，缺少formKey！')
                        return
                    }
                    this.compKey = compKey;
                    if (compParams) {
                        this.formId = compParams.split('=')[1];
                    }
                    this.taskId = id;
                    this.viewId = business_key;
                    this.$refs.ref_custom.openModel(row);
                }
            }
        }
    };
</script>
<style>
    @keyframes ani-icon-sync {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>
<style scoped lang="scss">
    .el-card__header {
        .flex {
            align-items: center;
        }
    }

    /deep/ .box-card {
        box-shadow: none;

        .el-card__header {
            padding: 10px 20px;
        }
    }

    /deep/ .el-tabs__nav-wrap {
        padding: 0 20px;
    }

    .tabs-wrap {
        position: relative;
        /*操作*/
        .actions {
            position: absolute;
            right: 20px;
            height: 40px;
            padding-top: 9px;
            z-index: 10;

            & > div {
                display: inline-block;
                margin-left: 10px;
                vertical-align: middle;
            }

            .el-icon-search {
                cursor: pointer;
            }

            .icon-sync {
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
            }

            .icon-sync:hover {
                color: #000;
                animation: ani-icon-sync 2s infinite linear;
            }
        }

        /*tab页*/
        /deep/ .el-tabs__header {
            margin-bottom: 0;
        }
    }

    .dealWith-wrap {
        min-height: 477px;
        height: 100%;
        background-color: #fff;

        /deep/ .box-card {
            transition: all 1s;
            border: none;

            .el-card__body {
                position: relative;
                padding: 10px 20px;
            }

            &.isFull {
                height: 100%;
            }

            &.hide {
                height: 0;
                margin-top: 0;
            }

            .icon-down-wrap {
                text-align: center;
                margin-top: -20px;

                span {
                    display: inline-block;
                    border: 1px solid currentColor;
                    border-top: none;
                    padding: 0 10px;
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                    cursor: pointer;
                    color: #cdcfd4;
                    transition: color 0.2s;
                    overflow: hidden;

                    i {
                        color: inherit;
                    }

                    &:hover {
                        color: #4B9DF3;
                    }
                }
            }

            /deep/ .more {
                display: inline-block;
                vertical-align: middle;
            }

            /deep/ .el-pagination__sizes {
                display: none;
            }

            &.isFull /deep/ .el-pagination__sizes {
                display: inline-block;
            }
        }
    }

    /deep/ .searchForm-wrap {
        vertical-align: middle;
        position: absolute;
        top: 3px;
        left: 100px;
        transition: all 0.3s;
        font-size: 0;
        background-color: transparent;
        padding: 0;

        & > div:first-child {
            margin-right: 10px;
        }

        /deep/ .el-form-item {
            .el-form-item__content {
                font-size: 0;
            }
        }

        &.moreQuery {
            position: relative;
            top: 0;
            left: 0;
            flex-direction: column;
            align-items: flex-start;
        }

        .extend-text {
            color: #4B9DF3;
            cursor: pointer;
            font-size: 12px;
            margin-left: 15px;
            min-width: auto;
        }
    }

    /deep/ .ant-card-body {
        padding: 20px;
    }

    /deep/ .ant-card-wider-padding .ant-card-head {
        padding: 0 20px;
    }
</style>
