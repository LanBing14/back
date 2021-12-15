<template>
    <div>
        <a-tree
            ref="depTree"
            :treeData="dataUse"
            v-bind="$props"
            v-on="$listeners"
        />
        <div v-if="!dataUse.length" style="text-align: center;">
            {{ emptyText }}
        </div>
    </div>
</template>

<script>
    import {merge} from 'lodash';

    export default {
        name: "Tree",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            emptyText: {
                type: String,
                default: '暂无数据'
            }
        },
        data() {
            return {
                treeDataSource: merge([], this.treeData), // 树的原数据
                dataUse: merge([], this.data) // 树真实使用的数据
            };
        },
        watch: {
            data(value) {
                this.treeDataSource = merge([], value); // 树的原数据
                this.dataUse = merge([], value); // 树真实使用的数据
            }
        },
        methods: {
            filter(val) {
                this.dataUse = this.filterTree(val, this.treeDataSource);
            },
            filterTree(filterValue, filterArr) {
                return filterArr.filter(item => {
                    if (item.children) {
                        this.filterTree(filterValue, item.children);
                    }
                    return filterValue ? (item.title.indexOf(filterValue) !== -1) : true;
                });
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
