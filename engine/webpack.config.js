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
  },
  resolveLoader: {
    modules,
  },
  watchOptions: {
    ignored: /(node_modules|\.build)/,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /(node_modules|\.build)/,
      },
    ],
  },
  externals: {
    wad: "Wad",
  },
};
