// src/components/SeasonalDecorativeFrame.vue
<template>
  <div 
    class="seasonal-frame" 
    :class="[`theme-${theme}`, `season-${currentSeason}`, timeOfDay]"
  >
    <!-- Coins du cadre -->
    <div class="frame-corner top-left"></div>
    <div class="frame-corner top-right"></div>
    <div class="frame-corner bottom-left"></div>
    <div class="frame-corner bottom-right"></div>
    
    <!-- Bords du cadre -->
    <div class="frame-edge top"></div>
    <div class="frame-edge right"></div>
    <div class="frame-edge bottom"></div>
    <div class="frame-edge left"></div>
    
    <!-- Ornements qui varient selon les saisons -->
    <div v-if="level > 1" class="frame-ornaments">
      <div 
        v-for="i in Math.min(level - 1, 4)" 
        :key="i" 
        class="ornament" 
        :class="[`ornament-${i}`, currentSeason]"
      ></div>
    </div>
    
    <!-- Effets de temps/météo sur le cadre -->
    <div 
      class="weather-effect" 
      :class="weather"
      v-if="weather !== 'sunny'"
    ></div>
    
    <!-- Effet de luminosité -->
    <div 
      class="brightness-filter"
      :style="{ opacity: 1 - (brightness / 100) }"
    ></div>
    
    <!-- Contenu du cadre -->
    <div class="frame-content">
      <slot></slot>
    </div>
    
    <!-- Informations temporelles (optionnelles) -->
    <div v-if="showTimeInfo" class="time-display">
      <span class="time-item season">{{ seasonNames[currentSeason] }}</span>
      <span class="time-item day-time">{{ timeOfDayNames[timeOfDay] }}</span>
      <span class="time-item weather">{{ weatherNames[weather] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Season, Weather, TimeOfDay } from '../composables/useTimeSystem';

// Props du composant
const props = defineProps({
  theme: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'fire', 'ice', 'nature', 'arcane', 'deferment'].includes(value)
  },
  level: {
    type: Number,
    default: 1
  },
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
  showTimeInfo: {
    type: Boolean,
    default: false
  }
});

// Noms d'affichage
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

const timeOfDayNames = {
  dawn: 'Aube',
  day: 'Jour',
  dusk: 'Crépuscule',
  night: 'Nuit'
};
</script>

<style scoped>
.seasonal-frame {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.7s ease;
}

.frame-content {
  width: 100%;
  height: 100%;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

/* Coins et bords du cadre */
.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid;
  z-index: 11;
  transition: all 0.3s ease;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.frame-edge {
  position: absolute;
  background: transparent;
  border: 1px dashed;
  opacity: 0.7;
  z-index: 11;
  transition: all 0.3s ease;
}

.frame-edge.top, .frame-edge.bottom {
  left: 30px;
  right: 30px;
  height: 0;
}

.frame-edge.left, .frame-edge.right {
  top: 30px;
  bottom: 30px;
  width: 0;
}

.frame-edge.top { top: 0; }
.frame-edge.right { right: 0; }
.frame-edge.bottom { bottom: 0; }
.frame-edge.left { left: 0; }

/* Ornements */
.frame-ornaments {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 12;
}

.ornament {
  position: absolute;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: all 0.5s ease;
}

.ornament-1 { top: 15px; left: 50%; transform: translateX(-50%); }
.ornament-2 { top: 50%; right: 15px; transform: translateY(-50%); }
.ornament-3 { bottom: 15px; left: 50%; transform: translateX(-50%); }
.ornament-4 { top: 50%; left: 15px; transform: translateY(-50%); }

/* Ornements saisonniers */
.ornament.spring {
  background-image: url('@/assets/ornaments/spring-ornament.png');
}

.ornament.summer {
  background-image: url('@/assets/ornaments/summer-ornament.png');
}

.ornament.autumn {
  background-image: url('@/assets/ornaments/autumn-ornament.png');
}

.ornament.winter {
  background-image: url('@/assets/ornaments/winter-ornament.png');
}

/* Effets météo sur le cadre */
.weather-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  opacity: 0.3;
}

.weather-effect.rainy {
  background-image: url('@/assets/effects/frame-rain.png');
  animation: frameRain 2s linear infinite;
}

.weather-effect.cloudy {
  background-image: url('@/assets/effects/frame-clouds.png');
}

/* Filtre de luminosité */
.brightness-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 9;
  pointer-events: none;
  transition: opacity 1s ease;
}

/* Affichage des informations temporelles */
.time-display {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 10px;
  z-index: 15;
  font-size: 0.8rem;
}

.time-item {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}

.time-item.season {
  color: #1890ff;
}

.time-item.day-time {
  color: #722ed1;
}

.time-item.weather {
  color: #52c41a;
}

/* Thèmes du cadre qui se combinent avec les saisons */
.theme-default {
  --frame-color: #1890ff;
  background-color: #f0f2f5;
}

.theme-fire {
  --frame-color: #fa541c;
  background-color: #fff2e8;
}

.theme-ice {
  --frame-color: #00a2ae;
  background-color: #e6fffb;
}

.theme-nature {
  --frame-color: #52c41a;
  background-color: #f6ffed;
}

.theme-arcane {
  --frame-color: #722ed1;
  background-color: #f9f0ff;
}

.theme-deferment {
  --frame-color: #eb2f96;
  background-color: #fff0f6;
}

/* Application des couleurs de cadre */
.seasonal-frame .frame-corner,
.seasonal-frame .frame-edge {
  border-color: var(--frame-color);
}

/* Modifications saisonnières du cadre */
.season-spring {
  --season-tint: rgba(120, 220, 120, 0.1);
}

.season-summer {
  --season-tint: rgba(255, 220, 100, 0.1);
}

.season-autumn {
  --season-tint: rgba(220, 120, 50, 0.1);
}

.season-winter {
  --season-tint: rgba(200, 230, 255, 0.15);
}

/* Application des teintes saisonnières */
.seasonal-frame.season-spring { background-color: #f6ffed; }
.seasonal-frame.season-summer { background-color: #fffbe6; }
.seasonal-frame.season-autumn { background-color: #fff2e8; }
.seasonal-frame.season-winter { background-color: #f0f5ff; }

/* Modifications nocturnes */
.seasonal-frame.night {
  background-color: #212530;
}

.seasonal-frame.night .frame-content {
  color: #eee;
}

/* Animations */
@keyframes frameRain {
  from { background-position: 0 0; }
  to { background-position: -10px 10px; }
}

/* Animation subtile des bords pour certains thèmes */
.theme-deferment .frame-edge {
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  100% { opacity: 0.9; }
}
</style>