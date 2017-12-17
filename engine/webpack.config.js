const path = require('path');
const webpack = require('webpack');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

module.exports = {

  entry: path.resolve(__dirname, './src/core.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + '/../.build/engine/'),
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
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
