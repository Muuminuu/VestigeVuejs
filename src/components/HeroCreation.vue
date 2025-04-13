<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Vestige } from '../core/types/Vestige'

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
  
  // Reset form
  heroName.value = ''
}

function getVestigeDescription(vestige: Vestige): string {
  let description = `Level ${vestige.level} - ${vestige.description}\n\nBonuses: ${vestige.bonus.description}`
  
  if (vestige.bonus.statBonuses) {
    const stats = vestige.bonus.statBonuses
    description += '\n\nStat bonuses:'
    if (stats.maxHealth) description += `\n• +${stats.maxHealth} Max Health`
    if (stats.attack) description += `\n• +${stats.attack} Attack`
    if (stats.defense) description += `\n• +${stats.defense} Defense`
    if (stats.speed) description += `\n• +${stats.speed} Speed`
    // Add other stats as needed
  }
  
  if (vestige.bonus.ability) {
    const ability = vestige.bonus.ability
    description += `\n\nSpecial Ability: ${ability.name}\n${ability.description}`
  }
  
  return description
}
</script>

<template>
  <div class="hero-creation">
    <h2>Create New Hero</h2>
    
    <div class="form-group">
      <label for="heroName">Hero Name:</label>
      <input 
        id="heroName" 
        v-model="heroName" 
        type="text" 
        placeholder="Enter hero name"
        required
      />
    </div>
    
    <div class="legacy-section" v-if="hasVestiges">
      <h3>Available Legacy Vestiges</h3>
      <p>Your new hero will automatically inherit all available vestiges.</p>
      
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
    
    <button 
      class="create-button" 
      :disabled="!heroName" 
      @click="createHero"
    >
      Create Hero
    </button>
  </div>
</template>

<style scoped>
.hero-creation {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.legacy-section {
  margin-top: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}

.vestiges-list {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 15px;
}

.vestige-item {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vestige-item:hover {
  background-color: #f9f9f9;
}

.vestige-item.selected {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.vestige-item h4 {
  margin-top: 0;
  margin-bottom: 5px;
}

.vestige-item p {
  white-space: pre-line;
  font-size: 0.9em;
  margin: 0;
}

.create-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.create-button:hover {
  background-color: #40a9ff;
}

.create-button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}
</style>