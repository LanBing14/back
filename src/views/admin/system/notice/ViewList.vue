<template>
        <Drawer
            :visible.sync="visible"
            :btn="drawerBtn"
            title="公告列表">
            <a-form
                ref="searchForm"
                :form="form"
                layout="inline"
                class="demo-form-inline searchForm-wrap">
                <a-form-item>
                    <a-input
                        v-decorator="['code']"
                        placeholder="编号"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"/>
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['title']"
                        placeholder="标题"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"/>
                </a-form-item>
                <a-form-item>
                    <a-date-picker
                        v-decorator="['startDate']"
                        :disabledDate="disabledStartDate"
                        format="YYYY-MM-DD"
                        type="date"
                        placeholder="开始日期"/>
                </a-form-item>
                <a-form-item>
                    <a-date-picker
                        v-decorator="['endDate']"
                        :disabledDate="disabledEndDate"
                        format="YYYY-MM-DD"
                        type="date"
                        placeholder="结束日期">
                    </a-date-picker>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="search"
                        @click="handleFilter">
                        查询
                    </a-button>
                    <a-button
                        class="filter-item"
                        icon="undo"
                        @click="handleReset('searchForm')">
                        重置
                    </a-button>
                </a-form-item>
            </a-form>
            <EmailList
                ref="emailList"
                :query="listQuery"
                :fetchDataFn="Api_NoticeFetchPersonList"
                :columns="columns"
                :rowClassName="rowClassName"
                timeKey="publishTime"
                empty-text="您暂时未收到消息~"
            />
        </Drawer>
</template>

<script type="text/jsx">
    import EmailList from '@/components/EmailList';
    import {
        Api_NoticeFetchPersonList
    } from '@/api/admin/system/index';

    export default {
        name: 'NoticeViewList',
        components: {
            EmailList
        },
        data() {
            return {
                Api_NoticeFetchPersonList,
                form: this.$form.createForm(this),
                visible: false,
                // dialogVisible: false,
                detailData: {}, // 单个公告详情
                listQuery: {
                    code: undefined,
                    title: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                drawerBtn: [{
                    text: '关闭',
                    click: () => {
                        this.visible = false;
                    }
                }],
                columns: [{
                    key: 'code',
                    label: '编号'
                }, {
                    key: 'title',
                    label: '标题',
                    render: (data, row) => {
                        return <span class='highlight-text-default'
                                     onClick={this.handleViewDetail.bind(this, row)}>{data}</span>;
                    }
                }, {
                    key: 'viewTimes',
                    label: '浏览次数',
                    width: 80
                }, {
                    key: 'publishTime',
                    label: '发布时间',
                    width: 150
                }, {
                    key: 'creator',
                    label: '发布人',
                    width: 100
                }]
            };
        },
        methods: {
            // 获取主列表数据
            getList(pageReset) {
                this.listQuery = this.form.getFieldsValue();
                this.$nextTick(() => {
                    this.$refs.emailList.fetchData(pageReset);
                });
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 查看单个公告详情
            handleViewDetail(row) {
                const {id, status} = row;
                const loading = this.$openLoading();
                this.$store.dispatch('getNoticeDetail', id).then(() => {
                    this.$store.commit('TOGGLE_noticeDetailVisible', true);
                    if (status !== '1') {
                        row.status = '1';
                    }
                    this.$store.dispatch('putNoticeRead', id).then(() => {
                        row.viewTimes++;
                        this.$store.dispatch('getNoticeNums');
                    });
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 给未读的行添加class类名
            rowClassName(row) {
                return row.status !== '1';
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList(true);
            },
            // 打开列表弹框
            show() {
                this.getList();
                this.visible = true;
            },
            disabledStartDate(startValue) {
                const endValue = this.form.getFieldValue('endDate');
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledEndDate(endValue) {
                const startValue = this.form.getFieldValue('startDate');
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            }
        }
    };
</script>

<style scoped>

</style>
