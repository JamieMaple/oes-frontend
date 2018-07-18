const webpack = require('webpack')
const merge = require('webpack-merge')
const friendlyError = require('friendly-errors-webpack-plugin')
const open = require('open')
const express = require('express')
const fallback = require('connect-history-api-fallback')
const Mock = require('mockjs')
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

const app = express()
const router = express.Router()

const prefix = '/oesrd'

app.use(prefix, router)

const commonMockData = {
  'code|1': [
    200,
    201,
    300,
  ],
  'message': 'mock success',
  'data': null,
}

// paper
router
  .get('/showalltest', (req, res) => {
    // all paper
    const data = Mock.mock({
      ...commonMockData, 
      'data|1-20': [{
        'id|+1': 1,
        'test_id|+1': 10,
        'reg_date': +new Date(Mock.mock('@date')),
        'test_answer': `{'A','B','C','D'}`,
        'test_title': Mock.mock('@ctitle(5, 10)')
      }]
    })
    res.json(data)
  })
  .post('/addtest', (req, res) => {
    // TODO: exam the req body with encode url
    const data = {
      ...commonMockData,
      message: 'add test success'
    }
    res.json(data)
  })
  .get('/showatest', (req, res) => {
    const data = Mock.mock({
      ...commonMockData,
      'data|1-30': [{
        'id|+1': 1,
        'reg_date': +new Date(Mock.mock('@date')),
        'test_answer|1': ['A', 'B', 'C', 'D'],
        'test_content': Mock.mock('@cword(5, 10)'),
        'test_id|+1': 10,
        'test_score|5-20': 100
      }]
    })
    res.json(data)
  })
  .post('/deleteatest', (req, res) => {
    const data = Mock.mock({
      ...commonMockData,
      message: 'delete a test'
    })

    res.json(data)
  })

// question
router.post('/addquestion', (req, res) => {
  const data = Mock.mock({
    ...commonMockData,
    message: 'add a question'
  })

  res.json(data)
})

// user
router.get('/stu/get', (req, res) => {
  const data = Mock.mock({
    ...commonMockData,
    'data|0-20': [{
      'id|+1': 1,
      'user_name': Mock.mock('@cword(5, 8)')
    }]
  })

  res.json(data)
})

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

app.listen(port, () => {
  console.log('> Starting server...')
  open(`http://localhost:${port}`)
})