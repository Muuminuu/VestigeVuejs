<template>
  <div class="game-container" @keydown="handleKeyPress" tabindex="0" ref="gameContainer">
    <!-- Mode aventure (lorsque le menu n'est pas visible) -->
    <div v-if="!isMenuVisible" class="adventure-mode">
      <!-- Indicateur de menu en haut à gauche -->
      <div class="menu-indicator" @click="openMenu">
        <span class="indicator-icon">☰</span>
        <span class="indicator-text">Menu (TAB)</span>
      </div>
      
      <!-- Cadre décoratif pour le contenu narratif -->
      <div class="adventure-frame">
        <decorative-frame :theme="frameTheme" :level="frameLevel">
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
        </decorative-frame>
      </div>
    </div>
    
    <!-- Mode menu (plein écran, superposé à l'aventure) -->
    <div v-else class="menu-mode">
      <div class="menu-header">
        <div class="hero-info" v-if="hero">
          <div class="hero-name">{{ hero.name }}</div>
          <div class="hero-level">Niveau {{ hero.level }}</div>
          <div class="hero-health">
            <div class="health-bar">
              <div class="health-fill" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
              <span class="health-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }} PV</span>
            </div>
          </div>
        </div>
        
        <button class="close-menu-button" @click="closeMenu">
          Retour à l'aventure (TAB)
        </button>
      </div>
      
      <div class="menu-content">
        <div class="menu-sidebar">
          <button 
            v-for="tab in menuTabs" 
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="selectTab(tab.id)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tab-content">
          <component :is="getCurrentTabComponent()" :hero="hero" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import DecorativeFrame from './DecorativeFrame.vue';
import HeroView from './HeroView.vue';
import InventoryView from './InventoryView.vue';
import QuestsView from './QuestsView.vue';
import MapView from './MapView.vue';
import CodexView from './CodexView.vue';

// Référence au conteneur du jeu pour le focus
const gameContainer = ref(null);

// État du menu
const isMenuVisible = ref(false);
const activeTab = ref('hero');

// Données du héros (exemple)
const hero = ref({
  name: "Aveline",
  level: 3,
  stats: {
    maxHealth: 150,
    currentHealth: 120,
    maxStamina: 100,
    currentStamina: 80,
    attack: 25,
    defense: 18,
    speed: 12,
    healthRegen: 2
  },
  experience: 280,
  experienceForNextLevel: 400,
  abilities: [
    {
      name: "Frappe Puissante",
      type: "PHYSIQUE",
      description: "Une attaque puissante qui inflige 150% de dégâts."
    },
    {
      name: "Bouclier Spectral",
      type: "DÉFENSE",
      description: "Invoque un bouclier spirituel qui absorbe les dégâts."
    }
  ],
  vestiges: [
    {
      name: "Vestige du Gardien",
      level: 2,
      description: "L'essence d'un ancien gardien de Vestifall, augmente la défense."
    }
  ]
});

// Thème du cadre décoratif
const frameTheme = ref('default');
const frameLevel = ref(3);

// Onglets du menu
const menuTabs = [
  { id: 'hero', label: 'Héros', icon: '👤' },
  { id: 'inventory', label: 'Inventaire', icon: '🎒' },
  { id: 'quests', label: 'Quêtes', icon: '📜' },
  { id: 'map', label: 'Carte', icon: '🗺️' },
  { id: 'codex', label: 'Codex', icon: '📚' }
];

// Ouvrir et fermer le menu
function openMenu() {
  isMenuVisible.value = true;
}

function closeMenu() {
  isMenuVisible.value = false;
  
  // Remettre le focus sur le conteneur du jeu
  nextTick(() => {
    if (gameContainer.value) {
      gameContainer.value.focus();
    }
  });
}

// Gestionnaire d'événements pour les touches clavier
function handleKeyPress(event: KeyboardEvent) {
  // Tab pour basculer l'affichage du menu
  if (event.key === 'Tab') {
    event.preventDefault(); // Empêcher le comportement par défaut du Tab
    isMenuVisible.value = !isMenuVisible.value;
  }
}

// Sélectionner un onglet dans le menu
function selectTab(tabId: string) {
  activeTab.value = tabId;
}

// Obtenir le composant correspondant à l'onglet actif
function getCurrentTabComponent() {
  switch (activeTab.value) {
    case 'hero': return HeroView;
    case 'inventory': return InventoryView;
    case 'quests': return QuestsView;
    case 'map': return MapView;
    case 'codex': return CodexView;
    default: return HeroView;
  }
}

// Actions de l'aventure (à développer selon les besoins)
function exploreForest() {
  alert("Vous vous enfoncez dans la forêt et découvrez un ancien autel...");
}

function travelToCity() {
  alert("Vous vous dirigez vers Vestifall, la ville s'agrandit à l'horizon...");
}

function startCombat() {
  alert("Un ennemi apparaît ! Préparez-vous au combat...");
}

// S'assurer que le conteneur du jeu puisse recevoir le focus à son initialisation
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
  outline: none; /* Supprimer l'outline quand le conteneur est focusé */
}

/* Mode aventure */
.adventure-mode {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  z-index: 10;
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

.adventure-frame {
  width: 90vw;
  height: 80vh;
  max-width: 1200px;
  max-height: 800px;
}

.adventure-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.adventure-content h2 {
  color: #1890ff;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 28px;
}

.adventure-content p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
}

.adventure-actions {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  background-color: #1890ff;
  color: white;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #40a9ff;
}

/* Mode menu */
.menu-mode {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(18, 18, 20, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgba(30, 30, 40, 0.8);
  border-bottom: 1px solid rgba(100, 100, 150, 0.3);
}

.hero-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hero-name {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.hero-level {
  padding: 4px 10px;
  background-color: rgba(24, 144, 255, 0.2);
  color: #1890ff;
  border-radius: 12px;
  font-size: 14px;
}

.hero-health {
  width: 200px;
}

.health-bar {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.health-fill {
  height: 100%;
  background-color: #52c41a;
  transition: width 0.3s ease;
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
}

.close-menu-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-menu-button:hover {
  background-color: rgba(24, 144, 255, 0.2);
  color: #1890ff;
  border-color: rgba(24, 144, 255, 0.5);
}

.menu-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.menu-sidebar {
  width: 250px;
  background-color: rgba(30, 30, 40, 0.6);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
}

.tab-button:hover {
  background-color: rgba(24, 144, 255, 0.1);
  color: #fff;
}

.tab-button.active {
  background-color: rgba(24, 144, 255, 0.2);
  color: #1890ff;
  border-color: #1890ff;
}

.tab-icon {
  margin-right: 10px;
  font-size: 18px;
}

.tab-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #ccc;
}
</style>