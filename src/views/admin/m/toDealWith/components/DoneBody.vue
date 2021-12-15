<template>
    <a-card :class="{ani: className}" class="box-card">
        <div v-if="isFull" slot="title" class="clearfix flex">
            <div class="flex-primary flex">
                <span style="font-size: 14px;">已办事项</span>
            </div>
            <div v-if="isFull && isMoreQuery" class="actions">
                <MoreEnter
                    :active="isFull"
                    :icon="isFull?'icon-fullscreen-exit':'icon-fullscreen'"
                    @click="onMoreExist()"></MoreEnter>
            </div>
            <div v-else-if="!isFull" class="actions">
                <MoreEnter
                    :active="isFull"
                    :icon="isFull?'icon-fullscreen-exit':'icon-fullscreen'"
                    @click="onMoreExist()"></MoreEnter>
            </div>
        </div>
        <div v-if="isFull" class="moreQuery-wrap">
            <DoneSearchForm :small="isFull" @search="onSearch" @toggleMoreEnter="toggleMoreEnter"></DoneSearchForm>
        </div>
        <div class="content">
            <TableWrapper
                ref="ref_doneTable"
                :query="query"
                :fetch-data-fn="Api_DoneGetList"
                :size="pageSize"
                :columns="tableCol"
                :filterGroup="false"
            />
        </div>
    </a-card>
</template>

<script type="text/jsx">
import MoreEnter from '@/components/MoreEnter'
import TableWrapper from '@/components/TableWrapper'
import Button from '@/components/Button'
import DoneSearchForm from './DoneSearchForm'
import { Api_DoneGetList } from '@/api/admin/m/index'

export default {
    name: 'DoneBody',
    components: {
        TableWrapper,
        DoneSearchForm,
        MoreEnter
    },
    props: {
        type: String
    },
    data () {
        const btn = {
            key: null,
            label: '操作',
            align: 'center',
            width: 80,
            render: (data, row) => {
                return [
                    <Button
                        isIcon={ false }
                        row={ row }
                        text='查看'
                        click={ this.handleOpenCustom.bind(this, row, true) }/>]
            }
        }
        let tableCol = [
            {
                key: 'proc_inst_id',
                label: '实例编号'
            }, {
                key: 'task_name',
                label: '任务名称',
                props: {
                    'min-width': 140,
                    'showOverflowTooltip': true
                }
            }, {
                key: 'create_date',
                label: '处理时间',
                width: 140
            }, btn]
        if (this.type === 'max') {
            tableCol = [
                {
                    key: 'proc_inst_id',
                    label: '实例编号'
                }, {
                    key: 'task_name',
                    label: '任务名称',
                    props: {
                        'min-width': 140,
                        'showOverflowTooltip': true
                    }
                }, {
                    key: 'start_user',
                    label: '发起人'
                }, {
                    key: 'create_date',
                    label: '处理时间',
                    width: 140
                }, {
                    key: 'proc_def_name',
                    label: '流程名称'
                }, {
                    key: 'category',
                    label: '类别',
                    props: {
                        'showOverflowTooltip': true
                    }
                }, {
                    key: 'run_status',
                    label: '运行状态',
                    width: 100
                }, btn]
        }
        return {
            className: '',
            query: {}, // 待办——查询条件
            pageSize: this.type === 'max' ? 10 : 5, // 待办——分页数
            tableCol, // 待办的列配置
            isMoreQuery: false
        }
    },
    computed: {
        isFull () {
            return this.type === 'max'
        }
    },
    mounted () {
        this.className = 'entry'
        if (this.isFull) {
            this.loadData()
        }
    },
    methods: {
        Api_DoneGetList,
        // 加载数据
        loadData (reset) {
            this.query = {}
            this.getList(reset)
        },
        // 已办——搜索/重置
        onSearch (data) {
            this.query = data
            this.$nextTick(() => {
                this.getList(true)
            })
        },
        // 已办——获取列表数据
        getList (reset) {
            this.$refs.ref_doneTable.fetchData(reset)
        },
        // 退出已办全屏
        onMoreExist() {
            this.$emit('exist', 'done')
        },
        // 打开配置的处理页面
        handleOpenCustom(row) {
            const {form_key} = row
            if (form_key) {
                this.$emit('openCustom', row, 'view')
            }
        },
        toggleMoreEnter(flag) {
            this.isMoreQuery = flag
        }
    }
}
</script>
<style>
    @keyframes ani-entry {
        0% {
            opacity: 0;
            transform: scale(0.4);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
<style scoped lang="scss">
    .box-card {
        height: 100%;

        &.entry {
            animation: ani-entry 0.4s;
        }
    }
</style>
