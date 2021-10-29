var path = require("path");
var webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    example: "./example/example.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["env"],
        },
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: "Input Sample Configuration",
    }),
  ],
  stats: {
    colors: true,
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: {
          enforce: true,
          priority: 1,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
          name: "vendors",
          enforce: true,
          chunks: "all",
        },
      },
    },
  },

  devtool: "source-map",
};
