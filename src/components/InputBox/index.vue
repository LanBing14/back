<template>
    <div class="input-box-wrap" @click="focusInput">
        <span v-for="(el, index) in list"
              :key="index"
              class="input-tag">
            {{ el }}
            <i class="iconfont icon-close" title="删除" @click="delTag(index)"></i>
        </span>
        <span class="new-tag-wrap">
            <input ref="ref_newTag"
                   v-model="curValue"
                   type="text"
                   class="new-tag"
                   :placeholder="list.length?'':'请输入'+tip"
                   @keydown.enter="saveTag">
        </span>
    </div>
</template>

<script>
import { trim } from 'lodash'

export default {
    name: 'InputBox',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: Array, // 不需要传入
        tip: String // input的提示
    },
    data () {
        return {
            curValue: '',
            list: this.value
        }
    },
    watch: {
        list (val) {
            this.$emit('change', val)
        },
        value (val) {
            this.list = val
        }
    },
    methods: {
        focusInput () {
            this.$refs.ref_newTag.focus()
        },
        saveTag () {
            const trimVal = trim(this.curValue)
            if (!trimVal) {
                return
            }
            const findRes = this.list.find(item => item === trimVal)
            if (findRes) {
                this.$message.warning('已存在相同的词！')
                return
            }
            this.list.push(this.curValue)
            this.curValue = ''
        },
        delTag (index) {
            this.list.splice(index, 1)
        }
    }
}
</script>

<style scoped lang="scss">
    .input-box-wrap {
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding-top: 4px;
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: content-box;
        min-height: 28px;
        cursor: text;
        line-height: normal;

        .new-tag-wrap {
            display: inline-block;
            width: 80px;
            margin-bottom: 2px;
            margin-right: 4px;
            padding-top: 3px;

            input {
                width: 100%;
                border: none;
                outline: none;
                font-size: 12px;
                background-color: transparent;

                &::placeholder {
                    color: #ccc;
                }
            }
        }

        .input-tag {
            background-color: #f6f7f9;
            padding: 4px 6px;
            font-size: 12px;
            display: inline-block;
            margin-right: 4px;
            margin-bottom: 4px;

            .icon-close {
                cursor: pointer;
            }
        }
    }
</style>
