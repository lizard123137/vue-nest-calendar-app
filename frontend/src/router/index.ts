import Calendar from '@/components/Calendar.vue'
import Login from '@/components/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Login,
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
    }
  ],
})

export default router
