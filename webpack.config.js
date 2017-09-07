const webpack = require('webpack');
const path = require('path');
const express = require('express');
const version = require('./package.json').version;

/*eslint-disable */
const banner =
"/**\n" +
" * smoothie v" + version + "\n" +
" * Copyright (c) " + (new Date().getFullYear()) + " Alessandro Rigobello\n" +
" * MIT License\n" +
" */\n";
/*eslint-enable */

const plugins = [
    new webpack.BannerPlugin({ raw: true, banner }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    })
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}

module.exports = {
    entry: {
        smoothie: ['./src/index.js']
    },

    output: {
        library: 'smoothie',
        libraryTarget: 'umd',
        path: path.join(process.cwd(), 'lib'),
        filename: process.env.NODE_ENV === 'production' ? 'smoothie.min.js' : 'smoothie.js',
    },

    plugins,

    devServer: {
        contentBase: './example',
        hot: true,
        historyApiFallback: true,
        publicPath: '/dist/'
    },

    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.join(process.cwd(), 'src')
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            }
        }]
    }
};
