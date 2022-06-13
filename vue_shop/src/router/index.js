import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/login')
  },
  {
    path: '/home',
    component: () => import('../components/home'),
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: () => import('../components/home/Welcome')
    },
    {
      path: '/users',
      component: () => import('../components/home/User')
    },
    {
      path: '/rights',
      component: () => import('../components/home/Rights')
    },
    {
      path: '/roles',
      component: () => import('../components/home/Roles')
    },
    {
      path: '/goods',
      component: () => import('../components/home/Goods')
    },
    {
      path: '/categories',
      component: () => import('../components/home/Category')
    },
    {
      path: '/params',
      component: () => import('../components/home/Params')
    }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to 要访问的路径
  // from 代表从哪个路径跳转的路径
  // next 是一个函数 表示放行；在括号内写路径名表示强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
