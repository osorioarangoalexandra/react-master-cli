/*
    This is the file we use to create the
    configuration that transpiles the JSX
    into JS and creates the server so
    we have live changes
*/

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';

dotenv.config();

const { NAME, PROJECT, MODULES } = process.env;

if (!PROJECT) {
    throw new Error("🌵 No project selected. Stopping process...");
}

import fs from 'fs';

console.log(
    'webpaaack',
    process.env
);


fs.writeFileSync(
    './.env',
    `
    NAME=${NAME || ""}
    `
);

const cssModuleRules = Number(MODULES) ? [{
    test: /\.css$/,
    loader: 'style-loader',
},
{
    test: /\.css$/,
    loader: 'css-loader',
    options: {
        modules: {
            localIdentName:
                '[path][name]__[local]--[hash:base64:5]',
        },
    },
}] : [{
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
    ],
},];

module.exports = {
    mode: 'development',
    entry: [
        'react-hot-loader/patch',
        path.resolve(__dirname, `../${PROJECT}/index.js`),
    ],
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
        compress: true,
        historyApiFallback: true,
        hot: true,
        inline: true,
        open: true,
        contentBase: path.join(__dirname, `../${PROJECT}/public/`),
        port: 1306,
    },
    module: {
        rules: [
            {
                // Check for eslint errors
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    failOn: false,
                },
            },
            {
                // Compile main index
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: ['@babel/preset-react'],
                    plugins: ['react-hot-loader/babel'],
                },
            },
            ...cssModuleRules,
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(
                __dirname,
                `../${PROJECT}/public/index.html`
            ),
        }),
    ],
    resolve: {
        modules: [
            path.resolve(`../${PROJECT}`),
            path.resolve('./node_modules'),
        ],
        extensions: ['.js', '.jsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    stats: 'errors-only',
    watchOptions: {
        ignored: ['node_modules'],
    },
};