const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  devtool: 'inline-source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + '/../.build/engine/'),
    library: ['Engine'],
    libraryTarget: 'window',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  watchOptions: {
    ignored: /(node_modules|\.build)/
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /(node_modules|\.build)/
      }
    ]
  },
  externals: {
    wad: 'Wad'
  },
  plugins: [new DtsBundlePlugin()]
};

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    var dts = require('dts-bundle');

    dts.bundle({
      name: 'Engine',
      main: path.resolve(__dirname, '../.build/engine/src/index.d.ts'),
      out: path.resolve(__dirname, '../.build/engine/index.d.ts'),
      // removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};
