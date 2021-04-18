const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = false

module.exports = {
  entry: './index.js',
  mode: isProd ? 'production' : 'development',
  target: 'node',

  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
        type: 'json'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  ...isProd && {
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    }
  }
}
