const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack (config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('baseCpn', resolve('src/baseCpn'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
  }
}