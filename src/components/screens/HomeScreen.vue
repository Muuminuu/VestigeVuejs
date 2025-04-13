<template>
    <main class="home-screen">
      <div class="home-container">
        <h1>Bienvenue dans Vestige</h1>
        
        <div class="game-description">
          <p>Embarquez dans un voyage où la mort n'est pas la fin, mais un nouveau commencement.</p>
          
          <h2>Le Système d'Héritage</h2>
          <p>
            Dans Vestige, lorsque votre héros tombe au combat, il laisse derrière lui un vestige spirituel.
            Ces Vestiges peuvent être incorporés par de futurs héros, leur accordant les pouvoirs et capacités de leurs prédécesseurs.
          </p>
          
          <h2>Fonctionnalités</h2>
          <ul>
            <li>Créez des héros avec différentes capacités</li>
            <li>Quand un héros meurt, il laisse derrière lui un Vestige contenant une partie de son pouvoir</li>
            <li>Les nouveaux héros peuvent incorporer ces Vestiges, créant une lignée spirituelle</li>
            <li>Chaque nouveau héros peut construire sur l'héritage de ceux qui l'ont précédé</li>
            <li>Accumulez de la puissance à travers plusieurs vies de héros</li>
          </ul>
          
          <div class="cta-container">
            <button class="play-button" @click="startNewGame">
              {{ hasHero ? 'Continuer l\'Aventure' : 'Commencer l\'Aventure' }}
            </button>
            
            <button v-if="hasHero" class="new-hero-button" @click="createNewHero">
              Créer un Nouveau Héros
            </button>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useGameStore } from '../../stores/gameStore'
  
  // Définir les émetteurs d'événements
  const emit = defineEmits(['start-game', 'create-hero'])
  
  const gameStore = useGameStore()
  const hasHero = computed(() => gameStore.hero !== null)
  
  // Commencer le jeu ou continuer
  function startNewGame() {
    emit('start-game')
  }
  
  // Créer un nouveau héros
  function createNewHero() {
    // Si un héros existe déjà, on le supprime
    if (hasHero.value) {
      // Demander confirmation avant de perdre le héros actuel
      if (confirm('Êtes-vous sûr de vouloir créer un nouveau héros ? Votre héros actuel sera perdu.')) {
        gameStore.handleHeroDeath(false) // false = ne pas créer de vestige
        emit('start-game')
      }
    } else {
      emit('start-game')
    }
  }
  </script>
  
  <style scoped>
  .home-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .home-container {
    max-width: 800px;
    width: 100%;
  }
  
  h1 {
    font-size: 2.5rem;
    color: #1890ff;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .game-description {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  h2 {
    color: #333;
    margin-top: 25px;
    margin-bottom: 15px;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  ul {
    margin-bottom: 25px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  .cta-container {
    text-align: center;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .play-button, .new-hero-button {
    padding: 12px 30px;
    border-radius: 4px;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    min-width: 250px;
  }
  
  .play-button {
    background-color: #1890ff;
    color: white;
  }
  
  .play-button:hover {
    background-color: #40a9ff;
  }
  
  .new-hero-button {
    background-color: #52c41a;
    color: white;
  }
  
  .new-hero-button:hover {
    background-color: #73d13d;
  }
  
  @media (min-width: 768px) {
    .cta-container {
      flex-direction: row;
      justify-content: center;
    }
  }
  </style>