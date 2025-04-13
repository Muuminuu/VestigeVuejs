<template>
    <div class="hero-view">
      <h2>Fiche de Héros</h2>
      
      <div v-if="hero" class="hero-details">
        <div class="hero-section hero-stats">
          <h3>Statistiques</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Santé:</span>
              <span class="stat-value">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Attaque:</span>
              <span class="stat-value">{{ hero.stats.attack }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Défense:</span>
              <span class="stat-value">{{ hero.stats.defense }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Vitesse:</span>
              <span class="stat-value">{{ hero.stats.speed }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Endurance:</span>
              <span class="stat-value">{{ hero.stats.stamina }} / {{ hero.stats.maxStamina }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Régén. Santé:</span>
              <span class="stat-value">{{ hero.stats.healthRegen }}/s</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Vitalité:</span>
              <span class="stat-value">{{ hero.stats.vitality }} / {{ hero.stats.maxVitality }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Énergie Vitale:</span>
              <span class="stat-value">{{ hero.stats.vitalEnergy }} / {{ hero.stats.maxVitalEnergy }}</span>
            </div>
          </div>
        </div>
        
        <div class="hero-section hero-experience">
          <h3>Progression</h3>
          <div class="experience-bar">
            <div class="exp-fill" :style="{ width: `${experiencePercentage}%` }"></div>
            <span class="exp-text">Niveau {{ hero.level }} - {{ hero.experience }} / {{ experienceForNextLevel }} XP</span>
          </div>
        </div>
        
        <div class="hero-section hero-abilities">
          <h3>Capacités</h3>
          <div class="abilities-list">
            <div v-for="ability in hero.abilities" :key="ability.id" class="ability-item">
              <div class="ability-header">
                <span class="ability-name">{{ ability.name }}</span>
                <span :class="['ability-type', `type-${ability.damageType.toLowerCase()}`]">{{ ability.damageType }}</span>
              </div>
              <div class="ability-description">{{ ability.description }}</div>
              <div class="ability-stats">
                <span class="ability-power">Puissance: {{ ability.power }}</span>
                <span class="ability-cooldown">Recharge: {{ ability.cooldown }}s</span>
              </div>
            </div>
            
            <div v-if="hero.abilities.length === 0" class="no-abilities">
              Aucune capacité apprise.
            </div>
          </div>
        </div>
        
        <div class="hero-section hero-vestiges">
          <h3>Vestiges Incorporés</h3>
          <div class="vestiges-list">
            <div v-for="vestige in hero.vestiges" :key="vestige.id" class="vestige-item">
              <div class="vestige-header">
                <span class="vestige-name">{{ vestige.name }}</span>
                <span class="vestige-level">Niveau {{ vestige.level }}</span>
              </div>
              <div class="vestige-description">{{ vestige.bonus.description }}</div>
              <div v-if="vestige.ancestors && vestige.ancestors.length > 0" class="vestige-ancestors">
                <span class="ancestors-label">Héritage de {{ vestige.ancestors.length }} ancêtre(s)</span>
              </div>
            </div>
            
            <div v-if="hero.vestiges.length === 0" class="no-vestiges">
              Aucun vestige incorporé.
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-hero">
        <p>Aucun héros actif. Créez un nouveau héros pour commencer votre aventure.</p>
        <button class="create-hero-button" @click="showHeroCreation = true">Créer un héros</button>
        
        <div v-if="showHeroCreation" class="hero-creation-overlay">
          <div class="hero-creation-modal">
            <h3>Création d'un Nouveau Héros</h3>
            <div class="form-group">
              <label for="heroName">Nom du héros:</label>
              <input id="heroName" v-model="newHeroName" type="text" placeholder="Entrez le nom du héros"/>
            </div>
            
            <div class="modal-actions">
              <button class="create-button" :disabled="!newHeroName" @click="createNewHero">Créer</button>
              <button class="cancel-button" @click="showHeroCreation = false">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useGameStore } from '../../stores/gameStore';
  
  const gameStore = useGameStore();
  const hero = computed(() => gameStore.hero);
  
  // Calcul de l'expérience
  const experienceForNextLevel = computed(() => {
    if (!hero.value) return 100;
    return hero.value.level * 100; // Formule simple: niveau * 100
  });
  
  const experiencePercentage = computed(() => {
    if (!hero.value) return 0;
    return (hero.value.experience / experienceForNextLevel.value) * 100;
  });
  
  // Création d'un nouveau héros
  const showHeroCreation = ref(false);
  const newHeroName = ref('');
  
  function createNewHero() {
    if (!newHeroName.value) return;
    
    gameStore.createHero(newHeroName.value);
    
    // Réinitialiser le formulaire
    newHeroName.value = '';
    showHeroCreation.value = false;
  }
  </script>
  
  <style scoped>
  .hero-view {
    height: 100%;
    overflow-y: auto;
  }
  
  .hero-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .hero-section {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .hero-section h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #1890ff;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
  }
  
  /* Section statistiques */
  .hero-stats {
    grid-column: 1;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .stat-item {
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  .stat-label {
    font-weight: bold;
    color: #666;
  }
  
  .stat-value {
    float: right;
  }
  
  /* Section expérience */
  .hero-experience {
    grid-column: 2;
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
  
  /* Section capacités */
  .hero-abilities {
    grid-column: 1;
  }
  
  .abilities-list {
    max-height: 250px;
    overflow-y: auto;
  }
  
  .ability-item {
    padding: 10px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  
  .ability-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .ability-name {
    font-weight: bold;
    color: #1890ff;
  }
  
  .ability-type {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .type-physical { background-color: #d9d9d9; color: #262626; }
  .type-fire { background-color: #fff2e8; color: #fa541c; }
  .type-ice { background-color: #e6f7ff; color: #0050b3; }
  .type-lightning { background-color: #fcffe6; color: #7cb305; }
  .type-poison { background-color: #f9f0ff; color: #722ed1; }
  .type-holy { background-color: #fffbe6; color: #d48806; }
  .type-dark { background-color: #f0f0f0; color: #262626; }
  
  .ability-description {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  
  .ability-stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #666;
  }
  
  .no-abilities {
    text-align: center;
    padding: 15px;
    color: #999;
    font-style: italic;
  }
  
  /* Section vestiges */
  .hero-vestiges {
    grid-column: 2;
  }
  
  .vestiges-list {
    max-height: 250px;
    overflow-y: auto;
  }
  
  .vestige-item {
    padding: 10px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  
  .vestige-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .vestige-name {
    font-weight: bold;
    color: #1890ff;
  }
  
  .vestige-level {
    background-color: #e6f7ff;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #1890ff;
  }
  
  .vestige-description {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  
  .vestige-ancestors {
    font-size: 0.8rem;
    color: #999;
    font-style: italic;
  }
  
  .no-vestiges {
    text-align: center;
    padding: 15px;
    color: #999;
    font-style: italic;
  }
  
  /* Pas de héros */
  .no-hero {
    text-align: center;
    padding: 40px;
  }
  
  .create-hero-button {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 15px;
  }
  
  .create-hero-button:hover {
    background-color: #40a9ff;
  }
  
  /* Modal de création de héros */
  .hero-creation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .hero-creation-modal {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .create-button {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .create-button:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
  
  .cancel-button {
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.65);
    border: 1px solid #d9d9d9;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .hero-details {
      grid-template-columns: 1fr;
    }
    
    .hero-stats, .hero-experience, .hero-abilities, .hero-vestiges {
      grid-column: 1;
    }
  }
  </style>