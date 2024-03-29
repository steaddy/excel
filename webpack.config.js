const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoader = () => {
    const loaders = [
        {
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env']
            }
        }
    ];
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: ["@babel/polyfill","./index.js"],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html",
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd,
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/excel.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
                ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoader()
            },
        ],
    },
}