var path = require('path');
var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: './src/adptive.js',
    output: {
        path: path.resolve(__dirname, './list'),
        filename: 'adptive.js'
    },

    plugins: [
        new webpack.BannerPlugin('adptive@' + version + ' | https://github.com/heqing0712/adptive')
    ]

};