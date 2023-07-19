const configParts = require('./webpack.parts');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {merge} = require('webpack-merge');
const path = require('path');

const sassConfig = {
    includePath: [
        path.resolve(__dirname, 'src/scss'),
        require('node-neat').includePaths
    ],
    styleExport: ".[name].scss"
};

const commonConfig = merge(
    [
        {
            entry: {
                'all': './src/scss/all.scss',
                'fonts': './src/scss/fonts.scss',


                'main': './src/js/index',
            },
            output: {
                chunkFilename: '[name].js',
                filename: '[name].js',
                hashDigestLength: 7,
                path: __dirname + '/dist/theme/[fullhash]/',
                publicPath: '/theme/[fullhash]/',
                clean: true
            },
            plugins: [
                new configParts.MetaInfoPlugin({
                    filename: 'dist/theme/meta.json'
                }),
                new CopyWebpackPlugin({ patterns: [
                        // {
                        //     from: './src/js/sw.js',
                        //     to: './sw.js'
                        // },
                        {
                            from: './src/fonts',
                            to: '../'
                        },
                        {
                            from: './src/icons/sprite/icons.svg',
                            to: '../icons.svg'
                        },
                        {
                            from: './src/icons/sprite/icons.svg',
                            to: './icons.svg'
                        },
                        {
                            from: './src/images',
                            to: './images',
                        },
                        {
                            from: './dist/theme/',
                            to: './../../../../www/theme/'
                        }

                    ] })
            ]
        },
        configParts.loadCSS(
            {
                include: sassConfig.includePath,
                styleExport: sassConfig.styleExport
            }
        )
    ]
);

const developmentConfig = merge([
    {
        entry: {
            'all': './src/scss/all.scss',
            'fonts': './src/scss/fonts.scss',


            'main': './src/js/index',
        },
        output: {
            chunkFilename: '[name].js',
            filename: '[name].js',
            hashDigestLength: 7,
            path: __dirname + '/dist/theme',
            publicPath: '/',
        },
        plugins: [
            new CopyWebpackPlugin({ patterns: [
                    {
                        from: './src/images',
                        to: './images'
                    },
                    {
                        from: './src/icons/sprite/icons.svg',
                        to: './theme/icons.svg'
                    },
                    {
                        from: './src/fonts',
                        to: './theme/'
                    },
                ]})
        ],
        devtool: "inline-source-map",
    },
    configParts.loadCSS(
        {
            include: sassConfig.includePath,
            styleExport: sassConfig.styleExport
        }
    ),
    configParts.htmlLoader({
        minimize: 0,
        removeComments: 1,
        collapseWhitespace: 0,
        htmlPath: 'src/html',
        htmlPathIncludes: 'src/html/includes'
    }),
    configParts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: 8088
    })
]);

module.exports = mode => {
    if (mode.development) {
        return merge(developmentConfig, {mode});
    }
    return merge(commonConfig, {mode});
};