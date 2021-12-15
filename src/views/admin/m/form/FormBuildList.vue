<template>
    <div>
        <Drawer
            ref="drawer"
            :visible.sync="visible"
            :title="titleInfo"
            :on-ok="handleSure"
            fullscreen
            @close="onBuildModelClose"
        >
            <a-row>
                <a-col :md="leftFormOpened ? 8 : 2" :lg="leftFormOpened ? 6 : 1">
                    <Hamburger
                        :toggle-click="toggleSideBar"
                        :is-active="leftFormOpened"
                        class="hamburger-container"
                    />
                    <div class="left-top">
                        <div class="flex">
                            <div class="flex-primary">
                                <h2 class="interface-title">平铺</h2>
                            </div>
                            <div
                                v-if="leftFormOpened"
                                style="display: inline-block;margin-top: 10px;"
                            >
                                <a-popover
                                    placement="right"
                                    width="400"
                                    :trigger="['click']"
                                    popper-class="pp-popover"
                                >
                                    <a-select
                                        v-model="ppData"
                                        slot="content"
                                        placeholder="请选择"
                                        filterable
                                        multiple
                                        collapse-tags
                                        style="width: 100%;"
                                        @change="ppSelectChange"
                                    >
                                        <a-select-option
                                            v-for="(el, index) in ppOptions"
                                            :key="index"
                                            :value="el.value"
                                        >
                                            {{ el.label }}
                                        </a-select-option>
                                    </a-select>
                                    <a-button>添加</a-button>
                                </a-popover>
                            </div>
                        </div>
                        <div class="left-content">
                            <Draggable
                                v-model="ppRenderData"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="left-ul-wrap"
                            >
                                <transition-group
                                    tag="ul"
                                    name="fade-in-up"
                                    mode="out-in"
                                    appear
                                >
                                    <li
                                        v-for="(el, index) in ppRenderData"
                                        :key="el.id"
                                        class="drag-icon flex"
                                        @click="handleUpdateFormBuildPP(el, index)"
                                    >
                                        <div class="flex-primary">{{ el.name }}</div>
                                        <div @click.stop="closePp(el)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
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
                            <div
                                v-if="leftFormOpened"
                                style="display: inline-block;margin-top: 10px;"
                            >
                                <a-popover
                                    placement="right"
                                    width="400"
                                    :trigger="['click']"
                                    popper-class="pp-popover"
                                >
                                    <a-select
                                        v-model="tabData"
                                        slot="content"
                                        placeholder="请选择"
                                        filterable
                                        multiple
                                        collapse-tags
                                        style="width: 100%;"
                                        @change="tabSelectChange"
                                    >
                                        <a-select-option
                                            v-for="(el, index) in tabOptions"
                                            :key="index"
                                            :label="el.label"
                                            :value="el.value"
                                        >
                                            {{ el.label }}
                                        </a-select-option>
                                    </a-select>
                                    <a-button>添加</a-button>
                                </a-popover>
                            </div>
                        </div>
                        <div class="left-content">
                            <Draggable
                                v-model="tabRenderData"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="left-ul-wrap"
                            >
                                <transition-group
                                    tag="ul"
                                    name="fade-in-up"
                                    mode="out-in"
                                    appear
                                >
                                    <li
                                        v-for="(el, index) in tabRenderData"
                                        :key="el.id"
                                        class="drag-icon flex"
                                        @click="handleUpdateFormBuildTab(el, index)"
                                    >
                                        <div class="flex-primary">{{ el.name }}</div>
                                        <div @click.stop="closeTab(el)">
                                            <i class="iconfont icon-close"></i>
                                        </div>
                                    </li>
                                </transition-group>
                            </Draggable>
                        </div>
                    </div>
                </a-col>
                <a-col :md="leftFormOpened ? 16 : 22" :lg="leftFormOpened ? 18 : 23" style="padding-left: 24px;">
                    <a-form
                        ref="ref_buildDataForm"
                        :form="form"
                        :rules="addFormRules"
                        :model="addFormData"
                    >
                        <div class="item-area" style="margin-bottom: 15px;">
                            <div class="clearfix">
                                <a-form-item :labelCol="labelColInline" :wrapperCol="wrapperColInline" label="主键"
                                             class="fl" style="width: 25%;">
                                    <template slot="label">
                                        主键
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            content="格式：({table}){column}"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <a-input
                                        v-decorator="formDecorator.primaryKey"
                                        style="width: auto"
                                    />
                                </a-form-item>
                                <a-form-item :labelCol="labelColInline" :wrapperCol="wrapperColInline" label="外键"
                                             class="fl" style="width: 25%;">
                                    <template slot="label">
                                        外键
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            content="格式：({table}){column},如果该模型不作为子模型，则可不填；如果作为子模型则填入外键"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <a-input
                                        v-decorator="formDecorator.foreignKey"
                                        style="width: auto"
                                    />
                                </a-form-item>
                                <a-form-item :labelCol="labelColInline" :wrapperCol="wrapperColInline" label="宽度占比"
                                             class="fl" style="width: 25%;">
                                    <template slot="label">
                                        宽度占比
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            content="0到1之间的数字比例"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <a-input v-decorator="formDecorator.width" style="width: auto"/>
                                </a-form-item>
                                <a-form-item :labelCol="labelColInline" :wrapperCol="wrapperColInline" label="副标题"
                                             class="fl" style="width: 25%;">
                                    <template slot="label">
                                        副标题
                                        <i
                                            class="iconfont icon-image icon-image-extend"
                                            @click="showDialogImg('subTitle')"
                                        ></i>
                                    </template>
                                    <a-input v-decorator="formDecorator.subTitle" style="width: auto"/>
                                </a-form-item>
                            </div>
                            <div class="clearfix">
                                <a-form-item
                                    :labelCol="{span: 10}"
                                    :wrapperCol="{span:14}"
                                    label="是否分页"
                                    class="fl"
                                    style="width: 20%;margin-bottom: 0;margin-left: 10px;"
                                >
                                    <a-switch
                                        v-decorator="formDecorator.paging"
                                        style="margin-top: 4px;"
                                    />
                                </a-form-item>
                                <a-form-item
                                    :labelCol="{span: 10}"
                                    :wrapperCol="{span:14}"
                                    label="列表多选"
                                    class="fl"
                                    style="width: 20%;margin-bottom: 0;margin-left: 10px;"
                                >
                                    <a-switch
                                        v-decorator="formDecorator.isCheckbox"
                                        style="margin-top: 4px;"
                                    />
                                </a-form-item>
                                <a-form-item
                                    :labelCol="{span: 10}"
                                    :wrapperCol="{span:14}"
                                    label="导出按钮"
                                    class="fl"
                                    style="width: 20%;margin-bottom: 0;margin-left: 10px;"
                                >
                                    <a-switch
                                        v-decorator="formDecorator.export"
                                        style="margin-top: 4px;"
                                    />
                                </a-form-item>
                            </div>
                        </div>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area" label="头部统计块">
                            <template slot="label">
                                头部统计块
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('statisticBlock')"
                                ></i>
                            </template>
                            <Draggable
                                v-model="statistic"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="content"
                            >
                                <a-tag
                                    v-for="(tag, index) in statistic"
                                    :key="index"
                                    closable
                                    class="drag-icon"
                                    @close.stop="handleStatisticTagClose(index)"
                                    @click="openStatisticAddUpdate(tag, index)"
                                >
                                    {{ tag.name }}
                                </a-tag>
                            </Draggable>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="iconfont icon-plus"
                                    class="button-new-tag"
                                    @click="openStatisticAdd"
                                >
                                    头部统计
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area" label="查询标签">
                            <template slot="label">
                                查询标签
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('tagGroup')"
                                ></i>
                            </template>
                            <Draggable
                                v-model="querySign"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="content"
                            >
                                <a-form-item
                                    v-for="(el, index) in querySign"
                                    :labelCol="{span:2}"
                                    :wrapperCol="{span:22}"
                                    :key="index"
                                    :label="el.groupName + '：'"
                                    style="margin-left: 10px;"
                                    class="drag-icon border-dashed"
                                >
                                    <div class="flex" style="width: 100%;">
                                        <div class="flex-primary">
                                            <a-tag
                                                v-for="(tag, tagIndex) in el.tags"
                                                :key="tag.tagName + tagIndex"
                                                @click="openQuerySignUpdate(el, index)"
                                            >
                                                {{ tag.tagName }}
                                            </a-tag>
                                        </div>
                                        <div style="padding-right: 10px;">
                                            <i
                                                class="iconfont icon-close"
                                                @click="handleQuerySignTagClose(index)"
                                            ></i>
                                        </div>
                                    </div>
                                </a-form-item>
                            </Draggable>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="iconfont icon-plus"
                                    class="button-new-tag"
                                    @click="openQuerySignAdd"
                                >
                                    查询标签
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area" label="查询条件">
                            <template slot="label">
                                查询条件
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('queryCondition')"
                                ></i>
                            </template>
                            <Draggable
                                v-model="queryTerm"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="content"
                            >
                                <a-tag
                                    v-for="(tag, index) in queryTerm"
                                    :key="tag.conditionTitle + index"
                                    closable
                                    class="drag-icon"
                                    @close="handleQueryTermTagClose(index)"
                                    @click="openQueryTermAddUpdate(tag, index)"
                                >
                                    {{ tag.conditionTitle }}
                                </a-tag>
                            </Draggable>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="iconfont icon-plus"
                                    class="button-new-tag"
                                    @click="openQueryTermAdd"
                                >
                                    查询条件
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area" label="顶部按钮">
                            <template slot="label">
                                顶部按钮
                                <a-tooltip class="item" effect="dark" content="(未定内容)">
                                    <i class="iconfont icon-question-circle"></i>
                                </a-tooltip>
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('topButton')"
                                ></i>
                            </template>
                            <Draggable
                                v-model="topButtons"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="content"
                            >
                                <a-tag
                                    v-for="(tag, index) in topButtons"
                                    :key="tag.name + index"
                                    closable
                                    class="drag-icon"
                                    @close="handleTopButtonTagClose(index)"
                                    @click="openTopButtonUpdate(tag, index)"
                                >
                                    {{ tag.name }}
                                </a-tag>
                            </Draggable>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="plus"
                                    class="button-new-tag"
                                    @click="openTopButtonAdd"
                                >
                                    顶部按钮
                                </a-button>
                            </div>
                        </a-form-item>
                        <div class="item-area" style="margin-bottom: 15px">
                            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="查询语句" prop="querySql"
                                         style="margin-bottom: 15px">
                                <template slot="label">
                                    查询语句
                                    <a-tooltip
                                        class="item"
                                        effect="dark"
                                        content="sql不以order by结尾；sql语句请务必添加where valid='1'，因为查询标签与查询条件都是以‘ and ’拼接起来"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </a-tooltip>
                                </template>
                                <a-input
                                    v-decorator="formDecorator.querySql"
                                    :rows="3"
                                    type="textarea"
                                />
                            </a-form-item>
                            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="默认排序" prop="defaultOrder">
                                <template slot="label">
                                    默认排序
                                    <a-tooltip
                                        class="item"
                                        effect="dark"
                                        content="查询语句+' order by '+默认排序，可填入值例如'id','id asc','id desc','id asc,name desc'"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </a-tooltip>
                                </template>
                                <a-input
                                    v-decorator="formDecorator.defaultOrder"
                                    type="text"
                                    style="width: 320px"
                                />
                            </a-form-item>
                        </div>
                        <div class="item-area" style="margin-bottom: 15px;">
                            <div class="flex" style="margin-bottom: 15px;">
                                <div style="width: 220px;text-align: center;">
                                    数据权限
                                    <a-tooltip
                                        class="item"
                                        effect="dark"
                                        content="如果选择了数据权限，“只查询自己sql”和“查询部门sql”都必填"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </a-tooltip>
                                </div>
                                <div
                                    class="flex-primary"
                                    style="margin: 0 15px;text-align: center;"
                                >
                                    只查询自己sql
                                    <a-tooltip
                                        class="item"
                                        effect="dark"
                                        content="参数名只为creatorId"
                                    >
                                        <i class="iconfont icon-question-circle"></i>
                                    </a-tooltip>
                                </div>
                                <div class="flex-primary" style="text-align: center;">
                                    查询部门sql
                                    <a-tooltip class="item" effect="dark" content="只为deptIds">
                                        <i class="iconfont icon-question-circle"></i>
                                    </a-tooltip>
                                </div>
                            </div>
                            <div class="flex">
                                <a-form-item
                                    :prop="'dataAccess.type'"
                                    class="fl"
                                    style="width: 180px;"
                                >
                                    <a-select
                                        v-decorator="formDecorator.dataAccess.type"
                                        placeholder="请选择"
                                        clearable
                                        style="width: 100%;"
                                        @change="handleDataAccessTypeChange"
                                    >
                                        <a-select-option
                                            v-for="(el, index) in dataAccessNameOptions"
                                            :key="index"
                                            :value="el.value"
                                        >
                                            {{ el.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item
                                    :prop="'dataAccess.selfSql'"
                                    class="fl flex-primary"
                                    style="margin: 0 15px;"
                                    :rules="
                                        $createRules({
                                          msg: '只查询自己sql',
                                          required: form.getFieldValue('type') ? true : false
                                        })
                                     "
                                >
                                    <a-input v-decorator="formDecorator.dataAccess.selfSql"/>
                                </a-form-item>
                                <a-form-item
                                    :prop="'dataAccess.deptSql'"
                                    class="fl flex-primary"
                                    :rules="
                                        $createRules({
                                          msg: '查询部门sql',
                                          required: form.getFieldValue('type') ? true : false
                                        })
                                     "
                                >
                                    <a-input v-decorator="formDecorator.dataAccess.deptSql"/>
                                </a-form-item>
                            </div>
                        </div>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area" label="操作按钮">
                            <template slot="label">
                                操作按钮
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('colButton')"
                                ></i>
                            </template>
                            <Draggable
                                v-model="actionButtons"
                                v-bind="draggableOptions"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                class="content"
                            >
                                <a-tag
                                    v-for="(tag, index) in actionButtons"
                                    :key="tag.name + index"
                                    closable
                                    class="drag-icon"
                                    @close="handleActionButtonTagClose(index)"
                                    @click="openActionButtonUpdate(tag, index)"
                                >
                                    {{ tag.name }}
                                </a-tag>
                            </Draggable>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="iconfont icon-plus"
                                    class="button-new-tag"
                                    @click="openActionButtonAdd"
                                >
                                    操作按钮
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rowButtonsWidth"
                                     class="item-area" label="操作列宽">
                            <template slot="label">
                                操作列宽
                                <a-tooltip
                                    class="item"
                                    effect="dark"
                                    content="行按钮总宽度，整数，非必填，不填的话，宽度为均分值"
                                >
                                    <i class="iconfont icon-question-circle"></i>
                                </a-tooltip>
                            </template>
                            <a-input v-decorator="formDecorator.rowButtonsWidth" style="width: auto"/>
                        </a-form-item>
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-area t" label="列信息">
                            <template slot="label">
                                列信息
                                <i
                                    class="iconfont icon-image icon-image-extend"
                                    @click="showDialogImg('columns')"
                                ></i>
                            </template>
                            <div class="content">
                                <a-table
                                    ref="table_col"
                                    :dataSource="form.getFieldValue('queryColumns')"
                                    :columns="columns"
                                    row-key="name"
                                    style="width: 100%">
                                    <div slot="order">
                                        <i class="menu sort" style="cursor: pointer"></i>
                                    </div>
                                    <template slot="annotationHeader">
                                        列名
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            content="表头显示名称"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <div slot="annotation" slot-scope="data, row, index">
                                        <template v-if="!row.edit">
                                            {{ row.annotation }}
                                        </template>
                                        <a-form-item
                                            v-else
                                            :prop="'queryColumns.'+ index+'.annotation' "
                                            :inline-message="true"
                                        >
                                            <a-input v-decorator="[`queryColumns.${index}.annotation`,{
                                                    rules:[{required: true, message: 'key不能为空', trigger: 'blur'}]
                                                }]"/>
                                        </a-form-item>
                                    </div>
                                    <template slot="nameHeader">
                                        key
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            content="查询语句中查询字段名称。注：务必要包含id字段，否则按钮无法操作。"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <div slot="name" slot-scope="data, row, index">
                                        <template v-if="!row.edit">
                                            {{ row.name }}
                                        </template>
                                        <a-form-item
                                            v-else
                                            :inline-message="true"
                                        >
                                            <a-input v-decorator="[`queryColumns.${index}.name`,{
                                                    rules:[{required: true, message: 'key不能为空', trigger: 'blur'}]
                                                }]"/>
                                        </a-form-item>
                                    </div>
                                    <div slot="align" slot-scope="data, row, index">
                                        <template v-if="!row.edit">
                                            {{ row.align | filterAlign }}
                                        </template>
                                        <a-form-item
                                            v-else
                                            :inline-message="true"
                                        >
                                            <a-select v-decorator="[`queryColumns.${index}.align`]" style="width: 100%">
                                                <a-select-option value="left">居左</a-select-option>
                                                <a-select-option value="center">居中</a-select-option>
                                                <a-select-option value="right">居右</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                    <div slot="show" slot-scope="data, row, index">
                                        <template v-if="!row.edit">
                                            <a-checkbox v-model="row.show" disabled></a-checkbox>
                                        </template>
                                        <a-form-item
                                            v-else
                                            :inline-message="true"
                                        >
                                            <a-switch
                                                v-decorator="[`queryColumns.${index}.show`, {valuePropName:'checked'}]"
                                            />
                                        </a-form-item>
                                    </div>
                                    <template slot="widthHeader">
                                        列宽
                                        <a-tooltip
                                            class="item"
                                            effect="dark"
                                            title="列宽，整数，单位：像素，非必填，不填的话，宽度为均分值"
                                        >
                                            <i class="iconfont icon-question-circle"></i>
                                        </a-tooltip>
                                    </template>
                                    <div slot="width" slot-scope="data, row, index">
                                        <template v-if="!row.edit">
                                            {{ row.width }}
                                        </template>
                                        <a-form-item
                                            v-else
                                            :inline-message="true"
                                        >
                                            <a-input v-decorator="[`queryColumns.${index}.width`]"/>
                                        </a-form-item>
                                    </div>
                                    <template slot="opHeader">
                                        <a-button icon="plus" type="success" shape="circle" @click="openColumnAdd"/>
                                    </template>
                                    <div slot="op" slot-scope="data, row, index">
                                        <a-button v-if="!row.edit"
                                                  icon="edit"
                                                  type="primary"
                                                  shape="circle"
                                                  @click="row.edit = true"/>
                                        <a-button v-else icon="save" type="success" shape="circle"
                                                  @click="saveRow(row)"/>
                                        <a-button icon="minus" type="danger" shape="circle"
                                                  @click="delColumn(index)"/>
                                    </div>
                                </a-table>
                            </div>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </Drawer>

        平铺表单建模修改
<!--                <FormBuildEdit ref="ref_formBuildEditPP" @ok="onFormBuildEditOkPP"/>-->
<!--                &lt;!&ndash;平铺表单建模修改&ndash;&gt;-->
<!--                <FormBuildEdit ref="ref_formBuildEditTab" @ok="onFormBuildEditOkTab"/>-->
                <!--新增头部统计模态框-->
                <Statistic
                    ref="ref_statistic"
                    :default-list="statistic"
                    @ok="onStatisticOk"
                />
                <!--新增查询标签模态框-->
                <QuerySign
                    ref="ref_querySign"
                    :default-list="querySign"
                    @ok="onQuerySignOk"
                />
                <!--新增查询条件模态框-->
                <QueryTerm
                    ref="ref_queryTerm"
                    :default-list="queryTerm"
                    @ok="onQueryTermOk"
                />
        <!--        &lt;!&ndash;新增顶部按钮模态框&ndash;&gt;-->
        <!--        <ActionButton-->
        <!--            ref="ref_topButton"-->
        <!--            title="顶部按钮"-->
        <!--            :default-list="topButtons"-->
        <!--            :form-id-options="ppOptions"-->
        <!--            @ok="onTopButtonOk"-->
        <!--        />-->
        <!--        &lt;!&ndash;新增操作按钮模态框&ndash;&gt;-->
        <!--        <ActionButton-->
        <!--            ref="ref_actionButton"-->
        <!--            title="操作按钮"-->
        <!--            :default-list="actionButtons"-->
        <!--            :form-id-options="ppOptions"-->
        <!--            @ok="onActionButtonOk"-->
        <!--        />-->
        <!--        &lt;!&ndash;新增列信息模态框&ndash;&gt;-->
        <!--        <Column ref="ref_column" :default-list="column" @ok="onColumnOk"/>-->

        <a-modal v-model="dialogVisible" width="80%">
            <img :src="dialogImageUrl" width="100%" alt=""/>
        </a-modal>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';
    import {merge} from 'lodash';
    import vuedraggable from 'vuedraggable';
    import Hamburger from '@/components/Hamburger';
    import {switchColors} from '@/utils/variables';
    import FormBuildEdit from './components/FormBuildEdit'; // 平铺表单或tab表单建模修改
    import Statistic from './components/Statistic'; // 头部统计弹框组件
    import QuerySign from './components/QuerySign'; // 查询标签弹框组件
    import QueryTerm from './components/QueryTerm'; // 查询条件弹框组件
    import ActionButton from './components/ActionButton'; // 操作按钮弹框组件
    import Column from './components/Column'; // 列信息弹框组件
    import img_subTitle from '@/assets/images/tips/sub-title.jpg';
    import img_colButton from '@/assets/images/tips/col-button.jpg';
    import img_columns from '@/assets/images/tips/columns.jpg';
    import img_queryCondition from '@/assets/images/tips/query-condition.jpg';
    import img_statisticBlock from '@/assets/images/tips/statistic-block.jpg';
    import img_tagGroup from '@/assets/images/tips/tag-group.jpg';
    import img_topButton from '@/assets/images/tips/top-buttion.jpg';
    import {
        Api_FormModelBuild,
        Api_FormModelBuildDetail,
        Api_FormFormsCombobox,
        Api_FormDetail
    } from '@/api/admin/m/index';
    import {Api_getDataAccessName} from '@/api/admin/index';

    const imgKeys = {
        subTitle: img_subTitle,
        colButton: img_colButton,
        columns: img_columns,
        queryCondition: img_queryCondition,
        statisticBlock: img_statisticBlock,
        tagGroup: img_tagGroup,
        topButton: img_topButton
    };
    export default {
        name: 'FormBuildList',
        components: {
            Draggable: vuedraggable,
            Statistic,
            QuerySign,
            QueryTerm,
            ActionButton,
            Column,
            FormBuildEdit,
            Hamburger
        },
        filters: {
            filterColumnIsShow(val) {
                return val ? '是' : '否';
            },
            filterAlign(val) {
                if (val === 'left') {
                    return '居左';
                } else if (val === 'center') {
                    return '居中';
                } else {
                    return '居右';
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
                form: this.$form.createForm(this),
                labelColInline: {
                    span: 8
                },
                wrapperColInline: {
                    span: 16
                },
                labelCol: {
                    span: 2
                },
                wrapperCol: {
                    span: 22
                },
                formDecorator: {
                    paging: ['paging', {
                        valuePropName: 'checked'
                    }],
                    isCheckbox: ['isCheckbox', {
                        valuePropName: 'checked'
                    }],
                    export: ['export', {
                        valuePropName: 'checked'
                    }],
                    querySql: ['querySql', {
                        rules: createRules({
                            msg: '查询语句',
                            required: true
                        }),
                    }],
                    width: ['width', {
                        initialValue: '1',
                        rules: createRules({
                            msg: '宽度占比',
                            required: true,
                            max: 1,
                            min: 0.1,
                            number: true
                        }),
                    }],
                    primaryKey: ['primaryKey', {
                        rules: createRules({
                            msg: '主键',
                            required: true,
                            EXP_ENG_NUM_5: true
                        }),
                    }],
                    foreignKey: ['foreignKey'],
                    subTitle: ['subTitle', {
                        rules: createRules({
                            msg: '副标题',
                            max: 50
                        }),
                    }],
                    defaultOrder: ['defaultOrder', {
                        rules: createRules({
                            msg: '默认排序',
                            required: true
                        })
                    }],
                    rowButtonsWidth: ['rowButtonsWidth', {
                        rules: createRules({
                            msg: '操作列宽',
                            integer0: true
                        }),
                    }],
                    dataAccess: {
                        type: ['dataAccess.type'],
                        selfSql: ['dataAccess.selfSql'],
                        deptSql: ['dataAccess.deptSql']
                    },
                    // dataAccess: ['dataAccess', {
                    //     initialValue: {
                    //         type: '',
                    //         selfSql: '',
                    //         deptSql: ''
                    //     }
                    // }],
                    queryColumns: ['queryColumns', {
                        initialValue: [],
                        rules: [{type: 'array'}]
                    }],
                    statistic: ['statistic',{
                        initialValue: [],
                        rules: [{type: 'array'}]
                    }]
                },
                columns: [
                    {
                        title: '',
                        key: null,
                        scopedSlots: {customRender: 'order'}
                    }, {
                        key: 'annotation',
                        slots: {title: 'annotationHeader'},
                        scopedSlots: {customRender: 'annotation'}
                    }, {
                        key: 'name',
                        slots: {title: 'nameHeader'},
                        scopedSlots: {customRender: 'name'}
                    }, {
                        title: '对齐方式',
                        key: 'align',
                        scopedSlots: {customRender: 'align'}
                    }, {
                        title: '是否显示',
                        key: 'show',
                        scopedSlots: {customRender: 'show'}
                    }, {
                        key: 'width',
                        slots: {title: 'widthHeader'},
                        scopedSlots: {customRender: 'width'}
                    }, {
                        key: null,
                        slots: {title: 'opHeader'},
                        scopedSlots: {customRender: 'op'}
                    }],

                switchColors,
                visible: false,
                leftFormOpened: false,
                dialogVisible: false,
                dialogImageUrl: '',
                ppOptions: [], // 平铺的列表数据
                ppRenderData: [], // 平铺的选中数据(用于页面渲染)
                ppData: [], // 平铺的选中数据
                tabOptions: [], // tab的列表数据
                tabRenderData: [], // tab的选中数据(用于页面渲染)
                tabData: [], // tab的选中数据
                draggableOptions: {
                    // vuedraggable的配置
                    animation: 200,
                    handle: '.drag-icon'
                },
                addFormRules: {
                    defaultOrder: createRules({
                        msg: '默认排序',
                        required: true
                    }),
                    querySql: createRules({
                        msg: '查询语句',
                        required: true
                    }),
                    width: createRules({
                        msg: '宽度占比',
                        required: true,
                        max: 1,
                        min: 0.1,
                        number: true
                    }),
                    rowButtonsWidth: createRules({
                        msg: '操作列宽',
                        integer0: true
                    }),
                    subTitle: createRules({
                        msg: '副标题',
                        max: 50
                    }),
                    primaryKey: createRules({
                        msg: '主键',
                        required: true,
                        EXP_ENG_NUM_5: true
                    }),
                    dataAccess: {
                        type: createRules({
                            msg: '数据权限'
                        })
                    }
                },
                addFormData: {
                    // 新增的数据
                    paging: true,
                    isCheckbox: false,
                    export: false,
                    querySql: '',
                    width: '1',
                    primaryKey: '',
                    foreignKey: '',
                    subTitle: '',
                    defaultOrder: '',
                    rowButtonsWidth: '',
                    dataAccess: {
                        type: '',
                        selfSql: '',
                        deptSql: ''
                    },
                    queryColumns: []
                },
                statistic: [], // 头部统计块的tags
                querySign: [], // 查询标签的tags
                queryTerm: [], // 查询条件的tags
                topButtons: [], // 顶部按钮的tags
                actionButtons: [], // 表格里操作按钮的tags
                column: [], // 表格里列信息的数据
                dataAccessNameOptions: []
            };
        },
        computed: {
           titleInfo() {
                const {title, name} = this.selectData;
                return `${name}、${title}——建模`;
            }
        },
        created() {
            this.form = this.$form.createForm(this);
            this.form.getFieldDecorator('queryColumns', {preserve: true, initialValue: []});
            Api_getDataAccessName().then(res => {
                this.dataAccessNameOptions = res;
            });
        },
        mounted() {
            // new Sortable(this.$refs.table_col.$el.querySelector('.el-table__body-wrapper tbody'), {
            //     handle: '.sort'
            // });
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
                    Api_FormModelBuildDetail(formId)
                        .then(res => {
                            const json = res.model;
                            if (json) {
                                json.queryColumns = json.queryColumns.map(item => ({
                                    ...item,
                                    edit: false
                                }));
                                this.statistic = json.statisticGroups || [];
                                this.querySign = json.tagGroups;
                                this.queryTerm = json.queryConditions;
                                this.topButtons = json.topButtons;
                                this.actionButtons = json.rowButtons;
                                // this.column = json.queryColumns
                                // this.addFormData.queryColumns = json.queryColumns;
                                this.addFormData.querySql = json.querySql;
                                this.addFormData.defaultOrder = json.defaultOrder;
                                this.addFormData.paging = json.paging;
                                this.addFormData.isCheckbox = json.isCheckbox;
                                this.addFormData.subTitle = json.subTitle;
                                this.addFormData.width = json.width + '';
                                this.addFormData.rowButtonsWidth = json.rowButtonsWidth;
                                this.addFormData.dataAccess = json.dataAccess || {};
                                this.addFormData.primaryKey = json.primaryKey + '';
                                this.addFormData.foreignKey = json.foreignKey + '';

                                json.normals.map(item => {
                                    this.ppData.push(item.formId);
                                    Api_FormDetail(item.formId).then(res => {
                                        this.ppRenderData.push({
                                            ...res,
                                            model: {...item}
                                        });
                                    });
                                    this.leftFormOpened = true;
                                });
                                json.tabs.map(item => {
                                    this.tabData.push(item.formId);
                                    Api_FormDetail(item.formId).then(res => {
                                        this.tabRenderData.push({
                                            ...res,
                                            model: {...item}
                                        });
                                    });
                                    this.leftFormOpened = true;
                                });

                                this.form.setFieldsValue({
                                    queryColumns: json.queryColumns
                                })
                            }
                            this.visible = true;
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    this.visible = true;
                }
            },
            // 点击确认
            handleSure() {
                this.form.validateFields(valid => {
                    if (!valid) {
                        const postData = {};
                        const {id: formId, type} = this.selectData;
                        const {
                            querySign: tagGroups,
                            queryTerm: queryConditions,
                            // column: queryColumns,
                            topButtons,
                            actionButtons: rowButtons,
                            statistic: statisticGroups
                        } = this;
                        const a = this.form.getFieldsValue()
                        console.log(a);
                        return
                        const formData = merge({}, this.addFormData);
                        formData.queryColumns = formData.queryColumns.map(item => {
                            delete item.edit;
                            return item;
                        });
                        const modelNormals = this.ppRenderData.map(item => item.model);
                        const modelTabs = this.tabRenderData.map(item => item.model);
                        const text = {
                            ...formData,
                            type,
                            formId,
                            tagGroups,
                            queryConditions,
                            topButtons,
                            rowButtons,
                            statisticGroups,
                            normals: modelNormals,
                            tabs: modelTabs
                        };
                        postData.type = type;
                        postData.normals = this.ppRenderData.map(item => item.id).join(',');
                        postData.tabs = this.tabRenderData.map(item => item.id).join(',');
                        postData.text = JSON.stringify(this.$trimObject(merge({}, text)));
                        if (!formData.queryColumns.length) {
                            this.$message.warning('请至少添加一条列数据！');
                            return;
                        }
                        const loading = this.$openLoading();
                        Api_FormModelBuild(formId, postData)
                            .then(msg => {
                                this.visible = false;
                                this.onBuildModelClose();
                                this.$message.success(msg);
                                this.$emit('getList');
                                loading.close();
                            })
                            .catch(() => {
                                loading.close();
                            });
                    }
                });

                // }));
            },
            // 打开新增查询标签模态框
            openQuerySignAdd() {
                this.$refs.ref_querySign.openModel();
            },
            // 打开修改查询标签模态框
            openQuerySignUpdate(row, updateIndex) {
                this.$refs.ref_querySign.openModel(row, updateIndex);
            },
            // 打开头部统计模态框
            openStatisticAdd() {
                this.$refs.ref_statistic.openModel();
            },
            // 打开新增查询条件模态框
            openQueryTermAdd() {
                this.$refs.ref_queryTerm.openModel();
            },
            // 打开修改头部统计模态框
            openStatisticAddUpdate(row, updateIndex) {
                this.$refs.ref_statistic.openModel(row, updateIndex);
            },
            // 打开修改查询标签模态框
            openQueryTermAddUpdate(row, updateIndex) {
                this.$refs.ref_queryTerm.openModel(row, updateIndex);
            },
            // 打开新增顶部按钮模态框
            openTopButtonAdd() {
                this.$refs.ref_topButton.openModel();
            },
            // 打开修改顶部按钮模态框
            openTopButtonUpdate(row, updateIndex) {
                this.$refs.ref_topButton.openModel(row, updateIndex);
            },
            // 打开新增操作按钮模态框
            openActionButtonAdd() {
                this.$refs.ref_actionButton.openModel();
            },
            // 打开修改操作按钮模态框
            openActionButtonUpdate(row, updateIndex) {
                this.$refs.ref_actionButton.openModel(row, updateIndex);
            },
            // 打开新增列模态框
            openColumnAdd() {
                this.addFormData.queryColumns.push({
                    annotation: '',
                    name: '',
                    width: '',
                    align: 'left',
                    show: true,
                    edit: false
                });
                // this.$refs.ref_column.openModel()
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
            // 删除查询标签时
            handleQuerySignTagClose(index) {
                this.querySign.splice(index, 1);
            },
            // 删除查询条件时
            handleQueryTermTagClose(index) {
                this.queryTerm.splice(index, 1);
            },
            // 删除头部统计时
            handleStatisticTagClose(index) {
                this.statistic.splice(index, 1);
            },
            // 删除顶部按钮时
            handleTopButtonTagClose(index) {
                this.topButtons.splice(index, 1);
            },
            // 删除操作按钮时
            handleActionButtonTagClose(index) {
                this.actionButtons.splice(index, 1);
            },
            // 删除列信息
            delColumn(delIndex) {
                // this.column.splice(delIndex, 1)
                this.addFormData.queryColumns.splice(delIndex, 1);
            },
            handleDataAccessTypeChange(val) {
                if (!val) {
                    this.addFormData.dataAccess.deptSql = '';
                    this.addFormData.dataAccess.selfSql = '';
                }
            },
            // 新增头部统计成功
            onStatisticOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.statistic.splice(updateIndex, 1, {...data});
                } else {
                    this.statistic.push({...data});
                }
            },
            // 新增查询标签成功
            onQuerySignOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.querySign.splice(updateIndex, 1, {...data});
                } else {
                    this.querySign.push({...data});
                }
            },
            // 新增查询条件成功
            onQueryTermOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.queryTerm.splice(updateIndex, 1, data);
                } else {
                    this.queryTerm.push(data);
                }
            },
            // 新增顶部按钮成功
            onTopButtonOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.topButtons.splice(updateIndex, 1, data);
                } else {
                    this.topButtons.push(data);
                }
            },
            // 新增操作按钮成功
            onActionButtonOk(data, updateIndex) {
                if (updateIndex !== undefined) {
                    this.actionButtons.splice(updateIndex, 1, data);
                } else {
                    this.actionButtons.push(data);
                }
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
                        this.ppRenderData.push(res);
                    });
                });
            },
            // tab表单选择change事件
            tabSelectChange(val) {
                this.tabRenderData = [];
                // 根据选中的数据拉取详情数据
                val.forEach(item => {
                    Api_FormModelBuildDetail(item).then(res => {
                        this.tabRenderData.push(res);
                    });
                });
            },
            // 平铺表单建模修改确认事件
            onFormBuildEditOkPP(newDataModel, updateIndex) {
                this.ppRenderData[updateIndex].model = newDataModel;
            },
            // tab表单建模修改确认事件
            onFormBuildEditOkTab(newDataModel, updateIndex) {
                this.tabRenderData[updateIndex].model = newDataModel;
            },
            // 关闭平铺类型的表单
            closePp(row) {
                const index = this.ppRenderData.findIndex(item => item.id === row.id);
                this.ppData.splice(index, 1);
                this.ppRenderData.splice(index, 1);
            },
            // 关闭tab类型的表单
            closeTab(row) {
                const index = this.tabRenderData.findIndex(item => item.id === row.id);
                this.tabData.splice(index, 1);
                this.tabRenderData.splice(index, 1);
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
                this.statistic = [];
                this.querySign = [];
                this.topButtons = [];
                this.actionButtons = [];
                this.column = [];
                this.queryTerm = [];
            },
            showDialogImg(imgKey) {
                this.dialogImageUrl = imgKeys[imgKey];
                this.dialogVisible = true;
            },
            saveRow(row) {
                console.log(row);
                // this.form.validateFields([], valid => {
                //     if (valid) {
                //         row.edit = false;
                //     }
                // });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .item-area.t {
        .el-form-item.el-form-item--mini {
            margin-bottom: 0;
        }

        .el-table--mini th, .el-table--mini td {
            padding: 12px 0;
        }
    }

    .fl {
        .ant-input {
            width: 100% !important;
        }
    }
</style>
