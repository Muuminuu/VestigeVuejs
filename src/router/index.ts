import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import WelcomeScreen from '../views/WelcomeScreen.vue'
import GamePage from '../views/GamePage.vue'
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
      component: GamePage,
      meta: { requiresHero: false } // On désactive temporairement la vérification pour permettre la création de héros sur la page de jeu
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
    // Redirect to welcome screen
    next({ name: 'welcome' })
  } else {
    // Otherwise proceed normally
    next()
  }
})

export default router