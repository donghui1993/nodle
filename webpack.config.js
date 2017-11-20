var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: './src/nodle.ts',

  output: {
    filename: 'nodle.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.webpack.js', '.ts', '.js']
  },

  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        evtool: 'source-map'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}