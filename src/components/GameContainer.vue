<template>
    <div class="game-container">
      <!-- Page d'accueil -->
      <home-screen v-if="gameState === 'home'" @start-game="startGame" />
      
      <!-- Création de personnage -->
      <character-creation v-else-if="gameState === 'character-creation'" @hero-created="onHeroCreated" />
      
      <!-- Vue de jeu principale -->
      <game-view v-else-if="gameState === 'game'" @return-home="returnToHome" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useGameStore } from '../stores/gameStore'
  import HomeScreen from '../components/screens/HomeScreen.vue'
  import CharacterCreation from '../components/screens/CharacterCreation.vue'
  import GameView from '../components/screens/GameView.vue'
  
  // States possibles : 'home', 'character-creation', 'game'
  const gameState = ref('home')
  const gameStore = useGameStore()
  
  // Au chargement, vérifier si un héros existe déjà
  onMounted(() => {
    checkHeroExistence()
  })
  
  // Vérifier si un héros existe, et ajuster l'état du jeu en conséquence
  function checkHeroExistence() {
    if (gameStore.hero) {
      // Si un héros existe, aller directement à l'écran de jeu
      gameState.value = 'game'
    }
  }
  
  // Commencer un nouveau jeu
  function startGame() {
    if (gameStore.hero) {
      // Si un héros existe déjà, aller directement au jeu
      gameState.value = 'game'
    } else {
      // Sinon, aller à la création de personnage
      gameState.value = 'character-creation'
    }
  }
  
  // Lorsqu'un héros est créé
  function onHeroCreated() {
    gameState.value = 'game'
  }
  
  // Retourner à l'écran d'accueil
  function returnToHome() {
    gameState.value = 'home'
  }
  </script>
  
  <style scoped>
  .game-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  </style>