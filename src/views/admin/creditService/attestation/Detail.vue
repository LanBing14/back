<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        title="企业认证查看"
        only-close-btn
        @close="onClose"
    >
        <a-form ref="form" :model="formData"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                class="form"
        >
            <a-form-item
                label="企业编号"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="企业名称"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="真实姓名">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="身份证号"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="手机号码"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="营业执照"
                prop="key1">
                <viewer :images="formData.pic"
                        class="viewer"
                        ref="viewer"
                        style="display: none;"
                >
                    <template slot-scope="scope">
                        <img v-for="src in scope.images" :src="src" :key="src">
                    </template>
                </viewer>
            </a-form-item>
            <a-form-item
                label="申请号码"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="审核状态"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="审核意见"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
            <a-form-item
                label="审核时间"
                prop="key1">
                {{ formData.key1 }}
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_AttestationDetail
    } from "@/api/admin/creditService/index";
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer/src/component.vue';

    export default {
        name: "Detail",
        components: {
            Viewer
        },
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
                timeArrVal: "",
                typeData: [],
                formData: {
                    key1: '',
                    pic: []
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
            };
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail();
                }
            },
            // 获取单条数据信息
            getDetail() {
                Api_AttestationDetail().then(res => {
                    this.formData = res
                })
            },
            onClose() {
                this.$refs.form.resetFields()
            }
        }
    };
</script>

<style lang="scss" scoped>
    .form {
        max-width: 600px;
        margin: auto;
    }
</style>
