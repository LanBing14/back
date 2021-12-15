<script type="text/jsx">
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    render(h, context) {
        const { icon, title } = context.props
        const vnodes = []

        if (icon) {
            if (icon.indexOf('icon-') !== -1) {
                vnodes.push(<svg-icon type={icon} />)
            } else {
                vnodes.push(<svg-icon type={icon}/>)
            }
        }
        if (title) {
            vnodes.push(<span title={title}>{(title)}</span>)
        }
        return vnodes
    }
}
</script>
