var path = require('path');
var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
    entry: './src/adaptive.js',
    output: {
        path: path.resolve(__dirname, './list'),
        filename: 'adaptive.js'
    },

    plugins: [
        new webpack.BannerPlugin('adaptive@' + version + ' | https://github.com/heqing0712/adaptive')
    ]

};