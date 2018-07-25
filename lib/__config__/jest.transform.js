// eslint-disable-next-line
module.exports = require('babel-jest').createTransformer({
  presets: ['react', 'env', 'stage-0'],
  plugins: ['transform-decorators-legacy', 'syntax-async-functions', 'transform-regenerator'],
})
