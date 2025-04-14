<template>
  <div class="welcome-screen">
    <div class="welcome-container">
      <h1 class="game-title">VESTIGE</h1>
      <div class="game-subtitle">L'Héritage des Âmes</div>
      
      <div class="hero-description">
        <p>Dans un monde où la mort n'est que le commencement, vous incarnez un Héritier capable d'absorber les vestiges des héros tombés avant vous.</p>
        <p>Chaque vestige vous octroie une fraction de la puissance et des souvenirs de son précédent propriétaire.</p>
        <p>Comment écrirez-vous votre légende ?</p>
      </div>
      
      <div class="action-buttons">
        <button @click="startGame" class="start-button">
          Commencer l'Aventure
        </button>
        
        <button v-if="hasHero" @click="continueGame" class="continue-button">
          Continuer l'Aventure
        </button>
        
        <router-link to="/about" class="about-link">À propos</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

// Vérifie si un héros existe déjà
const hasHero = computed(() => gameStore.hero !== null);

// Navigation vers le jeu
function startGame() {
  router.push('/game');
}

// Navigation directe vers le jeu (si un héros existe)
function continueGame() {
  router.push('/game');
}
</script>

<style scoped>
.welcome-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d1117;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/path/to/your/background.jpg');
  background-size: cover;
  background-position: center;
  color: #e6edf3;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.welcome-container {
  background-color: rgba(22, 27, 34, 0.8);
  border-radius: 12px;
  padding: 40px;
  width: 90%;
  max-width: 600px;
  text-align: center;
  backdrop-filter: blur(4px);
  border: 1px solid #30363d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.game-title {
  font-size: 4rem;
  margin: 0;
  letter-spacing: 0.5rem;
  color: #58a6ff;
  text-shadow: 0 0 15px rgba(88, 166, 255, 0.6);
  font-weight: bold;
}

.game-subtitle {
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #8b949e;
  font-style: italic;
}

.hero-description {
  margin-bottom: 40px;
  text-align: left;
  line-height: 1.6;
}

.hero-description p {
  margin-bottom: 15px;
  color: #c9d1d9;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-button, .continue-button {
  background-color: #238636;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.start-button:hover {
  background-color: #2ea043;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(35, 134, 54, 0.4);
}

.continue-button {
  background-color: #58a6ff;
}

.continue-button:hover {
  background-color: #79b8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 166, 255, 0.4);
}

.about-link {
  color: #8b949e;
  text-decoration: none;
  margin-top: 20px;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  display: inline-block;
}

.about-link:hover {
  color: #58a6ff;
}

@media (max-width: 768px) {
  .game-title {
    font-size: 3rem;
  }
  
  .game-subtitle {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  .welcome-container {
    padding: 30px;
  }
}
</style>