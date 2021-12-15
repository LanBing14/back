<template>
    <Drawer
        ref="drawer"
        title="增加定时任务"
        :visible.sync="visible"
        :onOk="createData"
        @close="onClose">
        <a-form-model
            ref="dataForm"
            :rules="addFormRules"
            :model="addFormData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-model-item
                label="触发器名称"
                prop="triggerName">
                <a-input
                    v-model="addFormData.triggerName"
                    placeholder="请输入触发器名称"/>
            </a-form-model-item>
            <a-form-model-item
                label="cron表达式"
                prop="cronExpression">
                <a-input
                    v-model="addFormData.cronExpression"
                    placeholder="请输入cron表达式"/>
            </a-form-model-item>
            <a-form-model-item
                label="定时器任务"
                prop="jobClass">
                <a-select v-model="addFormData.jobClass" placeholder="请选择定时器任务" filterable>
                    <a-select-option
                        v-for="item in jobClassData"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                label="任务描述"
                prop="description">
                <a-input
                    v-model="addFormData.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入任务描述"/>
            </a-form-model-item>
        </a-form-model>
    </Drawer>
</template>

<script>
    import {
        Api_CrontabsGetJobsList,
        Api_CrontabsAdd
    } from '@/api/admin/crontab/index'

    export default {
        name: 'CreateUpdate',
        props: {
            selectData: Object
        },
        data() {
            const createRules = this.$createRules;
            return {
                jobClassData: undefined, // 定时任务下拉数据
                treeData: [], // 部门树的数据
                visible: false, // 是否显示
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                addFormRules: { // 表单验证规则
                    triggerName: createRules({
                        msg: '触发器名称',
                        required: true,
                        max: 66
                    }),
                    jobClass: createRules({
                        msg: '定时器任务',
                        required: true,
                        max: 200
                    }),
                    cronExpression: createRules({
                        msg: 'cron表达式',
                        required: true,
                        max: 40
                    }),
                    description: createRules({
                        msg: '描述',
                        max: 83
                    })
                },
                addFormData: {// 新增部门的表单数据
                    triggerName: '',
                    jobClass: '',
                    cronExpression: '',
                    description: ''
                },
                editChecked: undefined
            }
        },
        created() {
            Api_CrontabsGetJobsList().then(res => {
                this.jobClassData = res
            })
        },
        methods: {
            // 打开模态框
            openModel() {
                this.visible = true;
            },
            // 创建生成新部门数据
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const loading = this.$openLoading();
                        const postData = this.addFormData;
                        Api_CrontabsAdd(postData).then(msg => {
                            this.visible = false
                            this.$message.success(msg);
                            this.$emit('getList');
                            this.$emit('getDepTree');
                            loading.close()
                        }).catch(() => {
                            loading.close()
                        })
                    }
                })
            },
            // 模态框关闭时
            onClose() {
                this.$refs['dataForm'].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
