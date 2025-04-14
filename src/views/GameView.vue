<template>
  <div class="game-view">
    <div class="game-header" v-if="hero">
      <div class="header-info-container">
        <div class="header-info hero-info">
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
      </div>
    </div>
    
    <div class="game-content">
      <div class="game-sidebar" v-if="hero">
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
        <!-- Affichage du composant de création de héros si nécessaire -->
        <hero-creation v-if="showHeroCreation" @hero-created="onHeroCreated" />
          
        <!-- Affichage du combat si actif -->
        <combat-interface v-else-if="showCombat && hero" @end-combat="endCombat" />
          
        <!-- Affichage du composant de vue actuel si un héros existe -->
        <div v-else-if="hero && currentView === 'hero'">
          <hero-display :hero="hero" />
        </div>
        
        <div v-else-if="hero && currentView === 'inventory'">
          <inventory-view :inventory="heroInventory" />
        </div>
        
        <div v-else-if="hero && currentView === 'quests'">
          <quests-view :quests="quests" />
        </div>
        
        <div v-else-if="hero && currentView === 'map'">
          <map-view />
        </div>
        
        <div v-else-if="hero && currentView === 'codex'">
          <codex-view />
        </div>
          
        <!-- Message par défaut si aucun héros n'existe -->
        <div v-else class="no-hero">
          <p>Vous n'avez pas de héros actif. Créez un nouveau héros pour commencer votre aventure.</p>
          <button class="action-button" @click="showHeroCreation = true">Créer un Héros</button>
        </div>
        
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

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import HeroCreation from '../components/HeroCreation.vue'
import CombatInterface from '../components/CombatInterface.vue'
import HeroDisplay from '../components/HeroDisplay.vue'
import MapView from './MapView.vue'
import InventoryView from './InventoryView.vue'
import QuestsView from './QuestsView.vue' 
import CodexView from './CodexView.vue'

// Store du jeu
const gameStore = useGameStore()
const hero = computed(() => gameStore.hero)

// Gestion des vues
const currentView = ref('hero')
const showHeroCreation = ref(false)
const showCombat = ref(false)
const showDeathModal = ref(false)

// Données simulées pour le test
const heroInventory = computed(() => {
  return {
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
  }
})

// Quêtes simulées pour le test
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
])

// Définition des vues disponibles
const views = [
  { id: 'hero', label: 'Héros' },
  { id: 'inventory', label: 'Inventaire' },
  { id: 'quests', label: 'Quêtes' },
  { id: 'map', label: 'Carte' },
  { id: 'codex', label: 'Codex' }
]

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
  
  // Réinitialiser la vue courante pour revenir au combat après
  if (currentView.value !== 'hero') {
    currentView.value = 'hero'
  }
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

// Observer les changements de héros
watch(() => hero.value, (newHero) => {
  if (!newHero && !showHeroCreation.value) {
    showHeroCreation.value = true
  }
})
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

.hero-level {
  display: inline-block;
  padding: 3px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-top: 5px;
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

/* Message quand pas de héros */
.no-hero {
  text-align: center;
  padding: 40px;
  background-color: #f0f2f5;
  border-radius: 8px;
  margin-bottom: 20px;
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