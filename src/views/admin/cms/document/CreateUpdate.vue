<template slot>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增文档':'修改文档'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form
            ref="dataForm"
            :form="form"
        >
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="文档名称"
            >
                <a-input
                    v-decorator="formDecorator.title"
                    placeholder="请输入文档名称"
                />
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="文件"
            >
                <Upload
                    ref="ref_upload"
                    v-decorator="formDecorator.url"
                    :limit="1"
                />
            </a-form-item>
            <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="描述"
            >
                <a-input
                    v-decorator="formDecorator.summary"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入描述"
                />
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
import Upload from '@/components/Upload'

import {
    Api_DocumentDetail,
    Api_DocumentAdd,
    Api_DocumentUpdate
} from '@/api/admin/cms/index'

export default {
    name: 'CreateUpdate',
    components: { Upload },
    props: {
        modelStatus: {
            type: String,
            default: ''
        },
        selectData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        const createRules = this.$createRules
        return {
            form: this.$form.createForm(this),
            formDecorator: {
                title: ['title', {
                    rules: createRules({
                        msg: '文档名称',
                        required: true,
                        max: 100
                    })
                }],
                summary: ['summary', {
                    rules: createRules({
                        msg: '描述',
                        max: 300
                    })
                }],
                url: ['url', {
                    initialValue: [],
                    rules: [{
                        message: '请选择文件',
                        required: true,
                        type: 'array'
                    }]
                }]
            },
            labelCol: {span: 4},
            wrapperCol: {span: 20},

            visible: false,
            defaultFileList: [],
            addFormRules: {
                title: createRules({
                    msg: '文档名称',
                    required: true,
                    max: 100
                }),
                summary: createRules({
                    msg: '描述',
                    max: 300
                }),
                url: createRules({
                    msg: '文件',
                    required: true,
                    max: 85
                })
            },
            addFormData: {// 新增文档的表单数据
                title: undefined,
                summary: undefined,
                url: undefined
            }
        }
    },
    methods: {
        // 打开模态框
        openModel (id) {
            if (id) {
                this.getDetail(id)
            } else {
                this.visible = true
            }
        },
        // 获取详情信息
        getDetail (id) {
            const loading = this.$openLoading()
            Api_DocumentDetail(id).then(({title, summary, attachmentVo}) => {
                let urlArr = []
                if (attachmentVo) {
                    urlArr = [
                        {
                            name: attachmentVo.originalName,
                            url: attachmentVo.url
                        }]
                }
                this.form.setFieldsValue({
                    title,
                    summary,
                    url: urlArr
                })
                this.visible = true
                loading.close()
            }).catch(() => {
                loading.close()
            })
        },
        // 点击确认
        handleSure () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const { modelStatus } = this // add新增，update修改
                    const { id, version } = this.selectData
                    const postData = this.form.getFieldsValue()
                    const loading = this.$openLoading()
                    const promiseRes = modelStatus === 'add' ? Api_DocumentAdd(postData) : Api_DocumentUpdate(id, {
                        ...postData,
                        version
                    })
                    promiseRes.then(msg => {
                        this.visible = false
                        this.onClose()
                        this.$message.success(msg);
                        this.$emit('getList')
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    })
                }
            })
        },
        onClose () {
            this.form.resetFields()
        }
    }
}
</script>

<style scoped>

</style>
