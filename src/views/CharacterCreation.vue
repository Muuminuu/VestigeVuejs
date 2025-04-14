<template>
    <div class="character-creation">
      <div class="creation-container">
        <h1>Créer votre Héros</h1>
        
        <div class="creation-card">
          <h2>Nouveau Héros</h2>
          
          <div class="form-group">
            <label for="heroName">Nom du Héros</label>
            <input 
              id="heroName" 
              v-model="heroName" 
              type="text" 
              placeholder="Entrez le nom de votre héros..."
              @keyup.enter="createHero"
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
          </div>
          
          <div class="action-buttons">
            <button 
              :disabled="!heroName.trim()" 
              @click="createHero" 
              class="create-button"
            >
              Commencer l'Aventure
            </button>
            <button class="back-button" @click="goBack">Retour</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '../stores/gameStore';
  
  const router = useRouter();
  const gameStore = useGameStore();
  const heroName = ref('');
  
  // Vestiges disponibles
  const availableVestiges = computed(() => {
    return gameStore.vestiges;
  });
  
  // Vérifie s'il y a des vestiges disponibles
  const hasVestiges = computed(() => {
    return availableVestiges.value.length > 0;
  });
  
  // Création du héros
  function createHero() {
    if (!heroName.value.trim()) return;
    
    // Créer le héros
    gameStore.createHero(heroName.value);
    
    // Rediriger vers le jeu
    router.push('/game');
  }
  
  // Retour à l'écran d'accueil
  function goBack() {
    router.push('/');
  }
  
  // Obtenir la description d'un vestige
  function getVestigeDescription(vestige) {
    if (!vestige || !vestige.bonus) return 'Aucune description disponible';
    
    let description = vestige.description || '';
    
    if (vestige.bonus.description) {
      description += ` ${vestige.bonus.description}`;
    }
    
    if (vestige.bonus.statBonuses) {
      const stats = vestige.bonus.statBonuses;
      const bonuses = [];
      
      if (stats.maxHealth) bonuses.push(`+${stats.maxHealth} Santé Max`);
      if (stats.attack) bonuses.push(`+${stats.attack} Attaque`);
      if (stats.defense) bonuses.push(`+${stats.defense} Défense`);
      if (stats.speed) bonuses.push(`+${stats.speed} Vitesse`);
      
      if (bonuses.length > 0) {
        description += ` Bonus: ${bonuses.join(', ')}.`;
      }
    }
    
    return description;
  }
  </script>
  
  <style scoped>
  .character-creation {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #121212;
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/path/to/your/background.jpg');
    background-size: cover;
    background-position: center;
    padding: 20px;
  }
  
  .creation-container {
    width: 100%;
    max-width: 800px;
  }
  
  h1 {
    color: #1890ff;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5rem;
    text-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
  }
  
  .creation-card {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 30px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    color: white;
  }
  
  h2 {
    color: #1890ff;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
    font-size: 1.8rem;
  }
  
  .form-group {
    margin-bottom: 30px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    color: #ddd;
  }
  
  input {
    width: 100%;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  }
  
  input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  .vestiges-section {
    margin-bottom: 30px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 8px;
  }
  
  h3 {
    color: #ddd;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  .vestiges-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .vestige-item {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
  }
  
  .vestige-item h4 {
    margin-top: 0;
    margin-bottom: 8px;
    color: #1890ff;
  }
  
  .vestige-item p {
    margin: 0;
    color: #bbb;
    line-height: 1.5;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .create-button, .back-button {
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    transition: all 0.3s ease;
  }
  
  .create-button {
    background-color: #1890ff;
    color: white;
  }
  
  .create-button:hover:not(:disabled) {
    background-color: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
  
  .create-button:disabled {
    background-color: #505050;
    color: #aaa;
    cursor: not-allowed;
  }
  
  .back-button {
    background-color: transparent;
    color: #bbb;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  @media (min-width: 768px) {
    .action-buttons {
      flex-direction: row;
      justify-content: space-between;
    }
    
    .create-button, .back-button {
      width: 48%;
    }
  }
  </style>