// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import GameContainer from '../views/GameContainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameContainer
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // Rediriger toutes les autres routes vers la route principale
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router