<template>
    <div class="game-page">
      <!-- En-tête du jeu -->
      <header class="game-header">
        <div v-if="hero" class="hero-info">
          <h2 class="hero-name">{{ hero.name }}</h2>
          <div class="hero-level">Niveau {{ hero.level }}</div>
          
          <div class="hero-stats">
            <div class="stat-bar health-bar">
              <span class="stat-label">Santé</span>
              <div class="bar-container">
                <div class="bar-fill" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
                <span class="bar-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
              </div>
            </div>
            
            <div class="stat-bar stamina-bar">
              <span class="stat-label">Endurance</span>
              <div class="bar-container">
                <div class="bar-fill" :style="{ width: `${(hero.stats.stamina / hero.stats.maxStamina) * 100}%` }"></div>
                <span class="bar-text">{{ hero.stats.stamina }} / {{ hero.stats.maxStamina }}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2>Temps actuel</h2>
          <p>Année : {{ currentYear }}</p>
          <p>Saison : {{ currentSeason }}</p>
          <p>Jour : {{ currentDay }}</p>
          <p>Heure : {{ currentHour }}</p>
          <button @click="advanceTime">Avancer d'une heure</button>
        </div>
        
        <div class="menu-buttons">
          <button class="menu-button" @click="returnToHome">
            Menu Principal
          </button>
        </div>
      </header>
      
      <!-- Contenu principal -->
      <main class="game-content">
        <nav class="game-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="nav-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>
        
        <div class="game-main">
          <!-- Combat -->
          <div v-if="showCombat" class="game-panel">
            <combat-interface @end-combat="endCombat" />
          </div>
          
          <!-- Héros -->
          <div v-else-if="activeTab === 'hero'" class="game-panel">
            <hero-display :hero="hero" />
          </div>
          
          <!-- Inventaire -->
          <div v-else-if="activeTab === 'inventory'" class="game-panel">
            <inventory-view :inventory="inventory" />
          </div>
          
          <!-- Quêtes -->
          <div v-else-if="activeTab === 'quests'" class="game-panel">
            <quests-view :quests="quests" />
          </div>
          
          <!-- Carte -->
          <div v-else-if="activeTab === 'map'" class="game-panel">
            <map-view />
          </div>
          
          <!-- Codex -->
          <div v-else-if="activeTab === 'codex'" class="game-panel">
            <codex-view />
          </div>
        </div>
      </main>
      
      <!-- Boutons d'action -->
      <div class="game-actions" v-if="!showCombat">
        <button class="action-button combat-button" @click="startCombat">
          Partir en Combat
        </button>
        <button class="action-button death-button" @click="showDeathModal = true">
          Simuler la Mort
        </button>
      </div>
      
      <!-- Modal de mort du héros -->
      <div v-if="showDeathModal" class="modal death-modal">
        <div class="modal-content">
          <h2>Votre Héros Est Tombé</h2>
          <p>{{ hero.name }} a été vaincu. Son essence subsistera sous forme de vestige, prête à renforcer un futur héros.</p>
          
          <div class="modal-buttons">
            <button class="modal-button confirm-button" @click="confirmDeath">
              Accepter le Destin
            </button>
            <button class="modal-button cancel-button" @click="showDeathModal = false">
              Annuler
            </button>
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
  
  // Composants
  import HeroDisplay from '../components/HeroDisplay.vue';
  import InventoryView from '../views/InventoryView.vue';
  import QuestsView from '../views/QuestsView.vue';
  import MapView from '../views/MapView.vue';
  import CodexView from '../views/CodexView.vue';
  import CombatInterface from '../components/CombatInterface.vue';
  
  const router = useRouter();
  const gameStore = useGameStore();
  const timeStore = useTimeStore();

  // État
  const activeTab = ref('hero');
  const showCombat = ref(false);
  const showDeathModal = ref(false);
  
  // Données réactives pour le temps
  const currentYear = computed(() => timeStore.state.year);
  const currentSeason = computed(() => timeStore.state.season);
  const currentDay = computed(() => timeStore.state.day);
  const currentHour = computed(() => timeStore.state.hour);

  // Données
  const hero = computed(() => gameStore.hero);
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
  
  // Onglets de navigation
  const tabs = [
    { id: 'hero', label: 'Héros' },
    { id: 'inventory', label: 'Inventaire' },
    { id: 'quests', label: 'Quêtes' },
    { id: 'map', label: 'Carte' },
    { id: 'codex', label: 'Codex' }
  ];
  
  // Méthodes
  function advanceTime() {
    timeStore.advanceTime(1); // Avancer d'une heure via le TimeStore
  }

  function returnToHome() {
    router.push('/');
  }
  
  function startCombat() {
    showCombat.value = true;
  }
  
  function endCombat() {
    showCombat.value = false;
  }
  
  function confirmDeath() {
    gameStore.handleHeroDeath();
    showDeathModal.value = false;
    router.push('/');
  }

  // Vérification initiale
  onMounted(() => {
    if (!hero.value) {
      router.push('/');
      timeStore.loadTime(); // Charger l'état du temps au montage
    }
  });
  </script>
  
  <style scoped>
  .game-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f0f2f5;
    color: #333;
  }
  
  /* En-tête */
  .game-header {
    background-color: #fff;
    padding: 15px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .hero-info {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .hero-name {
    margin: 0;
    font-size: 1.5rem;
    color: #1890ff;
  }
  
  .hero-level {
    background-color: #e6f7ff;
    color: #1890ff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .hero-stats {
    display: flex;
    gap: 15px;
    flex-grow: 1;
    max-width: 500px;
  }
  
  .stat-bar {
    flex: 1;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 4px;
    display: block;
  }
  
  .bar-container {
    height: 12px;
    background-color: #f0f0f0;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  
  .bar-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .health-bar .bar-fill {
    background-color: #52c41a;
  }
  
  .stamina-bar .bar-fill {
    background-color: #faad14;
  }
  
  .bar-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #333;
  }
  
  .menu-button {
    background-color: #f0f0f0;
    border: 1px solid #d9d9d9;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-button:hover {
    background-color: #e6f7ff;
    color: #1890ff;
    border-color: #1890ff;
  }
  
  /* Contenu principal */
  .game-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .game-nav {
    width: 180px;
    background-color: #fff;
    padding: 20px 10px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .nav-button {
    padding: 12px 15px;
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }
  
  .nav-button:hover {
    background-color: #f5f5f5;
  }
  
  .nav-button.active {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
  
  .game-main {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .game-panel {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    min-height: calc(100% - 40px);
  }
  
  /* Actions */
  .game-actions {
    background-color: #fff;
    padding: 15px 20px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .action-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
  }
  
  .combat-button {
    background-color: #1890ff;
    color: white;
  }
  
  .combat-button:hover {
    background-color: #40a9ff;
  }
  
  .death-button {
    background-color: #ff4d4f;
    color: white;
  }
  
  .death-button:hover {
    background-color: #ff7875;
  }
  
  /* Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  .modal-content h2 {
    color: #ff4d4f;
    margin-top: 0;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .modal-button {
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    border: none;
  }
  
  .confirm-button {
    background-color: #1890ff;
    color: white;
  }
  
  .confirm-button:hover {
    background-color: #40a9ff;
  }
  
  .cancel-button {
    background-color: #f0f0f0;
    color: #666;
    border: 1px solid #d9d9d9;
  }
  
  .cancel-button:hover {
    background-color: #fafafa;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .game-content {
      flex-direction: column;
    }
    
    .game-nav {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      padding: 10px;
    }
    
    .nav-button {
      white-space: nowrap;
    }
    
    .hero-info {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .hero-stats {
      width: 100%;
    }
  }
  </style>