const path = require('path');
const webpack = require('webpack');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + '/../.build/wad/'),
    library: 'Wad'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new DeclarationBundlerPlugin({
      moduleName: 'Wad',
      out: 'index.d.ts'
    })
  ]
};
