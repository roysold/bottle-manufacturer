module.exports = {
    entry: ["./app/app.js"],
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            loader: "babel-loader",
            test: /\.js$/,
            exclude: /node_modules/
        }]
    },
    devServer: {
        port: 3000,
        contentBase: "./build",
        inline: true
    }
}