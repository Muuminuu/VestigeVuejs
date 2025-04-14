<template>
  <div class="hero-display">
    <h2>{{ hero.name }}</h2>
    <div class="hero-level">Niveau {{ hero.level }}</div>
    
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
            <span class="stat-value">{{ hero.stats.stamina || 0 }} / {{ hero.stats.maxStamina || 0 }}</span>
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
            {{ hero.experience || 0 }} / {{ experienceForNextLevel }} XP
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
              <span class="ability-type">{{ ability.damageType || 'PHYSIQUE' }}</span>
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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  hero: {
    type: Object,
    required: true
  }
});

// Calcul du pourcentage d'expérience et de l'expérience nécessaire pour le niveau suivant
const experienceForNextLevel = computed(() => {
  return props.hero.experienceForNextLevel || props.hero.level * 100;
});

const experiencePercentage = computed(() => {
  const experience = props.hero.experience || 0;
  return (experience / experienceForNextLevel.value) * 100;
});
</script>

<style scoped>
.hero-display {
  padding: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 5px;
  color: var(--primary-color);
  font-size: 1.8rem;
}

.hero-level {
  display: inline-block;
  background-color: #e6f7ff;
  color: var(--primary-color);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero-sections {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.hero-section {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.stat-item {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  font-weight: bold;
  color: #666;
}

.stat-value {
  color: var(--primary-color);
  font-weight: bold;
}

.experience-bar {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.exp-fill {
  height: 100%;
  background-color: var(--success-color);
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
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

.abilities-list, .vestiges-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.ability-item, .vestige-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px;
}

.ability-header, .vestige-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ability-name, .vestige-name {
  font-weight: bold;
  color: var(--primary-color);
}

.ability-type {
  padding: 3px 10px;
  background-color: #e6f7ff;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--primary-color);
}

.vestige-level {
  padding: 3px 10px;
  background-color: #f6ffed;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--success-color);
}

.ability-description, .vestige-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.no-abilities, .no-vestiges {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .hero-sections {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .abilities-list, .vestiges-list {
    grid-template-columns: 1fr;
  }
}
</style>