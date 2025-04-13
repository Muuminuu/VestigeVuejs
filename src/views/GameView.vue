<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import HeroCreation from '../components/HeroCreation.vue'
import HeroDisplay from '../components/HeroDisplay.vue'
import HeroDeath from '../components/HeroDeath.vue'
import VestigeManager from '../core/managers/VestigeManager'
import CombatInterface from '../components/CombatInterface.vue'

const gameStore = useGameStore()
const hasHero = computed(() => !!gameStore.hero)
const showCombat = ref(false)

function startCombat() {
  showCombat.value = true
}

function endCombat() {
  showCombat.value = false
}
</script>

<template>
  <div class="game-view">
    <h1>Vestige: The Legacy Game</h1>
    
    <div class="game-container">
      <div class="game-panel main-panel">
        <HeroCreation v-if="!hasHero" />
        <div v-else-if="!showCombat" class="active-hero-container">
          <HeroDisplay />
          <div class="hero-actions">
            <button class="combat-button" @click="startCombat">Start Combat</button>
            <HeroDeath />
          </div>
        </div>
        <CombatInterface v-else-if="showCombat" @combat-end="endCombat" />
      </div>
      
      <div class="game-panel side-panel">
        <VestigeManager />
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #1890ff;
}

.game-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.game-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.active-hero-container {
  display: flex;
  flex-direction: column;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.combat-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.combat-button:hover {
  background-color: #40a9ff;
}

@media (max-width: 768px) {
  .game-container {
    grid-template-columns: 1fr;
  }
}
</style>