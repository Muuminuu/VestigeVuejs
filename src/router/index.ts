// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import WelcomeScreen from '../views/WelcomeScreen.vue'
import GameView from '../views/GameView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeScreen
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      meta: { requiresHero: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

// Navigation guard to check if a hero exists before accessing game routes
router.beforeEach((to, from, next) => {
  const gameStore = useGameStore()
  
  // Check if the route requires a hero and if no hero exists
  if (to.meta.requiresHero && !gameStore.hero) {
    // Redirect to welcome screen to create a hero
    next({ name: 'welcome' })
  } else {
    // Otherwise proceed normally
    next()
  }
})

export default router