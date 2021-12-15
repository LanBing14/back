<template>
    <div>
        <a-form :form="form">
            <!--            <p class="form-info-split">-->
            <!--                <span class="l"></span>-->
            <!--                <span class="t">节点详情</span>-->
            <!--                <span class="r"></span>-->
            <!--            </p>-->
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="线型">
                <a-select
                    v-model="type"
                    placeholder="请选择线型"
                    filterable>
                    <a-select-option
                        v-for="el in lineTypes"
                        :key="el.value"
                        :value="el.value"
                    >
                        {{ el.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-table :columns="columns" :dataSource="tableData" bordered rowKey="id">
                <!--操作头-->
                <template slot="opHeader">
                    <a-button type="primary" size="small" icon="plus" shape="circle" @click="addRow"
                              style="margin-right: 0;"></a-button>
                </template>
                <!-- 操作-删除-->
                <template slot="opDel" slot-scope="text, record, index">
                    <a-button size="small" icon="minus" shape="circle" @click="delRow(index)"
                              style="margin-right: 0;"></a-button>
                </template>
                <!--值-->
                <template slot="value" slot-scope="text, record, index">
                    <a-input v-model="record.value"/>
                </template>
                <!--key-->
                <template slot="key" slot-scope="text, record, index">
                    <a-select v-model="record.key" style="width: 100%;">
                        <a-select-option v-for="(el, index) in keyOptions" :key="index" :value="el.value">
                            {{el.label}}
                        </a-select-option>
                    </a-select>
                </template>
                <!--条件-->
                <template slot="tj" slot-scope="text, record, index">
                    <a-select v-model="record.tj" style="width: 100%;">
                        <a-select-option value="==">==</a-select-option>
                        <a-select-option value=">">></a-select-option>
                        <a-select-option value="<"><</a-select-option>
                        <a-select-option value=">=">>=</a-select-option>
                        <a-select-option value="<="><=</a-select-option>
                    </a-select>
                </template>
                <!--关系-->
                <template slot="gx" slot-scope="text, record, index">
                    <a-select v-if="index!==tableData.length-1" v-model="record.gx" style="width: 100%;">
                        <a-select-option value="&&">与</a-select-option>
                        <a-select-option value="||">或</a-select-option>
                    </a-select>
                </template>
                <!--左括号-->
                <template slot="left" slot-scope="text, record, index">
                    <a-input v-model="record.left"/>
                </template>
                <!--右括号-->
                <template slot="right" slot-scope="text, record, index">
                    <a-input v-model="record.right"/>
                </template>
            </a-table>
        </a-form>
        <div style="text-align: center;margin-top: 20px;">
            <a-button type="primary" @click="save">保存线信息</a-button>
        </div>
    </div>
</template>

<script>
    import {merge, uniqueId} from 'lodash'
    import {Api_comboboxDict} from '@/api/admin/index'

    export default {
        name: 'LineInfo',
        props: {
            data: Object,
            lineTypes: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                formDecorator: {},
                type: '0',
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                keyOptions: [{
                    label: 'ww',
                    value: '123'
                }], // 选项的下拉框数据
                tableData: [],
                columns: [{
                    title: '(',
                    dataIndex: 'left',
                    align: 'center',
                    scopedSlots: {customRender: 'left'}
                }, {
                    title: '选项',
                    dataIndex: 'key',
                    align: 'center',
                    scopedSlots: {customRender: 'key'}
                }, {
                    title: '条件',
                    dataIndex: 'tj',
                    align: 'center',
                    scopedSlots: {customRender: 'tj'}
                }, {
                    title: '值',
                    dataIndex: 'value',
                    align: 'center',
                    scopedSlots: {customRender: 'value'}
                }, {
                    title: ')',
                    dataIndex: 'right',
                    align: 'center',
                    scopedSlots: {customRender: 'right'}
                }, {
                    title: '关系',
                    dataIndex: 'gx',
                    align: 'center',
                    scopedSlots: {customRender: 'gx'}
                }, {
                    dataIndex: null,
                    align: 'center',
                    slots: {title: 'opHeader'},
                    scopedSlots: {customRender: 'opDel'}
                }]
            }
        },
        watch: {
            data(val) {
                if (val) {
                    this.mergeData(merge({}, val))
                }
            }
        },
        mounted() {
            // Api_comboboxDict().then(res=>{
            //     this.keyOptions = res
            // })
            this.mergeData(merge({}, this.data))
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData({data}) {
                if (data && data.conditions) {
                    this.tableData = data.conditionsObject
                }
                if (data && data.type) {
                    this.type = data.type
                }
            },
            // 保存节点数据
            save() {
                let conditions = ''
                let names = ''
                this.tableData.forEach(item => {
                    conditions += item.left + '"${' + item.key + '}"' + item.tj + item.value + item.right + item.gx
                })
                try {
                    const result = eval(conditions)
                    names = this.tableData.map(item => {
                        return this.keyOptions.find(i => i.value === item.key).label
                    })
                    this.$emit('save', this.data.id, {
                        label: names.join('、'),
                        data: {
                            id: this.data.id,
                            startId: this.data.source,
                            endId: this.data.target,
                            conditions: conditions.replace(/"/g, ""),
                            conditionsObject: this.tableData,
                            name: names.join('、'),
                            points: this.data.points,
                            type: this.type
                        },
                        shape: this.type === '0' ? 'line' : 'polyline2'
                    })
                } catch (e) {
                    this.$message.warning('条件格式不正确')
                }
            },
            addRow() {
                const {tableData} = this

                const newData = {
                    id: uniqueId() + new Date().getTime(),
                    key: '',
                    tj: '',
                    value: '',
                    gx: '',
                    left: '',
                    right: ''
                }
                this.tableData = [...tableData, newData]
            },
            delRow(index) {
                this.tableData.splice(index, 1)
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-input-group__append {
        .el-select {
            width: 65px;
        }
    }

    /deep/ {
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
            padding-left: 5px;
            padding-right: 5px;
        }
    }

    .form-info-split {
        color: #999;
        font-size: 12px;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;

        .l, .r {
            flex: 1;
            border-top: 1px dashed currentColor;
        }

        .t {
            margin: 0 8px;
        }
    }

    .border-wrap {
        display: inline-block;
        width: 80px;
        margin-right: 10px;

        .el-form-item {
            margin-bottom: 0;
        }
    }

    .el-color-picker {
        vertical-align: middle;
    }

    .list-item {
        display: flex;

        & > div {
            flex: 1;
            text-align: center;
            padding: 0 5px;
        }

        /deep/ .el-form-item__label {
            width: 100% !important;
        }

        .action {
            flex: initial;
            margin-right: 0;

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }

    .label-right /deep/ {
        label {
            text-align: center;
        }
    }
</style>
