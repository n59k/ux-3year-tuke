const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-scss-extract-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const SshWebpackPlugin = require('ssh-webpack-plugin');
const {HotModuleReplacementPlugin} = require('webpack');

const generateHtmlPlugins = (templateDir) => {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split(".");
        if (parts[1] !== undefined && parts[0] !== undefined) {
            return new HtmlWebpackPlugin({
                // path.resolve(__dirname, htmlPathIncludes)
                // filename: `${parts[0]}.html`,
                filename: `${parts[0]}.html`,
                template: path.resolve(__dirname, `${templateDir}/${parts[0]}.${parts[1]}`),
            });
        }
    }).filter(item => item !== undefined);
};

class MetaInfoPlugin {
    constructor(options) {
        this.options = {filename: 'meta.json', ...options};
    }

    apply(compiler) {
        compiler.hooks.done.tap(this.constructor.name, stats => {
            const metaInfo = {
                // add any other information if necessary
                hash: stats.hash
            };
            const json = JSON.stringify(metaInfo);
            return new Promise((resolve, reject) => {
                fs.writeFile(this.options.filename, json, 'utf8', error => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
}

exports.devServer = ({host, port} = {}) => ({
    devServer: {
        liveReload: true,
        // hot: 'only',
        compress: true,
        // watchContentBase: true,
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        client: {
            overlay: {
                errors: true,
                warnings: true,
            },
        },
        static: {
            directory:  path.join(__dirname, '/dist'),
            // publicPath: path.join(__dirname, '/dist/theme')
        },
        watchFiles: ['src/**/*.html', 'dist/**/*'],
        // proxy: {
        //   '/assets': {
        //       target: 'http://beautyholic.sk/',
        //       changeOrigin: true,
        //       pathRewrite: {'^/assets' : '/assets', '^/theme' : '/theme'}
        //    }
        // }
    },
});

exports.loadCSS = ({include, exclude, styleExport} = {}) => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                include,
                exclude,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        "loader": "scss-loader",
                        "options": {
                            "url": false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        }
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: (el) => {
                if (
                    el.chunk &&
                    el.chunk.name &&
                    el.chunk.name.indexOf('critical') !== -1
                ) {
                    return '../../../../www/views/scss/[name]' + '.blade.php';
                }
                return '[name]' + '.scss';
            }
        }),
        new RemoveEmptyScriptsPlugin()
    ]
});

exports.htmlLoader = ({htmlPath, htmlPathIncludes} = {}) => ({
    module: {
        generator: {
            'asset/source': {
                publicPath: 'assets/',
            },
        },
        rules: [
            {
                test: /\.html$/,
                include: path.resolve(__dirname, htmlPathIncludes),
                type: 'asset/source',
            }
        ],
    },
    plugins: [
        ...generateHtmlPlugins(htmlPath)
    ]
});

exports.sshDeploy = ({buldPath, deployPath}) => ({
    plugins: [
        new SshWebpackPlugin({
            host: '192.168.178.52',
            port: 22,
            zip: false,
            username: 'www-data',
            password: 'secret',
            from: buldPath,
            to: deployPath
        })
    ]
});

exports.sshDeployAlt = ({buldPath, deployPath}) => ({
    plugins: [
        new SshWebpackPlugin({
            host: '89.47.166.222',
            port: 2016,
            zip: false,
            username: 'disart',
            privateKey: require('fs').readFileSync('/home/disart/.ssh/hostens'),
            passphrase: 'disart',
            from: buldPath,
            to: deployPath
        })
    ]
});

exports.MetaInfoPlugin = MetaInfoPlugin;