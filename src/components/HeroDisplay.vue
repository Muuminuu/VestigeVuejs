<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const hero = computed(() => gameStore.hero)
const heroVestiges = computed(() => hero.value?.vestiges || [])

const hasVestiges = computed(() => heroVestiges.value.length > 0)
</script>

<template>
  <div class="hero-display" v-if="hero">
    <div class="hero-header">
      <h2>{{ hero.name }}</h2>
      <div class="hero-level">Level {{ hero.level }}</div>
    </div>
    
    <div class="hero-stats">
      <div class="stat-group">
        <div class="stat-item">
          <span class="stat-label">Health:</span>
          <span class="stat-value">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Attack:</span>
          <span class="stat-value">{{ hero.stats.attack }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Defense:</span>
          <span class="stat-value">{{ hero.stats.defense }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Speed:</span>
          <span class="stat-value">{{ hero.stats.speed }}</span>
        </div>
      </div>
    </div>
    
    <div class="hero-abilities" v-if="hero.abilities.length > 0">
      <h3>Abilities</h3>
      <div class="abilities-list">
        <div v-for="ability in hero.abilities" :key="ability.id" class="ability-item">
          <div class="ability-name">{{ ability.name }}</div>
          <div class="ability-description">{{ ability.description }}</div>
          <div class="ability-details">
            Power: {{ ability.power }} | Cooldown: {{ ability.cooldown }}s
          </div>
        </div>
      </div>
    </div>
    
    <div class="hero-vestiges" v-if="hasVestiges">
      <h3>Incorporated Vestiges Lineage</h3>
      <div class="vestiges-list">
        <div v-for="vestige in heroVestiges" :key="vestige.id" class="vestige-item">
          <div class="vestige-name">{{ vestige.name }}</div>
          <div class="vestige-description">{{ vestige.bonus.description }}</div>
          <div v-if="vestige.ancestors && vestige.ancestors.length > 0" class="vestige-ancestors">
            <span class="ancestors-label">Legacy contains essences of: </span>
            {{ vestige.ancestors.length }} ancestors
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="no-hero" v-else>
    <p>No active hero. Create a new hero to begin your adventure.</p>
  </div>
</template>

<style scoped>
.hero-display {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.hero-header h2 {
  margin: 0;
  color: #1890ff;
}

.hero-level {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: bold;
}

.hero-stats {
  margin-bottom: 20px;
}

.stat-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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

.hero-abilities, .hero-vestiges {
  margin-top: 20px;
}

.hero-abilities h3, .hero-vestiges h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.abilities-list, .vestiges-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.ability-item, .vestige-item {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.ability-name, .vestige-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #1890ff;
}

.ability-description, .vestige-description {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.ability-details {
  font-size: 0.8em;
  color: #888;
}

.no-hero {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.vestige-ancestors {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

.ancestors-label {
  font-style: italic;
}
</style>