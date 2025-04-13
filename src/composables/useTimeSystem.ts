// src/composables/useTimeSystem.ts
import { ref, computed, onUnmounted } from 'vue';

// Types du système météorologique
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'sunny' | 'cloudy' | 'rainy';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

// Configuration des durées (en millisecondes)
const TIME_SPEEDS = {
  realtime: 1,              // Temps réel
  accelerated: 60,          // 1 seconde réelle = 1 minute dans le jeu
  fast: 1440,               // 1 seconde réelle = 24 minutes dans le jeu
  debug: 10080              // 1 seconde réelle = 1 semaine dans le jeu
};

// Force de différents types d'ennemis selon les conditions
export const ENEMY_STRENGTH_MODIFIERS = {
  seasons: {
    spring: { undead: 0.8, demon: 1.0, elemental: 1.1, dragon: 0.9, spirit: 1.2 },
    summer: { undead: 0.7, demon: 1.3, elemental: 1.2, dragon: 1.1, spirit: 0.9 },
    autumn: { undead: 1.1, demon: 0.9, elemental: 1.0, dragon: 0.8, spirit: 1.3 },
    winter: { undead: 1.2, demon: 0.8, elemental: 0.9, dragon: 1.0, spirit: 1.1 }
  },
  weather: {
    sunny: { undead: 0.7, demon: 1.2, elemental: 1.1, dragon: 1.0, spirit: 0.8 },
    cloudy: { undead: 0.9, demon: 1.0, elemental: 1.0, dragon: 1.0, spirit: 1.0 },
    rainy: { undead: 1.1, demon: 0.9, elemental: 1.2, dragon: 0.8, spirit: 1.1 }
  },
  timeOfDay: {
    dawn: { undead: 0.8, demon: 0.7, elemental: 1.0, dragon: 1.0, spirit: 1.1 },
    day: { undead: 0.6, demon: 0.8, elemental: 1.1, dragon: 1.1, spirit: 0.7 },
    dusk: { undead: 1.1, demon: 1.1, elemental: 0.9, dragon: 1.0, spirit: 1.1 },
    night: { undead: 1.4, demon: 1.3, elemental: 0.8, dragon: 0.9, spirit: 1.4 }
  },
  // Plus la luminosité est faible, plus les ennemis de type undead et spirit sont forts
  // La fonction est dans calculateEnemyStrength
};

// La date initiale du jeu (01 Mars, an 1 à 8h du matin)
const INITIAL_GAME_DATE = new Date(1, 2, 1, 8, 0, 0);

// Détermine la saison en fonction du mois
function getSeason(month: number): Season {
  if (month >= 2 && month <= 4) return 'spring';       // Mars à Mai
  if (month >= 5 && month <= 7) return 'summer';       // Juin à Août
  if (month >= 8 && month <= 10) return 'autumn';      // Septembre à Novembre
  return 'winter';                                     // Décembre à Février
}

// Détermine le moment de la journée
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn';            // 5h à 8h
  if (hour >= 8 && hour < 18) return 'day';            // 8h à 18h
  if (hour >= 18 && hour < 21) return 'dusk';          // 18h à 21h
  return 'night';                                      // 21h à 5h
}

// Obtenir une météo aléatoire avec des probabilités différentes selon la saison
function getRandomWeather(season: Season): Weather {
  const rand = Math.random();
  
  // Probabilités différentes selon les saisons
  switch (season) {
    case 'spring':
      if (rand < 0.5) return 'sunny';
      if (rand < 0.8) return 'cloudy';
      return 'rainy';
    case 'summer':
      if (rand < 0.7) return 'sunny';
      if (rand < 0.9) return 'cloudy';
      return 'rainy';
    case 'autumn':
      if (rand < 0.3) return 'sunny';
      if (rand < 0.7) return 'cloudy';
      return 'rainy';
    case 'winter':
      if (rand < 0.2) return 'sunny';
      if (rand < 0.8) return 'cloudy';
      return 'rainy';
  }
}

// Calculer la luminosité (0-100%) en fonction de l'heure, de la météo et de la saison
function calculateBrightness(hour: number, weather: Weather, season: Season): number {
  // Luminosité de base selon l'heure (0-100)
  let baseBrightness = 0;
  
  if (hour >= 5 && hour < 7) {                         // Aube: 5h-7h
    baseBrightness = 40 + ((hour - 5) * 30);           // 40% à 5h, augmente à 70% à 7h
  } 
  else if (hour >= 7 && hour < 12) {                   // Matin: 7h-12h
    baseBrightness = 70 + ((hour - 7) * 6);            // 70% à 7h, augmente à 100% à 12h
  }
  else if (hour >= 12 && hour < 17) {                  // Après-midi: 12h-17h
    baseBrightness = 100;                              // 100% entre 12h et 17h
  }
  else if (hour >= 17 && hour < 20) {                  // Soir: 17h-20h
    baseBrightness = 100 - ((hour - 17) * 25);         // 100% à 17h, diminue à 25% à 20h
  }
  else if (hour >= 20 && hour < 22) {                  // Crépuscule: 20h-22h
    baseBrightness = 25 - ((hour - 20) * 12.5);        // 25% à 20h, diminue à 0% à 22h
  }
  // Nuit (22h-5h): 0%
  
  // Modificateurs selon la météo
  const weatherModifier = 
    weather === 'sunny' ? 1.2 :
    weather === 'cloudy' ? 0.8 :
    weather === 'rainy' ? 0.6 : 1;
  
  // Modificateurs selon la saison
  const seasonModifier = 
    season === 'summer' ? 1.1 :
    season === 'winter' ? 0.8 : 1;
  
  // Calcul final (limité entre 0 et 100)
  return Math.min(100, Math.max(0, Math.round(baseBrightness * weatherModifier * seasonModifier)));
}

// Composable qui gère tout le système de temps
export function useTimeSystem(initialTimeSpeed: keyof typeof TIME_SPEEDS = 'accelerated') {
  // État du système
  const gameDate = ref<Date>(new Date(INITIAL_GAME_DATE));
  const timeSpeed = ref<keyof typeof TIME_SPEEDS>(initialTimeSpeed);
  const isPaused = ref<boolean>(false);
  const weather = ref<Weather>('sunny');
  const weatherChangeTimer = ref<number>(0);
  
  // Timer pour la mise à jour du temps
  let timer: number | null = null;
  
  // Valeurs calculées
  const currentSeason = computed<Season>(() => getSeason(gameDate.value.getMonth()));
  const timeOfDay = computed<TimeOfDay>(() => getTimeOfDay(gameDate.value.getHours()));
  const brightness = computed<number>(() => 
    calculateBrightness(gameDate.value.getHours(), weather.value, currentSeason.value)
  );
  
  // Méthode pour avancer le temps
  function updateGameTime() {
    if (isPaused.value) return;
    
    // Avancer le temps selon la vitesse
    const newDate = new Date(gameDate.value);
    newDate.setMinutes(newDate.getMinutes() + TIME_SPEEDS[timeSpeed.value]);
    gameDate.value = newDate;
    
    // Gérer les changements de météo (changement toutes les 3-6 heures de jeu)
    weatherChangeTimer.value += TIME_SPEEDS[timeSpeed.value];
    const hourInMs = 60;  // 60 minutes
    
    if (weatherChangeTimer.value >= (Math.random() * 3 + 3) * hourInMs) {
      weather.value = getRandomWeather(currentSeason.value);
      weatherChangeTimer.value = 0;
    }
  }
  
  // Démarrer le système de temps
  function startTimeSystem() {
    stopTimeSystem();  // Arrêter d'abord pour éviter les doublons
    timer = window.setInterval(updateGameTime, 1000);  // Mise à jour toutes les secondes
  }
  
  // Arrêter le système de temps
  function stopTimeSystem() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }
  
  // Mettre en pause/reprendre
  function togglePause() {
    isPaused.value = !isPaused.value;
  }
  
  // Changer la vitesse du temps
  function setTimeSpeed(speed: keyof typeof TIME_SPEEDS) {
    timeSpeed.value = speed;
  }
  
  // Forcer la météo (utile pour le debug ou des événements spéciaux)
  function setWeather(newWeather: Weather) {
    weather.value = newWeather;
  }
  
  // Calculer la force de l'ennemi en fonction des conditions actuelles
  function calculateEnemyStrength(enemyType: keyof typeof ENEMY_STRENGTH_MODIFIERS.seasons.spring): number {
    const seasonMod = ENEMY_STRENGTH_MODIFIERS.seasons[currentSeason.value][enemyType];
    const weatherMod = ENEMY_STRENGTH_MODIFIERS.weather[weather.value][enemyType];
    const timeMod = ENEMY_STRENGTH_MODIFIERS.timeOfDay[timeOfDay.value][enemyType];
    
    // Modificateur de luminosité (plus important pour les morts-vivants et les esprits)
    const brightnessMod = 
      enemyType === 'undead' || enemyType === 'spirit' 
        ? 1 + ((100 - brightness.value) / 100) 
        : 1;
    
    return seasonMod * weatherMod * timeMod * brightnessMod;
  }
  
  // Nettoyer les timers quand le composant est détruit
  onUnmounted(() => {
    stopTimeSystem();
  });
  
  // Mises à jour forcées (pour les tests ou les événements spéciaux)
  function updateTimeSystem(options: {
    newDate?: Date;
    newWeather?: Weather;
    newTimeSpeed?: keyof typeof TIME_SPEEDS;
  }) {
    if (options.newDate) gameDate.value = options.newDate;
    if (options.newWeather) weather.value = options.newWeather;
    if (options.newTimeSpeed) timeSpeed.value = options.newTimeSpeed;
  }
  
  return {
    // État courant
    gameDate,
    timeSpeed,
    isPaused,
    currentSeason,
    weather,
    timeOfDay,
    brightness,
    
    // Actions
    startTimeSystem,
    stopTimeSystem,
    togglePause,
    setTimeSpeed,
    setWeather,
    updateTimeSystem,
    
    // Calculs
    calculateEnemyStrength
  };
}