<template>
    <component ref="ref_comp" :is="compKey" @ok="onOk"></component>
</template>

<script>
    import BuildList from './BuildList'; // 建模列表修改组件
    import BuildListEdit from './BuildListEdit'; // 建模列表编辑修改组件
    import BuildView from './BuildView'; // 建模详情修改组件

    export default {
        name: 'FormBuildEdit',
        components: {
            BuildList,
            BuildListEdit,
            BuildView
        },
        data() {
            return {
                compKey: ''
            }
        },
        methods: {
            openModel(oldFormData, updateIndex) {
                if (oldFormData.type === '0') {
                    this.compKey = 'BuildList'
                } else if (oldFormData.type === '1') {
                    this.compKey = 'BuildListEdit'
                } else {
                    this.compKey = 'BuildView'
                }
                this.$nextTick(() => {
                    this.$refs.ref_comp.openModel(oldFormData, updateIndex);
                })
            },
            onOk(r, i) {
                this.$emit('ok', r, i);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '~@/styles/element-variables.scss';

    .fr {
        float: left;
    }

    .querySign-table {
        margin: 0 -10px;

        td {
            padding: 0 10px;
        }
    }

    .item-area {
        padding: 28px 15px;
        background-color: #e4e2e2;
        box-shadow: inset 0 0 4px rgba(206, 204, 204, .5);

        /deep/ .el-form-item__content {
            display: flex;
        }

        .content {
            flex: 1;
        }

        & > .el-form-item {
            margin-bottom: 0;
        }

        &::after {
            content: '';
            display: block;
            clear: both;
        }
    }

    .interface-title {
        clear: both;
        font-weight: normal;
        margin-top: .48rem;
        margin-bottom: .16rem;
        border-left: 3px solid #2395f1;
        padding-left: 8px;
    }

    .left-top {
        margin-bottom: 20px;

        .actions {
            float: right;
        }
    }

    .pp-checkbox-item {
        width: 100%;

        & + & {
            margin-top: 6px;
        }
    }

    .icon-close {
        font-size: 14px;
        color: #ff5248;
        cursor: pointer;
    }

    .left-content {
        height: 300px;
        overflow: auto;
        overflow-x: hidden;
        background: #e4e2e2;
        margin-top: 15px;
        padding-right: 10px;
    }

    .left-ul-wrap {
        ul {
            list-style: none;
            padding-left: 2em;
        }

        li {
            border: 1px solid #ccc;
            padding: 2px 6px;
            border-radius: 3px;
        }

        li + li {
            margin-top: 10px;
        }

        .sortable-chosen {
            background-color: $--color-primary;
            color: #fff;
        }
    }

    .border-dashed {
        border: 1px dashed #464444;
        padding: 8px 0;
        border-radius: 4px;
        margin-right: 10px;
    }
</style>
<style>
    .pp-popover {
        box-shadow: 0 0 5px rgba(0, 0, 0, .6);
    }
</style>
