<template>
    <div class="game-view">
      <div class="game-header">
        <div class="header-info-container">
          <div class="header-info hero-info" v-if="hero">
            <div class="hero-name">{{ hero.name }}</div>
            <div class="hero-level">Niveau {{ hero.level }}</div>
            
            <div class="stat-bars">
              <div class="stat-bar health-bar">
                <span class="stat-label">Santé:</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
                  <span class="bar-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
                </div>
              </div>
              
              <div class="stat-bar stamina-bar">
                <span class="stat-label">Endurance:</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: `${(hero.stats.stamina / hero.stats.maxStamina) * 100}%` }"></div>
                  <span class="bar-text">{{ hero.stats.stamina }} / {{ hero.stats.maxStamina }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="header-info progress-info" v-if="hero">
            <!-- Informations sur la progression -->
            <div class="deferment-level" v-if="defermentLevel > 0">Niveau de Déferlement: {{ defermentLevel }}</div>
          </div>
          
          <div class="header-info status-info" v-if="hero">
            <!-- Statuts et effets actifs -->
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <div class="game-sidebar">
          <button 
            v-for="view in views" 
            :key="view.id"
            class="nav-button"
            :class="{ active: currentView === view.id }"
            @click="currentView = view.id"
          >
            {{ view.label }}
          </button>
        </div>
        
        <div class="game-main">
          <decorative-frame :theme="frameTheme" :level="frameMagicLevel">
            <!-- Affichage du composant de création de héros si nécessaire -->
            <hero-creation v-if="showHeroCreation" @hero-created="onHeroCreated" />
            
            <!-- Affichage du combat si actif -->
            <combat-interface v-else-if="showCombat" @end-combat="endCombat" />
            
            <!-- Affichage du composant de vue actuel si un héros existe -->
            <component :is="currentViewComponent" v-else-if="hero" />
            
            <!-- Message par défaut si aucun héros n'existe -->
            <div v-else class="no-hero">
              <p>Vous n'avez pas de héros actif. Créez un nouveau héros pour commencer votre aventure.</p>
              <button class="action-button" @click="showHeroCreation = true">Créer un Héros</button>
            </div>
          </decorative-frame>
          
          <!-- Boutons d'action en bas de l'écran si un héros existe -->
          <div class="action-buttons" v-if="hero && !showCombat && !showHeroCreation">
            <button class="action-button combat-button" @click="startCombat">
              Partir en Combat
            </button>
            <button class="action-button death-button" @click="simulateDeath">
              Simuler la Mort
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal pour la mort du héros -->
      <div v-if="showDeathModal" class="death-modal">
        <div class="death-modal-content">
          <h2>Votre Héros Est Tombé</h2>
          
          <p>{{ hero?.name }} a été vaincu. Son essence subsistera sous forme de vestige, prête à renforcer un futur héros.</p>
          
          <div class="vestige-preview" v-if="hero">
            <h3>{{ hero.name }}'s Vestige</h3>
            <p>Niveau {{ hero.level }}</p>
            <p>Ce vestige contiendra une partie de la puissance de {{ hero.name }} et potentiellement l'une de ses capacités.</p>
          </div>
          
          <div class="action-buttons">
            <button class="confirm-button" @click="confirmDeath">Accepter le Destin</button>
            <button class="cancel-button" @click="cancelDeath">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useGameStore } from '../stores/gameStore'
  import DecorativeFrame from '../components/DecorativeFrame.vue'
  import HeroCreation from '../components/HeroCreation.vue'
  import CombatInterface from '../components/CombatInterface.vue'
  import { HeroView, InventoryView, QuestsView, MapView, CodexView } from '../components/views'
  
  // Store du jeu
  const gameStore = useGameStore()
  const hero = computed(() => gameStore.hero)
  
  // Gestion des vues
  const currentView = ref('hero')
  const showHeroCreation = ref(false)
  const showCombat = ref(false)
  const showDeathModal = ref(false)
  
  // Thème du cadre décoratif
  const frameTheme = ref('default')
  const frameMagicLevel = ref(1)
  const defermentLevel = ref(0) // À implémenter dans votre logique de jeu
  
  // Définition des vues disponibles
  const views = [
    { id: 'hero', label: 'Héros', component: HeroView },
    { id: 'inventory', label: 'Inventaire', component: InventoryView },
    { id: 'quests', label: 'Quêtes', component: QuestsView },
    { id: 'map', label: 'Carte', component: MapView },
    { id: 'codex', label: 'Codex', component: CodexView }
  ]
  
  // Composant à afficher selon la navigation
  const currentViewComponent = computed(() => {
    const view = views.find(v => v.id === currentView.value)
    return view ? view.component : null
  })
    
  // Vérifie si un héros existe, sinon affiche la création de héros
  function checkHeroExists() {
    if (!hero.value && !showHeroCreation.value) {
      showHeroCreation.value = true
    }
  }
    
  // Au chargement, vérifie si un héros existe
  checkHeroExists()
    
  // Gestion du combat
  function startCombat() {
    showCombat.value = true
  }
    
  function endCombat() {
    showCombat.value = false
  }
    
  // Gestion de la création du héros
  function onHeroCreated() {
    showHeroCreation.value = false
  }
    
  // Gestion de la mort du héros
  function simulateDeath() {
    showDeathModal.value = true
  }
    
  function confirmDeath() {
    gameStore.handleHeroDeath()
    showDeathModal.value = false
    
    // Après la mort, si aucun héros n'est actif, montrer la création
    checkHeroExists()
  }
    
  function cancelDeath() {
    showDeathModal.value = false
  }
    
  // Mise à jour du thème du cadre selon le niveau du héros ou d'autres facteurs
  function updateFrameTheme() {
    if (!hero.value) {
      frameTheme.value = 'default'
      frameMagicLevel.value = 1
      return
    }
    
    const level = hero.value.level
    
    if (defermentLevel.value > 0) {
      frameTheme.value = 'deferment'
      frameMagicLevel.value = Math.min(defermentLevel.value + 1, 5)
    } else if (level >= 15) {
      frameTheme.value = 'arcane'
      frameMagicLevel.value = 5
    } else if (level >= 10) {
      frameTheme.value = 'nature'
      frameMagicLevel.value = 4
    } else if (level >= 5) {
      frameTheme.value = 'fire'
      frameMagicLevel.value = 3
    } else if (level >= 2) {
      frameTheme.value = 'default'
      frameMagicLevel.value = 2
    } else {
      frameTheme.value = 'default'
      frameMagicLevel.value = 1
    }
  }
    
  // Observer les changements de héros pour mettre à jour le thème
  watch(() => hero.value?.level, () => {
    updateFrameTheme()
  }, { immediate: true })
  </script>
    
  <style scoped>
  /* Styles généraux */
  .game-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
    
  /* En-tête du jeu */
  .game-header {
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
    
  .header-info-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
    
  .header-info {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 6px;
  }
    
  .hero-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1890ff;
  }
    
  .hero-level, .deferment-level {
    display: inline-block;
    padding: 3px 8px;
    background-color: #e6f7ff;
    color: #1890ff;
    border-radius: 12px;
    font-size: 0.9rem;
    margin-top: 5px;
  }
    
  .deferment-level {
    background-color: #fff2e8;
    color: #fa541c;
  }
    
  /* Barres de statistiques */
  .stat-bar {
    margin-bottom: 8px;
  }
    
  .stat-label {
    font-weight: bold;
    display: inline-block;
    width: 90px;
  }
    
  .bar-container {
    display: inline-block;
    width: calc(100% - 100px);
    height: 15px;
    background-color: #f0f0f0;
    border-radius: 7px;
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
    
  .vitality-bar .bar-fill {
    background-color: #722ed1;
  }
    
  .energy-bar .bar-fill {
    background-color: #1890ff;
  }
    
  .bar-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    color: #333;
    line-height: 15px;
  }
    
  /* Contenu principal */
  .game-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
    
  /* Barre latérale */
  .game-sidebar {
    width: 200px;
    background-color: #fff;
    border-right: 1px solid #ddd;
    padding: 15px;
  }
    
  .nav-button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 12px 15px;
    margin-bottom: 10px;
    background-color: transparent;
    border: 1px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }
    
  .nav-button:hover {
    background-color: #f0f0f0;
  }
    
  .nav-button.active {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
    
  /* Zone principale */
  .game-main {
    flex: 1;
    padding: 20px;
    overflow: auto;
    position: relative;
  }
    
  /* Boutons d'action */
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
    
  .action-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
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
    
  /* Modal de mort du héros */
  .death-modal {
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
    
  .death-modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
    
  .death-modal-content h2 {
    color: #ff4d4f;
    margin-top: 0;
  }
    
  .vestige-preview {
    margin: 30px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
    
  .vestige-preview h3 {
    margin-top: 0;
    color: #1890ff;
  }
    
  .death-modal .action-buttons {
    margin-top: 30px;
  }
    
  .confirm-button {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
    
  .confirm-button:hover {
    background-color: #40a9ff;
  }
    
  .cancel-button {
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.65);
    border: 1px solid #d9d9d9;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
    
  .cancel-button:hover {
    background-color: #fafafa;
  }
    
  /* Responsive */
  @media (max-width: 1024px) {
    .header-info-container {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    
    .game-sidebar {
      width: 150px;
    }
  }
    
  @media (max-width: 768px) {
    .game-content {
      flex-direction: column;
    }
    
    .game-sidebar {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
    }
    
    .nav-button {
      width: auto;
      margin-bottom: 0;
    }
    
    .game-main {
      padding: 10px;
    }
  }
  </style>