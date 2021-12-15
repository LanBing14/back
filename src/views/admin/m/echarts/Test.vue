<template>
    <div class="app-container">
        <PageHead>
            <el-form
                ref="searchForm"
                :model="listQuery"
                :inline="true"
                class="demo-form-inline searchForm-wrap">

                <el-form-item prop="name">
                    <el-input
                        v-model="listQuery.name"
                        placeholder="图表名称"
                    />
                </el-form-item>
                <el-form-item class="btns">
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="icon iconfont icon-search"
                        @click="handleFilter">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body" style="height: 100%;">
                <Ins id="JG-1912-00005" :query="chartQuery" style="flex: 1;"></Ins>
            </div>
        </div>
    </div>
</template>

<script>
import Ins from './Ins'
import PageHead from '@/components/PageHead'


export default {
    name: 'Test',
    components: {
        Ins,
        PageHead
    },
    data () {
        return {
            listQuery: {
                name: ''
            },
            chartQuery: {}
        }
    },
    methods: {
        handleFilter () {
            this.chartQuery = { ...this.listQuery }
        }
    }
}
</script>

<style scoped lang="scss">

</style>
