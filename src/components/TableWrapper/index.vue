<template>
    <div class="tableWrapper">
        <div class="tool-wrap flex">
            <div class="flex-primary">
                <!--table工具按钮-->
                <slot name="tool">
                    <a-button v-for="(el, index) in toolActions" :key="index" :icon="el.icon" type="primary"
                              class="tool-btn" plain @click="el.click">
                        {{ el.text }}
                    </a-button>
                </slot>
            </div>
            <div v-if="filterGroup" style="padding: 0 0 10px;margin-right: -10px;text-align: right;cursor:pointer;">
                <a-checkbox-group v-model="filterOptions">
                    <a-dropdown
                        v-model="dropdownVisible"
                        class="el-dropdown-link"
                    >
                        <a-button type="primary">
                            列筛选
                            <svg-icon type="icon-down"></svg-icon>
                        </a-button>
                        <a-menu slot="overlay">
                            <a-menu-item v-for="(el, index) in columns" :key="index">
                                <a-checkbox :value="index">{{ el.label }}</a-checkbox>
                            </a-menu-item>
                        </a-menu>

                    </a-dropdown>
                </a-checkbox-group>
            </div>
        </div>
        <a-table
            :loading="listLoading"
            :dataSource="list"
            :columns="columnsData"
            :highlight-current-row="highlight"
            :rowClassName="rowClassName"
            :row-key="rowKey"
            :rowSelection="rowSelection"
            :pagination="paginationCfg"
            v-bind="tableProps"
            style="width: 100%;"
            @current-change="currentChange"
            @row-click="rowClick"
            @sort-change="sortChange"
            @select="onSelect"
            @select-all="onSelectAll"
        >
        </a-table>
    </div>
</template>
<script>
    import {merge} from 'lodash'
    import moment from "moment";

    export default {
        name: 'TableWrapper',
        // components: {Render},
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
            // 表格行 key 的取值
            rowKey: {
                type: String,
                default: 'id'
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
            // 是否开启单选
            radio: {
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
            // 单选时表格行数据改变时
            sortChange: {
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
            // 当前页
            page: {
                type: Number,
                default: () => 1
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
            toolActions: Array,
            momentFormat: {
                type: String,
                default: 'YYYY-MM-DD'
            }
        },
        data() {
            return {
                listLoading: this.loading,
                list: this.data || [],
                filterOptions: [],
                formTheadOptions: [],
                dropdownVisible: false,
                paginationCfg: this.pagination ? { // 分页器设置
                    showQuickJumper: true, // 是否可以快速跳转至某页
                    showSizeChanger: true, // 是否可以快速跳转至某页
                    showTotal: (total) => { // 共多少条
                        return '共' + total + '条';
                    },
                    total: 0,
                    current: this.page,
                    pageSize: this.size,
                    onChange: this.pageChange,
                    onShowSizeChange: this.pageChange,
                    pageSizeOptions: this.pageSizes // 指定每页可以显示多少条
                } : false,
                index: [{ // 为表格添加索引
                    title: '#',
                    dataIndex: 'index',
                    width: 50,
                    customRender: (text, record, index) => {
                        return {
                            children: this.getTableIndex(index)
                        };
                    }
                }]
            };
        },
        computed: {
            // 是否需要选择行功能，单选或多选
            rowSelection() {
                const p = (this.checkbox || this.radio) ? {
                    type: this.checkbox || this.radio,
                    onChange(selectedRowKeys, selectedRows) {
                        this.onSelect(selectedRows);
                    },
                    onSelectAll(selected, selectedRows) {
                        this.onSelect(selectedRows);
                    }
                } : null;
                return p;
            },
            // 列数据
            columnsData() {
                const filterOptions = this.filterOptions;
                const filterColumns = this.columns.filter((i, index) => {
                    return filterOptions.indexOf(index) >= 0;
                }).map(item => {
                    const r = {
                        ...item,
                        dataIndex: item.key,
                        title: item.label,
                        customRender: item.render
                    };
                    delete r.render;
                    return r;
                });
                return this.index.concat(filterColumns);
            }
        },
        watch: {
            data: function (val) {
                this.list = val;
            },
            loading: function (val) {
                this.listLoading = val;
            },
            size(val) {
                this.pageSize = val;
            },
            page(val) {
                this.current = val;
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
                    this.paginationCfg.current = 1;
                    this.paginationCfg.pageSize = this.size;
                }
                this.listLoading = true;
                const query = merge({}, this.query)
                for (const key in query) {
                    if (moment.isMoment(query[key])) {
                        query[key] = moment(query[key]).format(this.momentFormat);
                    }
                }
                const postData = {
                    currentPage: this.pagination ? this.paginationCfg.current : undefined,
                    pageSize: this.pagination ? this.paginationCfg.pageSize : undefined,
                    ...query
                };
                this.fetchDataFn(postData).then(response => {
                    this.list = this.$isObject(response) ? response.data : response || [];
                    this.pagination ? this.paginationCfg.total = response.totalRecordNumber || 0 : null;
                    this.listLoading = false;
                    this.$emit('onSuccessData', this.list);
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            // 页码变化时
            pageChange(page, pageSize) {
                this.paginationCfg.current = page
                this.paginationCfg.pageSize = pageSize
                this.fetchData()
            },
            // 生成正确的行索引
            getTableIndex(index) {
                if(!this.pagination){
                    return index + 1
                }
                return (index + 1) + (this.paginationCfg.current - 1) * this.paginationCfg.pageSize + this.preIndex;
            },
            // 获取当前表格数据
            getData() {
                return this.list;
            },
            onSelect(data) {
                this.$emit('onCheckedChange', data);
            },
            onSelectAll(data) {
                this.$emit('onCheckedChange', data);
            },
            // 获取展示的当前列信息
            getColumnsData() {
                return this.columnsData;
            }
        }
    };
</script>

<style scoped lang="less">
    .tableWrapper {
        background-color: #fff;
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

        & /deep/ .el-table__empty-text {
            line-height: normal;
        }
    }
</style>
