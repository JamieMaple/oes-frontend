const webpack = require('webpack')
const merge = require('webpack-merge')
const friendlyError = require('friendly-errors-webpack-plugin')
const open = require('open')
const fallback = require('connect-history-api-fallback')
const { port, publicPath } = require('./config')
const { resolve } = require('./helpers')
const common = require('./webpack.common')

// add hot-reload for each
Object.keys(common.entry).forEach(name => {
  common.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(common.entry[name])
})

const compiler = webpack(merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /^(.(?!\.global))*\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              module: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.global\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    // error emits
    new friendlyError({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:${port}`],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      clearConsole: true,
    })
  ]
}))

// hmr

const app = require('express')()

app.use(fallback())

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: publicPath,
  contentBase: resolve('static/'),
  quiet: true,
  stats: {
    colors: true,
    modules: false,
    modulesSort: "field",
    entrypoints: false,
    children: false,
  }
}))

app.use(require('webpack-hot-middleware')(compiler, {
  log: () => {}
}))

const data = {
  messages: "success"
}

const prefix = 'v1/api'

function fixURLWithPrefix(url) {
  return `${prefix}${url}`
}

app.use(fixURLWithPrefix('/login'), (req, res) => {
  res.json(data)
})

app.use(fixURLWithPrefix('/showalltest'), (req, res) => {
  res.json(data)
})



app.listen(port, () => {
  console.log('> Starting server...')
  open(`http://localhost:${port}`)
})