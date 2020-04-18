import VueRouter from 'vue-router'
import Vue from 'vue'
import locol from '@/utils/local'
const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const Welcome = () => import('@/views/welcome')
const NotFound = () => import('@/views/404')
const Article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Setting = () => import('@/views/setting')
const Fans = () => import('@/views/fans')
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
        },
        // 发布文章
        {
          path: '/publish',
          component: Publish
        },
        // 评论管理
        {
          path: '/comment',
          component: Comment
        },
        // 个人设置
        {
          path: '/setting',
          component: Setting
        },
        //  粉丝管理
        {
          path: '/fans',
          component: Fans
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
    // to.path跳转到那个路由对象 跳到登录就放行
    if (to.path === '/login') {
      next()
    } else {
      // 不通过
      next('/login')
    }
  }
})
export default router
