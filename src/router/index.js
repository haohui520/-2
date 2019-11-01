import VueRouter from 'vue-router'
import Vue from 'vue'
import locol from '@/utils/local'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
import Article from '@/views/article'
import Image from '@/views/image'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 登录
    {
      path: '/login',
      component: Login
    },
    // 首页
    {
      path: '/',
      component: Home,
      children: [
        // 欢迎
        {
          path: '/',
          component: Welcome
        },
        // 内容管理
        {
          path: '/article',
          component: Article
        },
        // 素材管理
        {
          path: '/image',
          component: Image
        }
      ]
    },
    // 匹配  不符合路由规则的路径
    {
      path: '*',
      component: NotFound
    }
  ]
})
// 添加路由 导航守卫 beforeEach是一个方法
router.beforeEach((to, from, next) => {
  // to是跳转到路由对象
  // from是从呢跳转
  // next是下一步的方法 next()放行 next('/login')拦截
  // 需要一个用户接收
  const user = locol.getUser()
  // 用户存在 且 token代表用户登陆过
  if (user && user.token) {
    next()
  } else {
    // to.path跳转到那个路由对象
    if (to.path === '/login') {
      next()
    } else {
      // 不通过
      next('/login')
    }
  }
})
export default router
