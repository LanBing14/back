<template>
    <Drawer
        ref="drawer"
        :title="title"
        :visible.sync="visible"
        :onOk="updateGrant"
        fullscreen
        class="grant-wrap"
        @close="onClose"
    >
        <a-form
            ref="grantForm"
        >
            <a-form-item>
                <a-table
                    :dataSource="grantData"
                    :columns="columns"
                    :expandedRowKeys="expandedRowKeys"
                    :pagination="false"
                    row-key="id"
                    bordered
                    @expandedRowsChange="expandedRowsChange"
                >
                    <div slot="customTitle">
                        菜单
                        <a-button type="primary" @click="toggleExpandOn" style="margin-left: 15px;">全部展开</a-button>
                        <a-button type="primary" @click="toggleExpandOff" style="margin-left: 15px;">全部收起</a-button>
                    </div>
                    <div slot="renderCheckbox" slot-scope="permissions,row">
                        <a-checkbox
                            v-if="permissions"
                            :indeterminate="isIndeterminates['isIndeterminate'+row.id]"
                            :checked="checkAlls['checkAll'+row.id]"
                            @change="handleCheckAllChange(row.id)"
                        >
                            全选
                        </a-checkbox>
                        <a-checkbox-group
                            v-model="grantForm['permissions'+row.id]"
                            @change="handleCheckedCitiesChange(row.id)"
                        >
                            <a-checkbox
                                v-for="item in permissions"
                                :key="item.value"
                                :value="item.value"
                                :checked="item.checked"
                            >
                                {{ item.text }}
                            </a-checkbox>
                        </a-checkbox-group>
                    </div>
                </a-table>
            </a-form-item>
        </a-form>
    </Drawer>
</template>

<script>
    export default {
        name: 'Grant',
        props: {
            selectId: {
                type: String,
                default() {
                    return '';
                }
            },
            title: {
                type: String,
                default() {
                    return '授权';
                }
            },
            getList: {
                type: Function,
                default() {
                    return null;
                }
            },
            update: {
                type: Function,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                expandedRowKeys: [],
                visible: false,
                grantForm: {},
                defaultGruopCheckAllData: {},
                isIndeterminates: {},
                checkAlls: {},
                expandIds: [], // 所有可展开行的id
                grantData: [], // 额外授权的列表数据
                columns: [{
                    width: '30%',
                    // title: '菜单',
                    dataIndex: 'label',
                    slots: {title: 'customTitle'},
                }, {
                    // width: 200,
                    title: '权限',
                    dataIndex: 'attributes.permissions',
                    scopedSlots: { customRender: 'renderCheckbox' }
                }]
            }
        },
        methods: {
            handleGrant: function () {
                if (!this.getList) {
                    console.warn('请传入获取数据的接口！');
                    return;
                }
                const loading = this.$openLoading();
                this.getList(this.selectId).then(res => {
                    this.filterChildren(res)
                    this.bindPermissionsData(res)
                    this.visible = true;
                    this.grantData = res;
                    this.bindExpandIds(res)
                    loading.close()
                }).catch((e) => {
                    console.log(e);
                    loading.close()
                })
            },
            bindPermissionsData(arr) {
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    const { permissions } = item.attributes
                    if (permissions) {
                        let checkAllGroupFlag = false;
                        const defaultCheckAll = [];
                        const checkeds = [];
                        const pLen = permissions.length;
                        if (pLen > 0) {
                            for (let j = 0; j < permissions.length; j++) {
                                const permissionItem = permissions[j];
                                if (permissionItem.checked) {
                                    checkAllGroupFlag = true;
                                    checkeds.push(permissionItem.value)
                                }
                                defaultCheckAll.push(permissionItem.value)
                            }
                            this.$set(this.defaultGruopCheckAllData, 'permissions' + item.id, defaultCheckAll);
                            this.$set(this.checkAlls, 'checkAll' + item.id, checkAllGroupFlag);
                            this.$set(this.grantForm, 'permissions' + item.id, checkeds);
                            this.$set(this.isIndeterminates, 'isIndeterminate' + item.id, !checkAllGroupFlag && checkeds.length > 0);
                        }
                    }
                    if (item.children && item.children.length) {
                        this.bindPermissionsData(item.children)
                    }
                }
            },
            handleCheckAllChange(groupId) {
                this.checkAlls['checkAll' + groupId] = !this.checkAlls['checkAll' + groupId]
                this.grantForm['permissions' + groupId] = this.checkAlls['checkAll' + groupId] ? this.defaultGruopCheckAllData['permissions' + groupId] : []
                this.isIndeterminates['isIndeterminate' + groupId] = false
            },
            handleCheckedCitiesChange(groupId) {
                const checkedCount = this.grantForm['permissions' + groupId].length;
                this.checkAlls['checkAll' + groupId] = checkedCount === this.defaultGruopCheckAllData['permissions' + groupId].length;
                this.isIndeterminates['isIndeterminate' + groupId] = checkedCount > 0 && checkedCount < this.defaultGruopCheckAllData['permissions' + groupId].length;
            },
            updateGrant() {
                if (!this.update) {
                    console.warn('请传入更新数据的接口！');
                    return;
                }
                const id = this.selectId;
                let permissionArr = [];
                for (const key in this.grantForm) {
                    permissionArr = permissionArr.concat(this.grantForm[key])
                }
                const loading = this.$openLoading();
                this.update(id, permissionArr.join(',')).then(msg => {
                    this.visible = false;
                    this.$message.success(msg);
                    this.onClose();
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            },
            // 过滤掉children为空数组的
            filterChildren(res){
                res.forEach(item=>{
                    if(!item.children.length){
                        item.children = null
                    }else{
                        this.filterChildren(item.children)
                    }
                })
            },
            // 展开全部
            toggleExpandOn(){
                this.expandedRowKeys = [...this.expandIds]
            },
            // 收起全部
            toggleExpandOff(){
                this.expandedRowKeys = []
            },
            // 展开行的变化
            expandedRowsChange(expandedRows){
                this.expandedRowKeys = expandedRows
            },
            bindExpandIds(arr){
                arr.forEach(item=>{
                    if(item.children){
                        this.expandIds.push(item.id)
                        this.bindExpandIds(item.children)
                    }
                })
            },
            onClose: function () {
                this.grantData = []
            }
        }
    }
</script>

<style scoped>
    label.ant-checkbox-wrapper {
        margin-right: 25px;
    }
    .ant-checkbox-wrapper + .ant-checkbox-wrapper{
        margin-left: 0;
    }
    .grant-wrap .ant-checkbox-group{
        display: block;
    }
</style>
