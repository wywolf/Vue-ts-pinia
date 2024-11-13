import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue')
  },
  {
    path: '/system/users',
    name: 'Users',
    component: () => import('@/views/system/users/index.vue')
  },
  {
    path: '/system/roles',
    name: 'Roles', 
    component: () => import('@/views/system/roles/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('当前路由:', to.path)
  next()
})

export default router 