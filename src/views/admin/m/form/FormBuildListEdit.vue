<template>
    <div>
        <Drawer
            ref="drawer"
            :visible.sync="visible"
            :title="titleInfo"
            :onOk="handleSure"
            fullscreen
            @close="onBuildModelClose"
        >
            <el-row>
                <el-col :md="leftFormOpened?8:2" :lg="leftFormOpened?6:1">
                    <hamburger
                        :toggle-click="toggleSideBar"
                        :is-active="leftFormOpened"
                        class="hamburger-container"
                    />
                    <div class="left-top">
                        <div class="flex">
                            <div class="flex-primary">
                                <h2 class="interface-title">平铺</h2>
                            </div>
                            <div v-if="leftFormOpened" style="display: inline-block;margin-top: 10px;">
                                <el-popover
                                    placement="right"
                                    width="400"
                                    trigger="click"
                                    popper-class="pp-popover"
                                >
                                    <el-select v-model="ppData" placeholder="请选择" filterable multiple collapse-tags style="width: 100%;"
                                               @change="ppSelectChange">
                                        <el-option v-for="(el, index) in ppOptions" :key="index" :label="el.label" :value="el.value"/>
                                    </el-select>
                                    <el-button slot="reference">添加</el-button>
                                </el-popover>
                            </div>
                        </div>
                        <div class="left-content">
                            <Draggable
                                v-model="ppRenderData"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="left-ul-wrap"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li v-for="(el, index) in ppRenderData" :key="el.id" class="drag-icon flex" @click="handleUpdateFormBuildPP(el, index)">
                                        <div class="flex-primary">{{ el.name }}</div>
                                        <div @click.stop="closePp(el)"><i class="iconfont icon-close"></i></div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                    <div class="left-bottom">
                        <div class="flex">
                            <div class="flex-primary">
                                <h2 class="interface-title">tab</h2>
                            </div>
                            <div v-if="leftFormOpened" style="display: inline-block;margin-top: 10px;">
                                <el-popover
                                    placement="right"
                                    width="400"
                                    trigger="click"
                                    popper-class="pp-popover"
                                >
                                    <el-select v-model="tabData" placeholder="请选择" filterable multiple collapse-tags style="width: 100%;"
                                               @change="tabSelectChange">
                                        <el-option v-for="(el, index) in tabOptions" :key="index" :label="el.label" :value="el.value"/>
                                    </el-select>
                                    <el-button slot="reference">添加</el-button>
                                </el-popover>
                            </div>
                        </div>
                        <div class="left-content">
                            <Draggable
                                v-model="tabRenderData"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="left-ul-wrap"
                            >
                                <transition-group tag="ul" name="fade-in-up" mode="out-in" appear>
                                    <li v-for="(el, index) in tabRenderData" :key="el.id" class="drag-icon flex" @click="handleUpdateFormBuildTab(el, index)">
                                        <div class="flex-primary">{{ el.name }}</div>
                                        <div @click.stop="closeTab(el)"><i class="iconfont icon-close"></i></div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                </el-col>
                <el-col :md="leftFormOpened?16:22" :lg="leftFormOpened?18:23" style="padding-left: 24px;">
                    <el-form
                        ref="ref_buildDataForm"
                        :rules="addFormRules"
                        :model="addFormData"
                        label-position="right"
                        label-width="8em"
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
                                    <el-tooltip class="item" effect="dark" content="格式：({table}){column},如果该模型不作为子模型，则可不填；如果作为子模型则填入外键，“table”必需与主键的“table”保持一致">
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
                        </div>
                        <el-form-item
                            class="item-area"
                            label="列信息"
                            prop="column"
                        >
                            <div class="content">
                                <div class="like-table">
                                    <div class="l-head">
                                        <div style="width: 10%;">
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
                                        <div style="width: 5%;">
                                            列宽
                                            <el-tooltip class="item" effect="dark" content="列宽，整数，单位：像素，非必填，不填的话，宽度为均分值">
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
                                        <div style="width: 10%;">
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
                                            <el-button icon="el-icon-plus" type="success" circle @click="openColumnAdd"/>
                                        </div>
                                    </div>
                                    <Draggable
                                        v-model="column"
                                        v-bind="draggableOptions"
                                        :group="{ name: 'people', pull: 'clone', put: false }"
                                        class="l-body"
                                    >
                                        <div v-for="(el, index) in column" :key="el.name+index" class="drag-icon" @click="openColumnUpdate(el, index)"
                                             style="cursor: pointer">
                                            <div><span>{{ el.name || '-' }}</span></div>
                                            <div ><span>{{ el.title || '-' }}</span></div>
                                            <div><span>{{ el.show | filterBoolean }}</span></div>
                                            <div><span>{{ el.width }}</span></div>
                                            <div>
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
                                                                <br />
                                                                option值：{{ el.selectValue }} <br />
                                                                option展示内容：{{ el.selectLabel }} <br />
                                                            </template>
                                                        </template>
                                                        <i class="iconfont icon-question-circle"></i>
                                                    </el-tooltip>
                                                </span>
                                            </div>
                                            <div><span>{{ el.colspan || '-' }}</span></div>
                                            <div><span>{{ el.nullable | filterBoolean }}</span></div>
                                            <div><span>{{ el.editable | filterBoolean }}</span></div>
                                            <div><span>{{ el.length || '-' }}</span></div>
                                            <div><span>{{ filterValidation(el.validationRuleId) }}</span></div>
                                            <div>
                                                <el-button icon="iconfont icon-minus" type="danger" circle @click="delColumn(index)"/>
                                            </div>
                                        </div>
                                    </Draggable>
                                </div>
                            </div>
<!--                            <div>-->
<!--                                <el-button type="primary" icon="iconfont icon-plus" class="button-new-tag" @click="openColumnAdd">列</el-button>-->
<!--                            </div>-->
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </Drawer>

        <!--平铺表单建模修改-->
        <FormBuildEdit
            ref="ref_formBuildEditPP"
            :data="formBuildEditDataPP"
            @ok="onFormBuildEditOkPP"
        />
        <!--平铺表单建模修改-->
        <FormBuildEdit
            ref="ref_formBuildEditTab"
            :data="formBuildEditDataTab"
            @ok="onFormBuildEditOkTab"
        />
        <!--新增表单项模态框-->
        <FormProp
            ref="ref_column"
            :defaultList="column"
            :validationRuleIdOptions="validationRuleIdOptions"
            isListEdit
            @ok="onColumnOk"
        />
    </div>
</template>

<script>
    import { merge } from 'lodash'
    import vuedraggable from 'vuedraggable';
    import Hamburger from '@/components/Hamburger'
    import {switchColors} from '@/utils/variables'
    import FormBuildEdit from './components/FormBuildEdit'; // 平铺表单或tab表单建模修改
    import FormProp from './components/FormProp'; // 表单项弹框组件
    import {
        Api_FormModelBuild,
        Api_FormModelBuildDetail,
        Api_FormFormsCombobox,
        Api_ValidationRulesCombobox,
        Api_FormDetail
    } from '@/api/admin/m/index'

    export default {
        name: 'FormBuildListEdit',
        components: {
            Draggable: vuedraggable,
            FormProp,
            FormBuildEdit,
            Hamburger
        },
        filters: {
            filterAlign(val) {
                if (val === 'left') {
                    return '居左';
                } else if (val === 'center') {
                    return '居中';
                } else {
                    return '居右';
                }
            },
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
                        required: true,
                        max: 1,
                        min: 0.1,
                        number: true
                    }),
                    subTitle: createRules({
                        msg: '副标题',
                        max: 50
                    }),
                    primaryKey: createRules({
                        msg: '主键',
                        required: true,
                        EXP_ENG_NUM_5: true
                    })
                },
                addFormData: {// 新增的数据
                    width: '1',
                    primaryKey: '',
                    foreignKey: '',
                    subTitle: ''
                },
                column: [], // 表格里列信息的数据
                formBuildEditDataPP: {}, // 平铺表单建模修改数据
                formBuildEditDataTab: {} // 平铺表单建模修改数据
            }
        },
        computed: {
            titleInfo() {
                const {title, name} = this.selectData;
                return `${name}、${title}——建模`
            }
        },
        created() {
            Api_ValidationRulesCombobox().then(res => {
                this.validationRuleIdOptions = res;
            });
        },
        methods: {
            // 打开模态框
            openModel() {
                Api_FormFormsCombobox().then(res => {
                    this.ppOptions = res;
                    this.tabOptions = res;
                });
                const {id: formId} = this.selectData;
                if (formId) {
                    const loading = this.$openLoading();
                    Api_FormModelBuildDetail(formId).then(res => {
                        const json = res.model;
                        if (json) {
                            this.column = json.columns;
                            this.addFormData.subTitle = json.subTitle;
                            this.addFormData.width = json.width + '';
                            this.addFormData.primaryKey = json.primaryKey + '';
                            this.addFormData.foreignKey = json.foreignKey + '';

                            json.normals.map(item => {
                                this.ppData.push(item.formId);
                                Api_FormDetail(item.formId).then(res => {
                                    this.ppRenderData.push({
                                        ...res,
                                        model: {...item}
                                    })
                                })
                            });
                            json.tabs.map(item => {
                                this.tabData.push(item.formId);
                                Api_FormDetail(item.formId).then(res => {
                                    this.tabRenderData.push({
                                        ...res,
                                        model: {...item}
                                    })
                                })
                            });
                        }
                        this.visible = true;
                        loading.close();
                    }).catch(() => {
                        loading.close();
                    })
                } else {
                    this.visible = true;
                }
            },
            // 点击确认
            handleSure() {
                this.$refs.ref_buildDataForm.validate((valid) => {
                    if (valid) {
                        const postData = {};
                        const {id: formId, type} = this.selectData;
                        const { column: columns} = this;
                        const modelNormals = this.ppRenderData.map(item => item.model);
                        const modelTabs = this.tabRenderData.map(item => item.model);
                        const text = {
                            ...this.addFormData,
                            type,
                            formId,
                            columns,
                            normals: modelNormals,
                            tabs: modelTabs
                        };
                        postData.type = type;
                        postData.normals = this.ppRenderData.map(item => item.id).join(',');
                        postData.tabs = this.tabRenderData.map(item => item.id).join(',');
                        postData.text = JSON.stringify(this.$trimObject(merge({}, text)));
                        if (!columns.length) {
                            this.$message.warning('请至少添加一条列数据！')
                            return;
                        }
                        const loading = this.$openLoading();
                        Api_FormModelBuild(formId, postData).then(msg => {
                            this.visible = false;
                            this.onBuildModelClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close()
                        }).catch(() => {
                            loading.close()
                        })
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
            // 平铺表单修改建模
            handleUpdateFormBuildPP(row, updateIndex) {
                this.$refs.ref_formBuildEditPP.openModel(row, updateIndex);
            },
            // tab表单修改建模
            handleUpdateFormBuildTab(row, updateIndex) {
                this.$refs.ref_formBuildEditTab.openModel(row, updateIndex);
            },
            // 删除列信息
            delColumn(delIndex) {
                this.column.splice(delIndex, 1)
            },
            // 新增列信息成功
            onColumnOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.column.splice(updateIndex, 1, data);
                } else {
                    this.column.push(data);
                }
            },
            // 平铺表单选择change事件
            ppSelectChange(val) {
                this.ppRenderData = [];
                // 根据选中的数据拉取详情数据
                val.forEach(item => {
                    Api_FormModelBuildDetail(item).then(res => {
                        this.ppRenderData.push(res)
                    })
                });
            },
            // tab表单选择change事件
            tabSelectChange(val) {
                this.tabRenderData = [];
                // 根据选中的数据拉取详情数据
                val.forEach(item => {
                    Api_FormModelBuildDetail(item).then(res => {
                        this.tabRenderData.push(res)
                    })
                });
            },
            // 平铺表单建模修改确认事件
            onFormBuildEditOkPP(newDataModel, updateIndex) {
                this.ppRenderData[updateIndex].model = newDataModel
            },
            // tab表单建模修改确认事件
            onFormBuildEditOkTab(newDataModel, updateIndex) {
                this.tabRenderData[updateIndex].model = newDataModel
            },
            // 关闭平铺类型的表单
            closePp(row) {
                const index = this.ppRenderData.findIndex(item => item.id === row.id);
                this.ppData.splice(index, 1)
                this.ppRenderData.splice(index, 1)
            },
            // 关闭tab类型的表单
            closeTab(row) {
                const index = this.tabRenderData.findIndex(item => item.id === row.id);
                this.tabData.splice(index, 1)
                this.tabRenderData.splice(index, 1)
            },
            filterValidation(val) {
                const res = this.validationRuleIdOptions.find(item => item.value === val)
                return res ? res.label : '-';
            },
            toggleSideBar() {
                this.leftFormOpened = !this.leftFormOpened;
            },
            // 建模弹框关闭时
            onBuildModelClose() {
                this.$refs['ref_buildDataForm'].resetFields();
                this.ppData = [];
                this.tabData = [];
                this.ppRenderData = [];
                this.tabRenderData = [];
                this.column = [];
            }
        }
    }
</script>
