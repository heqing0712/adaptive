var path = require('path');
var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: {
        'adaptive': './src/adaptive.js',
        'adaptivex': './src/adaptivex.js'
    },
    output: {
        path: path.resolve(__dirname, './list'),
        filename: '[name].js'
    },

    plugins: [
        new webpack.BannerPlugin('adaptive@' + version + ' | https://github.com/heqing0712/adaptive')
    ]

};