<template>
    <div class="app-container">
        <PageHead>
            <a-form ref="searchForm" :form="form" :inline="true" class="demo-form-inline searchForm-wrap">
                <a-form-item prop="name">
                    <a-input v-decorator="formDecorator.courseName" placeholder="课程名称"/>
                </a-form-item>
                <a-form-item prop="lessonName">
                    <a-input v-decorator="formDecorator.lessonName" placeholder="课时名称"/>
                </a-form-item>
                <a-form-item prop="ip">
                    <a-input v-decorator="formDecorator.ip" placeholder="ip"/>
                </a-form-item>
                <a-form-item class="btns">
                    <a-button
                        class="filter-item"
                        type="primary"
                        icon="search"
                        @click="handleFilter"
                    >查询
                    </a-button>
                    <a-button
                        class="filter-item"
                        icon="undo"
                        @click="handleReset('searchForm')"
                    >重置
                    </a-button>
                </a-form-item>
            </a-form>
        </PageHead>
        <div class="page-content">
            <div class="page-content-body">
                <TableWrapper
                    ref="child"
                    :fetch-data-fn="Api_LearningFetchList"
                    :query="form.getFieldsValue()"
                    :columns="tableCol"
                />
            </div>
        </div>
        <!--        <CreateUpdate-->
        <!--            ref="createUpdateModel"-->
        <!--            :model-status="modelStatus"-->
        <!--            :select-data="selectData"-->
        <!--            :typeOptions="typeOptions"-->
        <!--            @getList="getList"-->
        <!--        />-->
        <viewer
            :images="fileListUrls"
            @inited="inited"
            class="viewer"
            ref="viewer"
            style="display: none"
        >
            <template slot-scope="scope">
                <img v-for="src in scope.images" :src="src" :key="src">
            </template>
        </viewer>
    </div>
</template>
<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import TableWrapper from "@/components/TableWrapper";
    // import CreateUpdate from "./CreateUpdate";
    import Button from "@/components/Button";
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer/src/component.vue';
    import {
        Api_LearningFetchList
    } from "@/api/admin/train/index";

    export default {
        name: "Courses",
        components: {PageHead, TableWrapper, Viewer},
        data() {
            return {
                $viewer: null,
                fileListUrls: [],
                sassData: [],
                tableCol: [
                    {
                        key: "courseName",
                        label: "课程名称"
                    },
                    {
                        key: "lessonName",
                        label: "课时名称"
                    },
                    {
                        key: "courseTypeDesc",
                        label: "课程类型",
                        width: 120
                    },
                    {
                        key: "username",
                        label: "用户账号",
                        width: 120
                    },
                    {
                        key: "durationSecond",
                        label: "学习时长",
                        width: 100,
                        render: (data) => {
                            if (!data) return ''
                            return this.$turnTime(data)
                        }
                    },
                    {
                        key: "finished",
                        label: "是否完成",
                        width: 100,
                        render: (data) => {
                            return data ? '是' : '否'
                        }
                    }
                ],
                list: null, // 列表数据
                listLoading: false, // 列表loading状态
                listQuery: {
                    courseName: "",
                },
                form: this.$form.createForm(this),
                // 查询表单注册表单值
                formDecorator: {
                    courseName: ["courseName"],
                    lessonName: ["lessonName"],
                    ip: ["ip"],
                },
                selectId: undefined,
                selectData: undefined,
                modelStatus: "add"
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            Api_LearningFetchList,
            // 获取主列表数据
            getList(flag) {
                this.listQuery = this.form.getFieldsValue()
                this.$nextTick(() => {
                    this.$refs.child.fetchData(flag);
                })
            },
            // 根据查询条件获取数据
            handleFilter() {
                this.getList(true);
            },
            // 重置查询条件
            handleReset() {
                this.form.resetFields();
                this.getList(true);
            },
            // 重置form表单
            resetForm() {
                this.form.resetFields();
            },
            // 打开新增培训讲师界面
            handleView() {
                this.$refs.createUpdateModel.openModel();
            },
            // 生成图片查看器
            inited(viewer) {
                this.viewer = viewer;
            },
            preview(url) {
                this.fileListUrls = [url]
                this.$nextTick(() => {
                    this.viewer.view();
                })
            },
        }
    };
</script>

<style scoped>
</style>
