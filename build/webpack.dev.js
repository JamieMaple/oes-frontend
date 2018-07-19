const webpack = require('webpack')
const merge = require('webpack-merge')
const friendlyError = require('friendly-errors-webpack-plugin')
const open = require('open')
const express = require('express')
const fallback = require('connect-history-api-fallback')
const Mock = require('mockjs')
const proxy = require('http-proxy-middleware')
const { port, publicPath, proxyIP, isUsingMock } = require('./config')
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
const mockRouter = express.Router()
const proxyRouter = express.Router()

const prefix = '/oesrd'

if (isUsingMock) {
  app.use(prefix, mockRouter)
} else {
  // debug with server
  app.use(proxy(function fileter(pathname, req) {
    return pathname.match(`^${prefix}`)
  }, {
    target: proxyIP,
  }))
}

const commonMockData = {
  'code': 200,
  'message': 'mock success',
  'data': null,
}

/**
 *  mock data
 */
// paper
mockRouter
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
    const data = {
      ...commonMockData,
      message: 'add test success'
    }
    res.json(data)
  })
  .post('/showatest', (req, res) => {
    const data = Mock.mock({
      ...commonMockData,
      'data': {
        test_id: 100,
        test_title: '试卷名称',
        'questions|1-30': [{
          "test_num|+1": 1,
          'test_title': Mock.mock('@cword(5, 10)'),
          'test_id|+1': 10,
          'test_answer|1': ['A', 'B', 'C', 'D'],
          'test_score|5-20': 100,
        }]
      }
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
mockRouter.post('/add/test_question', (req, res) => {
  const data = Mock.mock({
    ...commonMockData,
    message: 'add a question'
  })

  res.json(data)
})

// user
mockRouter.get('/stu/get', (req, res) => {
  const data = Mock.mock({
    ...commonMockData,
    'data|0-20': [{
      'id|+1': 1,
      'user_name': Mock.mock('@cword(5, 8)')
    }]
  })

  res.json(data)
})
mockRouter.post('/login', (req, res) => {
  res.json({
    code: 200,
    ...data,
  })
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