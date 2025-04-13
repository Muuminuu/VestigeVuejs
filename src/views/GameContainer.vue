<template>
  <div class="game-container" @keydown="handleKeyPress" tabindex="0" ref="gameContainer">
    <!-- Menu latéral togglable -->
    <div class="game-menu" :class="{ 'menu-visible': isMenuVisible }">
      <div class="menu-header">
        <h2>Menu</h2>
        <button class="close-button" @click="isMenuVisible = false">×</button>
      </div>
      
      <div class="menu-sections">
        <div class="hero-info-section">
          <div class="hero-name">{{ heroName }}</div>
          <div class="hero-level">Niveau {{ heroLevel }}</div>
          <div class="stat-bars">
            <div class="stat-bar">
              <span class="stat-label">Santé:</span>
              <div class="bar-container">
                <div class="bar-fill health-fill" :style="{ width: `${(currentHealth / maxHealth) * 100}%` }"></div>
                <span class="bar-text">{{ currentHealth }} / {{ maxHealth }}</span>
              </div>
            </div>
            <div class="stat-bar">
              <span class="stat-label">Endurance:</span>
              <div class="bar-container">
                <div class="bar-fill stamina-fill" :style="{ width: `${(currentStamina / maxStamina) * 100}%` }"></div>
                <span class="bar-text">{{ currentStamina }} / {{ maxStamina }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="navigation-section">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            class="nav-button"
            :class="{ active: activeTab === tab.id }"
            @click="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="actions-section">
          <button class="action-button combat-button" @click="startCombat">Partir en Combat</button>
          <button class="action-button death-button" @click="simulateDeath">Simuler la Mort</button>
        </div>
        
        <div class="menu-footer">
          <button class="main-menu-button" @click="returnToMainMenu">Menu Principal</button>
          <div class="key-hint">Appuyez sur <kbd>ESC</kbd> pour fermer ce menu</div>
        </div>
      </div>
    </div>

    <!-- Indicateur de menu (visible seulement quand le menu est caché) -->
    <div class="menu-indicator" v-if="!isMenuVisible" @click="isMenuVisible = true">
      <span class="indicator-icon">☰</span>
      <span class="indicator-text">Menu (ESC)</span>
    </div>

    <!-- Cadre principal du jeu (toujours visible) -->
    <div class="main-frame">
      <div class="decorative-frame" :class="`theme-${frameTheme}`">
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
        
        <!-- Ornements -->
        <div v-if="frameLevel > 1" class="frame-ornaments">
          <div v-for="i in Math.min(frameLevel - 1, 4)" :key="i" 
                class="ornament" :class="`ornament-${i}`"></div>
        </div>
        
        <!-- Contenu du cadre -->
        <div class="frame-content">
          <!-- Contenu dépendant de l'onglet sélectionné -->
          <div v-if="activeTab === 'hero'" class="hero-view">
            <h2>Fiche de Héros</h2>
            
            <div class="hero-sections">
              <div class="hero-section">
                <h3>Statistiques</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-name">Santé:</span>
                    <span class="stat-value">{{ currentHealth }} / {{ maxHealth }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-name">Attaque:</span>
                    <span class="stat-value">{{ attack }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-name">Défense:</span>
                    <span class="stat-value">{{ defense }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-name">Vitesse:</span>
                    <span class="stat-value">{{ speed }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-name">Endurance:</span>
                    <span class="stat-value">{{ currentStamina }} / {{ maxStamina }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-name">Régén. Santé:</span>
                    <span class="stat-value">{{ healthRegen }}/s</span>
                  </div>
                </div>
              </div>
              
              <div class="hero-section">
                <h3>Progression</h3>
                <div class="experience-bar">
                  <div class="exp-fill" :style="{ width: `${experiencePercentage}%` }"></div>
                  <span class="exp-text">
                    Niveau {{ heroLevel }} - {{ currentExp }} / {{ expForNextLevel }} XP
                  </span>
                </div>
              </div>
            </div>
            
            <div class="hero-sections">
              <div class="hero-section">
                <h3>Capacités</h3>
                <div class="abilities-list" v-if="abilities.length > 0">
                  <div v-for="(ability, index) in abilities" :key="index" class="ability-item">
                    <div class="ability-header">
                      <span class="ability-name">{{ ability.name }}</span>
                      <span class="ability-type">{{ ability.type }}</span>
                    </div>
                    <div class="ability-description">{{ ability.description }}</div>
                  </div>
                </div>
                <div class="no-abilities" v-else>
                  Aucune capacité apprise.
                </div>
              </div>
              
              <div class="hero-section">
                <h3>Vestiges Incorporés</h3>
                <div class="vestiges-list" v-if="vestiges.length > 0">
                  <div v-for="(vestige, index) in vestiges" :key="index" class="vestige-item">
                    <div class="vestige-header">
                      <span class="vestige-name">{{ vestige.name }}</span>
                      <span class="vestige-level">Niveau {{ vestige.level }}</span>
                    </div>
                    <div class="vestige-description">{{ vestige.description }}</div>
                  </div>
                </div>
                <div class="no-vestiges" v-else>
                  Aucun vestige incorporé.
                </div>
              </div>
            </div>
          </div>
          
          <!-- Autres onglets -->
          <div v-else-if="activeTab === 'inventory'" class="inventory-view">
            <h2>Inventaire</h2>
            <!-- Contenu de l'inventaire -->
          </div>
          
          <div v-else-if="activeTab === 'quests'" class="quests-view">
            <h2>Quêtes</h2>
            <!-- Contenu des quêtes -->
          </div>
          
          <div v-else-if="activeTab === 'map'" class="map-view">
            <h2>Carte</h2>
            <!-- Contenu de la carte -->
          </div>
          
          <div v-else-if="activeTab === 'codex'" class="codex-view">
            <h2>Codex</h2>
            <!-- Contenu du codex -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

// État du menu
const isMenuVisible = ref(false);
const gameContainer = ref(null);

// Données du héros
const heroName = ref('Héros Test');
const heroLevel = ref(1);
const currentHealth = ref(23);
const maxHealth = ref(100);
const currentStamina = ref(80);
const maxStamina = ref(80);
const attack = ref(15);
const defense = ref(10);
const speed = ref(8);
const healthRegen = ref(1);
const currentExp = ref(0);
const expForNextLevel = ref(100);

// Calcul du pourcentage d'expérience
const experiencePercentage = computed(() => {
  return (currentExp.value / expForNextLevel.value) * 100;
});

// Données pour le cadre décoratif
const frameTheme = ref('default');
const frameLevel = ref(1);

// Onglets de navigation
const activeTab = ref('hero');
const tabs = [
  { id: 'hero', label: 'Héros' },
  { id: 'inventory', label: 'Inventaire' },
  { id: 'quests', label: 'Quêtes' },
  { id: 'map', label: 'Carte' },
  { id: 'codex', label: 'Codex' }
];

// Exemple de données pour les capacités
const abilities = ref([
  {
    name: 'Frappe Puissante',
    type: 'PHYSIQUE',
    description: 'Une attaque puissante qui inflige 120% de dégâts.'
  }
]);

// Exemple de données pour les vestiges
const vestiges = ref([
  {
    name: 'Vestige de Test',
    level: 1,
    description: 'Accorde une partie du pouvoir de test.'
  }
]);

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
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value);
    const nextIndex = (currentIndex + 1) % tabs.length;
    
    activeTab.value = tabs[nextIndex].id;
    
    // Si le menu est caché, l'afficher brièvement
    if (!isMenuVisible.value) {
      isMenuVisible.value = true;
      
      // Le cacher à nouveau après un court délai
      setTimeout(() => {
        isMenuVisible.value = false;
      }, 1500);
    }
  }
}

// Sélectionner un onglet et fermer le menu
function selectTab(tabId: string) {
  activeTab.value = tabId;
  
  // Fermer le menu après un court délai
  setTimeout(() => {
    isMenuVisible.value = false;
  }, 300);
}

// Actions simulées
function startCombat() {
  alert('Combat initié!');
  isMenuVisible.value = false;
}

function simulateDeath() {
  alert('Simulation de mort du héros');
  isMenuVisible.value = false;
}

function returnToMainMenu() {
  alert('Retour au menu principal');
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
/* Layout principal */
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none; /* Supprimer l'outline quand focusé */
}

/* Menu latéral */
.game-menu {
  position: absolute;
  top: 0;
  left: -320px; /* Caché par défaut */
  width: 320px;
  height: 100%;
  background-color: rgba(15, 15, 20, 0.95);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  transition: left 0.3s ease-in-out;
  z-index: 100;
  color: #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-visible {
  left: 0; /* Menu visible */
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1890ff;
}

.close-button {
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #1890ff;
}

.menu-sections {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
}

.hero-info-section {
  padding: 15px;
  background-color: rgba(24, 144, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.hero-level {
  display: inline-block;
  padding: 2px 8px;
  background-color: rgba(24, 144, 255, 0.2);
  color: #1890ff;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 4px;
}

.stat-bars {
  margin-top: 15px;
}

.stat-bar {
  margin-bottom: 10px;
}

.stat-label {
  display: block;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #ccc;
}

.bar-container {
  width: 100%;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.health-fill {
  background-color: #52c41a;
}

.stamina-fill {
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
  font-size: 12px;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
}

.navigation-section {
  margin-bottom: 20px;
}

.nav-button {
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  text-align: left;
  padding: 0 15px;
}

.nav-button:hover {
  background-color: rgba(24, 144, 255, 0.2);
  color: #fff;
  border-color: rgba(24, 144, 255, 0.5);
}

.nav-button.active {
  background-color: rgba(24, 144, 255, 0.3);
  color: #1890ff;
  border-color: #1890ff;
}

.actions-section {
  margin-bottom: 20px;
}

.action-button {
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  font-size: 16px;
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

.menu-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.main-menu-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  width: 100%;
  margin-bottom: 10px;
}

.main-menu-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.key-hint {
  font-size: 12px;
  color: #666;
}

kbd {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  padding: 2px 5px;
  font-family: monospace;
}

/* Indicateur de menu (quand le menu est caché) */
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

/* Cadre principal du jeu */
.main-frame {
  width: 90vw;
  height: 80vh;
  max-width: 1400px;
  max-height: 900px;
  position: relative;
  transition: all 0.3s ease;
}

.decorative-frame {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
}

.frame-content {
  width: 100%;
  height: 100%;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Coins et bords du cadre */
.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid;
  z-index: 2;
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
  z-index: 2;
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
  z-index: 3;
}

.ornament {
  position: absolute;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.ornament-1 { top: 15px; left: 50%; transform: translateX(-50%); }
.ornament-2 { top: 50%; right: 15px; transform: translateY(-50%); }
.ornament-3 { bottom: 15px; left: 50%; transform: translateX(-50%); }
.ornament-4 { top: 50%; left: 15px; transform: translateY(-50%); }

/* Thèmes du cadre */
.theme-default {
  --frame-color: #1890ff;
}

.theme-default .frame-corner,
.theme-default .frame-edge {
  border-color: var(--frame-color);
}

.theme-fire {
  --frame-color: #fa541c;
}

.theme-fire .frame-corner,
.theme-fire .frame-edge {
  border-color: var(--frame-color);
}

.theme-ice {
  --frame-color: #00a2ae;
}

.theme-ice .frame-corner,
.theme-ice .frame-edge {
  border-color: var(--frame-color);
}

.theme-nature {
  --frame-color: #52c41a;
}

.theme-nature .frame-corner,
.theme-nature .frame-edge {
  border-color: var(--frame-color);
}

.theme-arcane {
  --frame-color: #722ed1;
}

.theme-arcane .frame-corner,
.theme-arcane .frame-edge {
  border-color: var(--frame-color);
}

.theme-deferment {
  --frame-color: #eb2f96;
}

.theme-deferment .frame-corner,
.theme-deferment .frame-edge {
  border-color: var(--frame-color);
}

/* Animation subtile des bords pour certains thèmes */
.theme-deferment .frame-edge {
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  100% { opacity: 0.9; }
}

/* Contenu des onglets */
.hero-view, .inventory-view, .quests-view, .map-view, .codex-view {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1890ff;
  font-size: 22px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.hero-sections {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.hero-section {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  background-color: #f9f9f9;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.stat-name {
  font-weight: bold;
  color: #666;
}

.stat-value {
  color: #1890ff;
  font-weight: bold;
}

.experience-bar {
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.exp-fill {
  height: 100%;
  background-color: #52c41a;
  transition: width 0.5s ease;
}

.exp-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 14px;
}

.abilities-list, .vestiges-list {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

.ability-item, .vestige-item {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ability-header, .vestige-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ability-name, .vestige-name {
  font-weight: bold;
  color: #1890ff;
}

.ability-type {
  padding: 3px 10px;
  background-color: #e6f7ff;
  border-radius: 12px;
  font-size: 12px;
  color: #1890ff;
}

.vestige-level {
  padding: 3px 10px;
  background-color: #f6ffed;
  border-radius: 12px;
  font-size: 12px;
  color: #52c41a;
}

.ability-description, .vestige-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.no-abilities, .no-vestiges {
  padding: 30px;
  text-align: center;
  color: #999;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 6px;
}
</style>