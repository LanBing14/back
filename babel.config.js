module.exports = {
    presets: [
        ['@vue/app',
        {
            'useBuiltIns': 'entry'
            // polyfills: [
            //     'es6.promise',
            //     'es6.symbol'
            // ]
        }]
    ],
    plugins: [
        [
            "import",
            {libraryName: "ant-design-vue", libraryDirectory: "es", style: true}
        ],
        // "@babel/plugin-transform-runtime"
    ]
}
