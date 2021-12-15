<template>
    <Drawer
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus==='add'?'新增角色':'修改角色'"
        :onOk="handleSure"
        @close="onClose"
    >
        <a-form ref="dataForm" :form="form" >
            <a-form-item label="角色" prop="name">
                <a-input v-decorator="formDecorator.name" placeholder="请输入角色"/>
            </a-form-item>
            <a-form-item label="角色类型" prop="type">
                <a-select v-decorator="formDecorator.type" placeholder="请选择角色类型">
                    <a-select-option
                        v-for="item in rolesList"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="数据查看权限" prop="viewPermission">
                <a-select v-decorator="formDecorator.viewPermission" placeholder="请选择角色类型">
                    <a-select-option
                        v-for="item in authorityOptions"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="数据操作权限" prop="editPermission">
                <a-select v-decorator="formDecorator.editPermission" placeholder="请选择角色类型">
                    <a-select-option
                        v-for="item in authorityOptions"
                        :key="item.value"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="描述" prop="description">
                <a-input
                    v-decorator="formDecorator.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入描述"
                />
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_RolesDetail,
        Api_RolesAdd,
        Api_RolesUpdate
    } from "@/api/admin/system/index";
    import {
        Api_comboboxDict //角色类型下拉
    } from "@/api/admin/index";

    export default {
        name: "CreateUpdate",
        props: {
            modelStatus: {
                type: String,
                default: ""
            },
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
                lastId: undefined,
                rolesList: [],
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    name: [
                        "name",
                        {
                            rules: [
                                {required: true, message: "真实姓名必填"},
                                {max: 100, message: "超出最大长度"}
                            ]
                        }
                    ],
                    description: [
                        "description",
                        {
                            rules: [{max: 300, message: "超出最大长度"}]
                        }
                    ],
                    type: ['type', {
                        initialValue: undefined,
                        rules: [
                            {required: true, message: "角色类型必填"}
                        ]
                    }],
                    viewPermission: ['viewPermission', {
                        initialValue: null,
                        rules: [
                            {required: true, message: "数据查看权限"}
                        ]
                    }],
                    editPermission: ['editPermission', {
                        initialValue: null,
                        rules: [
                            {required: true, message: "数据操作权限"}
                        ]
                    }]
                },
                authorityOptions: [], // 数据权限下拉框数据
            };
        },
        created() {
            this.getDict()
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail(id);
                }
            },
            // 获取字典数据
            getDict() {
                Api_comboboxDict('role_type').then(res => {
                    this.rolesList = res;
                })
                Api_comboboxDict('role_dp').then(res => {
                    this.authorityOptions = res;
                })
            },
            // 点击确认
            handleSure() {
                this.form.validateFields((valid, values) => {
                    if (!valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = values;
                        postData.saasCode = this.$store.getters.selectSaasCode
                        const promiseRes =
                            modelStatus === "add"
                                ? Api_RolesAdd(postData)
                                : Api_RolesUpdate(id, {
                                    ...postData,
                                    version
                                });
                        const loading = this.$openLoading();
                        promiseRes
                            .then(msg => {
                                this.visible = false;
                                this.onClose();
                                this.$message.success(msg);
                                this.$emit("getList");
                                loading.close();
                            })
                            .catch(() => {
                                loading.close();
                            });
                    }
                });
            },
            // 获取单个角色信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_RolesDetail(id)
                    .then(res => {
                        const newData = {};
                        Object.keys(this.formDecorator).forEach(key=>{
                            newData[key] = String(res[key]||'');
                        })
                        this.form.setFieldsValue(newData);
                        this.visible = true;
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            },
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

<style scoped>
</style>
