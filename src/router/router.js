import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/user/users.vue'
import roles from '../components/rights/roles.vue'
import rights from '../components/rights/rights.vue'
import categories from '../components/goods/categories.vue'
import params from '../components/goods/params.vue'
import goods from '../components/goods/goods.vue'
import addgoods from '../components/goods/addgoods.vue'
import order from '../components/orders/order.vue'
import reports from '../components/reports/reports.vue'

Vue.use(VueRouter)

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    children: [
      {
        path: '/users',
        component: users
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/categories',
        component: categories
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/addgoods',
        component: addgoods
      },
      {
        path: '/orders',
        component: order
      },
      {
        path: '/reports',
        component: reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 使用路由导航守卫来确认用户的token值是否存在浏览器中
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
