const path = require('path');
const webpack = require('webpack');
const VarLibraryAliasPlugin = require('../../index');

module.exports = {
    entry: path.resolve(__dirname, 'fixtures', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'myLib.js',
        libraryTarget: 'var',
        library: 'MyLib',
    },
    mode: 'production',
    plugins: [
        new VarLibraryAliasPlugin({
            alias: 'MyLibAlias',
        }),
        new webpack.DefinePlugin({
            TEST: JSON.stringify('TEST'),
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
};
