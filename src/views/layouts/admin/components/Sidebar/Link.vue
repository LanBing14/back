<template>
<!-- eslint-disable vue/require-component-is-->
<component v-bind="linkProps(to)">
    <slot/>
</component>
</template>

<script>
    import {isExternal} from '@/utils'
    import {parse} from 'qs'

    export default {
        props: {
            to: {
                type: String,
                required: true
            },
            query: String,
            newWindow: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        methods: {
            isExternalLink(routePath) {
                return isExternal(routePath)
            },
            linkProps(url) {
                if (this.isExternalLink(url) || this.newWindow) {
                    return {
                        is: 'a',
                        href: url,
                        target: '_blank',
                        rel: 'noopener'
                    }
                }
                return {
                    is: 'router-link',
                    to: {
                        path: url,
                        query: parse(this.query)
                    }
                }
            }
        }
    }
</script>
