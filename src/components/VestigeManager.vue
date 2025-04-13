<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Vestige } from '../core/types/Vestige'

const gameStore = useGameStore()

const availableVestiges = computed(() => {
  return gameStore.vestiges
})

const hasVestiges = computed(() => {
  return availableVestiges.value.length > 0
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

function getVestigeBonusDescription(vestige: Vestige): string {
  let description = vestige.bonus.description
  
  if (vestige.bonus.statBonuses) {
    const stats = vestige.bonus.statBonuses
    
    const bonuses = []
    if (stats.maxHealth) bonuses.push(`+${stats.maxHealth} Health`)
    if (stats.attack) bonuses.push(`+${stats.attack} Attack`)
    if (stats.defense) bonuses.push(`+${stats.defense} Defense`)
    if (stats.speed) bonuses.push(`+${stats.speed} Speed`)
    
    if (bonuses.length > 0) {
      description += ` (${bonuses.join(', ')})`
    }
  }
  
  if (vestige.bonus.ability) {
    description += ` Grants ability: ${vestige.bonus.ability.name}`
  }
  
  return description
}
</script>

<template>
  <div class="vestige-manager">
    <h2>Legacy Vestiges</h2>
    
    <div v-if="!hasVestiges" class="no-vestiges">
      <p>No vestiges available. When your heroes fall in battle, their essence will remain here as vestiges.</p>
    </div>
    
    <div v-else class="vestiges-container">
      <div v-for="vestige in availableVestiges" :key="vestige.id" class="vestige-card">
        <div class="vestige-header">
          <h3>{{ vestige.name }}</h3>
          <span class="vestige-level">Level {{ vestige.level }}</span>
        </div>
        
        <div class="vestige-description">
          {{ vestige.description }}
        </div>
        
        <div class="vestige-bonus">
          <strong>Legacy Bonus:</strong> {{ getVestigeBonusDescription(vestige) }}
        </div>
        
        <div class="vestige-acquisition">
          Acquired: {{ formatDate(vestige.acquisitionDate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vestige-manager {
  padding: 20px;
}

.no-vestiges {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.vestiges-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.vestige-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.vestige-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.vestige-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.vestige-header h3 {
  margin: 0;
  color: #1890ff;
}

.vestige-level {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.vestige-class {
  font-style: italic;
  color: #666;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.vestige-description {
  margin-bottom: 10px;
  font-size: 0.9em;
}

.vestige-bonus {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 0.9em;
}

.vestige-acquisition {
  font-size: 0.8em;
  color: #999;
  text-align: right;
}
</style>