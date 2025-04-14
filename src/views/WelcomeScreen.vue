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

// Navigation vers la création de personnage
function startGame() {
  router.push('/create');
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
  background-color: #121212;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/path/to/your/background.jpg');
  background-size: cover;
  background-position: center;
}

.welcome-container {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 40px;
  width: 90%;
  max-width: 600px;
  text-align: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  color: white;
}

.game-title {
  font-size: 4rem;
  margin: 0;
  letter-spacing: 0.5rem;
  color: #1890ff;
  text-shadow: 0 0 10px rgba(24, 144, 255, 0.8);
  font-weight: bold;
}

.game-subtitle {
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #bbb;
  font-style: italic;
}

.hero-description {
  margin-bottom: 40px;
  text-align: left;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-button, .continue-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 80%;
  max-width: 300px;
}

.start-button:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.continue-button {
  background-color: #52c41a;
}

.continue-button:hover {
  background-color: #73d13d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.about-link {
  color: #bbb;
  text-decoration: none;
  margin-top: 10px;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.about-link:hover {
  color: #1890ff;
}
</style>