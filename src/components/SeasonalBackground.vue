// src/components/SeasonalBackground.vue
<template>
  <div class="seasonal-environment" :class="currentSeason">
    <!-- Arrière-plan principal qui change selon la saison -->
    <div 
      class="seasonal-background"
      :class="{ 
        'rainy': weather === 'rainy',
        'cloudy': weather === 'cloudy',
        'sunny': weather === 'sunny',
        'night': timeOfDay === 'night',
        'dawn': timeOfDay === 'dawn',
        'dusk': timeOfDay === 'dusk'
      }"
      :style="{ filter: `brightness(${brightness / 100})` }"
    ></div>
    
    <!-- Couche décorative avant-plan qui change selon la saison -->
    <div class="seasonal-foreground" :class="currentSeason"></div>
    
    <!-- Effets météo animés -->
    <div v-if="weather === 'rainy'" class="weather-effect rain-effect"></div>
    
    <!-- Effets saisonniers spécifiques -->
    <div v-if="currentSeason === 'autumn'" class="seasonal-effect leaves-effect"></div>
    <div v-if="currentSeason === 'winter'" class="seasonal-effect snow-effect"></div>
    
    <!-- Cycle jour/nuit -->
    <div 
      class="day-night-overlay"
      :class="timeOfDay"
      :style="{ opacity: calculateDayNightOpacity() }"
    ></div>
    
    <!-- Contenu -->
    <div class="content-container">
      <slot></slot>
    </div>
    
    <!-- Information temporelle (optionnelle, peut être masquée via prop) -->
    <div v-if="showTimeInfo" class="time-info">
      <div class="time-data season">{{ seasonNames[currentSeason] }}</div>
      <div class="time-data date">{{ formatGameDate() }}</div>
      <div class="time-data weather">{{ weatherNames[weather] }}</div>
      <div class="time-data light">Luminosité: {{ brightness }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Season, Weather, TimeOfDay } from '../composables/useTimeSystem';

// Props du composant
const props = defineProps({
  currentSeason: {
    type: String as () => Season,
    required: true
  },
  weather: {
    type: String as () => Weather,
    required: true
  },
  timeOfDay: {
    type: String as () => TimeOfDay,
    required: true
  },
  brightness: {
    type: Number,
    required: true
  },
  gameDate: {
    type: Date,
    required: true
  },
  showTimeInfo: {
    type: Boolean,
    default: false
  }
});

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

// Calcul de l'opacité pour la superposition jour/nuit
function calculateDayNightOpacity(): number {
  switch (props.timeOfDay) {
    case 'night': return 0.7;
    case 'dawn': return 0.3;
    case 'dusk': return 0.5;
    default: return 0;
  }
}

// Formatage de la date du jeu
function formatGameDate(): string {
  const date = props.gameDate;
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth retourne 0-11
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `Jour ${day}/${month}, An ${year} • ${hours}:${minutes}`;
}
</script>

<style scoped>
.seasonal-environment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Arrière-plans saisonniers (pixel art) */
.seasonal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: filter 1s ease;
  image-rendering: pixelated; /* Donne un effet pixel art plus net */
}

/* Chaque saison a son propre fond - Utiliser des URL publiques pour les tests */
.seasonal-environment.spring .seasonal-background {
  background-image: url('https://placekitten.com/800/600');
  background-color: #e6ffed; /* Fallback */
}

.seasonal-environment.summer .seasonal-background {
  background-image: url('https://placekitten.com/800/601');
  background-color: #fffbe6; /* Fallback */
}

.seasonal-environment.autumn .seasonal-background {
  background-image: url('https://placekitten.com/800/602');
  background-color: #fff2e8; /* Fallback */
}

.seasonal-environment.winter .seasonal-background {
  background-image: url('https://placekitten.com/800/603');
  background-color: #f0f5ff; /* Fallback */
}

/* Avant-plans saisonniers pour les détails supplémentaires */
.seasonal-foreground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background-size: 100% auto;
  background-position: bottom center;
  background-repeat: repeat-x;
  z-index: 5;
  pointer-events: none;
  image-rendering: pixelated;
}

/* Placeholders pour les avant-plans */
.seasonal-environment.spring .seasonal-foreground {
  background-image: linear-gradient(transparent 70%, rgba(120, 220, 120, 0.3) 100%);
}

.seasonal-environment.summer .seasonal-foreground {
  background-image: linear-gradient(transparent 70%, rgba(255, 220, 100, 0.3) 100%);
}

.seasonal-environment.autumn .seasonal-foreground {
  background-image: linear-gradient(transparent 70%, rgba(220, 120, 50, 0.3) 100%);
}

.seasonal-environment.winter .seasonal-foreground {
  background-image: linear-gradient(transparent 70%, rgba(200, 230, 255, 0.3) 100%);
}

/* Effets météo */
.weather-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

.rain-effect {
  background-image: linear-gradient(to bottom, rgba(100, 150, 255, 0) 0%, rgba(100, 150, 255, 0.2) 100%);
  animation: rainAnimation 0.5s linear infinite;
  opacity: 0.7;
}

/* Effets saisonniers */
.seasonal-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

.leaves-effect {
  background-image: radial-gradient(circle, rgba(220, 120, 50, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: leavesAnimation 20s linear infinite;
  opacity: 0.5;
}

.snow-effect {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: snowAnimation 15s linear infinite;
  opacity: 0.7;
}

/* Superposition jour/nuit */
.day-night-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;
  transition: opacity 1s ease;
}

.day-night-overlay.night {
  background-color: #001429;
}

.day-night-overlay.dawn {
  background: linear-gradient(to top, rgba(255, 200, 100, 0.2), rgba(0, 20, 60, 0.5));
}

.day-night-overlay.dusk {
  background: linear-gradient(to top, rgba(255, 100, 50, 0.3), rgba(20, 0, 40, 0.5));
}

/* Conteneur de contenu */
.content-container {
  position: relative;
  z-index: 20;
  height: 100%;
}

/* Informations temporelles */
.time-info {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 30;
}

.time-data {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.time-data.season {
  border-left: 3px solid #1890ff;
}

.time-data.date {
  border-left: 3px solid #722ed1;
}

.time-data.weather {
  border-left: 3px solid #52c41a;
}

.time-data.light {
  border-left: 3px solid #faad14;
}

/* Filtres météo */
.seasonal-background.rainy {
  filter: saturate(0.8) brightness(0.8);
}

.seasonal-background.cloudy {
  filter: saturate(0.9) brightness(0.9);
}

.seasonal-background.sunny {
  filter: saturate(1.1) brightness(1.1);
}

.seasonal-background.night {
  filter: brightness(0.4) saturate(0.8);
}

/* Animations */
@keyframes rainAnimation {
  from { background-position: 0 0; }
  to { background-position: 0 20px; }
}

@keyframes leavesAnimation {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

@keyframes snowAnimation {
  from { background-position: 0 0; }
  to { background-position: 30px 100px; }
}
</style>