const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entry = path.resolve(__dirname, 'src/ui.js')
const output = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    'ui': entry,
  },
  devtool: 'cheap-source-map',
  output: {
    path: output,
    filename: `[name].js`,
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/, 
      loader: "babel-loader",
      exclude: /node_modules/
    }]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
  ]
}