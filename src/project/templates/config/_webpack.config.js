const {resolve}       = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
    entry: {
        app: './<%= sourceDirectory %>app/main.js'
    },
    output: {
        path: resolve('./<% if (isNative) { %><%= sourceDirectory %><% } %>dist/client'),
        filename: 'bundle.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    plugins: [
        new DashboardPlugin()
    ],
    resolve: {
        modules: [
            resolve('./node_modules'),
            resolve('./<%= sourceDirectory %>app')
        ],
        alias: {
            handlebars: 'handlebars/runtime.js'//https://github.com/wycats/handlebars.js/issues/953#issuecomment-94931306
        }
    },
    node: {
        fs: 'empty'// https://github.com/webpack-contrib/css-loader/issues/447
    }
};
