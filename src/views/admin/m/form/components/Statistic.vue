<template>
    <a-modal
        v-model="visible"
        ref="dialog_querySign"
        :title="modelStatus === 'add' ? '新增头部统计' : '修改头部统计'"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @ok="handleAddQuerySign"
        @cancel="onClose"
        width="600px"
    >
        <a-form
            :form="form"
        >
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="名称"
            >
                <a-input v-decorator="formDecorator.name"/>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="统计内容"
            >
                <a-input v-decorator="formDecorator.show"/>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="类型"
            >
                <a-select v-decorator="formDecorator.type" style="width: 100%">
                    <a-select-option value="integer">整数</a-select-option>
                    <a-select-option value="double">小数</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                v-if="form.getFieldValue('type') === 'double'"
                label="小数位数"
            >
                <template slot="label">
                    小数位数
                    <a-tooltip class="item" effect="dark" title="(未定内容)">
                        <i class="iconfont icon-question-circle"></i>
                    </a-tooltip>
                </template>
                <a-input v-decorator="formDecorator.floatingLength"/>
            </a-form-item>
            <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="查询sql"
            >
                <template slot="label">
                    查询sql
                    <a-tooltip class="item" effect="dark" title="不是片断sql需要有数值类型的返回结果">
                        <i class="iconfont icon-question-circle"></i>
                    </a-tooltip>
                </template>
                <div v-for="(el, index) in form.getFieldValue('sqls')" :key="index" class="flex"
                     style="margin-bottom: 26px;">
                    <div class="flex-primary">
                        <a-form-item>
                            <a-input
                                v-decorator="[`[sqls].${index}`,{ rules:[{required:true,message:'查询sql必填'}]}]"/>
                        </a-form-item>
                    </div>
                    <div>
                        <a-button type="success" icon="plus" shape="circle" @click="add"/>
                        <a-button icon="minus" shape="circle" @click="del(index)"/>
                    </div>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {merge} from 'lodash'
    import {switchColors} from '@/utils/variables'

    export default {
        name: "Statistic",
        props: {
            defaultList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: null,
                listId: 0,
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                formDecorator: {
                    name: ['name', {
                        rules: createRules({
                            msg: '名称',
                            required: true
                        })
                    }],
                    show: ['show', {
                        rules: createRules({
                            msg: '统计内容',
                            required: true
                        })
                    }],
                    type: ['type', {
                        initialValue: 'integer',
                        rules: createRules({
                            msg: '类型',
                            required: true
                        })
                    }],
                    floatingLength: ['floatingLength', {
                        initialValue: '2',
                        rules: createRules({
                            integer: true
                        })
                    }],
                    sqls: ['sqls', {
                        preserve: true,
                        initialValue: [''],
                        rules: createRules({
                            msg: '查询sql',
                            required: true
                        }, 'change', 'array')
                    }]
                },
                switchColors,
                modelStatus: 'add',
                updateIndex: undefined,
                visible: false,
                postFormData: { // 顶部按钮的新增数据
                    show: '',
                    name: '',
                    type: 'integer',
                    floatingLength: '2',
                    sqls: ['']
                },
                postFormRules: { // 顶部按钮的表单验证规则
                    name: createRules({
                        msg: '名称',
                        required: true
                    }),
                    show: createRules({
                        msg: '统计内容',
                        required: true
                    }),
                    type: createRules({
                        msg: '类型',
                        required: true
                    }),
                    sqls: createRules({
                        msg: '查询sql',
                        required: true
                    }, 'change', 'array')
                }

            }
        },
        created() {
            this.form = this.$form.createForm(this);
            this.form.getFieldDecorator('sqls', this.formDecorator.sqls[1]);
        },
        methods: {
            openModel(row, updateIndex) {
                this.visible = true;
                this.$nextTick(() => {
                    if (row) {
                        this.modelStatus = 'update';
                        this.updateIndex = updateIndex;
                        const floatingLength = row.floatingLength
                        if (row.type === 'double') {
                            delete row.floatingLength
                            this.form.setFieldsValue({
                                ...row,
                            })
                        } else {
                            this.form.setFieldsValue({
                                ...row,
                            })
                        }
                        this.$nextTick(() => {
                            row.sqls.forEach((e, i) => {
                                this.form.setFieldsValue({
                                    [`[sqls].${i}`]: e
                                })
                            })
                            if (row.type === 'double') {
                                this.form.setFieldsValue({
                                    floatingLength: floatingLength
                                })
                            }
                        })
                    } else {
                        this.modelStatus = 'add';
                        this.updateIndex = undefined;
                    }
                })
            },
            // 保存新增的顶部按钮
            handleAddQuerySign() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const postFormData = this.form.getFieldsValue();
                        let updateIndex;
                        if (this.modelStatus === 'update') {
                            updateIndex = this.updateIndex;
                        }
                        this.$emit('ok', merge({}, postFormData), updateIndex);
                        this.visible = false;
                        this.onClose()
                    }
                })
            },
            add() {
                const sqls = this.form.getFieldValue('sqls');
                sqls.push('')
                this.form.setFieldsValue({
                    sqls
                })
            },
            del(index) {
                const el = this.form.getFieldValue(`[sqls].${index}`)
                const sqls = this.form.getFieldsValue().sqls
                if (sqls.length > 1) {
                    sqls.splice(index, 1)
                    this.form.setFieldsValue({
                        sqls
                    });
                    this.$nextTick(() => {
                        const f = sqls.filter(k => k !== el)
                        f.forEach((e, i) => {
                            this.form.setFieldsValue({
                                [`[sqls].${i}`]: e
                            });
                        })
                    })
                }
            },
            // 顶部按钮弹框关闭时
            onClose() {
                this.listId = 0
                this.form.resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
