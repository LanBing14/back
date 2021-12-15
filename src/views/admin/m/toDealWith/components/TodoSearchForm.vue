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
                    v-decorator="['startDate',{initialValue:null}]"
                    :disabledDate="disabledStartDate"
                    type="date"
                    format="YYYY-MM-DD"
                    placeholder="发起日期起"
                    class="filter-item"
                />
            </a-form-item>
            <a-form-item :style="{width: isTodoMoreQuery ? '' : (130+'px')}">
                <a-date-picker
                    v-decorator="['endDate',{initialValue:null}]"
                    :disabledDate="disabledEndDate"
                    type="date"
                    format="YYYY-MM-DD"
                    placeholder="发起日期止"
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
    import moment from 'moment'
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
            query: {
                procDefName: '',
                startUser: '',
                startDate: null,
                endDate: null,
                procInstId: '',
                taskDefName: '',
                category: ''
            }
        }
    },
    methods: {
        // 查询
        handleFilter () {
            this.$emit('search', this.form.getFieldsValue())
        },
        // 重置
        handleReset () {
            this.form.resetFields()
            this.$emit('reset', this.form.getFieldsValue())
        },
        toggleExtend () {
            this.isTodoMoreQuery = !this.isTodoMoreQuery
            this.$emit('toggleMoreEnter', this.isTodoMoreQuery)
        },
        disabledStartDate (startValue) {
            const endValue = this.form.getFieldValue('endDate');
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disabledEndDate (endValue) {
            const startValue = this.form.getFieldValue('startDate');
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        }
    }
}
</script>

