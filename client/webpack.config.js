const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/app.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + './../.build/app/')
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /(node_modules|\.build)/
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /.build/,
      /node_modules/,
      /\.d\.ts/
    ])
  ],
  externals: {
    wad: 'Wad',
    engine: 'Engine',
    three: 'THREE'
  }
};
