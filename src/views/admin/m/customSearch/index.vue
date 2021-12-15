<template>
    <div class="app-container">
        <PageHead>
            <el-form
                ref="searchForm"
                :model="listQuery"
                :inline="true"
                class="demo-form-inline searchForm-wrap"
            >
                <el-form-item prop="id">
                    <el-input v-model="listQuery.id" placeholder="表单id"/>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="listQuery.name" placeholder="表单名称"/>
                </el-form-item>
                <el-form-item prop="title">
                    <el-input v-model="listQuery.title" placeholder="页面标题"/>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button
                        v-waves
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter"
                    >
                        查询
                    </el-button>
                    <el-button
                        v-waves
                        class="filter-item"
                        icon="icon iconfont icon-undo"
                        @click="handleReset('searchForm')"
                    >
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_FormGetList"
                    :query="listQuery"
                    :columns="tableCol"
                />
            </div>
        </div>
        <Dispose
            ref="ref_dispose"
            :select-data="selectData"
            @getList="getList"
        />
    </div>
</template>

<script type="text/jsx">
import Button from '@/components/Button'
import PageHead from '@/components/PageHead'
import TableWrapper from '@/components/TableWrapper'
import Dispose from './Dispose'
import waves from '@/directive/waves' // Waves directive
import {m} from '@/api/index'
import {
    Api_comboboxDict
} from '@/api/admin/index'
import {
    Api_FormGetList // 表单分页列表
} from '@/api/admin/m/index'

export default {
    name: 'CustomSearch',
    directives: { waves },
    components: {
        PageHead,
        TableWrapper,
        Dispose
    },
    data () {
        return {
            selectData: undefined,
            typeOptions: [], // 表单类型下拉框数据
            listQuery: {
                id: '',
                name: '',
                type: '0'
            },
            tableCol: [
                {
                    key: 'id',
                    label: '表单id'
                }, {
                    key: 'name',
                    label: '表单名称'
                }, {
                    key: 'title',
                    label: '页面标题'
                }, {
                    key: 'typeDesc',
                    label: '表单类型'
                }, {
                    key: null,
                    label: '操作',
                    align: 'center',
                    width: 150,
                    render: (h, data, row) => {
                        return [
                            <Button
                                iconClass='icon-monitor'
                                iconColor='green'
                                row={ row }
                                text='查询配置'
                                type='success'
                                click={ this.handleBuild.bind(this) }/>
                        ]
                    }
                }]
        }
    },
    created () {
        Api_comboboxDict('form_type', m).then(res => {
            this.typeOptions = res
        })
        this.$nextTick(() => {
            this.getList()
        })
    },
    methods: {
        Api_FormGetList,
        // 获取主列表数据
        getList () {
            this.$refs.child.fetchData()
        },
        // 根据查询条件获取数据
        handleFilter () {
            this.getList()
        },
        // 查询列表配置
        handleBuild (row) {
            this.selectData = row
            this.$nextTick(() => {
                this.$refs.ref_dispose.openModel()
            })
        }
    }
}
</script>

<style scoped>
    .left-item + .left-item {
        margin-top: 20px;
    }
</style>
