import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: "/:pathMatch(.*)*",
      name: 'not found',
      component: () => import('../pages/NotFoundPage.vue')
    },
  ]
})

export default router
