const path = require("path");
const webpack = require("webpack");

const modules = [path.resolve(__dirname, "node_modules"), "node_modules"];

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  devtool: "inline-source-map",
  mode: "development",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname + "/../.build/engine/"),
    library: ["Engine"],
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      fs: false,
    },
  },
  resolveLoader: {
    modules,
  },
  watchOptions: {
    ignored: /node_modules/,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.pat$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].ext",
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    wad: "Wad",
  },
};
