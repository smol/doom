const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    debug: path.resolve(__dirname, "src/index.tsx"),
  },
  mode: "development",
  output: {
    filename: "[name].js",
    publicPath: "/public",
    path: path.resolve(__dirname, "../.build/"),
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

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
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      // inject: true,
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    wad: "Wad",
    engine: "Engine",
    react: "React",
    "react-dom": "ReactDOM",
  },
  watchOptions: {
    ignored: /node_modules|index\.html/,
  },
  devServer: {
    historyApiFallback: true,
    hot: false,
    // liveReload: true,
    client: {
      logging: "info",
    },

    // publicPath
    static: [
      { directory: path.resolve(__dirname, "../.build/"), watch: false },
      {
        directory: path.resolve(__dirname, "../.build/"),
        publicPath: "/public/",
      },
      {
        directory: path.resolve(__dirname, "node_modules/"),
        publicPath: "/library/",
        watch: false,
      },
    ],
    port: 9000, // Defaults to 8080,
  },
};
