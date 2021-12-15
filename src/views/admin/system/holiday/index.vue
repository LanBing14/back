<template>
    <div class="app-container">
        <div class="page-content">
            <div class="page-content-body">
                <div style="position: relative;">
                    <div class="btns">
                        <a-button icon="star-fill" type="primary" plain @click="signDay('0')">标记为-节假日</a-button>
                        <a-button icon="star-fill" type="primary" plain @click="signDay('1')">标记为-工作日</a-button>
                        <a-button
                            type="primary"
                            class="filter-item"
                            icon="sync"
                            plain
                            @click="handleFreshen()">
                            刷新
                        </a-button>
                    </div>
                    <div class="calendar-wrap">
<!--                        <div class="date-choose">-->
<!--                            <a-date-picker-->
<!--                                v-model="yearMonth"-->
<!--                                :editable="false"-->
<!--                                :clearable="false"-->
<!--                                align="right"-->
<!--                                format="yyyy年MM月"-->
<!--                                prefix-icon="11"-->
<!--                                type="month"-->
<!--                                placeholder="选择年月"-->
<!--                                @change="yearMonthChange"-->
<!--                            >-->
<!--                            </a-date-picker>-->
<!--                        </div>-->
                        <a-calendar ref="calendar" @change="onPanelChange">
                            <template
                                slot="dateCellRender"
                                slot-scope="date">
                                <div class="date-content">
                                    <a-tooltip
                                        v-if="filterHoliday(date).flag"
                                        :title="'删除'+filterHoliday(date).type === '0' ? '节假日' : '工作日'"
                                        class="item"
                                        effect="dark"
                                        placement="bottom"
                                    >
                                        <span class="memos-icons" @click="handleDeleteHoliday(data)">
                                                <span class="icon-delete-span"><i class="delete"></i></span>
                                        </span>
                                    </a-tooltip>
                                    <p :class="[filterHoliday(date).flag?(filterHoliday(date).type === '0'?'x':'b'):'']"
                                       class="holiday-tip">
                                        {{ filterHoliday(date).flag ? (filterHoliday(date).type === '0' ? '休' : '班') :
                                        '' }}
                                    </p>
                                </div>
                            </template>
                        </a-calendar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/jsx">
    import {
        Api_HolidayFetchList,
        Api_HolidayDel, // 删除节假日
        Api_HolidayFreshen, // 刷新节假日
        Api_HolidayList,
        Api_HolidayAdd // 保存节假日
    } from '@/api/admin/system/index';

    export default {
        name: 'Dictionary',
        data() {
            return {
                calendarValue: new Date(),
                holidayData: [],
                memosData: [],
                dateModel: {
                    markDate: '',
                    content: ''
                },
                yearMonth: this.$dateFormat(new Date(), 'yyyy-MM'),
                typeData: []
            };
        },
        mounted() {
            this.getHolidayDetail();
        },
        methods: {
            Api_HolidayFetchList,
            onPanelChange(value) {
                this.calendarValue = value.format('YYYY-MM-DD');
                this.$nextTick(() => {
                    this.getHolidayDetail();
                });
            },
            // 刷新节假日
            handleFreshen() {
                Api_HolidayFreshen().then(msg => {
                    this.$message.success(msg);
                    this.getHolidayDetail();
                });
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
            },
            // 标记为节假日，type:节假日类型
            signDay(type) {
                const loading = this.$openLoading();
                Api_HolidayAdd({type, exceptionDate: this.$dateFormat(this.calendarValue, 'yyyy-MM-dd')}).then(res => {
                    this.$message.success(res);
                    this.getHolidayDetail();
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 删除节假日
            handleDeleteHoliday({day}) {
                this.$confirm('确定删除?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const findRes = this.holidayData.find(item => item.exceptionDate === day);
                    if (findRes) {
                        Api_HolidayDel(findRes.id).then(msg => {
                            this.$message.success(msg);
                            this.getHolidayDetail();
                        });
                    }
                });
            },
            yearMonthChange(v) {
                const s = this.$dateFormat(v, 'yyyy-MM');
                const n = new Date(s + '-01');
                this.calendarValue = n;
            }
        }

    };
</script>

<style scoped lang="scss">
    .page-content {
        padding-top: 20px;
    }

    .calendar-wrap {
        position: relative;

        .date-choose {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;

            .el-date-editor {
                font-size: inherit;
                cursor: pointer;

                /deep/ input {
                    padding: 0;
                    border: none;
                }
            }
        }
    }

    .btns {
        position: absolute;
        top: 0;
        z-index: 1;
        left: 0;
        padding: 12px 20px;

        &::after {
            content: '';
            clear: both;
            display: block;
        }

        .el-button {
            float: left;
            margin-right: 10px;
        }
    }

    /deep/ .ant-fullcalendar-fullscreen {


        .ant-fullcalendar-table {
            td:nth-child(1), td:nth-child(7) {
                background-color: #f9f9f9;
            }

            td.is-selected, .el-calendar-day:hover {
                background-color: #c0dcf9;
            }

            .ant-fullcalendar-date {
                position: relative;
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

            .memos-icons {
                position: absolute;
                right: 8px;
                top: 4px;
                color: red;

            }


            .holiday-tip {
                position: absolute;
                right: 8px;
                bottom: 8px;
                padding: 2px;
                color: #fff;
                margin: 0;

                &.x {
                    background-color: red;
                }

                &.b {
                    background-color: #999;
                }
            }
        }
    }
</style>
