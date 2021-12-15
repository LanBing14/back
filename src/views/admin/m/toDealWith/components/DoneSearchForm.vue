<template>
    <a-form
        ref="searchForm"
        :form="form"
        :class="{moreQuery:!!isTodoMoreQuery}"
        layout="inline"
        class="searchForm-wrap flex"
    >
        <div>
            <a-form-item :style="{width: isTodoMoreQuery ? '' : (100+'px')}">
                <a-input
                    v-decorator="['startUser']"
                    placeholder="发起人"
                    class="filter-item"
                />
            </a-form-item>
            <a-form-item :style="{width: isTodoMoreQuery ? '' : (130+'px')}">
                <a-date-picker
                    v-decorator="['startCompleteDate',{initialValue:null}]"
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD"
                    placeholder="处理日期起"
                    class="filter-item"
                />
            </a-form-item>
            <a-form-item :style="{width: isTodoMoreQuery ? '' : (130+'px')}">
                <a-date-picker
                    v-decorator="['endCompleteDate',{initialValue:null}]"
                    :disabledDate="disabledEndDate"
                    format="YYYY-MM-DD"
                    placeholder="处理日期止"
                    class="filter-item"
                />
            </a-form-item>
            <div v-if="isTodoMoreQuery">
                <a-form-item>
                    <a-input
                        v-decorator="['procDefName']"
                        placeholder="流程名称"
                        class="filter-item"
                    >
                        <a-tooltip slot="suffix" class="item" effect="dark" title="搜索">
                            <a-button slot="append" icon="search" @click="handleFilter"></a-button>
                        </a-tooltip>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['procInstId']"
                        placeholder="实例编号"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['taskDefName']"
                        placeholder="任务名称"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item>
                    <a-input
                        v-decorator="['category']"
                        placeholder="类别"
                        class="filter-item"
                    />
                </a-form-item>
                <a-form-item >
                    <a-select
                        v-decorator="['runStatus']"
                        placeholder="运行状态"
                        filterable
                    >
                        <a-select-option
                            v-for="item in runStatusOptions"
                            :key="item.value"
                            :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
        </div>
        <div class="flex-primary">
            <a-form-item class="btns">
                <a-button
                    class="filter-item"
                    type="primary"
                    icon="search"
                    @click="handleFilter"
                >
                    查询
                </a-button>
                <a-button
                    class="filter-item"
                    icon="undo"
                    @click="handleReset"
                >
                    重置
                </a-button>
                <a-button type="text" class="filter-item extend-text" @click="toggleExtend">
                    {{ isTodoMoreQuery?'收起':'展开' }}
                    <i :class="[isTodoMoreQuery?'icon-up':'icon-down']" class="iconfont"></i>
                </a-button>
            </a-form-item>
        </div>
</a-form>
</template>

<script>
import { Api_comboboxDict } from '@/api/admin/index'

export default {
    name: 'TodoSearchForm',
    props: {
        small: {
            type: Boolean, // 是否处于全屏
            default: false
        }
    },
    data () {
        return {
            form: this.$form.createForm(this),

            isTodoMoreQuery: false,
            runStatusOptions: [],
            query: {
                procDefName: '',
                startUser: '',
                startCompleteDate: '',
                endCompleteDate: '',
                procInstId: '',
                taskDefName: '',
                category: '',
                runStatus: ''
            }
        }
    },
    created () {
        Api_comboboxDict('run_status').then(res => {
            this.runStatusOptions = res
        })
    },
    methods: {
        // 查询
        handleFilter () {
            const data = this.form.getFieldsValue();
            this.$emit('search', data)
        },
        // 重置
        handleReset () {
            this.form.resetFields();
            this.$emit('reset', this.form.getFieldsValue())
        },
        toggleExtend () {
            this.isTodoMoreQuery = !this.isTodoMoreQuery
            this.$emit('toggleMoreEnter', this.isTodoMoreQuery)
        },
        disabledStartDate(startValue) {
            const endValue = this.form.getFieldValue('endCompleteDate');
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disabledEndDate(endValue) {
            const startValue = this.form.getFieldValue('startCompleteDate');
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        }
    }
}
</script>
