<!-- src/views/WelcomeScreen.vue -->
<template>
    <div class="welcome-screen" :class="currentSeason">
      <!-- Arrière-plan animé qui change selon la saison -->
      <div class="seasonal-background">
        <div class="pixel-art-scene" :class="{ 
          'rainy': weather === 'rainy',
          'sunny': weather === 'sunny',
          'cloudy': weather === 'cloudy',
          'night': timeOfDay === 'night'
        }"></div>
        
        <!-- Effets météo -->
        <div v-if="weather === 'rainy'" class="weather-effect rain-effect"></div>
        <div v-if="seasonalEffects" class="seasonal-effect" :class="currentSeason"></div>
        
        <!-- Filtre de luminosité -->
        <div class="brightness-filter" :style="{ opacity: 1 - (brightness / 100) }"></div>
      </div>
      
      <div class="welcome-container">
        <h1 class="game-title">VESTIGE</h1>
        <div class="game-subtitle">L'Héritage des Âmes</div>
        
        <!-- Étape de création du héros -->
        <div v-if="currentStep === 'create'" class="creation-panel">
          <h2>Créer votre Héros</h2>
          
          <div class="form-group">
            <label for="heroName">Nom du Héros</label>
            <input 
              id="heroName" 
              v-model="heroName" 
              type="text" 
              placeholder="Entrez un nom..."
              @keyup.enter="confirmHeroCreation"
            />
          </div>
          
          <div class="hero-description">
            <p>Dans un monde où la mort n'est que le commencement, vous incarnez un Héritier capable d'absorber les vestiges des héros tombés avant vous.</p>
            <p>Chaque vestige vous octroie une fraction de la puissance et des souvenirs de son précédent propriétaire.</p>
            <p>Comment écrirez-vous votre légende ?</p>
          </div>
          
          <div class="time-display">
            <div class="season-indicator">{{ seasonNames[currentSeason] }}</div>
            <div class="time-indicator">{{ getFormattedTime() }}</div>
            <div class="weather-indicator">{{ weatherNames[weather] }}</div>
            <div class="brightness-indicator">Luminosité: {{ brightness }}%</div>
          </div>
          
          <button 
            :disabled="!heroName.trim()" 
            @click="confirmHeroCreation" 
            class="create-button"
          >
            Commencer l'Aventure
          </button>
        </div>
        
        <div v-else-if="currentStep === 'loading'" class="loading-screen">
          <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <div class="loading-text">Préparation de votre destin...</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useGameStore } from '../stores/gameStore';
  import { useRouter } from 'vue-router';
  import { useTimeSystem } from '../composables/useTimeSystem';
  
  const router = useRouter();
  const gameStore = useGameStore();
  const { 
    currentSeason, 
    weather, 
    timeOfDay,
    brightness, 
    updateTimeSystem,
    startTimeSystem,
    stopTimeSystem
  } = useTimeSystem();
  
  // État de la page
  const currentStep = ref('create');
  const heroName = ref('');
  
  // Noms d'affichage pour les saisons et la météo
  const seasonNames = {
    spring: 'Printemps',
    summer: 'Été',
    autumn: 'Automne',
    winter: 'Hiver'
  };
  
  const weatherNames = {
    sunny: 'Ensoleillé',
    cloudy: 'Nuageux',
    rainy: 'Pluvieux'
  };
  
  // Effets saisonniers (feuilles, neige, etc.)
  const seasonalEffects = computed(() => {
    return currentSeason.value === 'autumn' || currentSeason.value === 'winter';
  });
  
  // Lancer le système de temps
  onMounted(() => {
    startTimeSystem();
  });
  
  // Arrêter le système de temps quand on quitte cette page
  onUnmounted(() => {
    stopTimeSystem();
  });
  
  // Formatage de l'heure
  function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  
  // Validation et création du héros
  function confirmHeroCreation() {
    if (!heroName.value.trim()) return;
    
    currentStep.value = 'loading';
    
    // Simulation d'un temps de chargement
    setTimeout(() => {
      // Créer le héros dans le store
      gameStore.createHero(heroName.value);
      
      // Rediriger vers le jeu
      router.push('/game');
    }, 1500);
  }
  </script>
  
  <style scoped>
  .welcome-screen {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: 'Inter', sans-serif;
  }
  
  /* Arrière-plans saisonniers */
  .seasonal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: all 1s ease;
  }
  
  .pixel-art-scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: filter 1s ease;
  }
  
  .welcome-screen.spring .pixel-art-scene {
    background-image: url('/src/assets/backgrounds/spring.png');
  }
  
  .welcome-screen.summer .pixel-art-scene {
    background-image: url('/src/assets/backgrounds/summer.png');
  }
  
  .welcome-screen.autumn .pixel-art-scene {
    background-image: url('/src/assets/backgrounds/autumn.png');
  }
  
  .welcome-screen.winter .pixel-art-scene {
    background-image: url('/src/assets/backgrounds/winter.png');
  }
  
  /* Filtres météo */
  .pixel-art-scene.rainy {
    filter: saturate(0.8) brightness(0.8);
  }
  
  .pixel-art-scene.cloudy {
    filter: saturate(0.9) brightness(0.9);
  }
  
  .pixel-art-scene.sunny {
    filter: saturate(1.1) brightness(1.1);
  }
  
  .pixel-art-scene.night {
    filter: brightness(0.4) saturate(0.8);
  }
  
  /* Effets météo animés */
  .weather-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .rain-effect {
    background-image: url('/src/assets/effects/rain.png');
    animation: rain 0.8s linear infinite;
    opacity: 0.7;
  }
  
  .seasonal-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .seasonal-effect.autumn {
    background-image: url('/src/assets/effects/leaves.png');
    animation: leaves 15s linear infinite;
    opacity: 0.6;
  }
  
  .seasonal-effect.winter {
    background-image: url('/src/assets/effects/snow.png');
    animation: snow 10s linear infinite;
    opacity: 0.7;
  }
  
  /* Filtre de luminosité */
  .brightness-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    transition: opacity 1s ease;
  }
  
  /* Contenu principal */
  .welcome-container {
    position: relative;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 40px;
    width: 90%;
    max-width: 600px;
    text-align: center;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
  
  /* Formulaire de création */
  .creation-panel {
    text-align: left;
  }
  
  .creation-panel h2 {
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 20px;
    color: #1890ff;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #ddd;
  }
  
  .form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid rgba(24, 144, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 6px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #1890ff;
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 5px rgba(24, 144, 255, 0.5);
  }
  
  .form-group input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .hero-description {
    margin-bottom: 30px;
    color: #bbb;
    line-height: 1.6;
  }
  
  .hero-description p {
    margin-bottom: 10px;
  }
  
  /* Informations temporelles */
  .time-display {
    margin-bottom: 30px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .season-indicator, .time-indicator, 
  .weather-indicator, .brightness-indicator {
    text-align: center;
    padding: 5px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .season-indicator {
    background-color: rgba(24, 144, 255, 0.2);
    color: #1890ff;
  }
  
  .time-indicator {
    background-color: rgba(114, 46, 209, 0.2);
    color: #b37feb;
  }
  
  .weather-indicator {
    background-color: rgba(82, 196, 26, 0.2);
    color: #73d13d;
  }
  
  .brightness-indicator {
    background-color: rgba(250, 173, 20, 0.2);
    color: #ffc53d;
  }
  
  /* Bouton de création */
  .create-button {
    width: 100%;
    padding: 12px 0;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .create-button:hover:not(:disabled) {
    background-color: #40a9ff;
  }
  
  .create-button:disabled {
    background-color: #595959;
    cursor: not-allowed;
  }
  
  /* Écran de chargement */
  .loading-screen {
    text-align: center;
    padding: 40px 0;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #1890ff;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
  }
  
  .loading-text {
    font-size: 1.2rem;
    color: #bbb;
  }
  
  /* Animations */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes rain {
    from { background-position: 0 0; }
    to { background-position: 0 20px; }
  }
  
  @keyframes leaves {
    from { background-position: 0 0; }
    to { background-position: 100px 100px; }
  }
  
  @keyframes snow {
    from { background-position: 0 0; }
    to { background-position: 20px 100px; }
  }
  </style>