<template>
    <a-modal
        v-model="visible"
        ref="ref_dialog"
        :title="modelStatus === 'add' ? '新增查询标签' : '修改查询标签'"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @ok="handleOk"
        @cancel="onQuerySignModelClose"
        width="1000px"
    >
        <a-form
            :form="form"
            ref="ref_postFormData"
        >
            <a-form-item
                label="查询标签组名"
                prop="groupName"
            >
                <a-input v-decorator="['groupName',{rules:$createRules({
                        msg: '查询标签组名',
                        required: true,
                        max: 50,
                        validator: validatorQuerySignAddName
                    })}]"/>
            </a-form-item>
        </a-form>
        <a-form
            :form="form2"
            ref="ref_postFormDataTags"
        >
            <a-form-item
            >
                <div class="like-table">
                    <div class="l-head">
                        <div>
                            标签名称
                        </div>
                        <div>
                            标签sql
                            <a-tooltip class="item" effect="dark" title="片断sql，不以“and”开头，调用时会和“查询语句”以“ and ”拼接">
                                <i class="iconfont icon-question-circle"></i>
                            </a-tooltip>
                        </div>
                        <div></div>
                    </div>
                    <Draggable
                        v-model="postFormDataTags.tags"
                        v-bind="draggableOptions"
                        :group="{ name: 'people', pull: 'clone', put: false }"
                        class="l-body"
                    >
                        <div v-for="(el, index) in postFormDataTags.tags" :key="index" class="drag-icon" style="cursor: pointer">
                            <div>
                                <a-form-item
                                >
                                    <a-input v-decorator="[`tags.${index}.tagName`,{rules:tagNameRules}]" />
                                </a-form-item>
                            </div>
                            <div style="flex: 3;">
                                <a-form-item
                                >
                                    <a-input v-decorator="[`tags.${index}.tagSql`,{rules:tagSqlRules}]"/>
                                </a-form-item>
                            </div>
                            <div style="flex: none;width: 90px;">
                                <a-form-item
                                >
                                    <a-button type="success" icon="plus" shape="circle" @click="add"/>
                                    <a-button v-if="postFormDataTags.tags.length>1" icon="minus" shape="circle" @click="del(index)"/>
                                </a-form-item>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import vuedraggable from 'vuedraggable';

    export default {
        name: "QuerySign",
        components: {
            Draggable: vuedraggable
        },
        props: {
            defaultList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                form2: this.$form.createForm(this),
                modelStatus: 'add',
                updateIndex: undefined,
                visible: false,
                postFormData: { // 查询标签的新增数据
                    groupName: ''
                    // tags: [{}]
                },
                draggableOptions: { // vuedraggable的配置
                    animation: 200,
                    handle: '.drag-icon'
                },
                postFormDataTags: {
                    tags: [{
                        tagName: '',
                        tagSql: ''
                    }]
                },
                tagsCopy: [],
                postFormRules: { // 查询标签的表单验证规则
                    groupName: createRules({
                        msg: '查询标签组名',
                        required: true,
                        max: 50,
                        validator: this.validatorQuerySignAddName
                    })
                },
                tagNameRules: createRules({
                    msg: '标签名称',
                    required: true,
                    max: 50,
                    validator: this.validatorTagName
                }),
                tagSqlRules: createRules({
                    msg: '标签sql',
                    required: true,
                    max: 300
                })
            }
        },
        methods: {
            openModel(row, updateIndex) {
                this.visible = true;
                this.$nextTick(()=>{
                    if (row) {
                        this.modelStatus = 'update';
                        this.updateIndex = updateIndex;
                        this.form.setFieldsValue({
                            groupName: row.groupName
                        })
                        this.postFormDataTags.tags = row.tags
                        this.$nextTick(()=>{
                            console.log(this.form2.getFieldsValue());
                            this.form2.setFieldsValue({
                                tags: row.tags
                            })
                        })
                    } else {
                        this.modelStatus = 'add';
                        this.updateIndex = undefined;
                    }
                })
            },
            // 保存新增的查询标签
            handleOk() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        this.form2.validateFields((valid) => {
                            if (!valid) {
                                let updateIndex;
                                if (this.modelStatus === 'update') {
                                    updateIndex = this.updateIndex;
                                }
                                const postFormData = this.form.getFieldsValue();
                                const postFormDataTags = this.form2.getFieldsValue();
                                this.$emit('ok', {
                                    ...postFormData,
                                    ...postFormDataTags
                                }, updateIndex);
                                this.visible = false;
                                this.onClose()
                            }
                        })
                    }
                })
            },
            // 验证查询标签组名是否已存在
            validatorQuerySignAddName(rule, value, callback) {
                const { groupName } = this.form.getFieldsValue();
                const { updateIndex } = this;
                const findRes = this.defaultList.find((item, index) => { // 查找查询标签是否已经存在
                    return item.groupName === groupName && updateIndex !== index;
                });
                if (findRes) {
                    callback(new Error('查询标签组名已存在'));
                } else {
                    callback()
                }
            },
            validatorTagName(rule, value, callback) {
                const tagsNams = this.form2.getFieldsValue().tags.map(item => {
                    return item.tagName;
                });

                const firstIndex = tagsNams.indexOf(value);
                const lastIndex = tagsNams.lastIndexOf(value);
                if (!value) {
                    callback(new Error('标签名称必填'));
                    return;
                }
                if (firstIndex !== lastIndex) {
                    callback(new Error('标签名称已存在'));
                } else {
                    callback()
                }
            },
            add() {
                this.postFormDataTags.tags.push({
                    tagName: '',
                    tagSql: ''
                });
            },
            del(index) {
                if (this.postFormDataTags.tags.length > 1) {
                    this.postFormDataTags.tags.splice(index, 1);
                    this.$nextTick(() => {
                        this.$refs['ref_postFormDataTags'].clearValidate()
                    })
                }
            },
            // 查询标签弹框关闭时
            onQuerySignModelClose() {
                // this.postFormDataTags.tags = [{
                //     tagName: '',
                //     tagSql: ''
                // }];
                // this.$nextTick(() => {
                    this.form.resetFields();
                    this.form2.resetFields();
                    this.modelStatus = 'add';
                    this.updateIndex = undefined;
                // })
            }
        }
    }
</script>

<style scoped lang="scss">
    .querySign-table {
        /*border: none;*/
        width: 100%;

        th:nth-child(2), td:nth-child(2) {
            padding: 10px 12px;
        }
    }

</style>
