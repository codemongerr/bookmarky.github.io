const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const dirSrc = path.join(__dirname, "src");
const dirPublic = path.join(__dirname, "public");
const dirDist = path.join(__dirname, "dist");

module.exports = {
  entry: `${dirSrc}/index.js`,
  output: {
    path: path.resolve(dirDist),
    filename: "bundle.min.js",
    publicPath: "/"
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  module: {
    rules: [
      // BABEL Loader
      {
        test: /\.(js)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
        options: {
          compact: true,
          presets: ["@babel/preset-env"]
        }
      },
      // IMAGES
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        loader: "file-loader",
        options: {
          name: "graphics/[name].[ext]"
        }
      },
      // CSS
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: `${dirPublic}/index.html`,
      filename: "index.html",
      inject: "body"
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    watchContentBase: true,
    compress: true,
    port: 8896,
    stats: "errors-only",
    open: true,
    inline: true,
    hot: true,
    historyApiFallback: true
  },
  mode: "development"
};
