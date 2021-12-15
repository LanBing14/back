<template>
    <Main v-if="!editing" @edit="onEdit"></Main>
    <!--详情-->
    <Detail
        v-else-if="editing && pageType === 1"
        :select-data="row"
        @edit="onEdit"
    />
</template>
<script>
    import Main from './Main'
    import Detail from './Detail'

    export default {
        name: 'Attestation',
        components: {
            Main,
            Detail,
        },
        data() {
            return {
                editing: false,
                pageType: 1, // 1:详情
                row: {}
            }
        },
        methods: {
            onEdit(editing, pageType, row) {
                this.editing = editing;
                this.pageType = pageType;
                this.row = row;
            }
        }
    }
</script>
