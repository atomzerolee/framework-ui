const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entry = path.resolve(__dirname, 'src/source/index.js')
const output = path.resolve(__dirname, 'framework/js');
module.exports = {
  entry: {
    'ui': entry,
    'ui.min': entry
  },
  output: {
    library: 'UI',
    libraryTarget: 'umd',
    path: output,
    filename: `[name].js`,
  },
  externals: ['underscore', 'jquery', 'nunjucks'],
  module: {
    rules: [{
      test: /\.js$/, 
      exclude: /node_modules/, 
      loader: "babel-loader"
    }]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'framework')),
    new webpack.optimize.UglifyJsPlugin({
      include: /ui.min/,
    })
  ]
}