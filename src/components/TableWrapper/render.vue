<script>
    export default {
        functional: true,
        render(h, context) {
            const {row, field, render} = context.props;
            const renderResult = render(h, row[field], row);
            return (renderResult instanceof Array) ? renderResult : [renderResult];
        }
    }
</script>
