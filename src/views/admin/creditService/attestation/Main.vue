<template>
    <div class="app-container">
        <PageHead>
            <a-form-model ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-model-item prop="name">
                    <a-input v-model="listQuery.name" placeholder="业务编号"/>
                </a-form-model-item>
                <a-form-model-item prop="idCard">
                    <a-input v-model="listQuery.idCard" placeholder="企业名称"/>
                </a-form-model-item>
                <a-form-model-item prop="startDate">
                    <a-date-picker
                        v-model="listQuery.startDate"
                        :disabled-date="disabledDateStart"
                        placeholder="开始时间"
                    />
                </a-form-model-item>
                <a-form-model-item prop="endDate">
                    <a-date-picker
                        v-model="listQuery.endDate"
                        :disabled-date="disabledDateEnd"
                        placeholder="结束时间"
                    />
                </a-form-model-item>
                <a-form-model-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="search"
                        @click="handleFilter"
                    >查询
                    </a-button>
                    <a-button
                        class="filter-item"
                        icon="undo"
                        @click="handleReset('searchForm')"
                    >重置
                    </a-button>
                </a-form-model-item>
            </a-form-model>
            <RadioText :options="radioOptions" name="认证状态" @change="onRadioChange"></RadioText>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_AttestationList"
                    :query="listQuery"
                    :columns="tableCol"
                />
            </div>
        </div>
    </div>
</template>
<script type="text/jsx">
    import RadioText from "@/components/RadioText";
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    import Button from "@/components/Button";
    import Detail from './Detail'
    import {
        Api_AttestationList
    } from "@/api/admin/creditService/index";

    export default {
        name: "Main",
        components: {RadioText, PageHead, TableWrapper, Detail},
        data() {
            return {
                fileListUrls: ['/group1/M00/00/27/Cr8eXV6ODBCAKV5jAAA_gMHjhuI637.jpg'],
                timeArrVal: [],
                sassData: [],
                radioOptions: [{
                    id: '',
                    label: '全部'
                }, {
                    id: '1',
                    label: '待审核'
                }, {
                    id: '2',
                    label: '审核通过'
                }, {
                    id: '3',
                    label: '审核不通过'
                }],
                tableCol: [
                    {
                        key: "key1",
                        label: "业务编号"
                    },
                    {
                        key: "key2",
                        label: "企业名称"
                    },
                    {
                        key: "key3",
                        label: "用户名"
                    },
                    {
                        key: "key4",
                        label: "真实姓名"
                    },
                    {
                        key: "key5",
                        label: "手机号码"
                    },
                    {
                        key: "key6",
                        label: "认证状态"
                    },
                    {
                        key: "key7",
                        label: "认证申请时间"
                    },
                    {
                        key: null,
                        label: "操作",
                        align: "center",
                        width: 150,
                        render: (data, row) => {
                            return [
                                <Button
                                    iconClass="icon-edit-square"
                                    iconColor="green"
                                    row={row}
                                    text="查看"
                                    type="success"
                                    click={this.handleDetail.bind(this)}
                                />,
                                <Button
                                    iconClass="icon-delete"
                                    iconColor="red"
                                    row={row}
                                    text="审核"
                                    type="danger"
                                    click={this.handleCheck.bind(this)}
                                />
                            ];
                        }
                    }
                ],
                list: null, // 列表数据
                listLoading: false, // 列表loading状态
                listQuery: {
                    name: "",
                    idCard: "",
                    status: '',
                    startDate: null,
                    endDate: null,
                },
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: ["name"],
                    idCard: ["idCard"]
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add"
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            Api_AttestationList,
            // 获取主列表数据
            getList(flag) {
                this.$refs.child.fetchData(flag);
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
            // 重置form表单
            resetForm() {
                this.form.resetFields();
            },
            // 打开查看界面
            handleDetail(row) {
                this.$refs.Detail.openModel(row.id)
                this.$emit('edit', true, 1, row)
            },
            // 审核
            handleCheck({id}) {

            },
            disabledDateStart(startValue) {
                const endValue = this.listQuery.endDate;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledDateEnd(endValue) {
                const startValue = this.listQuery.startDate
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            onRadioChange(value) {
                this.listQuery.status = value
            }
        }
    };
</script>

<style scoped>
</style>
