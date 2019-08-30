module.exports = {
    publicPath: './' ,// <----这里就是会修改webpack的outPath.publicPath
    productionSourceMap: false,
    baseUrl: './',
    devServer: {
      proxy: {
        '/api': {
          target: 'http://luyabang.com/lyb', //线上地址
          // target: 'http://192.168.3.195:8080', //本地地址
          changeOrigin: true,
          pathRewrite: {
            '/api': ''
          }
        }
      }
    }
  }
