<template>
  <div class="hero-view">
    <h2>Fiche de Héros</h2>
    
    <div class="hero-sections">
      <div class="hero-section">
        <h3>Statistiques</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-name">Santé:</span>
            <span class="stat-value">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Attaque:</span>
            <span class="stat-value">{{ hero.stats.attack }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Défense:</span>
            <span class="stat-value">{{ hero.stats.defense }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Vitesse:</span>
            <span class="stat-value">{{ hero.stats.speed }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Endurance:</span>
            <span class="stat-value">{{ hero.stats.currentStamina || 0 }} / {{ hero.stats.maxStamina || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Régén. Santé:</span>
            <span class="stat-value">{{ hero.stats.healthRegen }}/s</span>
          </div>
        </div>
      </div>
      
      <div class="hero-section">
        <h3>Progression</h3>
        <div class="experience-bar">
          <div class="exp-fill" :style="{ width: `${experiencePercentage}%` }"></div>
          <span class="exp-text">
            Niveau {{ hero.level }} - {{ hero.experience }} / {{ hero.experienceForNextLevel }} XP
          </span>
        </div>
      </div>
    </div>
    
    <div class="hero-sections">
      <div class="hero-section">
        <h3>Capacités</h3>
        <div class="abilities-list" v-if="hero.abilities && hero.abilities.length > 0">
          <div v-for="(ability, index) in hero.abilities" :key="index" class="ability-item">
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
        <div class="vestiges-list" v-if="hero.vestiges && hero.vestiges.length > 0">
          <div v-for="(vestige, index) in hero.vestiges" :key="index" class="vestige-item">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  hero: {
    type: Object,
    required: true
  }
});

// Calcul du pourcentage d'expérience
const experiencePercentage = computed(() => {
  if (!props.hero || !props.hero.experienceForNextLevel) return 0;
  return (props.hero.experience / props.hero.experienceForNextLevel) * 100;
});
</script>

<style scoped>
.hero-view {
  width: 100%;
  height: 100%;
  color: #e8e8e8;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1890ff;
  font-size: 22px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #ccc;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.hero-sections {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.hero-section {
  flex: 1;
  background-color: rgba(40, 40, 50, 0.5);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
}

.stat-name {
  font-weight: bold;
  color: #ccc;
}

.stat-value {
  color: #1890ff;
  font-weight: bold;
}

.experience-bar {
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
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
  font-size: 14px;
}

.abilities-list, .vestiges-list {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

.ability-item, .vestige-item {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  padding: 3px 10px;
  background-color: rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: #1890ff;
}

.vestige-level {
  padding: 3px 10px;
  background-color: rgba(82, 196, 26, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: #52c41a;
}

.ability-description, .vestige-description {
  font-size: 14px;
  color: #bbb;
  line-height: 1.5;
}

.no-abilities, .no-vestiges {
  padding: 30px;
  text-align: center;
  color: #777;
  font-style: italic;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}
</style>