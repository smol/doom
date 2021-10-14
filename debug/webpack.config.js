const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  entry: {
    debug: path.resolve(__dirname, "src/index.tsx"),
  },
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../.build/"),
    clean: true,
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      inject: true,
    }),
    // new webpack.HotModuleReplacementPlugin({
    //   multiStep: true,
    // }),
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    wad: "Wad",
    engine: "Engine",
  },
  watchOptions: {
    ignored: /node_modules|index\.html/,
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    client: {
      logging: "verbose",
    },

    static: [
      { directory: path.resolve(__dirname, "../.build/"), watch: false },
    ],
    port: 9000, // Defaults to 8080,
  },
};
