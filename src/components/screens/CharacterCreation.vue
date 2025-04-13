<template>
    <main class="character-creation">
      <div class="creation-container">
        <h1>Créer votre Héros</h1>
        
        <div class="creation-card">
          <h2>Nouveau Héros</h2>
          
          <div class="form-group">
            <label for="heroName">Nom du Héros:</label>
            <input 
              id="heroName" 
              v-model="heroName" 
              type="text" 
              placeholder="Entrez le nom de votre héros"
              required
            />
          </div>
          
          <div class="vestiges-section" v-if="hasVestiges">
            <h3>Vestiges Disponibles</h3>
            <p>Votre nouveau héros héritera automatiquement de tous les vestiges disponibles.</p>
            
            <div class="vestiges-list">
              <div 
                v-for="vestige in availableVestiges" 
                :key="vestige.id"
                class="vestige-item"
              >
                <h4>{{ vestige.name }}</h4>
                <p>{{ getVestigeDescription(vestige) }}</p>
              </div>
            </div>
            
            <div class="vestige-info" v-if="availableVestiges.length > 0">
              <p>Ces vestiges renforceront votre héros avec des statistiques et des capacités supplémentaires.</p>
            </div>
          </div>
          
          <div class="character-stats">
            <h3>Statistiques de Base</h3>
            <div class="stats-preview">
              <div class="stat-item">
                <span>Santé:</span> <span>100</span>
              </div>
              <div class="stat-item">
                <span>Attaque:</span> <span>15</span>
              </div>
              <div class="stat-item">
                <span>Défense:</span> <span>10</span>
              </div>
              <div class="stat-item">
                <span>Vitesse:</span> <span>8</span>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="create-button" :disabled="!heroName" @click="createHero">
              Créer et Commencer l'Aventure
            </button>
            <button class="cancel-button" @click="cancel">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useGameStore } from '../../stores/gameStore'
  import type { Vestige } from '../../core/types/Vestige'
  
  // Définir les émetteurs d'événements
  const emit = defineEmits(['hero-created', 'cancel'])
  
  const gameStore = useGameStore()
  const heroName = ref('')
  
  const availableVestiges = computed(() => {
    return gameStore.vestiges
  })
  
  const hasVestiges = computed(() => {
    return availableVestiges.value.length > 0
  })
  
  function createHero() {
    if (!heroName.value) return
    
    // Create the hero (will automatically incorporate all vestiges)
    gameStore.createHero(heroName.value)
    
    // Notifier que le héros a été créé
    emit('hero-created')
  }
  
  function cancel() {
    emit('cancel')
  }
  
  function getVestigeDescription(vestige: Vestige): string {
    let description = `Niveau ${vestige.level} - ${vestige.description}\n\nBonus: ${vestige.bonus.description}`
    
    if (vestige.bonus.statBonuses) {
      const stats = vestige.bonus.statBonuses
      description += '\n\nBonus de statistiques:'
      if (stats.maxHealth) description += `\n• +${stats.maxHealth} Santé Max`
      if (stats.attack) description += `\n• +${stats.attack} Attaque`
      if (stats.defense) description += `\n• +${stats.defense} Défense`
      if (stats.speed) description += `\n• +${stats.speed} Vitesse`
    }
    
    if (vestige.bonus.ability) {
      const ability = vestige.bonus.ability
      description += `\n\nCapacité Spéciale: ${ability.name}\n${ability.description}`
    }
    
    return description
  }
  </script>
  
  <style scoped>
  .character-creation {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .creation-container {
    max-width: 800px;
    width: 100%;
  }
  
  h1 {
    text-align: center;
    color: #1890ff;
    margin-bottom: 30px;
    font-size: 2.2rem;
  }
  
  .creation-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  h2 {
    color: #1890ff;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 30px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    font-size: 1.1rem;
    transition: all 0.3s;
  }
  
  input:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
  }
  
  .vestiges-section, .character-stats {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  h3 {
    margin-top: 0;
    color: #333;
    margin-bottom: 15px;
  }
  
  .vestiges-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 15px;
  }
  
  .vestige-item {
    background-color: white;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .vestige-item h4 {
    margin-top: 0;
    color: #1890ff;
    margin-bottom: 10px;
  }
  
  .vestige-item p {
    margin: 0;
    white-space: pre-line;
    font-size: 0.9rem;
  }
  
  .vestige-info {
    font-style: italic;
    color: #666;
  }
  
  .stats-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .stat-item {
    background-color: white;
    padding: 10px 15px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #eee;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .create-button, .cancel-button {
    padding: 12px 25px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 250px;
    text-align: center;
  }
  
  .create-button {
    background-color: #1890ff;
    color: white;
  }
  
  .create-button:hover {
    background-color: #40a9ff;
  }
  
  .create-button:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
  
  .cancel-button {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #d9d9d9;
  }
  
  .cancel-button:hover {
    background-color: #fafafa;
    color: #1890ff;
  }
  
  @media (min-width: 768px) {
    .action-buttons {
      flex-direction: row;
      justify-content: center;
    }
  }
  </style>