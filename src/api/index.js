// 导出一个配置好的axios对象
import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'
// 对axios进行配置
// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// ... 很多配置
axios.defaults.transformResponse = [(data) => {
  // 对data进行格式转换  data就是后台响应的json字符串
  // 如果没数据呢？data === null 使用JSONBIG.parse(null) 报错
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// config是一个配置
axios.interceptors.request.use((config) => {
  // 如果拿不到值会得到一个空对象 也不会报错
  const user = local.getUser() || {}
  // 拦截成功  往headers中加token
  config.headers.Authorization = `Bearer ${user.token}`
  return config
  //   拦截失败
}, (err) => {
  return Promise.reject(err)
})

// 响应式拦截
// 拿到res返回res
axios.interceptors.response.use(res => res, err => {
  // 获取响应状态码  err.response 响应对象  err.response.status 状态码
  if (err.response.status === 401) {
    //  如果是401就跳转
    // 使用vue-router进行跳转
    return router.push('/login')
  }
  return Promise.reject(err)
})
export default axios
