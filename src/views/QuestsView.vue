<template>
  <div class="quests-view">
    <h2>Journal de Quêtes</h2>
    
    <div v-if="hero" class="quests-content">
      <div class="quests-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          Quêtes Actives
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          Quêtes Complétées
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'failed' }"
          @click="activeTab = 'failed'"
        >
          Quêtes Échouées
        </button>
      </div>
      
      <div class="quests-list">
        <div v-if="filteredQuests.length === 0" class="no-quests">
          <p v-if="activeTab === 'active'">Aucune quête active. Explorez le monde pour en découvrir.</p>
          <p v-else-if="activeTab === 'completed'">Aucune quête complétée pour le moment.</p>
          <p v-else>Aucune quête échouée pour le moment.</p>
        </div>
        
        <div v-for="quest in filteredQuests" :key="quest.id" class="quest-card">
          <div class="quest-header">
            <h3 class="quest-title">{{ quest.title }}</h3>
            <span 
              class="quest-difficulty" 
              :class="`difficulty-${quest.difficulty.toLowerCase()}`"
            >
              {{ quest.difficulty }}
            </span>
          </div>
          
          <div class="quest-description">{{ quest.description }}</div>
          
          <div class="quest-objectives">
            <h4>Objectifs:</h4>
            <ul class="objectives-list">
              <li 
                v-for="objective in quest.objectives" 
                :key="objective.id"
                :class="{ 'completed': objective.completed }"
              >
                <span class="objective-status">
                  <span v-if="objective.completed" class="checkmark">✓</span>
                  <span v-else class="pending">○</span>
                </span>
                {{ objective.description }}
                <span v-if="objective.progress" class="objective-progress">
                  ({{ objective.current }}/{{ objective.target }})
                </span>
              </li>
            </ul>
          </div>
          
          <div class="quest-rewards">
            <h4>Récompenses:</h4>
            <div class="rewards-list">
              <div class="reward-item" v-if="quest.rewards.experience">
                <span class="reward-icon xp-icon">★</span>
                <span class="reward-value">{{ quest.rewards.experience }} XP</span>
              </div>
              <div class="reward-item" v-if="quest.rewards.gold">
                <span class="reward-icon gold-icon">⦿</span>
                <span class="reward-value">{{ quest.rewards.gold }} Or</span>
              </div>
              <div class="reward-item" v-for="item in quest.rewards.items" :key="item.id">
                <span class="reward-icon item-icon">⚓</span>
                <span class="reward-value">{{ item.name }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'active'" class="quest-actions">
            <button class="track-button" :class="{ 'tracking': quest.tracking }" @click="toggleTracking(quest)">
              {{ quest.tracking ? 'Suivi actif' : 'Suivre cette quête' }}
            </button>
            <button v-if="quest.canAbandon" class="abandon-button" @click="abandonQuest(quest)">
              Abandonner
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-hero">
      <p>Aucun héros actif. Créez un nouveau héros pour accéder aux quêtes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import type { Quest } from '../core/types/ViewTypes';

const gameStore = useGameStore();
const hero = computed(() => gameStore.hero);
const activeTab = ref('active');

// Données de démonstration pour les quêtes (à remplacer par votre système de quêtes réel)
const quests = ref<Quest[]>([
  {
    id: '1',
    title: "L'Éveil du Vestige",
    description: "Explorez les ruines anciennes où repose le premier vestige et découvrez les secrets de votre héritage.",
    status: 'active',
    difficulty: 'Facile',
    tracking: true,
    canAbandon: true,
    objectives: [
      {
        id: 'obj1-1',
        description: "Atteindre les ruines de l'Ancien Temple",
        completed: true,
        progress: false
      },
      {
        id: 'obj1-2',
        description: "Trouver l'entrée cachée des catacombes",
        completed: false,
        progress: false
      },
      {
        id: 'obj1-3',
        description: "Éliminer les gardiens corrompus",
        completed: false,
        progress: true,
        current: 2,
        target: 5
      },
      {
        id: 'obj1-4',
        description: "Récupérer le Vestige Primordial",
        completed: false,
        progress: false
      }
    ],
    rewards: {
      experience: 500,
      gold: 200,
      items: [
        { id: 'item1', name: "Amulette du Premier Vestige", type: "Accessoire" }
      ]
    }
  },
  {
    id: '2',
    title: "Menace des Profondeurs",
    description: "Des créatures émergent des profondeurs de la terre, menaçant le village de Mirefall. Enquêtez sur leur origine.",
    status: 'active',
    difficulty: 'Modéré',
    tracking: false,
    canAbandon: true,
    objectives: [
      {
        id: 'obj2-1',
        description: "Parler aux villageois affectés",
        completed: true,
        progress: false
      },
      {
        id: 'obj2-2',
        description: "Suivre les traces jusqu'à leur source",
        completed: false,
        progress: false
      },
      {
        id: 'obj2-3',
        description: "Explorer la crevasse nouvellement formée",
        completed: false,
        progress: false
      },
    ],
    rewards: {
      experience: 350,
      gold: 150,
      items: []
    }
  },
  {
    id: '3',
    title: "L'Héritage du Mage",
    description: "Le célèbre mage Eldrin est mort, laissant derrière lui un puissant vestige. Retrouvez son laboratoire secret.",
    status: 'completed',
    difficulty: 'Difficile',
    tracking: false,
    canAbandon: false,
    objectives: [
      {
        id: 'obj3-1',
        description: "Recueillir des informations à l'Académie des Mages",
        completed: true,
        progress: false
      },
      {
        id: 'obj3-2',
        description: "Déchiffrer le journal codé d'Eldrin",
        completed: true,
        progress: false
      },
      {
        id: 'obj3-3',
        description: "Localiser l'entrée du laboratoire secret",
        completed: true,
        progress: false
      },
      {
        id: 'obj3-4',
        description: "Désactiver les pièges magiques",
        completed: true,
        progress: false
      },
      {
        id: 'obj3-5',
        description: "Récupérer le Vestige d'Eldrin",
        completed: true,
        progress: false
      }
    ],
    rewards: {
      experience: 800,
      gold: 350,
      items: [
        { id: 'item2', name: "Bâton d'Eldrin", type: "Arme" },
        { id: 'item3', name: "Robe de l'Arcaniste", type: "Armure" }
      ]
    }
  },
  {
    id: '4',
    title: "La Cargaison Perdue",
    description: "Une caravane marchande a disparu dans les Collines Brumeuses. Retrouvez-la avant que les bandits ne s'emparent de son chargement.",
    status: 'failed',
    difficulty: 'Modéré',
    tracking: false,
    canAbandon: false,
    objectives: [
      {
        id: 'obj4-1',
        description: "Enquêter sur la dernière position connue de la caravane",
        completed: true,
        progress: false
      },
      {
        id: 'obj4-2',
        description: "Suivre les traces dans les Collines Brumeuses",
        completed: true,
        progress: false
      },
      {
        id: 'obj4-3',
        description: "Attaquer le camp des bandits",
        completed: false,
        progress: false
      },
      {
        id: 'obj4-4',
        description: "Récupérer la cargaison et libérer les marchands",
        completed: false,
        progress: false
      }
    ],
    rewards: {
      experience: 400,
      gold: 250,
      items: []
    }
  }
]);

// Filtre les quêtes selon l'onglet actif
const filteredQuests = computed(() => {
  return quests.value.filter(quest => quest.status === activeTab.value);
});

// Change le suivi de la quête
function toggleTracking(quest: Quest): void {
  quest.tracking = !quest.tracking;
  
  // Si la quête est suivie, désactiver le suivi des autres quêtes
  if (quest.tracking) {
    quests.value.forEach(q => {
      if (q.id !== quest.id) {
        q.tracking = false;
      }
    });
  }
}

// Abandonne une quête
function abandonQuest(quest: Quest): void {
  if (confirm(`Êtes-vous sûr de vouloir abandonner la quête "${quest.title}" ? Cette action est irréversible.`)) {
    quest.status = 'failed';
    quest.tracking = false;
  }
}
</script>

<style scoped>
.quests-view {
  height: 100%;
  overflow-y: auto;
}

.quests-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Onglets */
.quests-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-button {
  padding: 8px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f5f5f5;
}

.tab-button.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* Liste des quêtes */
.quests-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-quests {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #999;
  font-style: italic;
}

.quest-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.quest-title {
  margin: 0;
  color: #1890ff;
  font-size: 1.2rem;
}

.quest-difficulty {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

.difficulty-facile {
  background-color: #f6ffed;
  color: #52c41a;
}

.difficulty-modéré {
  background-color: #fffbe6;
  color: #faad14;
}

.difficulty-difficile {
  background-color: #fff2e8;
  color: #fa541c;
}

.quest-description {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Objectifs */
.quest-objectives, .quest-rewards {
  margin-bottom: 15px;
}

.quest-objectives h4, .quest-rewards h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #333;
}

.objectives-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.objectives-list li {
  padding: 5px 0;
  display: flex;
  align-items: flex-start;
}

.objectives-list li.completed {
  color: #999;
  text-decoration: line-through;
}

.objective-status {
  display: inline-block;
  width: 20px;
  margin-right: 8px;
  text-align: center;
}

.checkmark {
  color: #52c41a;
  font-weight: bold;
}

.pending {
  color: #d9d9d9;
}

.objective-progress {
  margin-left: 5px;
  font-size: 0.85rem;
  color: #1890ff;
}

/* Récompenses */
.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.reward-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.reward-icon {
  margin-right: 5px;
  font-size: 1rem;
}

.xp-icon {
  color: #722ed1;
}

.gold-icon {
  color: #faad14;
}

.item-icon {
  color: #1890ff;
}

/* Actions */
.quest-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.track-button, .abandon-button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  border: none;
}

.track-button {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.track-button:hover {
  background-color: #bae7ff;
}

.track-button.tracking {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.abandon-button {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}

.abandon-button:hover {
  background-color: #ffccc7;
}

/* Pas de héros */
.no-hero {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>