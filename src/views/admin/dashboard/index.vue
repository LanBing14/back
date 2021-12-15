<template>
    <div class="wrap">
        <!--<div class="apply-entry-wrap">
            <a-row :gutter="20" type="flex">
                <a-col :span="6">
                    <div class="apply-item">
                        应用1
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="apply-item">
                        应用2
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="apply-item">
                        应用3
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="apply-item">
                        应用4
                    </div>
                </a-col>
            </a-row>
        </div>-->
        <div class="center-wrap">
            <a-row :gutter="20">
                <a-col :span="16">
                    <ToDealWith></ToDealWith>
                </a-col>
                <a-col :span="8" style="position: relative">
                    <a-button class="remark-btn" type="primary" plain @click="addRemark">新增备忘录</a-button>
                    <a-calendar ref="calendar" @change="onPanelChange">
                        <template
                            slot="dateCellRender"
                            slot-scope="date">
                            <a-popover
                                v-if="filterMemosContent(date)"
                                :title="$dateFormat(date, 'yyyy-MM-dd')"
                                :content="filterMemosContent(date)"
                                placement="top"
                                width="200"
                                class="date-content"
                            >
                                <div @dblclick="editRemark">
                                    <a-tooltip class="item" effect="dark" title="删除备忘录" placement="bottom">
                                        <span class="memos-icons" @click="handleDeleteMemos(date)">
                                                <span class="icon-delete-span"><i
                                                    class="iconfont icon-delete"></i></span>
                                            <span class="icon-star-span"><i class="iconfont icon-star-fill"></i></span>
                                        </span>
                                    </a-tooltip>
                                    <p class="memos-content">{{ filterMemosContent(date) }}</p>
                                    <p :class="[filterHoliday(date).flag?(filterHoliday(date).type === '0'?'x':'b'):'']"
                                       class="holiday-tip">
                                        {{ filterHoliday(date).flag ? (filterHoliday(date).type === '0' ? '休' : '班') :
                                        '' }}
                                    </p>
                                </div>
                            </a-popover>
                            <div v-else class="date-content" @dblclick="editRemark">
                                <p :class="[filterHoliday(date).flag?(filterHoliday(date).type === '0'?'x':'b'):'']"
                                   class="holiday-tip">
                                    {{ filterHoliday(date).flag ? (filterHoliday(date).type === '0' ? '休' : '班') : '' }}
                                </p>
                            </div>
                        </template>
                    </a-calendar>
                </a-col>
            </a-row>
        </div>
        <a-modal
            :title="(modelStatus ? '添加' : '修改') + '备忘录'"
            v-model="dialogVisible"
            width="30%">
            <a-form
                ref="ref_remarkForm"
                :form="form"
            >
                <a-form-item label="备忘录日期">
                    <a-date-picker
                        v-decorator="formDecorator.markDate"
                        format="YYYY-MM-DD"
                        type="date"
                    />
                </a-form-item>
                <a-form-item label="备忘录内容">
                    <a-input v-decorator="formDecorator.content" :rows="4" type="textarea" :max-length="300"
                             show-word-limit/>
                </a-form-item>
            </a-form>

            <div slot="footer" class="dialog-footer">
                <a-button @click="dialogVisible = false">关 闭</a-button>
                <a-button type="primary" @click="handleSureMemos">确 定</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import ToDealWith from '@/views/admin/m/toDealWith/index';
    import {Api_MemosAddUpdate, Api_MemosDetail, Api_MemosDelete} from '@/api/admin/dashboard/index';
    import {Api_HolidayList} from '@/api/admin/system/index';

    export default {
        name: 'Dashboard',
        components: {
            ToDealWith
        },
        data() {
            const createRules = this.$createRules;
            return {
                form: this.$form.createForm(this),
                formDecorator: {
                    markDate: ['markDate', {
                        rules: createRules({
                            msg: '备忘录日期',
                            required: true
                        })
                    }],
                    content: ['content', {
                        rules: createRules({
                            msg: '备忘录内容',
                            required: true,
                            max: 300
                        })
                    }]
                },
                calendarValue: '',
                dialogVisible: false,
                modelStatus: true,
                memosData: [],
                holidayData: [],
                dateModel: {
                    markDate: '',
                    content: ''
                }
            };
        },
        mounted() {
            this.getMemosDetail();
            this.getHolidayDetail();
            this.calendarValue = moment().format('YYYY-MM-DD');
        },
        methods: {
            onPanelChange(value) {
                this.calendarValue = value.format('YYYY-MM-DD');
                this.$nextTick(() => {
                    this.getMemosDetail()
                    this.getHolidayDetail()
                })
            },
            addRemark() {
                this.modelStatus = true
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        content: ''
                    });
                });
            },
            editRemark() {
                const findRes = this.memosData.find(({markDate}) => {
                    return this.calendarValue === moment(markDate).format('YYYY-MM-DD');
                });
                this.modelStatus = false
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        markDate: moment(this.calendarValue),
                        content: findRes ? findRes.content : ''
                    });
                });
            },
            // 确定备忘录
            handleSureMemos() {
                this.form.validateFields((valid) => {
                    if (!valid) {
                        const postData = this.form.getFieldsValue()
                        const loading = this.$openLoading();
                        postData.markDate = postData.markDate.format('YYYY-MM-DD')
                        Api_MemosAddUpdate(postData).then(res => {
                            this.getMemosDetail();
                            this.$message.success(res);
                            this.dialogVisible = false;
                            loading.close();
                        }).catch(() => {
                            loading.close();
                        });
                    }
                });
            },
            // 删除备忘录
            handleDeleteMemos(date) {
                this.$confirm('确定删除该备忘录?', '提示', {
                    type: 'warning'
                }).then(() => {
                    Api_MemosDelete({
                        markDate: date.format('YYYY-MM-DD')
                    }).then(msg => {
                        this.$message.success(msg);
                        this.getMemosDetail();
                    });
                });
            },
            // 获取备忘录
            getMemosDetail() {
                const [startDate, endDate] = this.getHeadEndDate();
                Api_MemosDetail({startDate, endDate}).then(res => {
                    this.memosData = res;
                });
            },
            // 过滤是否显示备忘录
            filterMemosContent(date) {
                const findRes = this.memosData.find(({markDate}) => {
                    const markDateString = moment(markDate).format('YYYY-MM-DD');
                    const curDateString = date.format('YYYY-MM-DD');
                    return markDateString === curDateString;
                });
                if (findRes) {
                    return findRes.content;
                }
                return '';
            },
            // 获取节假日
            getHolidayDetail() {
                const [startDate, endDate] = this.getHeadEndDate();
                Api_HolidayList({startDate, endDate}).then(res => {
                    this.holidayData = res;
                });
            },
            // 过滤生成某一天是否是节假日
            filterHoliday(date) {
                const findRes = this.holidayData.find(({exceptionDate}) => {
                    if (date.format('YYYY-MM-DD') === exceptionDate) {
                        return true;
                    }
                    return false;
                });
                if (findRes) {
                    return {
                        flag: true,
                        type: findRes.type
                    };
                } else {
                    return {
                        flag: false
                    };
                }
            },
            // 获取日历中第一个天和最后一个天的日期
            getHeadEndDate() {
                const tableComp = this.$refs.calendar.$el;
                const startTd = tableComp.querySelector('.ant-fullcalendar-tbody tr:first-child td:first-child');
                const endTd = tableComp.querySelector('.ant-fullcalendar-tbody tr:last-child td:last-child');
                let startDate = startTd ? startTd.getAttribute('title') : '';
                let endDate = endTd ? endTd.getAttribute('title') : '';
                startDate = startDate.replace(/[年|月]/g, '-').replace('日', '');
                endDate = endDate.replace(/[年|月]/g, '-').replace('日', '');
                if (startDate) {
                    startDate = startDate.split('-').map((item, index) => {
                        return index > 0 ? ('0' + item).slice(-2) : item;
                    }).join('-');
                }
                if (endDate) {
                    endDate = endDate.split('-').map((item, index) => {
                        return index > 0 ? ('0' + item).slice(-2) : item;
                    }).join('-');
                }
                return [startDate, endDate];
            }
        }
    };
</script>
<style lang="scss">
    .el-popover--plain {
        padding-top: 0;

        .el-popover__title {
            border-bottom: 1px solid #ccc;
            padding: 10px;
            margin-left: -20px;
            margin-right: -20px;
            font-size: 14px;
        }
    }
</style>
<style scoped lang="scss">
    .wrap {
        min-height: 100%;
        background-color: #F5F6FA;
        padding: 15px;
        /*快捷应用*/
        .apply-entry-wrap {
            .apply-item {
                height: 60px;
                background-color: #fff;
                margin-bottom: 10px;
            }
        }

        /*备忘录按钮*/
        .remark-btn {
            position: absolute;
            left: 24px;
            top: 5px;
        }

        /*日历*/
        /deep/ .ant-fullcalendar-fullscreen {
            font-size: 12px;
            background-color: #fff;

            .ant-fullcalendar-content {
                height: auto;
            }

            .ant-fullcalendar-value {
                text-align: left;
            }

            .ant-fullcalendar-header {
                padding-top: 5px;
                padding-bottom: 5px;
            }

            .ant-fullcalendar {
                padding-top: 0;
                padding-bottom: 20px;
            }

            .ant-fullcalendar-table {
                td:nth-child(1), td:nth-child(7) {
                    background-color: #f9f9f9;
                }

                td.is-selected, .el-calendar-day:hover {
                    background-color: #c0dcf9;
                }

                thead th {
                    padding: 5px 0;
                }

                .ant-fullcalendar-date {
                    height: 60px;
                    position: relative;

                    p {
                        margin: 0;
                    }
                }

                .date-content, .date-content .el-popover__reference {
                    overflow: hidden;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    padding: 8px;
                }

                .memos-content {
                    margin-top: 15px !important;
                    line-height: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .memos-icons {
                    position: absolute;
                    right: 8px;
                    top: 4px;
                    color: red;

                    span {
                        transition: all 0.6s;
                        display: block;
                    }

                    .icon-delete-span {
                        position: absolute;
                        transform: translateY(-8px);
                        opacity: 0;
                    }

                    &:hover {
                        .icon-delete-span {
                            transform: translateY(0);
                            opacity: 1;
                        }

                        .icon-star-span {
                            transform: translateY(8px);
                            opacity: 0;
                        }
                    }
                }


                .holiday-tip {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    padding: 2px;
                    color: #fff;

                    &.x {
                        background-color: red;
                    }

                    &.b {
                        background-color: #999;
                    }
                }
            }
        }
    }

    .ant-fullcalendar-calendar-body {
        min-height: 440px;
    }

    /deep/ .ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group {
        display: none;
    }
</style>
