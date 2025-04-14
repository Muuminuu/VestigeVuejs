<template>
  <div class="game-page">
    <!-- Vérifier si un héros existe -->
    <div v-if="hero">
      <!-- Interface principale du jeu -->
      <GameInterface />
    </div>
    
    <!-- Si aucun héros n'existe, afficher le message de création -->
    <div v-else class="no-hero-container">
      <div class="no-hero-card">
        <h2>Aucun Héros Actif</h2>
        <p>Pour commencer à jouer, vous devez d'abord créer un héros.</p>
        
        <div class="hero-creation" v-if="showCreation">
          <div class="form-group">
            <label for="heroName">Nom du Héros:</label>
            <input 
              id="heroName" 
              v-model="heroName" 
              type="text" 
              placeholder="Entrez le nom de votre héros"
              @keyup.enter="createHero"
            />
          </div>
          
          <div v-if="hasVestiges" class="vestiges-info">
            <p>Votre nouveau héros héritera des vestiges suivants:</p>
            <ul class="vestiges-list">
              <li v-for="vestige in availableVestiges" :key="vestige.id">
                {{ vestige.name }} (Niveau {{ vestige.level }})
              </li>
            </ul>
          </div>
          
          <div class="action-buttons">
            <button 
              class="create-button" 
              :disabled="!heroName.trim()" 
              @click="createHero"
            >
              Créer et Commencer l'Aventure
            </button>
            <button class="cancel-button" @click="showCreation = false">Annuler</button>
          </div>
        </div>
        
        <button v-else class="create-hero-button" @click="showCreation = true">
          Créer un Héros
        </button>
        
        <router-link to="/" class="return-link">Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import GameInterface from './GameInterface.vue';

const router = useRouter();
const gameStore = useGameStore();

// État local
const heroName = ref('');
const showCreation = ref(false);

// Données réactives
const hero = computed(() => gameStore.hero);
const availableVestiges = computed(() => gameStore.vestiges);
const hasVestiges = computed(() => availableVestiges.value.length > 0);

// Vérifier au chargement si un héros existe
onMounted(() => {
  if (!hero.value) {
    // Optionnel: Rediriger automatiquement vers l'écran de création
    // showCreation.value = true;
  }
});

// Créer un nouveau héros
function createHero() {
  if (!heroName.value.trim()) return;
  
  // Appeler le store pour créer le héros
  gameStore.createHero(heroName.value);
  
  // Réinitialiser le formulaire
  heroName.value = '';
  showCreation.value = false;
}
</script>

<style scoped>
/* .game-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0d1117;
  color: #e6edf3;
} */
.game-page {
  width: 100%;  /* Change from 100vw to 100% */
  height: 100vh;
  overflow: hidden;
  background-color: #0d1117;
  color: #e6edf3;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.game-page > div {
  width: 100%;
  max-width: 1440px; /* Maximum width for large screens */
  display: flex;
  justify-content: center;
  margin: 0;
}

.no-hero-container {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-hero-card {
  background-color: #161b22;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #30363d;
  text-align: center;
}

h2 {
  color: #58a6ff;
  margin-top: 0;
  margin-bottom: 15px;
}

p {
  color: #c9d1d9;
  margin-bottom: 20px;
}

.hero-creation {
  margin-top: 20px;
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #c9d1d9;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.3);
}

.vestiges-info {
  background-color: rgba(88, 166, 255, 0.1);
  border: 1px solid rgba(88, 166, 255, 0.3);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.vestiges-list {
  list-style: none;
  padding-left: 0;
}

.vestiges-list li {
  padding: 5px 0;
  border-bottom: 1px solid #30363d;
}

.vestiges-list li:last-child {
  border-bottom: none;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.create-button, .cancel-button, .create-hero-button {
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.create-button {
  background-color: #238636;
  color: white;
  flex: 1;
}

.create-button:hover:not(:disabled) {
  background-color: #2ea043;
}

.create-button:disabled {
  background-color: #238636;
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #21262d;
  color: #c9d1d9;
  border: 1px solid #30363d;
}

.cancel-button:hover {
  background-color: #30363d;
}

.create-hero-button {
  background-color: #58a6ff;
  color: white;
  width: 100%;
  margin-bottom: 15px;
}

.create-hero-button:hover {
  background-color: #79b8ff;
}

.return-link {
  display: inline-block;
  color: #8b949e;
  text-decoration: none;
  margin-top: 10px;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.return-link:hover {
  color: #58a6ff;
}

</style>