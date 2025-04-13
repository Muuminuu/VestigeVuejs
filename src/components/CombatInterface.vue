<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { CombatSystem, type CombatAction, type CombatResult } from '../core/systems/CombatSystems'
import { Enemy } from '../core/entities/Enemy'
import { EnemyType } from '../core/types/EnemyType'
import { DamageType } from '../core/types/DamageType'
import { TargetType } from '../core/types/TargetType'
import { Hero } from '../core/entities/Hero'
import { v4 as uuidv4 } from 'uuid' // Vous devrez installer ce package

const gameStore = useGameStore()
const combatSystem = ref<CombatSystem | null>(null)
const combatLog = ref<CombatAction[]>([])
const showResults = ref(false)
const combatResult = ref<CombatResult | null>(null)

const hero = computed(() => gameStore.hero)
const enemy = ref<Enemy | null>(null)
const isHeroTurn = computed(() => combatSystem.value?.getState().isHeroTurn || false)
const inProgress = computed(() => combatSystem.value?.getState().inProgress || false)

// Génération aléatoire d'un ennemi
function generateRandomEnemy() {
  if (!hero.value) return null
  
  const enemyTypes = Object.values(EnemyType)
  const selectedType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
  
  const enemyLevel = Math.max(1, hero.value.level + Math.floor(Math.random() * 3) - 1)
  const levelMultiplier = 1 + (enemyLevel - 1) * 0.2
  
  // Statistiques de base basées sur le niveau
  const stats = {
    maxHealth: Math.floor(50 + (enemyLevel * 10)),
    currentHealth: Math.floor(50 + (enemyLevel * 10)),
    healthRegen: 0.5,
    stamina: 50,
    maxStamina: 50,
    staminaRegen: 1,
    vitality: 30,
    maxVitality: 30,
    vitalityRegen: 0.5,
    vitalEnergy: 30,
    maxVitalEnergy: 30,
    vitalEnergyRegen: 0.5,
    attack: Math.floor(10 * levelMultiplier),
    defense: Math.floor(5 * levelMultiplier),
    speed: Math.floor(5 * levelMultiplier)
  }
  
  // Noms possibles d'ennemis selon le type
  const namesByType = {
    [EnemyType.UNDEAD]: ['Skeleton Warrior', 'Zombie', 'Ghoul', 'Wraith', 'Revenant'],
    [EnemyType.DEMON]: ['Imp', 'Hellhound', 'Succubus', 'Pit Fiend', 'Abyssal Horror'],
    [EnemyType.ELEMENTAL]: ['Fire Sprite', 'Stone Golem', 'Water Elemental', 'Thunder Spirit', 'Wind Sylph'],
    [EnemyType.DRAGON]: ['Drake', 'Wyvern', 'Young Dragon', 'Elder Wyrm', 'Dragon Whelp'],
    [EnemyType.SPIRIT]: ['Phantom', 'Wisp', 'Banshee', 'Poltergeist', 'Ancestral Spirit']
  }
  
  const possibleNames = namesByType[selectedType]
  const enemyName = possibleNames[Math.floor(Math.random() * possibleNames.length)]
  
  // Créer l'ennemi
  const newEnemy = new Enemy(uuidv4(), enemyName, stats, selectedType)
  
  // Ajouter quelques capacités basiques
  newEnemy.abilities.push({
    id: uuidv4(),
    name: 'Slam',
    description: 'A powerful physical attack',
    power: 120,
    cooldown: 3,
    currentCooldown: 0,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    manaCost: 5,
    isPassive: false
  })
  
  // Ajouter une capacité spéciale basée sur le type
  switch (selectedType) {
    case EnemyType.UNDEAD:
      newEnemy.abilities.push({
        id: uuidv4(),
        name: 'Death Touch',
        description: 'Drains life with a necrotic touch',
        power: 80,
        cooldown: 4,
        currentCooldown: 0,
        targetType: TargetType.SINGLE,
        damageType: DamageType.DARK,
        manaCost: 10,
        isPassive: false
      })
      break
    case EnemyType.DEMON:
      newEnemy.abilities.push({
        id: uuidv4(),
        name: 'Hellfire',
        description: 'Engulfs the enemy in demonic flames',
        power: 90,
        cooldown: 3,
        currentCooldown: 0,
        targetType: TargetType.SINGLE,
        damageType: DamageType.FIRE,
        manaCost: 12,
        isPassive: false
      })
      break
    // Ajoutez d'autres cas pour les différents types d'ennemis
  }
  
  return newEnemy
}

// Démarrer un nouveau combat
function startCombat() {
  if (!hero.value) return
  
  // Générer un ennemi aléatoire
  const newEnemy = generateRandomEnemy()
  if (!newEnemy) return
  
  enemy.value = newEnemy
  
  // Initialiser le système de combat
  combatSystem.value = new CombatSystem(hero.value as Hero, newEnemy)
  
  // Réinitialiser les logs et les résultats
  combatLog.value = []
  showResults.value = false
  combatResult.value = null
}

// Utiliser une capacité de héros
function useHeroAbility(abilityId?: string) {
  if (!combatSystem.value || !hero.value || !isHeroTurn.value) return
  
  let ability
  if (abilityId) {
    ability = hero.value.abilities.find(a => a.id === abilityId)
    if (!ability || ability.currentCooldown > 0) return
  }
  
  // Exécuter l'action du héros
  const heroAction = combatSystem.value.performHeroAction(ability)
  if (heroAction) {
    combatLog.value.push(heroAction)
  }
  
  // Si le combat est toujours en cours, exécuter l'action de l'ennemi après un court délai
  if (combatSystem.value.getState().inProgress) {
    setTimeout(() => {
      if (!combatSystem.value) return
      
      const enemyAction = combatSystem.value.performEnemyAction()
      if (enemyAction) {
        combatLog.value.push(enemyAction)
      }
      
      // Vérifier si le combat est terminé
      if (!combatSystem.value.getState().inProgress) {
        endCombat()
      }
    }, 1000)
  } else {
    // Le combat est terminé après l'action du héros
    endCombat()
  }
}

// Terminer le combat et afficher les résultats
function endCombat() {
  if (!combatSystem.value) return
  
  // Obtenir les résultats du combat
  combatResult.value = combatSystem.value.getCombatResult()
  showResults.value = true
  
  // Si le héros est mort, créer un vestige
  if (!combatResult.value.victory && hero.value && hero.value.stats.currentHealth <= 0) {
    gameStore.handleHeroDeath()
  }
}

// Action suite aux résultats du combat
function handleCombatResults() {
  // Réinitialiser pour un nouveau combat
  showResults.value = false
  enemy.value = null
  combatSystem.value = null
}

// Démarrer un combat au chargement du composant
onMounted(() => {
  if (hero.value && !enemy.value) {
    startCombat()
  }
})

// Formater l'action de combat pour le log
function formatActionMessage(action: CombatAction): string {
  const actorName = action.actor.name
  const targetName = action.target.name
  
  let message = ''
  
  if (action.ability) {
    message = `${actorName} uses ${action.ability.name} on ${targetName}`
  } else {
    message = `${actorName} attacks ${targetName}`
  }
  
  message += ` for ${action.damage} ${action.damageType.toLowerCase()} damage`
  
  if (action.isCritical) {
    message += ' (Critical Hit!)'
  }
  
  return message
}
</script>

<template>
  <div class="combat-interface">
    <div v-if="!inProgress && !showResults" class="combat-start">
      <h2>Prepare for Battle</h2>
      <button class="start-button" @click="startCombat">Start Combat</button>
    </div>
    
    <div v-else-if="showResults" class="combat-results">
      <h2>{{ combatResult?.victory ? 'Victory!' : 'Defeat...' }}</h2>
      
      <div class="result-summary">
        <p v-if="combatResult?.victory">
          You have defeated the enemy! Your hero survived with {{ combatResult.remainingHealth }} health.
        </p>
        <p v-else>
          Your hero has fallen in battle. However, their essence lives on as a vestige.
        </p>
        
        <p v-if="combatResult?.victory">
          Experience gained: {{ combatResult.experienceGained }}
        </p>
        
        <p>
          Combat lasted {{ combatResult?.turnsElapsed }} turns.
        </p>
      </div>
      
      <button class="continue-button" @click="handleCombatResults">
        {{ combatResult?.victory ? 'Continue' : 'Accept Fate' }}
      </button>
    </div>
    
    <div v-else class="active-combat">
      <div class="combat-arena">
        <div class="combatant hero-side" v-if="hero">
          <h3>{{ hero.name }}</h3>
          <div class="health-bar">
            <div class="health-remaining" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
            <span class="health-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
          </div>
        </div>
        
        <div class="combat-vs">VS</div>
        
        <div class="combatant enemy-side" v-if="enemy">
          <h3>{{ enemy.name }}</h3>
          <div class="health-bar">
            <div class="health-remaining" :style="{ width: `${(enemy.stats.currentHealth / enemy.stats.maxHealth) * 100}%` }"></div>
            <span class="health-text">{{ enemy.stats.currentHealth }} / {{ enemy.stats.maxHealth }}</span>
          </div>
        </div>
      </div>
      
      <div class="combat-log">
        <h3>Combat Log</h3>
        <div class="log-entries">
          <div v-for="(action, index) in combatLog" :key="index" class="log-entry">
            {{ formatActionMessage(action) }}
          </div>
          <div v-if="combatLog.length === 0" class="log-entry">
            Combat has begun! Prepare for battle.
          </div>
        </div>
      </div>
      
      <div class="combat-actions" v-if="isHeroTurn && hero">
        <h3>Your Turn</h3>
        <button class="action-button basic-attack" @click="useHeroAbility()">
          Basic Attack
        </button>
        
        <div class="abilities-container">
          <button 
            v-for="ability in hero.abilities" 
            :key="ability.id"
            class="action-button ability-button"
            :class="{ 'cooldown': ability.currentCooldown > 0 }"
            :disabled="ability.currentCooldown > 0"
            @click="useHeroAbility(ability.id)"
          >
            {{ ability.name }}
            <span v-if="ability.currentCooldown > 0" class="cooldown-counter">
              ({{ ability.currentCooldown }})
            </span>
          </button>
        </div>
      </div>
      
      <div class="enemy-turn" v-else-if="!isHeroTurn">
        <h3>Enemy's Turn</h3>
        <p>The enemy is preparing to attack...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.combat-interface {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.combat-start, .combat-results {
  text-align: center;
  padding: 30px 0;
}

.start-button, .continue-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover, .continue-button:hover {
  background-color: #40a9ff;
}

.result-summary {
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  text-align: left;
}

.combat-arena {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.combatant {
  flex: 1;
  padding: 15px;
  border-radius: 6px;
  background-color: white;
}

.hero-side {
  margin-right: 10px;
}

.enemy-side {
  margin-left: 10px;
}

.combat-vs {
  font-weight: bold;
  font-size: 1.5rem;
  color: #ff4d4f;
  margin: 0 10px;
}

.health-bar {
  position: relative;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.health-remaining {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #52c41a;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.health-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #000;
  line-height: 20px;
  z-index: 1;
}

.combat-log {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
}

.log-entries {
  max-height: 150px;
  overflow-y: auto;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.combat-actions {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
}

.action-button {
  padding: 10px 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.basic-attack {
  background-color: #1890ff;
  color: white;
}

.basic-attack:hover {
  background-color: #40a9ff;
}

.ability-button {
  background-color: #722ed1;
  color: white;
}

.ability-button:hover {
  background-color: #9254de;
}

.ability-button.cooldown {
  background-color: #d9d9d9;
  color: #666;
  cursor: not-allowed;
}

.abilities-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}

.cooldown-counter {
  font-size: 0.8rem;
  margin-left: 5px;
}

.enemy-turn {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  color: #ff4d4f;
}
</style>