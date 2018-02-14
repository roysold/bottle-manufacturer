const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: ["babel-polyfill", "./app/app.js"],
    target: "node",
    output: {
        path: path.join(__dirname, 'build'),
        filename: "bundle.js"
    },
    externals: nodeModules,
    module: {
        loaders: [
            {
                loader: "babel-loader",
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: 3000,
        contentBase: "./build",
        inline: true
    },
}