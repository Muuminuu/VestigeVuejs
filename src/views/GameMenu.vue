<template>
    <div class="fullscreen-menu">
      <!-- Overlay qui couvre tout l'écran -->
      <div class="menu-overlay" @click="$emit('close')"></div>
      
      <!-- Contenu du menu -->
      <div class="menu-content">
        <div class="menu-header">
          <h2>Menu</h2>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        
        <div class="menu-sections">
          <!-- Section d'information du héros -->
          <div class="hero-info-section">
            <div class="hero-name">{{ hero.name }}</div>
            <div class="hero-level">Niveau {{ hero.level }}</div>
            <div class="stat-bars">
              <div class="stat-bar">
                <span class="stat-label">Santé:</span>
                <div class="bar-container">
                  <div class="bar-fill health-fill" 
                       :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
                  <span class="bar-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
                </div>
              </div>
              <div class="stat-bar">
                <span class="stat-label">Endurance:</span>
                <div class="bar-container">
                  <div class="bar-fill stamina-fill" 
                       :style="{ width: `${(hero.stats.currentStamina / hero.stats.maxStamina) * 100}%` }"></div>
                  <span class="bar-text">{{ hero.stats.currentStamina }} / {{ hero.stats.maxStamina }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section de navigation -->
          <div class="navigation-section">
            <h3>Navigation</h3>
            <div class="nav-buttons">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="nav-button"
                :class="{ active: activeTab === tab.id }"
                @click="$emit('select-tab', tab.id)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <!-- Section d'actions -->
          <div class="actions-section">
            <h3>Actions</h3>
            <button class="action-button combat-button" @click="$emit('start-combat')">
              Partir en Combat
            </button>
            <button class="action-button death-button" @click="$emit('simulate-death')">
              Simuler la Mort
            </button>
          </div>
          
          <!-- Section d'options -->
          <div class="options-section">
            <h3>Options</h3>
            <button class="option-button" @click="returnToMainMenu">Menu Principal</button>
            <button class="option-button" @click="showOptions">Paramètres</button>
            <button class="option-button" @click="showHelp">Aide</button>
          </div>
        </div>
        
        <div class="key-hint">Appuyez sur <kbd>ESC</kbd> pour fermer ce menu</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Définition des props
  defineProps({
    hero: {
      type: Object,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    }
  });
  
  // Définition des événements émis
  defineEmits(['close', 'select-tab', 'start-combat', 'simulate-death']);
  
  // Fonctions pour les options
  function returnToMainMenu() {
    alert('Retour au menu principal');
  }
  
  function showOptions() {
    alert('Affichage des options');
  }
  
  function showHelp() {
    alert('Affichage de l\'aide');
  }
  </script>
  
  <style scoped>
  .fullscreen-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 101;
  }
  
  .menu-content {
    position: relative;
    width: 800px;
    max-height: 80%;
    background-color: rgba(30, 30, 40, 0.95);
    border-radius: 12px;
    border: 1px solid rgba(100, 100, 150, 0.3);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
    z-index: 102;
    color: #e8e8e8;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 25px;
  }
  
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .menu-header h2 {
    margin: 0;
    font-size: 28px;
    color: #1890ff;
    text-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
  }
  
  .close-button {
    background: none;
    border: none;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-button:hover {
    color: #1890ff;
    background-color: rgba(24, 144, 255, 0.1);
  }
  
  .menu-sections {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
  .hero-info-section, .navigation-section, .actions-section, .options-section {
    background-color: rgba(50, 50, 70, 0.5);
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .hero-info-section {
    grid-column: 1 / 3;
  }
  
  .hero-name {
    font-size: 20px;
    font-weight: bold;
    color: #1890ff;
  }
  
  .hero-level {
    display: inline-block;
    padding: 2px 10px;
    background-color: rgba(24, 144, 255, 0.2);
    color: #1890ff;
    border-radius: 12px;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .stat-bars {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    gap: 15px;
  }
  
  .stat-bar {
    flex: 1;
  }
  
  .stat-label {
    display: block;
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    color: #ccc;
  }
  
  .bar-container {
    width: 100%;
    height: 18px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 9px;
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
  
  .navigation-section h3, .actions-section h3, .options-section h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #1890ff;
    border-bottom: 1px solid rgba(24, 144, 255, 0.3);
    padding-bottom: 8px;
  }
  
  .nav-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .nav-button {
    height: 48px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
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
  
  .action-button, .option-button {
    width: 100%;
    height: 48px;
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
  
  .option-button {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ccc;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .option-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .key-hint {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #888;
  }
  
  kbd {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    padding: 2px 5px;
    font-family: monospace;
  }
  </style>