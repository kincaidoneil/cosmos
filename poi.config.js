module.exports = (options, req) => ({
  port: 3000,
  entry: 'src/index.js',
  html: {
    template: 'src/index.html',
    minify: {
      collapseWhitespace: true
    }
  }
})
