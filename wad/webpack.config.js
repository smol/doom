const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + '/../.build/wad/'),
    library: ['Wad'],
    libraryTarget: 'window',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new DtsBundlePlugin()]
};

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    var dts = require('dts-bundle');

    dts.bundle({
      name: 'Wad',
      main: path.resolve(__dirname, '../.build/wad/src/index.d.ts'),
      out: path.resolve(__dirname, '../.build/wad/index.d.ts'),
      // removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};
