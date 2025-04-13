<template>
  <div class="map-view">
    <h2>Carte</h2>
    
    <div class="map-content">
      <div class="map-container">
        <!-- Ici, vous auriez votre carte interactive -->
        <div class="map-placeholder">
          <p>Carte du monde</p>
          <p>Cliquez sur un point d'intérêt pour plus d'informations</p>
        </div>
        
        <!-- Points d'intérêt (exemple) -->
        <div class="map-poi city" style="top: 30%; left: 40%;" @click="selectPOI('city')">
          <div class="poi-icon">🏙️</div>
          <div class="poi-tooltip">Ville de Vestifall</div>
        </div>
        
        <div class="map-poi dungeon" style="top: 60%; left: 70%;" @click="selectPOI('dungeon')">
          <div class="poi-icon">🏛️</div>
          <div class="poi-tooltip">Ruines d'Ancor</div>
        </div>
      </div>
      
      <div class="map-info" v-if="selectedPOI">
        <h3>{{ getPOIName() }}</h3>
        <p>{{ getPOIDescription() }}</p>
        <button class="travel-button" @click="travelToPOI">Voyager vers cet endroit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedPOI: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['select-poi']);

function selectPOI(poiId: string) {
  emit('select-poi', poiId);
}

function getPOIName() {
  switch (props.selectedPOI) {
    case 'city': return 'Ville de Vestifall';
    case 'dungeon': return 'Ruines d\'Ancor';
    default: return '';
  }
}

function getPOIDescription() {
  switch (props.selectedPOI) {
    case 'city': 
      return 'La plus grande ville du royaume, réputée pour sa grande bibliothèque des vestiges.';
    case 'dungeon': 
      return 'Les ruines d\'une ancienne cité, maintenant infestées de créatures corrompues.';
    default: 
      return '';
  }
}

function travelToPOI() {
  alert(`Voyage vers ${getPOIName()} initié!`);
}
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1890ff;
  font-size: 22px;
}

.map-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-container {
  height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  color: #999;
  font-style: italic;
}

.map-poi {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
}

.poi-icon {
  width: 40px;
  height: 40px;
  background-color: white;
  border: 2px solid #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.2s ease;
}

.map-poi:hover .poi-icon {
  transform: scale(1.2);
}

.poi-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.map-poi:hover .poi-tooltip {
  opacity: 1;
}

.map-poi.city .poi-icon {
  border-color: #1890ff;
}

.map-poi.dungeon .poi-icon {
  border-color: #ff4d4f;
}

.map-info {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-info h3 {
  margin-top: 0;
  color: #1890ff;
  margin-bottom: 10px;
}

.travel-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: bold;
}

.travel-button:hover {
  background-color: #40a9ff;
}
</style>