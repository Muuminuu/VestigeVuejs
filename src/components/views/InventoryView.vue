<template>
  <div class="inventory-view">
    <h2>Inventaire</h2>
    
    <div v-if="hero" class="inventory-content">
      <div class="equipment-section">
        <h3>Équipement</h3>
        <div class="equipment-slots">
          <div class="equipment-slot" :class="{ empty: !equipment.head }">
            <div class="slot-label">Tête</div>
            <div class="slot-item" v-if="equipment.head">
              {{ equipment.head.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !equipment.chest }">
            <div class="slot-label">Torse</div>
            <div class="slot-item" v-if="equipment.chest">
              {{ equipment.chest.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !equipment.hands }">
            <div class="slot-label">Mains</div>
            <div class="slot-item" v-if="equipment.hands">
              {{ equipment.hands.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !equipment.legs }">
            <div class="slot-label">Jambes</div>
            <div class="slot-item" v-if="equipment.legs">
              {{ equipment.legs.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !equipment.feet }">
            <div class="slot-label">Pieds</div>
            <div class="slot-item" v-if="equipment.feet">
              {{ equipment.feet.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot weapon-slot" :class="{ empty: !equipment.weapon }">
            <div class="slot-label">Arme</div>
            <div class="slot-item" v-if="equipment.weapon">
              {{ equipment.weapon.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot accessory-slot" :class="{ empty: !equipment.accessory }">
            <div class="slot-label">Accessoire</div>
            <div class="slot-item" v-if="equipment.accessory">
              {{ equipment.accessory.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
        </div>
      </div>
      
      <div class="bag-section">
        <h3>Sac</h3>
        <div class="inventory-grid">
          <div 
            v-for="(item, index) in inventoryItems" 
            :key="index" 
            class="inventory-slot"
            :class="{ empty: !item }"
          >
            <div class="item-card" v-if="item">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-type">{{ item.type }}</div>
              <div class="item-description">{{ item.description }}</div>
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-hero">
      <p>Aucun héros actif. Créez un nouveau héros pour accéder à l'inventaire.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import type { EquipmentItem, InventoryItem } from '../../core/types/ViewTypes';

const gameStore = useGameStore();
const hero = computed(() => gameStore.hero);

// Simulation de l'équipement (à remplacer par votre logique d'inventaire réelle)
const equipment = ref<{
  head: EquipmentItem | null,
  chest: EquipmentItem | null,
  hands: EquipmentItem | null,
  legs: EquipmentItem | null,
  feet: EquipmentItem | null,
  weapon: EquipmentItem | null,
  accessory: EquipmentItem | null
}>({
  head: null,
  chest: null,
  hands: null,
  legs: null,
  feet: null,
  weapon: {
    name: "Épée du débutant",
    type: "Arme",
    rarity: "Commun",
    damage: 10,
    description: "Une épée standard fournie à tous les nouveaux aventuriers."
  },
  accessory: null
});

// Simulation des objets d'inventaire (à remplacer par votre logique d'inventaire réelle)
const inventoryItems = ref<(InventoryItem | null)[]>([
  {
    name: "Potion de santé",
    type: "Consommable",
    rarity: "Commun",
    effect: "Restaure 50 points de vie",
    description: "Une fiole contenant un liquide rouge qui soigne les blessures."
  },
  {
    name: "Parchemin d'identification",
    type: "Consommable",
    rarity: "Commun",
    effect: "Identifie un objet magique",
    description: "Un parchemin ancien permettant de révéler les propriétés magiques des objets."
  },
  null, // Emplacement vide
  null, // Emplacement vide
  {
    name: "Pépite d'or",
    type: "Matériau",
    rarity: "Peu commun",
    effect: "Valeur marchande élevée",
    description: "Une pépite d'or pur qui vaut une petite fortune."
  },
  null, // Emplacement vide
  null, // Emplacement vide
  null, // Emplacement vide
  {
    name: "Clé rouillée",
    type: "Clé",
    rarity: "Commun",
    effect: "Ouvre une serrure quelque part",
    description: "Une vieille clé rouillée. Qui sait ce qu'elle peut ouvrir..."
  },
  null, // Emplacement vide
  null, // Emplacement vide
  null, // Emplacement vide
  null, // Emplacement vide
  null, // Emplacement vide
  null, // Emplacement vide
  null  // Emplacement vide
]);
</script>

<style scoped>
.inventory-view {
  height: 100%;
  overflow-y: auto;
}

.inventory-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1890ff;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

/* Section équipement */
.equipment-section {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.equipment-slot {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 10px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.equipment-slot.empty {
  background-color: #fafafa;
}

.slot-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}

.slot-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #1890ff;
  font-weight: bold;
}

.empty-slot {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
  font-style: italic;
}

.weapon-slot, .accessory-slot {
  background-color: #f6ffed;
  border-color: #b7eb8f;
}

/* Section sac */
.bag-section {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.inventory-slot {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  min-height: 100px;
  padding: 5px;
}

.inventory-slot.empty {
  background-color: #fafafa;
}

.item-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.item-type {
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 5px;
}

.item-description {
  font-size: 0.8rem;
  color: #666;
  flex: 1;
}

/* Pas de héros */
.no-hero {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>