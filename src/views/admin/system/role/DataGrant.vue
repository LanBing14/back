<template>
    <Drawer
        ref="dataGrantDrawer"
        title="数据授权"
        :visible.sync="visible"
        :onOk="createData"
        @close="onClose">
        <a-form
            ref="dataForm"
            :form="form"
        >
            <a-form-item
                v-for="(el, index) in dataAccessName"
                :key="index"
                :label="el.label"
            >
                <a-select
                    v-decorator="[`types.${index}`, {initialValue: dataAccessType[0] ? dataAccessType[0].value : ''}]"
                    clearable
                    filterable
                    class="filter-item"
                    placeholder="请选择"
                >
                    <a-select-option
                        v-for="(op, opIndex) in dataAccessType"
                        :key="opIndex"
                        :value="op.value"
                    >
                        {{ op.label }}
                    </a-select-option>
                </a-select>
                <a-form-item
                    v-if="form.getFieldValue('types.'+index) === '3'"
                    style="display: inline-block;"
                >
                    <!--                    :[-->
                    <!--                    { required: true, message: '请输入祖宗部门层级', trigger: 'change' },-->
                    <!--                    { max:100, message: '祖宗部门层级值最大长度100', trigger: 'change' },-->
                    <!--                    { type:'integer', message: '祖宗部门层级只能为正数', trigger: 'change' }-->
                    <!--                    ],getValueFromEvent}-->
                    <a-input
                        v-decorator="[`typeVals.${index}`,{rules: $createRules({
                            msg: '祖宗部门层级',
                            max: 100,
                            integer: true
                        })}]"
                        class="filter-item"
                        placeholder="请输入祖宗部门层级"
                    />
                </a-form-item>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    import {
        Api_getDataAccessName,
        Api_comboboxDict
    } from '@/api/admin/index';
    import {
        Api_RolesAddDataPerms,
        Api_RolesGetDataPerms
    } from '@/api/admin/system/index';

    export default {
        name: 'DataGrant',
        props: {
            selectId: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    dataAccessName: ['dataAccessName', {
                        preserve: true,
                        initialValue: [{}]
                    }]
                },

                visible: false,
                addFormRules: {},
                addFormData: {
                    types: {},
                    typeVals: {}
                },
                dataAccessType: [],
                dataAccessName: undefined,
            };
        },
        beforeCreate() {
            // this.form = this.$form.createForm(this);
            // this.form.getFieldDecorator('type', this.formDecorator.type[1]);
        },
        async created() {
            await Api_getDataAccessName().then(res => {
                this.dataAccessName = res;
                // res.map((item, index) => {
                //     this.$set(this.addFormData.typeVals, 'type' + index, '')
                // })
            });
            Api_comboboxDict('data_access_type').then(res => {
                this.dataAccessType = res;
            });
        },
        methods: {
            getValueFromEvent({data}) {
                console.log(data);
                return Number(data);
            },
            handleGrant() {
                if (this.selectId) {
                    const {dataAccessName} = this;
                    const loading = this.$openLoading();
                    Api_RolesGetDataPerms(this.selectId).then(res => {
                        res.map(item => {
                            dataAccessName.map((tItem, tIndex) => {
                                if (item.name === tItem.value) {
                                    this.form.setFieldsValue({
                                        ['types.' + tIndex]: item.type
                                    });
                                    if (item.type === '3') {
                                        this.$nextTick(() => {
                                            this.form.setFieldsValue({
                                                ['typeVals.' + tIndex]: item.fatherDepth
                                            });
                                        });
                                    }
                                }
                            });
                        });
                        loading.close();
                        this.visible = true;
                    }).catch(() => {
                        loading.close();
                    });
                }
            },
            createData() {
                this.form.validateFields(valid => {
                    if (!valid) {
                        const id = this.selectId;
                        const postArr = [];
                        const {types, typeVals} = this.form.getFieldsValue();
                        for (const key in types) {
                            const typeName = this.dataAccessName[key.split('').pop()].value;
                            const t = types[key] || '';
                            const p = typeVals[key] || '';
                            postArr.push(`${typeName}:${t}:${p}`);
                        }
                        const loading = this.$openLoading();
                        Api_RolesAddDataPerms(id, postArr.join(',')).then(msg => {
                            this.visible = false;
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            selectChange(val, index) {
                if (!this.addFormData.typeVals['type' + index]) {
                    this.addFormData.typeVals['type' + index] = {};
                }
                if (val === '3') {
                    this.addFormData.typeVals['type' + index] = '1';
                } else {
                    delete this.addFormData.typeVals['type' + index];
                }
                if (val === '') {
                    delete this.addFormData.types['type' + index];
                }
            },
            onClose() {
                this.form.resetFields();
            }
        }
    };
</script>

<style scoped>

</style>
