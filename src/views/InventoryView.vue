<template>
  <div class="inventory-view">
    <h2>Inventaire</h2>
    
    <div class="inventory-content">
      <div class="equipment-section">
        <h3>Équipement</h3>
        <div class="equipment-slots">
          <div class="equipment-slot" :class="{ empty: !inventory?.equipment.head }">
            <div class="slot-label">Tête</div>
            <div class="slot-item" v-if="inventory?.equipment.head">
              {{ inventory.equipment.head.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !inventory?.equipment.chest }">
            <div class="slot-label">Torse</div>
            <div class="slot-item" v-if="inventory?.equipment.chest">
              {{ inventory.equipment.chest.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !inventory?.equipment.hands }">
            <div class="slot-label">Mains</div>
            <div class="slot-item" v-if="inventory?.equipment.hands">
              {{ inventory.equipment.hands.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !inventory?.equipment.legs }">
            <div class="slot-label">Jambes</div>
            <div class="slot-item" v-if="inventory?.equipment.legs">
              {{ inventory.equipment.legs.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot" :class="{ empty: !inventory?.equipment.feet }">
            <div class="slot-label">Pieds</div>
            <div class="slot-item" v-if="inventory?.equipment.feet">
              {{ inventory.equipment.feet.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot weapon-slot" :class="{ empty: !inventory?.equipment.weapon }">
            <div class="slot-label">Arme</div>
            <div class="slot-item" v-if="inventory?.equipment.weapon">
              {{ inventory.equipment.weapon.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
          <div class="equipment-slot accessory-slot" :class="{ empty: !inventory?.equipment.accessory }">
            <div class="slot-label">Accessoire</div>
            <div class="slot-item" v-if="inventory?.equipment.accessory">
              {{ inventory.equipment.accessory.name }}
            </div>
            <div class="empty-slot" v-else>Vide</div>
          </div>
        </div>
      </div>
      
      <div class="bag-section">
        <h3>Sac</h3>
        <div class="inventory-grid">
          <div v-for="(item, index) in inventory?.items" :key="index" 
               class="inventory-slot" :class="{ empty: !item }">
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
  </div>
</template>

<script setup lang="ts">
defineProps({
  inventory: {
    type: Object,
    default: () => ({
      equipment: {},
      items: []
    })
  }
});
</script>

<style scoped>
.inventory-view {
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

.inventory-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.equipment-section, .bag-section {
  background-color: rgba(40, 40, 50, 0.5);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.equipment-slot {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 10px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.05);
}

.equipment-slot.empty {
  background-color: rgba(255, 255, 255, 0.02);
}

.slot-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #aaa;
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
  color: #555;
  font-style: italic;
}

.weapon-slot {
  background-color: rgba(24, 144, 255, 0.1);
  border-color: rgba(24, 144, 255, 0.3);
}

.accessory-slot {
  background-color: rgba(250, 173, 20, 0.1);
  border-color: rgba(250, 173, 20, 0.3);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.inventory-slot {
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  min-height: 100px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.05);
}

.inventory-slot.empty {
  background-color: rgba(255, 255, 255, 0.02);
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
  color: #aaa;
  margin-bottom: 5px;
}

.item-description {
  font-size: 0.8rem;
  color: #bbb;
  flex: 1;
}
</style>