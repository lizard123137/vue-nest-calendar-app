import Calendar from '@/components/Calendar.vue'
import Login from '@/components/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
