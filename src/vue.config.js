// 进行vue-cli配置
// vue-cli配置实现了部分webpack的配置
module.exports = {
  // 覆盖webpack的配置选项
  configureWebpack: {
    externals: {
      // key 包名 value 暴露全局的变量名
      echarts: 'echarts'
    }
  }
}
