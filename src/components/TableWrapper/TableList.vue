<template>
    <div class="tableWrapper">
        <div class="tool-wrap flex">
            <div class="flex-primary">
                <!--table工具按钮-->
                <slot name="tool">
                    <a-button v-for="(el, index) in toolActions"
                              :key="index"
                              :icon="el.icon"
                              type="primary"
                              class="tool-btn"
                              @click="el.click">
<!--                        <i-->
<!--                            v-if="el.icon"-->
<!--                            :class="el.icon"-->
<!--                            class="iconfont "></i>-->
                        {{ el.text }}
                    </a-button>
                </slot>
            </div>
        </div>
        <div class="el-table--mini" v-loading="listLoading">
            <ul class="tableListStyle">
                <li v-for="dataEl in list" :key="dataEl.id">
                    <div v-for="(columnOutEl, index) in columnsData" :key="index" class="out-item">
                        <div
                            v-for="(columnInEl, indexEl) in columnOutEl"
                            :key="indexEl"
                            :style="{width:columnInEl.width,...columnInEl.style}"
                            class="in-item"
                        >
                            <label class="in-item-label" v-if="labelShow(columnInEl.label)"
                                   :style="{width:columnInEl.labelWidth}"
                            >{{ columnInEl.label }}</label>
                            <div class="in-item-control"
                                 :style="{textAlign:columnInEl.align,...columnInEl.controlStyle}">
                                <Render
                                    v-if="columnInEl.render"
                                    :row="dataEl"
                                    :field="columnInEl.key"
                                    :render="columnInEl.render"
                                />
                                <template v-else>
                                    {{ dataEl[columnInEl.key] }}
                                </template>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="el-table__empty-text" v-if="!list.length">
                <div style="margin: 15px 0;">
                    <svg-icon icon-class="table-nodata" style="width: auto;height: 50px;"/>
                </div>
                <div>
                    暂无数据
                </div>
            </div>
        </div>
        <a-pagination
            v-if="pagination && total>0"
            v-model="currentPage"
            :total="total"
            :pageSize.sync="pageSize"
            :pageSizeOptions="pageSizes"
            showSizeChanger
            class="page-wrap"
            @showSizeChange="fetchData"
        />
        <!--        <Pagination-->
        <!--            v-if="pagination"-->
        <!--            v-show="total>0"-->
        <!--            :total="total"-->
        <!--            :page.sync="currentPage"-->
        <!--            :limit.sync="pageSize"-->
        <!--            :page-sizes="pageSizes"-->
        <!--            @pagination="fetchData"-->
        <!--/>-->
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
    import Render from './render';

    export default {
        name: 'TableListStyle',
        components: {Pagination, Render},
        filters: {
            filterShowOverflowTooltips(arr, index) {
                return arr.includes(index);
            }
        },
        props: {
            // 传递给el-table的属性
            tableProps: Object,
            // 传过来的数据，如果有则不进行接口调用
            data: {
                type: Array,
                default: () => null
            },
            // 获取数据的接口
            fetchDataFn: {
                type: Function,
                default: () => null
            },
            // 接口查询条件
            query: {
                type: Object,
                default: () => ({})
            },
            // 定义显示列的相关配置
            columns: {
                type: Array,
                default: () => []
            },
            // 是否处于加载中
            loading: {
                type: Boolean,
                default: () => false
            },
            // 是否开启多选
            checkbox: {
                type: Boolean,
                default: () => false
            },
            // 上一次的数据索引
            preIndex: {
                type: Number,
                default: () => 0
            },
            // 单选时表格行数据改变时
            currentChange: {
                type: Function,
                default: () => () => {
                }
            },
            // 每行的点击
            rowClick: {
                type: Function,
                default: () => () => {
                }
            },
            // 是否需要分页
            pagination: {
                type: Boolean,
                default: () => true
            },
            // 每页显示数量
            size: {
                type: Number,
                default: () => 10
            },
            // 每面显示条目控制
            pageSizes: {
                type: Array,
                default: () => ['10', '20', '30', '50', '100']
            },
            // 是否开启展开行功能
            expand: {
                type: Boolean,
                default: () => false
            },
            // 是否需要列筛选
            filterGroup: {
                type: Boolean,
                default: () => true
            },
            // 是否要高亮当前行
            highlight: {
                type: Boolean,
                default: () => true
            },
            // 可选择给创建每行加上class类名
            rowClassName: {
                type: Function,
                default: () => () => {
                }
            },
            toolActions: Array
        },
        data() {
            return {
                listLoading: this.loading,
                list: this.data || [],
                total: 0,
                pageSize: this.size,
                currentPage: 1,
                filterOptions: [],
                formTheadOptions: [],
                columnsData: this.columns
            };
        },
        watch: {
            data: function (val) {
                this.list = val;
            },
            loading: function (val) {
                this.listLoading = val;
            },
            filterOptions: function (valArr) {
                this.columnsData = this.columns.filter((i, index) => {
                    return valArr.indexOf(index) >= 0;
                });
            }
        },
        created() {
            this.filterOptions = this.columns.map((item, index) => {
                return index;
            });
        },
        methods: {
            // 获取数据
            fetchData(pageReset) {
                if (this.fetchDataFn === null || this.data !== null) return;
                if (pageReset === true) {
                    this.currentPage = 1;
                }
                this.listLoading = true;
                const query = {
                    ...this.query,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                };
                this.fetchDataFn(query).then(response => {
                    this.list = response.data;
                    this.total = response.totalRecordNumber;
                    this.listLoading = false;
                    this.$emit('onSuccessData', this.list);
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            getTableIndex(index) {
                return (index + 1) + (this.currentPage - 1) * this.pageSize + this.preIndex;
            },
            labelShow(label) {
                return label !== undefined && typeof label === 'string';
            }
        }
    };
</script>

<style scoped lang="less">
    .tableWrapper {
        background-color: transparent;
        min-height: 100%;
        width: 100%;

        .tool-wrap {
            .tool-btn {
                margin-right: 10px;
                margin-bottom: 15px;
            }
        }

        .iconfont {
            margin-right: 10px;
        }

        .iconfont:last-child {
            margin-right: 0;
        }

        .tableListStyle {
            list-style: none;
            padding: 0;

            li {
                & + li {
                    margin-top: 20px;
                }

                padding: 20px 15px;
                background-color: #fff;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;

                .out-item + .out-item {
                    margin-top: 8px;
                }

                .el-button + .el-button {
                    margin-left: 10px;
                }

                .el-button {
                    font-size: 14px;
                }

                .out-item {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;

                    &::after {
                        content: '';
                        display: block;
                        clear: both;
                    }
                }

                .in-item {
                    float: left;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 0 10px;
                    margin-top: 5px;
                    margin-bottom: 5px;

                    .in-item-label {
                        font-weight: normal;
                        font-size: 14px;
                        vertical-align: middle;
                        color: #666;
                    }

                    .in-item-control {
                        flex: 1;
                        vertical-align: middle;
                        color: #999;
                        margin-left: 10px;
                    }
                }
            }
        }

        /deep/ .el-table__empty-text {
            line-height: normal;
            color: #909399;
            font-size: inherit;
            padding: 40px 0;
            text-align: center;
            margin: auto;
        }
    }
    .page-wrap{
        text-align: right;
        margin-top: 20px;
    }
</style>
