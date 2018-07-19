const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  port: 8080,
  proxyIP: 'http://10.23.39.157:9296',
  isUsingMock: true,
  isDev: isDev,
  publicPath: '/',
  htmlConfig: {
    title: 'scaffold',
    minify: isDev ? {} : {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: true,
      removeEmptyAttributes: true
    },
    template: 'index.pug',
    inject: true,
    favicon: undefined,
  }
}
