const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))

module.exports = {
  module: {
    loaders: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?name=/[hash].[ext]'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader?compact=true',
          options: Object.assign(babelrc, {
            cacheDirectory: true
          })
        }]
      }
    ]
  },

  context: path.join(__dirname, 'src'),
  entry: {
    app: ['./js/app'],
    cms: ['./js/cms']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  externals: [/^vendor\/.+\.js$/]
}
