<template>
<Drawer
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus==='add'?'新增节假日':'修改节假日'"
    :onOk="handleSure"
    @close="onClose">
    <el-form
        ref="dataForm"
        :rules="addFormRules"
        :model="addFormData"
        label-position="right"
        label-width="8em"
    >
        <el-form-item
            label="节假日类型"
            prop="type">
            <el-select v-model="addFormData.type" placeholder="请选择" style="width: 170px;" filterable>
                <el-option
                    v-for="item in typeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item
            label="时间起止"
            prop="startDate"
        >
            <el-date-picker
                v-model="timeArrVal"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
        </el-form-item>
    </el-form>
</Drawer>
</template>

<script>
    import {Api_comboboxDict} from '@/api/admin/index'
    import {
        Api_HolidayAdd,
        Api_HolidayUpdate
    } from '@/api/admin/system/index'

    export default {
        name: 'CreateUpdate',
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
            selectData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                timeArrVal: '',
                typeData: [],
                addFormRules: {
                    type: createRules({
                        msg: '节假日类型',
                        required: true
                    }),
                    startDate: createRules({
                        msg: '起止时间',
                        required: true
                    })
                },
                addFormData: {// 新增节假日的表单数据
                    type: undefined,
                    startDate: undefined,
                    endDate: undefined
                }
            }
        },
        watch: {
            timeArrVal: function (time) {
                const timeArr = time || ['', ''];
                this.addFormData.startDate = timeArr[0];
                this.addFormData.endDate = timeArr[1];
            }
        },
        created() {
            // 获取holiday_type节假日字典数据
            Api_comboboxDict('holiday_type').then(res => {
                this.typeData = res;
            })
        },
        methods: {
            // 打开模态框
            openModel(modelType) {
                const selectData = this.selectData;
                const addFormData = this.addFormData;
                const { id } = selectData;
                if (modelType === 'update' && !id) {
                    this.$message.warning('请先选择要修改的数据！');
                    return;
                }
                if (modelType === 'add') { // 是新增节假日
                    this.visible = true
                } else if (modelType === 'update') { // 是修改节假日
                    for (const key in addFormData) {
                        if (selectData.hasOwnProperty(key)) {
                            this.addFormData[key] = selectData[key]
                        }
                    }
                    this.visible = true
                }
            },
            // 点击确认
            handleSure() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.addFormData;
                        const promiseRes = modelStatus === 'add' ? Api_HolidayAdd(postData) : Api_HolidayUpdate(id, {
                            ...postData,
                            version
                        });
                        const loading = this.$openLoading();
                        promiseRes.then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close()
                        }).catch(() => {
                            loading.close()
                        })
                    }
                })
            },
            onClose() {
                this.$refs['dataForm'].resetFields();
                this.timeArrVal = ''
                // this.timeArrVal[0] = '';
                // this.timeArrVal[1] = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dictionary-list {
        div {
            &::after {
                content: '';
                display: block;
                clear: both;
            }
        }

        .el-form-item {
            float: left;
            margin-right: 10px;

            label {
                text-align: center;
                padding-right: 0;
            }
        }

        input {
            width: 100px;
        }
    }
</style>
