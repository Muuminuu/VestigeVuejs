<template>
    <div class="game-interface">
      <!-- Header avec les 3 grands blocs -->
      <div class="game-header">
        <!-- Bloc 1: Conditions générales -->
        <div class="header-block world-conditions">
          <h3 class="block-title">Monde</h3>
          <div class="conditions-grid">
            <div class="condition-item">
              <span class="condition-label">Saison</span>
              <span class="condition-value">{{ currentSeason }}</span>
            </div>
            <div class="condition-item">
              <span class="condition-label">Jour</span>
              <span class="condition-value">{{ currentDay }}</span>
            </div>
            <div class="condition-item">
              <span class="condition-label">Heure</span>
              <span class="condition-value">{{ currentHour }}h</span>
            </div>
            <div class="condition-item">
              <span class="condition-label">Météo</span>
              <span class="condition-value">{{ currentWeather }}</span>
            </div>
            <div class="condition-item">
              <span class="condition-label">Luminosité</span>
              <span class="condition-value">{{ currentLuminosity }}</span>
            </div>
            <div class="condition-item">
              <span class="condition-label">Région</span>
              <span class="condition-value">{{ currentRegion }}</span>
            </div>
          </div>
        </div>
        
        <!-- Bloc 2: Informations du héros -->
        <div class="header-block hero-status">
          <h3 class="block-title">Héros: {{ hero.name }}</h3>
          <div class="hero-level">Niveau {{ hero.level }}</div>
          
          <div class="hero-stats">
            <div class="stat-container">
              <div class="stat-bar health-bar">
                <div class="bar-label">
                  <span class="stat-name">Santé</span>
                  <span class="stat-value">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
                </div>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
                </div>
              </div>
              
              <div class="stat-bar stamina-bar">
                <div class="bar-label">
                  <span class="stat-name">Endurance</span>
                  <span class="stat-value">{{ hero.stats.stamina || 0 }} / {{ hero.stats.maxStamina || 0 }}</span>
                </div>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: `${((hero.stats.stamina || 0) / (hero.stats.maxStamina || 1)) * 100}%` }"></div>
                </div>
              </div>
              
              <div class="stat-bar vitality-bar">
                <div class="bar-label">
                  <span class="stat-name">Vitalité</span>
                  <span class="stat-value">{{ hero.stats.vitality || 0 }} / {{ hero.stats.maxVitality || 0 }}</span>
                </div>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: `${((hero.stats.vitality || 0) / (hero.stats.maxVitality || 1)) * 100}%` }"></div>
                </div>
              </div>
            </div>
            
            <div class="additional-stats">
              <div class="stat-item">
                <span class="stat-label">ATT</span>
                <span class="stat-number">{{ hero.stats.attack }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">DEF</span>
                <span class="stat-number">{{ hero.stats.defense }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">VIT</span>
                <span class="stat-number">{{ hero.stats.speed }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bloc 3: Contrôles du jeu -->
        <div class="header-block game-controls">
          <h3 class="block-title">Actions</h3>
          <div class="controls-grid">
            <button class="control-button" @click="advanceTime">
              <span class="control-icon">⏱️</span>
              <span class="control-text">+1h</span>
            </button>
            <button class="control-button" @click="toggleView('hero-display')">
              <span class="control-icon">👤</span>
              <span class="control-text">Héros</span>
            </button>
            <button class="control-button" @click="startCombat">
              <span class="control-icon">⚔️</span>
              <span class="control-text">Combat</span>
            </button>
            <button class="control-button" @click="toggleView('inventory-view')">
              <span class="control-icon">🎒</span>
              <span class="control-text">Inventaire</span>
            </button>
            <button class="control-button" @click="toggleView('map-view')">
              <span class="control-icon">🗺️</span>
              <span class="control-text">Carte</span>
            </button>
            <button class="control-button" @click="toggleView('codex-view')">
              <span class="control-icon">📚</span>
              <span class="control-text">Codex</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contenu principal du jeu -->
      <div class="game-content">
        <!-- Combat -->
        <div v-if="currentView === 'combat-interface'" class="game-panel">
          <CombatInterface @end-combat="onCombatEnd" />
        </div>
        
        <!-- Héros -->
        <div v-else-if="currentView === 'hero-display'" class="game-panel">
          <HeroDisplay :hero="hero" />
        </div>
        
        <!-- Inventaire -->
        <div v-else-if="currentView === 'inventory-view'" class="game-panel">
          <InventoryView :inventory="inventory" />
        </div>
        
        <!-- Quêtes -->
        <div v-else-if="currentView === 'quests-view'" class="game-panel">
          <QuestsView :quests="quests" />
        </div>
        
        <!-- Carte -->
        <div v-else-if="currentView === 'map-view'" class="game-panel">
          <MapView />
        </div>
        
        <!-- Codex -->
        <div v-else-if="currentView === 'codex-view'" class="game-panel">
          <CodexView />
        </div>
        
        <!-- Vue par défaut -->
        <div v-else class="game-panel default-view">
          <div class="adventure-content">
            <h2>Les Terres de Vestige</h2>
            
            <p>Bienvenue dans un monde où la mort n'est pas la fin, mais le début d'un nouveau voyage. Vous êtes un Héritier, capable d'incorporer les vestiges des héros tombés pour gagner en puissance.</p>
            
            <p>Vous vous tenez à l'orée d'une forêt dense, les premiers rayons du soleil filtrant à travers les feuilles. Au loin, vous pouvez apercevoir les tours de la ville de Vestifall, centre d'étude des vestiges et refuge des Héritiers.</p>
            
            <p>Votre voyage commence ici. Que ferez-vous ?</p>
            
            <div class="adventure-actions">
              <button class="action-button" @click="exploreForest">Explorer la forêt</button>
              <button class="action-button" @click="travelToCity">Se diriger vers la ville</button>
              <button class="action-button" @click="startCombat">Combattre un ennemi</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pied de page avec actions rapides -->
      <div class="game-footer">
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.id"
            class="quick-action-button"
            @click="executeAction(action.id)"
          >
            {{ action.label }}
          </button>
        </div>
        
        <div class="game-status">
          <span v-if="gameMessage" class="game-message">{{ gameMessage }}</span>
          <span class="vestige-count">Vestiges: {{ vestigeCount }}</span>
          <button class="menu-button" @click="returnToHome">
            Menu Principal
          </button>
        </div>
      </div>
      
      <!-- Modal pour la mort du héros -->
      <div v-if="showDeathModal" class="modal death-modal">
        <div class="modal-overlay" @click="showDeathModal = false"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h3>Votre Héros Est Tombé</h3>
            <button class="close-button" @click="showDeathModal = false">×</button>
          </div>
          <div class="modal-content">
            <p>{{ hero.name }} a été vaincu. Son essence subsistera sous forme de vestige, prête à renforcer un futur héros.</p>
            
            <div class="vestige-preview">
              <h4>{{ hero.name }}'s Vestige</h4>
              <p>Niveau {{ hero.level }}</p>
              <p>Ce vestige contiendra une partie de la puissance de {{ hero.name }} et potentiellement l'une de ses capacités.</p>
            </div>
            
            <div class="modal-buttons">
              <button class="confirm-button" @click="confirmDeath">Accepter le Destin</button>
              <button class="cancel-button" @click="showDeathModal = false">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '../stores/gameStore';
  import { useTimeStore } from '../stores/timeStore';
  import HeroDisplay from '../components/HeroDisplay.vue';
  import CombatInterface from '../components/CombatInterface.vue';
  import InventoryView from './InventoryView.vue';
  import QuestsView from './QuestsView.vue';
  import MapView from './MapView.vue';
  import CodexView from './CodexView.vue';
  
  // Router et stores
  const router = useRouter();
  const gameStore = useGameStore();
  const timeStore = useTimeStore();
  
  // État réactif
  const currentView = ref('default-view');
  const gameMessage = ref('');
  const showDeathModal = ref(false);
  const vestigeCount = computed(() => gameStore.vestiges.length);
  
  // Données simulées pour démonstration
  const currentWeather = ref('Ensoleillé');
  const currentLuminosity = ref('Jour');
  const currentRegion = ref('Plaines de Vestifall');
  
  // Données temporelles
  const currentSeason = computed(() => {
    // Transformer l'énumération en format lisible
    const season = timeStore.currentTime.season || 'SPRING';
    const seasonMap = {
      'SPRING': 'Printemps',
      'SUMMER': 'Été',
      'FALL': 'Automne',
      'WINTER': 'Hiver'
    };
    return seasonMap[season] || season;
  });
  const currentDay = computed(() => timeStore.currentTime.day || 1);
  const currentHour = computed(() => timeStore.currentTime.hour || 12);
  
  // Héros
  const hero = computed(() => gameStore.hero);
  
  // Inventaire simulé
  const inventory = ref({
    equipment: {
      head: null,
      chest: { name: "Tunique du débutant", type: "Armure légère", defense: 5 },
      hands: null,
      legs: null,
      feet: { name: "Bottes de voyage", type: "Légère", defense: 2 },
      weapon: { name: "Épée courte", type: "Arme à une main", damage: 8 },
      accessory: null
    },
    items: [
      { name: "Potion de soin", type: "Consommable", description: "Restaure 50 points de vie" },
      { name: "Pain", type: "Nourriture", description: "Restaure un peu d'énergie" },
      { name: "Carte au trésor", type: "Quête", description: "Mène à un trésor caché dans les montagnes" }
    ]
  });
  
  // Quêtes simulées
  const quests = ref([
    {
      id: '1',
      title: "L'Éveil du Vestige",
      description: "Explorez les ruines anciennes où repose le premier vestige et découvrez les secrets de votre héritage.",
      status: 'active',
      difficulty: 'Facile',
      tracking: true,
      canAbandon: true,
      objectives: [
        {
          id: 'obj1-1',
          description: "Atteindre les ruines de l'Ancien Temple",
          completed: true,
          progress: false
        },
        {
          id: 'obj1-2',
          description: "Trouver l'entrée cachée des catacombes",
          completed: false,
          progress: false
        },
        {
          id: 'obj1-3',
          description: "Éliminer les gardiens corrompus",
          completed: false,
          progress: true,
          current: 2,
          target: 5
        }
      ],
      rewards: {
        experience: 500,
        gold: 200,
        items: [
          { id: 'item1', name: "Amulette du Premier Vestige", type: "Accessoire" }
        ]
      }
    }
  ]);
  
  // Actions rapides disponibles
  const quickActions = ref([
    { id: 'rest', label: 'Se reposer' },
    { id: 'explore', label: 'Explorer' },
    { id: 'talk', label: 'Parler aux habitants' },
    { id: 'camp', label: 'Établir un camp' }
  ]);
  
  // Initialisation
  onMounted(() => {
    // Charger l'état du temps
    timeStore.loadTime();
    
    // Mise à jour des conditions en fonction de l'heure
    updateWorldConditions();
  });
  
  // Méthodes pour la navigation
  function toggleView(viewName) {
    currentView.value = currentView.value === viewName ? 'default-view' : viewName;
  }
  
  function returnToHome() {
    router.push('/');
  }
  
  // Méthodes pour le temps et les conditions
  function advanceTime() {
    timeStore.advanceTime(1);
    gameMessage.value = `L'heure avance. Il est maintenant ${currentHour.value}h00.`;
    
    // Mise à jour de la météo et de la luminosité en fonction de l'heure
    updateWorldConditions();
    
    // Effacer le message après un délai
    setTimeout(() => {
      gameMessage.value = '';
    }, 3000);
  }
  
  function updateWorldConditions() {
    // Mise à jour de la luminosité en fonction de l'heure
    if (currentHour.value >= 6 && currentHour.value < 10) {
      currentLuminosity.value = 'Aube';
    } else if (currentHour.value >= 10 && currentHour.value < 18) {
      currentLuminosity.value = 'Jour';
    } else if (currentHour.value >= 18 && currentHour.value < 22) {
      currentLuminosity.value = 'Crépuscule';
    } else {
      currentLuminosity.value = 'Nuit';
    }
    
    // Simuler un changement de météo aléatoire
    if (Math.random() < 0.2) {
      const weathers = ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Brumeux', 'Orageux'];
      currentWeather.value = weathers[Math.floor(Math.random() * weathers.length)];
    }
  }
  
  // Méthodes pour le combat
  function startCombat() {
    currentView.value = 'combat-interface';
    gameMessage.value = 'Combat initié!';
  }
  
  function onCombatEnd(result) {
    currentView.value = 'default-view';
    gameMessage.value = result?.victory ? 'Victoire!' : 'Défaite...';
    
    // Effacer le message après un délai
    setTimeout(() => {
      gameMessage.value = '';
    }, 3000);
  }
  
  // Méthodes pour la mort du héros
  function simulateDeath() {
    showDeathModal.value = true;
  }
  
  function confirmDeath() {
    gameStore.handleHeroDeath();
    showDeathModal.value = false;
    router.push('/');
  }
  
  // Méthodes pour l'aventure
  function executeAction(actionId) {
    switch (actionId) {
      case 'rest':
        gameMessage.value = 'Vous vous reposez et récupérez de l\'énergie.';
        // Logique de repos (récupérer des points de vie/endurance)
        if (hero.value) {
          const newHealth = Math.min(hero.value.stats.maxHealth, hero.value.stats.currentHealth + 20);
          const newStamina = Math.min(hero.value.stats.maxStamina || 100, (hero.value.stats.stamina || 0) + 30);
          
          gameStore.updateHeroStats({
            currentHealth: newHealth,
            stamina: newStamina
          });
        }
        // Avancer le temps
        timeStore.advanceTime(1);
        updateWorldConditions();
        break;
        
      case 'explore':
        gameMessage.value = 'Vous explorez les environs...';
        // Logique d'exploration (chance de trouver des objets, rencontrer des ennemis, etc.)
        if (Math.random() < 0.3) {
          // 30% de chance de rencontrer un ennemi
          startCombat();
        } else if (Math.random() < 0.4) {
          // 40% de chance de trouver quelque chose d'intéressant
          gameMessage.value = 'Vous avez trouvé quelque chose d\'intéressant!';
          // TODO: Ajouter la logique pour trouver des objets ou découvrir des lieux
        }
        // Avancer le temps
        timeStore.advanceTime(2);
        updateWorldConditions();
        break;
        
      case 'talk':
        gameMessage.value = 'Vous discutez avec les habitants locaux.';
        // Logique de dialogue (obtenir des informations, quêtes, etc.)
        // TODO: Implémenter un système de dialogue
        // Avancer le temps
        timeStore.advanceTime(1);
        updateWorldConditions();
        break;
        
      case 'camp':
        gameMessage.value = 'Vous établissez un camp pour la nuit.';
        // Logique de campement (repos complet, avancer le temps jusqu'au matin, etc.)
        if (hero.value) {
          gameStore.updateHeroStats({
            currentHealth: hero.value.stats.maxHealth,
            stamina: hero.value.stats.maxStamina || 100,
            vitality: hero.value.stats.maxVitality || 50
          });
        }
        // Avancer le temps jusqu'au matin
        const hoursUntilMorning = (24 - currentHour.value + 6) % 24;
        timeStore.advanceTime(hoursUntilMorning || 6);
        updateWorldConditions();
        break;
    }
    
    // Effacer le message après un délai
    setTimeout(() => {
      gameMessage.value = '';
    }, 3000);
  }
  
  // Actions d'aventure spécifiques
  function exploreForest() {
    gameMessage.value = "Vous vous enfoncez dans la forêt dense, à la recherche de secrets oubliés...";
    timeStore.advanceTime(2);
    updateWorldConditions();
    
    if (Math.random() < 0.4) {
      setTimeout(() => {
        startCombat();
      }, 1500);
    } else {
      setTimeout(() => {
        gameMessage.value = "Vous découvrez un ancien autel couvert de mousse et de lierre.";
      }, 1500);
    }
  }
  
  function travelToCity() {
    gameMessage.value = "Vous vous dirigez vers Vestifall, la ville s'agrandit à l'horizon...";
    timeStore.advanceTime(3);
    updateWorldConditions();
    currentRegion.value = "Vestifall";
    
    setTimeout(() => {
      gameMessage.value = "Vous arrivez aux portes de Vestifall, la cité des Héritiers.";
    }, 1500);
  }
  </script>
  
  <style scoped>
  /* Styles généraux */
  /* .game-interface {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  } */

  /* .game-interface {
    display: flex;
    flex-direction: column;
    width: 100%; 
    height: 100vh;
    overflow: hidden;
    background-color: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    } */
    .game-interface {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #0d1117;
  color: #e6edf3;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  max-width: 1440px; /* Limit maximum width but don't add margins */
}
.game-header, 
.game-content,
.game-footer {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding-left: 15px;
  padding-right: 15px;
}

/* For smaller screens, reduce padding */
@media (max-width: 768px) {
  .game-header,
  .game-content,
  .game-footer {
    padding-left: 10px;
    padding-right: 10px;
  }
}
  
  /* En-tête du jeu */
  /* .game-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
    background-color: #161b22;
    border-bottom: 1px solid #30363d;
  } */
  /* .game-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px 5px;
    background-color: #161b22;
    border-bottom: 1px solid #30363d;
    width: 100%;
    box-sizing: border-box;
    } */
    .game-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px; /* Plus d'espace entre les colonnes */
    padding: 15px;
    background-color: #161b22;
    border-bottom: 1px solid #30363d;
    width: 100%;
    box-sizing: border-box;
  }

  .header-block {
    padding: 10px;
    background-color: #0d1117;
    border-radius: 8px;
    border: 1px solid #30363d;
  }
  
  .block-title {
    margin-top: 0;
    margin-bottom: 10px;
    color: #58a6ff;
    font-size: 1.1rem;
    border-bottom: 1px solid #30363d;
    padding-bottom: 5px;
  }
  
  /* Conditions du monde */
  .conditions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .condition-item {
    display: flex;
    flex-direction: column;
  }
  
  .condition-label {
    font-size: 0.8rem;
    color: #8b949e;
  }
  
  .condition-value {
    font-weight: bold;
    color: #c9d1d9;
  }
  
  /* Statut du héros */
  .hero-level {
    background-color: rgba(88, 166, 255, 0.2);
    color: #58a6ff;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 10px;
  }
  
  .hero-stats {
    display: flex;
    justify-content: space-between;
  }
  
  .stat-container {
    flex: 1;
    margin-right: 15px;
  }
  
  .stat-bar {
    margin-bottom: 8px;
  }
  
  .bar-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
  }
  
  .stat-name {
    font-size: 0.8rem;
    color: #8b949e;
  }
  
  .stat-value {
    font-size: 0.8rem;
    color: #c9d1d9;
  }
  
  .bar-container {
    height: 8px;
    background-color: #21262d;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .health-bar .bar-fill {
    background-color: #3fb950;
  }
  
  .stamina-bar .bar-fill {
    background-color: #f0883e;
  }
  
  .vitality-bar .bar-fill {
    background-color: #8957e5;
  }
  
  .additional-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #21262d;
    padding: 5px 10px;
    border-radius: 6px;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 0.7rem;
    color: #8b949e;
  }
  
  .stat-number {
    font-weight: bold;
    color: #c9d1d9;
  }
  
  /* Contrôles du jeu */
  /* .controls-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  } */
  .controls-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Passé de 3 à 2 colonnes */
    gap: 6px;
    }
  
  /* .control-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 8px 5px;
    cursor: pointer;
    transition: all 0.2s ease;
  } */
  .control-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 65px; /* Hauteur minimale pour uniformité */
    width: 100%; /* Prend toute la largeur disponible */
  }
  
  .control-button:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }
  
  .control-icon {
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  
  /* .control-text {
    font-size: 0.8rem;
    color: #c9d1d9;
  } */
  .control-text {
    font-size: 0.75rem; /* Taille de texte plus petite */
    color: #c9d1d9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }
  
  /* Contenu principal du jeu */
  /* .game-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #0d1117;
  } */
  /* .game-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px 5px; 
    background-color: #0d1117;
    width: 100%;
    box-sizing: border-box;
    } */

    .game-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #0d1117;
  width: 100%;
  box-sizing: border-box;
}
  
  .game-panel {
    background-color: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .default-view {
    padding: 20px;
  }
  
  /* .adventure-content {
    max-width: 800px;
    margin: 0 auto;
  } */
  .adventure-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
  
  .adventure-content h2 {
    color: #58a6ff;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .adventure-content p {
    color: #c9d1d9;
    line-height: 1.6;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }
  
  /* .adventure-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 30px;
  } */
  .adventure-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}
  
  /* .action-button {
    background-color: #238636;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.2s ease;
  } */
  .action-button {
  background-color: #238636;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  min-width: 180px; /* Largeur minimale pour uniformité */
}
  
  .action-button:hover {
    background-color: #2ea043;
    transform: translateY(-2px);
  }
  
  /* Pied de page */
  /* .game-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #161b22;
    border-top: 1px solid #30363d;
  } */
  /* .game-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px; 
    background-color: #161b22;
    border-top: 1px solid #30363d;
    width: 100%;
    box-sizing: border-box;
    } */
  
    /* .game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #161b22;
  border-top: 1px solid #30363d;
  width: 100%;
  box-sizing: border-box;
} */
.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #161b22;
  border-top: 1px solid #30363d;
  width: 100%;
  box-sizing: border-box;
}

  /* .quick-actions {
    display: flex;
    gap: 10px;
  } */

  .quick-actions {
  display: flex;
  justify-content: center; /* Centre les actions */
  gap: 10px;
  flex-wrap: wrap; /* Pour responsive */
}
  
  /* .quick-action-button {
    background-color: #21262d;
    border: 1px solid #30363d;
    color: #c9d1d9;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  } */

  .quick-action-button {
  background-color: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px; /* Largeur minimale pour uniformité */
  text-align: center;
}
  
  .quick-action-button:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }
  
  .game-status {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .game-message {
    color: #58a6ff;
    font-style: italic;
  }
  
  .vestige-count {
    background-color: rgba(138, 43, 226, 0.2);
    color: #d2a8ff;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .menu-button {
    background-color: #21262d;
    border: 1px solid #30363d;
    color: #c9d1d9;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-button:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }
  
  /* Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
  }
  
  .modal-container {
    position: relative;
    width: 90%;
    max-width: 500px;
    background-color: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #21262d;
    border-bottom: 1px solid #30363d;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #ff4d4f;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #8b949e;
    font-size: 24px;
    cursor: pointer;
    line-height: 24px;
    transition: color 0.2s;
  }
  
  .close-button:hover {
    color: #c9d1d9;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .vestige-preview {
    background-color: rgba(88, 166, 255, 0.1);
    border: 1px solid rgba(88, 166, 255, 0.3);
    padding: 15px;
    border-radius: 6px;
    margin: 20px 0;
  }
  
  .vestige-preview h4 {
    color: #58a6ff;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .vestige-preview p {
    color: #c9d1d9;
    margin: 5px 0;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .confirm-button, .cancel-button {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .confirm-button {
    background-color: #238636;
    color: white;
    border: none;
  }
  
  .confirm-button:hover {
    background-color: #2ea043;
  }
  
  .cancel-button {
    background-color: #21262d;
    color: #c9d1d9;
    border: 1px solid #30363d;
  }
  
  .cancel-button:hover {
    background-color: #30363d;
  }
  
  /* Responsive design */
  @media (max-width: 1024px) {
    .game-header {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
    
    .game-controls {
      grid-column: span 2;
    }
    
    .additional-stats {
      flex-direction: row;
      margin-top: 10px;
    }
    
    .stat-item {
      margin-right: 5px;
      margin-bottom: 0;
    }
  }
  
  @media (max-width: 768px) {
    .game-header {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .action-button {
      width: 100%;
    }
    
    .game-controls {
      grid-column: 1;
    }
    
    .conditions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .quick-actions {
      flex-wrap: wrap;
    }
    
    .quick-action-button {
      flex: 1;
      min-width: 120px;
    }
    
    .game-footer {
      flex-direction: column;
      gap: 10px;
    }
    
    .game-status {
      width: 100%;
      justify-content: space-between;
    }
  }

  </style>