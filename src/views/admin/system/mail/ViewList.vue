<template>
    <Drawer
        :visible.sync="visible"
        :btn="drawerBtn"
        title="消息列表">
        <a-form
            ref="searchForm"
            :form="form"
            layout="inline"
            class="demo-form-inline searchForm-wrap">
            <a-form-item prop="status">
                <a-select v-decorator="['status']" placeholder="状态" filterable>
                    <a-select-option value="1">已读</a-select-option>
                    <a-select-option value="0">未读</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-input
                    v-decorator="['title']"
                    placeholder="标题"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"/>
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
                    @click="handleReset">
                    重置
                </a-button>
            </a-form-item>
        </a-form>
        <EmailList
            ref="emailList"
            :fetchDataFn="Api_MailFetchListCenter"
            :columns="columns"
            :query="listQuery"
            :rowClassName="rowClassName"
            empty-text="您暂时未收到消息~"
        />
    </Drawer>
</template>

<script type="text/jsx">
    import EmailList from '@/components/EmailList';
    import {
        Api_MailFetchListCenter
    } from '@/api/admin/system/index';

    export default {
        name: 'MailViewList',
        components: {
            EmailList
        },
        data() {
            return {
                Api_MailFetchListCenter,
                form: this.$form.createForm(this),

                visible: false,
                listQuery: {
                    status: undefined,
                    title: undefined
                },
                drawerBtn: [{
                    text: '关闭',
                    click: () => {
                        this.visible = false;
                    }
                }],
                columns: [{
                    key: 'title',
                    label: '标题',
                    render: (data, row) => {
                        return <span class='highlight-text-default'
                                     onClick={this.handleViewDetail.bind(this, row)}>{data}</span>;
                    }
                }, {
                    key: 'sendTime',
                    label: '发送时间',
                    width: 100
                }, {
                    key: 'senderName',
                    label: '发送人',
                    width: 100
                }, {
                    key: "statusName",
                    label: "已读状态"
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
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList(true);
            },
            // 查看单个公告详情
            handleViewDetail(row) {
                const {id, status} = row;
                const loading = this.$openLoading();
                this.$store.dispatch('getMailDetail', id).then((res) => {
                    this.$store.commit('SAVE_mailDetailData', res);
                    this.$store.commit('TOGGLE_mailDetailVisible', true);
                    if (status !== '1') {
                        this.$store.dispatch('getMailNums');
                    }
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 给未读的行添加class类名
            rowClassName(row) {
                return row.status !== '1';
            },
            // 打开列表弹框
            show() {
                this.getList();
                this.visible = true;
            }
        }
    };
</script>

<style scoped>

</style>
