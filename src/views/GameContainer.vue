<template>
  <div class="game-container" @keydown="handleKeyPress" tabindex="0" ref="gameContainer">
    <!-- Menu plein écran quand il est visible -->
    <GameMenu 
      v-if="isMenuVisible" 
      :hero="hero"
      :activeTab="activeTab"
      :tabs="navigationTabs"
      @close="closeMenu"
      @select-tab="selectTab"
      @start-combat="startCombat"
      @simulate-death="simulateDeath"
    />

    <!-- Indicateur de menu (visible seulement quand le menu est caché) -->
    <div class="menu-indicator" v-if="!isMenuVisible" @click="openMenu">
      <span class="indicator-icon">☰</span>
      <span class="indicator-text">Menu (ESC)</span>
    </div>

    <!-- Cadre principal du jeu (toujours visible) -->
    <div class="main-frame" :class="{ blurred: isMenuVisible }">
      <DecorativeFrame :theme="frameTheme" :level="frameLevel">
        <!-- Contenu du cadre qui change selon l'onglet actif -->
        <component 
          :is="getCurrentView()" 
          :hero="hero"
          :inventory="inventory"
          :quests="quests"
          :selectedPOI="selectedPOI"
          @select-poi="selectPOI"
        />
      </DecorativeFrame>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import GameMenu from './GameMenu.vue';
import DecorativeFrame from './DecorativeFrame.vue';
import HeroView from './HeroView.vue';
import InventoryView from './InventoryView.vue';
import QuestsView from './QuestsView.vue';
import MapView from './MapView.vue';
import CodexView from './CodexView.vue';

// État du menu
const isMenuVisible = ref(false);
const gameContainer = ref(null);

// Données du héros
const hero = ref({
  name: 'Héros Test',
  level: 1,
  stats: {
    currentHealth: 23,
    maxHealth: 100,
    currentStamina: 80,
    maxStamina: 80,
    attack: 15,
    defense: 10,
    speed: 8,
    healthRegen: 1
  },
  experience: 0,
  experienceForNextLevel: 100,
  abilities: [
    {
      name: 'Frappe Puissante',
      type: 'PHYSIQUE',
      description: 'Une attaque puissante qui inflige 120% de dégâts.'
    }
  ],
  vestiges: [
    {
      name: 'Vestige de Test',
      level: 1,
      description: 'Accorde une partie du pouvoir de test.'
    }
  ]
});

// Données pour le cadre décoratif
const frameTheme = ref('default');
const frameLevel = ref(1);

// Onglets de navigation principaux
const activeTab = ref('hero');
const navigationTabs = [
  { id: 'hero', label: 'Héros' },
  { id: 'inventory', label: 'Inventaire' },
  { id: 'quests', label: 'Quêtes' },
  { id: 'map', label: 'Carte' },
  { id: 'codex', label: 'Codex' }
];

// Données d'inventaire simplifiées
const inventory = ref({
  equipment: {
    head: null,
    chest: null,
    hands: null,
    legs: null,
    feet: null,
    weapon: { name: "Épée du débutant", type: "Arme", rarity: "Commun" },
    accessory: null
  },
  items: [
    { name: "Potion de santé", type: "Consommable", description: "Restaure 50 points de vie" },
    { name: "Parchemin d'identification", type: "Consommable", description: "Identifie un objet magique" },
    null,
    null,
    { name: "Pépite d'or", type: "Matériau", description: "Valeur marchande élevée" },
    null,
    null,
    null
  ]
});

// Données pour les quêtes
const quests = ref([
  {
    id: '1',
    title: "L'Éveil du Vestige",
    description: "Explorez les ruines anciennes où repose le premier vestige.",
    status: 'active',
    difficulty: 'Modéré',
    tracking: true,
    canAbandon: true,
    objectives: [
      { id: 'obj1', description: "Atteindre les ruines", completed: true },
      { id: 'obj2', description: "Trouver l'entrée cachée", completed: false },
      { id: 'obj3', description: "Éliminer les gardiens", completed: false, progress: true, current: 2, target: 5 }
    ]
  },
  {
    id: '2',
    title: "La Cargaison Perdue",
    description: "Retrouvez une caravane marchande disparue dans les Collines Brumeuses.",
    status: 'completed',
    difficulty: 'Facile',
    tracking: false,
    canAbandon: false,
    objectives: [
      { id: 'obj4', description: "Enquêter sur la dernière position connue", completed: true },
      { id: 'obj5', description: "Retrouver les marchands", completed: true }
    ]
  }
]);

// Données pour la carte
const selectedPOI = ref(null);

// Fonctions de gestion du menu
function openMenu() {
  isMenuVisible.value = true;
}

function closeMenu() {
  isMenuVisible.value = false;
}

// Obtenir le composant de vue actif
function getCurrentView() {
  switch (activeTab.value) {
    case 'hero': return HeroView;
    case 'inventory': return InventoryView;
    case 'quests': return QuestsView;
    case 'map': return MapView;
    case 'codex': return CodexView;
    default: return HeroView;
  }
}

// Gestionnaire d'événements pour les touches clavier
function handleKeyPress(event: KeyboardEvent) {
  // Échap pour afficher/masquer le menu
  if (event.key === 'Escape') {
    isMenuVisible.value = !isMenuVisible.value;
  }
  // Tab pour basculer entre les onglets
  else if (event.key === 'Tab') {
    event.preventDefault(); // Empêcher le comportement par défaut du Tab
    
    // Trouver l'index actuel et passer au suivant
    const currentIndex = navigationTabs.findIndex(tab => tab.id === activeTab.value);
    const nextIndex = (currentIndex + 1) % navigationTabs.length;
    
    activeTab.value = navigationTabs[nextIndex].id;
  }
}

// Sélectionner un onglet
function selectTab(tabId: string) {
  activeTab.value = tabId;
  closeMenu();
}

// Fonctions pour la carte
function selectPOI(poiId: string) {
  selectedPOI.value = poiId;
}

// Actions du jeu
function startCombat() {
  alert('Combat initié!');
  closeMenu();
}

function simulateDeath() {
  alert('Simulation de mort du héros');
  closeMenu();
}

// S'assurer que le conteneur du jeu est focusable pour capturer les événements clavier
onMounted(() => {
  nextTick(() => {
    if (gameContainer.value) {
      gameContainer.value.focus();
    }
  });
});
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none; /* Supprimer l'outline quand focusé */
}

.menu-indicator {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ccc;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 50;
}

.menu-indicator:hover {
  background-color: rgba(24, 144, 255, 0.6);
  color: white;
}

.indicator-icon {
  font-size: 18px;
  margin-right: 8px;
}

.indicator-text {
  font-size: 14px;
}

.main-frame {
  width: 90vw;
  height: 80vh;
  max-width: 1400px;
  max-height: 900px;
  position: relative;
  transition: all 0.3s ease;
}

.main-frame.blurred {
  filter: blur(3px);
  transform: scale(0.98);
}
</style>