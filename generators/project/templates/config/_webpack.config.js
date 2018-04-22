const {resolve}       = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');

const IS_DEVELOPMENT = true;

module.exports = {
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    entry: {
        app: './<%= sourceDirectory %>app/main.js'
    },
    output: {
        path: resolve('./<% if (isNative) { %><%= sourceDirectory %><% } %>dist/client'),
        filename: 'bundle.min.js'
    },
    module: {
        rules: [
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
            underscore: 'lodash',
            handlebars: 'handlebars/runtime.js'//https://github.com/wycats/handlebars.js/issues/953#issuecomment-94931306
        }
    }
};
