<template>
    <div>
        <el-dialog
            ref="drawer"
            :title="oldFormData.name"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @close="onBuildModelClose"
            width="1300px"
        >
            <el-form
                ref="ref_buildDataForm"
                :rules="addFormRules"
                :model="addFormData"
                label-position="right"
                label-width="7em"
            >
                <div class="item-area" style="margin-bottom: 15px;">
                    <el-form-item
                        label="主键"
                        prop="primaryKey"
                        class="fl"
                    >
                        <template slot="label">
                            主键
                            <el-tooltip class="item" effect="dark" content="格式：({table}){column}">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.primaryKey" style="width: auto"/>
                    </el-form-item>
                    <el-form-item
                        label="外键"
                        prop="foreignKey"
                        class="fl"
                    >
                        <template slot="label">
                            外键
                            <el-tooltip class="item" effect="dark" content="格式：({table}){column},如果该模型不作为子模型，则可不填；如果作为子模型则填入外键，“table”必需与主键的“table”">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.foreignKey" style="width: auto"/>
                    </el-form-item>
                    <el-form-item
                        label="宽度占比"
                        prop="width"
                        class="fl"
                        style="margin-left: 25px;"
                    >
                        <template slot="label">
                            宽度占比
                            <el-tooltip class="item" effect="dark" content="0到1之间的数字比例">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.width" style="width: auto"/>
                    </el-form-item>
                    <el-form-item
                        label="副标题"
                        prop="subTitle"
                        class="fl"
                    >
                        <el-input v-model="addFormData.subTitle" style="width: auto"/>
                    </el-form-item>
                    <el-form-item
                        label="每行记录数"
                        prop="rowColumns"
                        class="fl"
                    >
                        <template slot="label">
                            每行记录数
                            <el-tooltip class="item" effect="dark" content="最少1个，最多4个">
                                <i class="iconfont icon-question-circle"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="addFormData.rowColumns" style="width: auto"/>
                    </el-form-item>
                </div>
                <el-form-item
                    class="item-area"
                    label="表单项"
                >
                    <div class="content">
                        <div class="like-table">
                            <div class="l-head">
                                <div style="width: 20%;">
                                    属性
                                    <el-tooltip class="item" effect="dark" content="格式：({table}){column}，“table”必需与主键的“table”一致，如果是附件则为附件的type">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    名称
                                    <el-tooltip class="item" effect="dark" content="页面显示的属性名称">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    是否显示
                                    <el-tooltip class="item" effect="dark" content="尽量把不显示字段放到最后，容易判断页面上字段的排版">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    类型
                                    <el-tooltip class="item" effect="dark" content="支持字典的多选，但不支持一对多表的多选">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    合并长度
                                    <el-tooltip class="item" effect="dark" content="如一行排放的元素不满每行记录数，则元素长度为：合并长度/每行记录数">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 5%;">
                                    是否为空
                                </div>
                                <div style="width: 10%;">
                                    是否编辑
                                    <el-tooltip class="item" effect="dark" content="不可编辑时，该字段的值不会入库">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    字符长度
                                    <el-tooltip class="item" effect="dark" content="因为中文占3个字符，所以需要输入中文的字符长度，是数据库中的1/3">
                                        <i class="iconfont icon-question-circle"></i>
                                    </el-tooltip>
                                </div>
                                <div style="width: 10%;">
                                    验证规则
                                </div>
                                <div style="width: 5%;">
                                    <el-button type="primary" icon="iconfont icon-plus" class="button-new-tag" @click="openColumnAdd">项</el-button>
                                </div>
                            </div>
                            <Draggable
                                v-model="column"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                @end="onDraggableEnd"
                                class="l-body"
                            >
                                <div v-for="(el, index) in column" :key="el.name+index" class="drag-icon" @click="openColumnUpdate(el, index)"
                                     style="cursor: pointer">
                                    <div style="width: 20%;"><span>{{ el.name || '-' }}</span></div>
                                    <div style="width: 15%;"><span>{{ el.title || '-' }}</span></div>
                                    <div style="width: 10%;">
                                                <span>
                                                    {{ el.type | filterType }}
                                                    <el-tooltip v-if="el.type==='attachment'" class="item" effect="dark">
                                                        <template slot="content">
                                                            附件类型：{{ el.docType }} <br/>
                                                            是否多个：{{ el.isMulti | filterBoolean }}
                                                        </template>
                                                        <i class="iconfont icon-question-circle"></i>
                                                    </el-tooltip>
                                                     <el-tooltip v-else-if="el.type==='select'" class="item" effect="dark">
                                                        <template slot="content">
                                                            <template v-if="el.dictCode">
                                                                   字典：{{ el.dictCode }}
                                                            </template>
                                                            <template v-else>
                                                                自定义查询sql：<span style="display:inline-block;vertical-align: top;
                                                                max-width: 300px;word-break: break-all;">
                                                                {{ el.selectSql }}</span>
                                                                <br/>
                                                                option值：{{ el.selectValue }} <br/>
                                                                option展示内容：{{ el.selectLabel }} <br/>
                                                            </template>
                                                        </template>
                                                        <i class="iconfont icon-question-circle"></i>
                                                    </el-tooltip>
                                                </span>
                                    </div>
                                    <div style="width: 10%;"><span>{{ el.colspan || '-' }}</span></div>
                                    <div style="width: 10%;"><span>{{ el.nullable | filterBoolean }}</span></div>
                                    <div style="width: 10%;"><span>{{ el.editable | filterBoolean }}</span></div>
                                    <div style="width: 10%;"><span>{{ el.length || '-' }}</span></div>
                                    <div style="width: 10%;"><span>{{ filterValidation(el.validationRuleId) }}</span></div>
                                    <div style="width: 5%;text-align: center;line-height: 33px;">
                                        <i class="iconfont icon-close" @click.stop="delColumn(index)"></i>
                                    </div>
                                </div>
                            </Draggable>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
                <el-button type="primary" @click="handleSure">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增表单项模态框-->
        <FormProp
            ref="ref_column"
            :defaultList="column"
            :validationRuleIdOptions="validationRuleIdOptions"
            @ok="onColumnOk"
        />
    </div>
</template>

<script>
    import vuedraggable from 'vuedraggable';
    import { switchColors } from '@/utils/variables'
    import FormProp from './FormProp'; // 表单项弹框组件
    import {
        Api_ValidationRulesCombobox
    } from '@/api/admin/m/index'

    export default {
        name: 'FormBuildView',
        components: {
            Draggable: vuedraggable,
            FormProp

        },
        filters: {
            filterBoolean(val) {
                return val ? '是' : '否'
            },
            filterType(val) {
                switch (val) {
                    case 'string':
                        return '字符串';
                    case 'textarea':
                        return '长字符串';
                    case 'integer':
                        return '整数';
                    case 'double':
                        return '小数';
                    case 'date':
                        return '日期';
                    case 'datetime':
                        return '时间';
                    case 'select':
                        return '下拉框';
                    case 'attachment':
                        return '附件';
                    case 'popup':
                        return '弹框';
                    default:
                        return '-'
                }
            }
        },
        props: {
            modelStatus: {
                type: String,
                default: ''
            },
            selectData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                switchColors,
                visible: false,
                leftFormOpened: false,
                ppOptions: [], // 平铺的列表数据
                ppRenderData: [], // 平铺的选中数据(用于页面渲染)
                ppData: [], // 平铺的选中数据
                tabOptions: [], // tab的列表数据
                tabRenderData: [], // tab的选中数据(用于页面渲染)
                tabData: [], // tab的选中数据
                validationRuleIdOptions: [], // 验证规则的option数据
                draggableOptions: { // vuedraggable的配置
                    animation: 200,
                    handle: '.drag-icon'
                },
                addFormRules: {
                    width: createRules({
                        msg: '宽度占比',
                        max: 1,
                        number: true
                    }),
                    subTitle: createRules({
                        msg: '副标题',
                        max: 50
                    }),
                    rowColumns: createRules({
                        msg: '每行记录数',
                        max: 50,
                        integer: true
                    }),
                    primaryKey: createRules({
                        msg: '主键',
                        required: true,
                        EXP_ENG_NUM_5: true
                    })
                },
                addFormData: {// 新增的数据
                    rowColumns: '1',
                    width: '1',
                    primaryKey: '',
                    foreignKey: '',
                    subTitle: ''
                },
                oldFormData: {},
                updateIndex: 0,
                column: [] // 表格里列信息的数据
            }
        },
        created() {
            Api_ValidationRulesCombobox().then(res => {
                this.validationRuleIdOptions = res;
            })
        },
        methods: {
            // 打开模态框
            openModel(oldFormData, updateIndex) {
                const o = { ...oldFormData };
                this.oldFormData = o;
                this.updateIndex = updateIndex;
                const json = o.model;
                if (json) {
                    this.addFormData.rowColumns = json.rowColumns + '';
                    this.addFormData.width = json.width + '';
                    this.addFormData.subTitle = json.subTitle;
                    this.addFormData.primaryKey = json.primaryKey;
                    this.addFormData.foreignKey = json.foreignKey;
                    this.column = json.columns || [];
                }
                this.visible = true;
            },
            // 点击确认
            handleSure() {
                this.$refs.ref_buildDataForm.validate((valid) => {
                    if (valid) {
                        const { id: formId, type } = this.selectData;
                        const { column: columns } = this;
                        const modelNormals = [];
                        const modelTabs = [];
                        const text = {
                            type,
                            formId,
                            columns,
                            normals: modelNormals,
                            tabs: modelTabs,
                            ...this.addFormData
                        };
                        this.$emit('ok', { ...text }, this.updateIndex);
                        this.visible = false;
                    }
                })
            },
            // 打开新增列模态框
            openColumnAdd() {
                this.$refs.ref_column.openModel();
            },
            // 打开修改列模态框
            openColumnUpdate(row, updateIndex) {
                this.$refs.ref_column.openModel(row, updateIndex);
            },
            // 新增列信息成功
            onColumnOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.column.splice(updateIndex, 1, data);
                } else {
                    this.column.push(data);
                }
            },
            // 建模弹框关闭时
            onBuildModelClose() {
                this.$refs['ref_buildDataForm'].resetFields();
                this.ppData = [];
                this.tabData = [];
                this.ppRenderData = [];
                this.tabRenderData = [];
                this.column = [];
            },
            filterValidation(val) {
                const res = this.validationRuleIdOptions.find(item => item.value === val)
                return res ? res.label : '-';
            },
            toggleSideBar() {
                this.leftFormOpened = !this.leftFormOpened;
            },
            onDraggableEnd() {
            },
            // 删除列信息
            delColumn(delIndex) {
                this.column.splice(delIndex, 1)
            }
        }
    }
</script>

