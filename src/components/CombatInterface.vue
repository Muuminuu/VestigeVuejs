<template>
  <div class="combat-interface">
    <div v-if="inProgress" class="combat-area">
      <div class="combat-header">
        <h2>Combat</h2>
        <div class="turn-indicator">Tour {{ state.currentTurn }} - {{ state.isHeroTurn ? 'Votre tour' : 'Tour de l\'ennemi' }}</div>
      </div>
      
      <div class="combat-arena">
        <div class="combatant hero-side">
          <h3>{{ hero.name }}</h3>
          <div class="health-bar">
            <div class="health-fill" :style="{ width: `${(hero.stats.currentHealth / hero.stats.maxHealth) * 100}%` }"></div>
            <span class="health-text">{{ hero.stats.currentHealth }} / {{ hero.stats.maxHealth }}</span>
          </div>
        </div>
        
        <div class="combat-vs">VS</div>
        
        <div class="combatant enemy-side">
          <h3>{{ enemy.name }}</h3>
          <div class="health-bar">
            <div class="health-fill" :style="{ width: `${(enemy.stats.currentHealth / enemy.stats.maxHealth) * 100}%` }"></div>
            <span class="health-text">{{ enemy.stats.currentHealth }} / {{ enemy.stats.maxHealth }}</span>
          </div>
        </div>
      </div>
      
      <div class="combat-log">
        <h3>Journal de combat</h3>
        <div class="log-entries">
          <div v-for="(action, index) in combatLog" :key="index" class="log-entry">
            {{ formatActionMessage(action) }}
          </div>
          <div v-if="combatLog.length === 0" class="log-entry">
            Le combat commence ! Préparez-vous...
          </div>
        </div>
      </div>
      
      <div v-if="state.isHeroTurn" class="combat-actions">
        <button class="action-button basic-attack" @click="performHeroAction()">
          Attaque de base
        </button>
        
        <div class="abilities-container">
          <button 
            v-for="ability in hero.abilities" 
            :key="ability.id"
            class="action-button ability-button"
            :class="{ 'cooldown': ability.currentCooldown > 0 }"
            :disabled="ability.currentCooldown > 0"
            @click="performHeroAction(ability)"
          >
            {{ ability.name }}
            <span v-if="ability.currentCooldown > 0" class="cooldown-counter">
              ({{ ability.currentCooldown }})
            </span>
          </button>
        </div>
      </div>
      
      <div v-else class="enemy-turn">
        <p>{{ enemy.name }} prépare son attaque...</p>
      </div>
    </div>
    
    <div v-else class="combat-results">
      <h2>{{ combatResult.victory ? 'Victoire !' : 'Défaite...' }}</h2>
      
      <div class="result-summary">
        <p v-if="combatResult.victory">
          Vous avez vaincu {{ enemy.name }} ! Votre héros a survécu avec {{ combatResult.remainingHealth }} points de vie.
        </p>
        <p v-else>
          Votre héros a été vaincu par {{ enemy.name }}. Cependant, son essence vivra en tant que vestige.
        </p>
        
        <p v-if="combatResult.victory">
          Expérience gagnée : <span class="xp-gained">{{ combatResult.experienceGained }} XP</span>
        </p>
        
        <p>
          Le combat a duré {{ combatResult.turnsElapsed }} tours.
        </p>
      </div>
      
      <button class="continue-button" @click="endCombat">
        {{ combatResult.victory ? 'Continuer' : 'Accepter le destin' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { v4 as uuidv4 } from 'uuid';
import { DamageType } from '../core/types/DamageType';
import { TargetType } from '../core/types/TargetType';

const emit = defineEmits(['end-combat']);
const gameStore = useGameStore();

// État du combat
const inProgress = ref(true);
const combatLog = ref([]);
const combatResult = ref({
  victory: false,
  remainingHealth: 0,
  turnsElapsed: 0,
  experienceGained: 0
});

// Combattants
const hero = computed(() => gameStore.hero);
const enemy = ref(null);

// État du système de combat
const state = ref({
  currentTurn: 1,
  isHeroTurn: true,
  inProgress: true
});

// Initialiser le combat
onMounted(() => {
  generateEnemy();
  startCombat();
});

// Générer un ennemi aléatoire
function generateEnemy() {
  if (!hero.value) return;
  
  const enemyTypes = ['UNDEAD', 'DEMON', 'ELEMENTAL', 'DRAGON', 'SPIRIT'];
  const enemyNames = {
    'UNDEAD': ['Zombie Putride', 'Squelette Guerrier', 'Revenant', 'Goule'],
    'DEMON': ['Imp Maléfique', 'Chasseur Infernal', 'Démon Mineur', 'Succube'],
    'ELEMENTAL': ['Élémentaire de Feu', 'Élémentaire de Glace', 'Esprit de la Tempête'],
    'DRAGON': ['Jeune Drake', 'Wyverne', 'Dragonnet'],
    'SPIRIT': ['Fantôme Errant', 'Esprit Vengeur', 'Âme Tourmentée']
  };
  
  // Sélectionner aléatoirement un type d'ennemi
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  
  // Sélectionner aléatoirement un nom d'ennemi du type choisi
  const enemyName = enemyNames[enemyType][Math.floor(Math.random() * enemyNames[enemyType].length)];
  
  // Calculer le niveau de l'ennemi (niveau du héros +/- 2)
  const heroLevel = hero.value.level || 1;
  const enemyLevel = Math.max(1, heroLevel + Math.floor(Math.random() * 3) - 1);
  
  // Calculer les statistiques de l'ennemi en fonction de son niveau
  const levelMultiplier = 1 + (enemyLevel - 1) * 0.2;
  
  // Créer l'ennemi
  enemy.value = {
    id: uuidv4(),
    name: enemyName,
    level: enemyLevel,
    type: enemyType,
    stats: {
      maxHealth: Math.floor(50 + (enemyLevel * 15)),
      currentHealth: Math.floor(50 + (enemyLevel * 15)),
      attack: Math.floor(10 * levelMultiplier),
      defense: Math.floor(7 * levelMultiplier),
      speed: Math.floor(5 * levelMultiplier),
      stamina: 50,
      maxStamina: 50
    },
    abilities: [
      {
        id: uuidv4(),
        name: "Frappe Brutale",
        description: "Une attaque puissante qui inflige des dégâts importants.",
        power: 120,
        cooldown: 3,
        currentCooldown: 0,
        targetType: TargetType.SINGLE,
        damageType: DamageType.PHYSICAL,
        manaCost: 0,
        isPassive: false
      }
    ]
  };
  
  // Ajouter une capacité spéciale en fonction du type
  if (enemyType === 'UNDEAD') {
    enemy.value.abilities.push({
      id: uuidv4(),
      name: "Toucher Morbide",
      description: "Un toucher qui draine la vie et inflige des dégâts d'ombre.",
      power: 90,
      cooldown: 3,
      currentCooldown: 0,
      targetType: TargetType.SINGLE,
      damageType: DamageType.DARK,
      manaCost: 0,
      isPassive: false
    });
  } else if (enemyType === 'DEMON') {
    enemy.value.abilities.push({
      id: uuidv4(),
      name: "Flammes Infernales",
      description: "Brûle l'adversaire avec des flammes démoniaques.",
      power: 100,
      cooldown: 2,
      currentCooldown: 0,
      targetType: TargetType.SINGLE,
      damageType: DamageType.FIRE,
      manaCost: 0,
      isPassive: false
    });
  } else if (enemyType === 'DRAGON') {
    enemy.value.abilities.push({
      id: uuidv4(),
      name: "Souffle de Feu",
      description: "Crache un jet de flammes dévastatrices.",
      power: 150,
      cooldown: 4,
      currentCooldown: 0,
      targetType: TargetType.SINGLE,
      damageType: DamageType.FIRE,
      manaCost: 0,
      isPassive: false
    });
  }
}

// Démarrer le combat
function startCombat() {
  state.value = {
    currentTurn: 1,
    isHeroTurn: true,
    inProgress: true
  };
  
  combatLog.value = [];
  inProgress.value = true;
}

// Effectuer une action de héros
function performHeroAction(ability = null) {
  if (!state.value.isHeroTurn || !state.value.inProgress) return;
  
  let damage = calculateDamage(hero.value, enemy.value, ability);
  let isCritical = Math.random() < 0.1; // 10% de chance de critique
  
  if (isCritical) {
    damage = Math.floor(damage * 1.5);
  }
  
  // Créer l'action
  const action = {
    actor: hero.value,
    target: enemy.value,
    ability: ability,
    damage: damage,
    damageType: ability ? ability.damageType : DamageType.PHYSICAL,
    isCritical: isCritical
  };
  
  // Appliquer les dégâts
  enemy.value.stats.currentHealth = Math.max(0, enemy.value.stats.currentHealth - damage);
  
  // Ajouter l'action au journal
  combatLog.value.push(action);
  
  // Mettre à jour le cooldown de l'aptitude utilisée
  if (ability) {
    ability.currentCooldown = ability.cooldown;
  }
  
  // Vérifier si l'ennemi est vaincu
  if (enemy.value.stats.currentHealth <= 0) {
    finishCombat(true);
    return;
  }
  
  // Tour de l'ennemi
  state.value.isHeroTurn = false;
  
  // Effectuer l'action de l'ennemi après un délai
  setTimeout(() => {
    performEnemyAction();
  }, 1000);
}

// Effectuer une action d'ennemi
function performEnemyAction() {
  if (state.value.isHeroTurn || !state.value.inProgress) return;
  
  // Sélectionner une capacité si disponible
  const availableAbilities = enemy.value.abilities.filter(a => a.currentCooldown <= 0);
  const ability = availableAbilities.length > 0 
    ? availableAbilities[Math.floor(Math.random() * availableAbilities.length)]
    : null;
  
  let damage = calculateDamage(enemy.value, hero.value, ability);
  let isCritical = Math.random() < 0.05; // 5% de chance de critique
  
  if (isCritical) {
    damage = Math.floor(damage * 1.5);
  }
  
  // Créer l'action
  const action = {
    actor: enemy.value,
    target: hero.value,
    ability: ability,
    damage: damage,
    damageType: ability ? ability.damageType : DamageType.PHYSICAL,
    isCritical: isCritical
  };
  
  // Appliquer les dégâts
  hero.value.stats.currentHealth = Math.max(0, hero.value.stats.currentHealth - damage);
  
  // Mettre à jour l'état du héros dans le store
  gameStore.updateHeroStats({ 
    currentHealth: hero.value.stats.currentHealth 
  });
  
  // Ajouter l'action au journal
  combatLog.value.push(action);
  
  // Mettre à jour les cooldowns des capacités
  enemy.value.abilities.forEach(a => {
    if (a.currentCooldown > 0) {
      a.currentCooldown--;
    }
  });
  
  if (ability) {
    ability.currentCooldown = ability.cooldown;
  }
  
  // Vérifier si le héros est vaincu
  if (hero.value.stats.currentHealth <= 0) {
    finishCombat(false);
    return;
  }
  
  // Passer au tour suivant
  state.value.currentTurn++;
  state.value.isHeroTurn = true;
  
  // Réduire les cooldowns des capacités du héros
  hero.value.abilities.forEach(a => {
    if (a.currentCooldown > 0) {
      a.currentCooldown--;
    }
  });
}

// Calculer les dégâts
function calculateDamage(attacker, defender, ability = null) {
  if (ability) {
    // Dégâts de capacité
    const baseDamage = ability.power * (attacker.stats.attack / 100);
    const randomFactor = 0.9 + Math.random() * 0.2; // 90% à 110% de dégâts
    return Math.floor(baseDamage * randomFactor);
  } else {
    // Dégâts d'attaque de base
    const baseDamage = Math.max(1, attacker.stats.attack - (defender.stats.defense / 2));
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% à 120% de dégâts
    return Math.floor(baseDamage * randomFactor);
  }
}

// Formater le message d'action pour le journal
function formatActionMessage(action) {
  const actorName = action.actor.name;
  const targetName = action.target.name;
  let message = '';
  
  if (action.ability) {
    message = `${actorName} utilise ${action.ability.name} sur ${targetName}`;
  } else {
    message = `${actorName} attaque ${targetName}`;
  }
  
  message += ` pour ${action.damage} points de dégâts`;
  if (action.isCritical) {
    message += ' (Coup Critique!)';
  }
  
  return message;
}

// Finaliser le combat
function finishCombat(victory) {
  state.value.inProgress = false;
  inProgress.value = false;
  
  // Calculer l'expérience gagnée (seulement en cas de victoire)
  let xpGained = 0;
  if (victory) {
    const levelDifference = enemy.value.level - hero.value.level;
    const baseXP = 20 * enemy.value.level;
    const levelModifier = 1 + Math.max(-0.5, Math.min(0.5, levelDifference * 0.1));
    
    xpGained = Math.floor(baseXP * levelModifier);
    
    // Donner l'expérience au héros
    gameStore.addExperience(xpGained);
  }
  
  // Préparer les résultats du combat
  combatResult.value = {
    victory: victory,
    remainingHealth: hero.value.stats.currentHealth,
    turnsElapsed: state.value.currentTurn,
    experienceGained: xpGained
  };
  
  // Si défaite, préparer la mort du héros mais ne pas l'exécuter encore
  // Cela sera géré lors de la confirmation par le joueur
}

// Terminer le combat
function endCombat() {
  // Si le héros a été vaincu, le gérer immédiatement
  if (!combatResult.value.victory) {
    gameStore.handleHeroDeath();
  }
  
  // Émettre l'événement de fin de combat
  emit('end-combat');
}
</script>

<style scoped>
.combat-interface {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.combat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.combat-header h2 {
  margin: 0;
  color: var(--primary-color);
}

.turn-indicator {
  padding: 6px 12px;
  background-color: var(--bg-secondary);
  border-radius: 6px;
  font-weight: bold;
}

.combat-arena {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.combatant {
  flex: 1;
  text-align: center;
  background-color: var(--bg-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.combatant h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.combat-vs {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--danger-color);
}

.health-bar {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.health-fill {
  height: 100%;
  background-color: var(--success-color);
  transition: width 0.3s ease;
}

.enemy-side .health-fill {
  background-color: var(--danger-color);
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

.combat-log {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.combat-log h3 {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.log-entries {
  max-height: 150px;
  overflow-y: auto;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid var(--border-color);
}

.log-entry:last-child {
  border-bottom: none;
}

.combat-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.basic-attack {
  background-color: var(--primary-color);
  color: white;
}

.basic-attack:hover {
  background-color: var(--primary-hover);
}

.abilities-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ability-button {
  background-color: #722ed1;
  color: white;
  flex: 1;
  min-width: 150px;
}

.ability-button:hover:not(:disabled) {
  background-color: #9254de;
}

.ability-button.cooldown {
  background-color: #d9d9d9;
  color: #666;
  cursor: not-allowed;
}

.cooldown-counter {
  font-size: 0.8rem;
  opacity: 0.7;
}

.enemy-turn {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  color: var(--danger-color);
  font-style: italic;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.combat-results {
  text-align: center;
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.combat-results h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.result-summary {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.xp-gained {
  font-weight: bold;
  color: #722ed1;
}

.continue-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.continue-button:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 768px) {
  .combat-arena {
    flex-direction: column;
  }
  
  .combat-vs {
    margin: 10px 0;
  }
  
  .abilities-container {
    flex-direction: column;
  }
}
</style>