<template>
  <div class="game-container">
    <!-- Entête avec informations du personnage -->
    <div class="game-header">
      <div class="hero-info">
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
      <div class="menu-actions">
        <button class="menu-button">Menu Principal</button>
      </div>
    </div>

    <!-- Zone principale du jeu -->
    <div class="game-main">
      <!-- Navigation latérale fixe -->
      <div class="game-nav">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="nav-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Cadre central fixe -->
      <div class="game-frame">
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
            <!-- Exemple : Affichage des statistiques du héros -->
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
            
            <!-- Autres onglets seraient implémentés de façon similaire -->
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

    <!-- Barre d'actions en bas -->
    <div class="game-actions">
      <button class="action-button combat-button">Partir en Combat</button>
      <button class="action-button death-button">Simuler la Mort</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Données simulées pour la démo
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
</script>

<style scoped>
/* Layout principal */
.game-container {
  display: flex;
  flex-direction: column;
  width: 100vw; /* Utilise toute la largeur de la fenêtre */
  height: 100vh; /* Utilise toute la hauteur de la fenêtre */
  background-color: #f0f2f5;
  overflow: hidden;
  position: fixed; /* Empêche le défilement de la page */
  top: 0;
  left: 0;
}

/* Entête du jeu */
.game-header {
  height: 100px;
  min-height: 100px;
  max-height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  box-sizing: border-box;
}

.hero-info {
  flex: 1;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.hero-level {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 4px;
}

.stat-bars {
  margin-top: 10px;
}

.stat-bar {
  margin-bottom: 6px;
}

.stat-label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
  font-size: 14px;
}

.bar-container {
  display: inline-block;
  width: 200px;
  height: 16px;
  background-color: #f5f5f5;
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
}

.menu-actions {
  display: flex;
  align-items: center;
}

.menu-button {
  padding: 6px 15px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover {
  color: #1890ff;
  border-color: #1890ff;
}

/* Zone principale du jeu */
.game-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* Navigation latérale */
.game-nav {
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  background-color: white;
  border-right: 1px solid #e8e8e8;
  padding: 15px 0;
  overflow-y: auto;
  box-sizing: border-box;
}

.nav-button {
  width: 130px;
  height: 40px;
  margin: 0 10px 10px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.nav-button:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.nav-button.active {
  color: white;
  background-color: #1890ff;
  border-color: #1890ff;
}

/* Cadre décoratif */
.game-frame {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
}

.decorative-frame {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Empêche tout défilement horizontal */
  box-sizing: border-box;
}

.frame-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto; /* Seul le défilement vertical est permis */
  overflow-x: hidden; /* Empêche le défilement horizontal */
  box-sizing: border-box;
}

/* Coins et bords du cadre */
.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid;
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
  opacity: 0.6;
  z-index: 2;
}

.frame-edge.top, .frame-edge.bottom {
  left: 20px;
  right: 20px;
  height: 0;
}

.frame-edge.left, .frame-edge.right {
  top: 20px;
  bottom: 20px;
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
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.ornament-1 { top: 10px; left: 50%; transform: translateX(-50%); }
.ornament-2 { top: 50%; right: 10px; transform: translateY(-50%); }
.ornament-3 { bottom: 10px; left: 50%; transform: translateX(-50%); }
.ornament-4 { top: 50%; left: 10px; transform: translateY(-50%); }

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

/* Contenu des onglets */
.hero-view, .inventory-view, .quests-view, .map-view, .codex-view {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1890ff;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.hero-sections {
  display: flex;
  margin-bottom: 20px;
}

.hero-section {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  margin-right: 15px;
}

.hero-section:last-child {
  margin-right: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  background-color: white;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
}

.stat-name {
  font-weight: bold;
  color: #666;
}

.stat-value {
  color: #1890ff;
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
}

.abilities-list, .vestiges-list {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

.ability-item, .vestige-item {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
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
  padding: 2px 8px;
  background-color: #e6f7ff;
  border-radius: 10px;
  font-size: 12px;
  color: #1890ff;
}

.vestige-level {
  padding: 2px 8px;
  background-color: #f6ffed;
  border-radius: 10px;
  font-size: 12px;
  color: #52c41a;
}

.ability-description, .vestige-description {
  font-size: 13px;
  color: #666;
}

.no-abilities, .no-vestiges {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

/* Barre d'actions en bas */
.game-actions {
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top: 1px solid #e8e8e8;
  width: 100%;
  box-sizing: border-box;
}

.action-button {
  height: 40px;
  padding: 0 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
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
</style>