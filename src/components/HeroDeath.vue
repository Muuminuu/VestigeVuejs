<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const showDeathScreen = ref(false)
const newVestigeName = ref('')

const hero = computed(() => gameStore.hero)

function simulateDeath() {
  if (!hero.value) return
  
  // Save the hero's name for the vestige
  newVestigeName.value = `${hero.value.name}'s Vestige`
  
  // Show death screen
  showDeathScreen.value = true
}

function confirmDeath() {
  // Handle hero death, which will create a vestige
  gameStore.handleHeroDeath()
  
  // Reset and close death screen
  showDeathScreen.value = false
  newVestigeName.value = ''
}

function cancelDeath() {
  // Just close the death screen without creating a vestige
  showDeathScreen.value = false
  newVestigeName.value = ''
}
</script>

<template>
  <div class="hero-death">
    <button 
      v-if="hero" 
      class="simulate-death-button" 
      @click="simulateDeath"
    >
      Simulate Hero Death
    </button>
    
    <!-- Death confirmation modal -->
    <div v-if="showDeathScreen" class="death-modal">
      <div class="death-modal-content">
        <h2>Your Hero Has Fallen</h2>
        
        <p>{{ hero?.name }} has been defeated. Their essence will remain as a vestige, ready to empower a future hero.</p>
        
        <div class="vestige-preview">
          <h3>{{ newVestigeName }}</h3>
          <p>Level {{ hero?.level }} {{ hero?.characterClass }}</p>
          <p>This vestige will contain a portion of {{ hero?.name }}'s power and possibly one of their abilities.</p>
        </div>
        
        <div class="action-buttons">
          <button class="confirm-button" @click="confirmDeath">Accept Fate</button>
          <button class="cancel-button" @click="cancelDeath">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-death {
  margin: 20px 0;
}

.simulate-death-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.simulate-death-button:hover {
  background-color: #fafafa;
}ff7875;
}

.death-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.death-modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.death-modal-content h2 {
  color: #ff4d4f;
  margin-top: 0;
}

.vestige-preview {
  margin: 30px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.vestige-preview h3 {
  margin-top: 0;
  color: #1890ff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.confirm-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.confirm-button:hover {
  background-color: #40a9ff;
}

.cancel-button {
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid #d9d9d9;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* .cancel-button:hover {
  background-color: # */