<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        title="产品配置"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="form" :form="form" label-position="right" label-width="8em">
            <a-form-item label="产品编码">{{ code }}</a-form-item>
            <a-form-item label="产品名称">{{ name }}</a-form-item>
            <a-form-item label="市场价" prop="price">
                <a-input v-decorator="formDecorator.price" placeholder="请输入市场价"/>
            </a-form-item>
            <a-form-item label="划线价" prop="oldPrice">
                <a-input v-decorator="formDecorator.oldPrice" placeholder="请输入划线价"/>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import { Api_ProductsTodo } from "@/api/admin/train/index";
    export default {
        name: "DealWith",
        props: {
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                visible: false,
                isView: false,
                form: this.$form.createForm(this),
                id: '',
                code: '',
                name: '',
                formDecorator: {
                    price: [
                        "price",
                        {
                            rules: [
                                {required: true, message: "市场价必选"},
                                {validator: this.validatorMetaPrice}
                            ]
                        }
                    ],
                    oldPrice: [
                        "oldPrice",
                        {
                            rules: [
                                {
                                    validator: this.validatorMetaInfo
                                }
                            ]
                        }
                    ]
                }
            }
        },
        methods: {
            openModel() {
                this.visible = true;
                this.code = this.selectData.code;
                this.name = this.selectData.name;
                this.id = this.selectData.id;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        price: this.selectData.price
                    });
                    this.form.setFieldsValue({
                        oldPrice: this.selectData.oldPrice
                    })
                })
            },
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const postData = values;
                        postData.id = this.id;
                        const loading = this.$openLoading();
                        Api_ProductsTodo(postData).then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit("getList");
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            onClose() {
                this.form.resetFields()
            },
            validatorMetaPrice(rule, value, callback) {
                if (value) {
                    if (!/^(\d|[1-9]\d{1,5})(\.\d{1,2})?$/.test(value)) {
                        callback(new Error('不超过6位数,小数位2位'));
                    }
                }
                callback()
            },
            validatorMetaInfo(rule, value, callback) {
                if (value) {
                    if (/^(\d|[1-9]\d{1,5})(\.\d{1,2})?$/.test(value)) {
                        if (Number(value) < Number(this.form.getFieldsValue().price)) {
                            callback(new Error('不能小于市场价'));
                        }
                    } else {
                        callback(new Error('不超过6位数,小数位2位'));
                    }
                }
                callback()
            }
        }
    }
</script>

<style scoped>

</style>
