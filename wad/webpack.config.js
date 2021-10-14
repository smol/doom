const path = require("path");
const webpack = require("webpack");

const modules = [path.resolve(__dirname, "node_modules"), "node_modules"];

module.exports = {
  mode: "development",
  entry: path.resolve(`${__dirname}/src/index.ts`),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname + "/../.build/wad/"),
    library: "Wad",
  },
  resolveLoader: {
    modules,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
    modules,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/inline",
      },
    ],
  },
};
