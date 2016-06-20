const webpack = require('webpack')

module.exports = {
  entry: './test/test.js',
  output: { 
    filename: './test/bundle.js' 
  },
  resolve: {
    extensions: ['','.js']
  },
  module: {
    loaders: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        presets: ['es2015']
      }
    ]
  }
}