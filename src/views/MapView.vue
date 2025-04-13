<template>
  <div class="map-view">
    <h2>Carte du Monde</h2>
    
    <div class="map-content">
      <div class="map-container">
        <!-- Fond de carte -->
        <div class="map-background"></div>
        
        <!-- Régions (exemples) -->
        <div class="map-region discovered" style="top: 15%; left: 20%; width: 25%; height: 30%;">
          <div class="region-name">Forêt d'Émerveille</div>
        </div>
        
        <div class="map-region discovered" style="top: 50%; left: 35%; width: 35%; height: 25%;">
          <div class="region-name">Plaines de Vestifall</div>
        </div>
        
        <div class="map-region fog" style="top: 25%; left: 60%; width: 30%; height: 35%;">
          <div class="region-name">???</div>
        </div>
        
        <div class="map-region fog" style="top: 65%; left: 65%; width: 20%; height: 25%;">
          <div class="region-name">???</div>
        </div>
        
        <!-- Points d'intérêt (exemples) -->
        <div class="map-poi city" style="top: 60%; left: 45%;" @click="selectPOI('vestifall')">
          <div class="poi-icon">🏙️</div>
          <div class="poi-tooltip">Ville de Vestifall</div>
        </div>
        
        <div class="map-poi dungeon" style="top: 35%; left: 30%;" @click="selectPOI('ancient_temple')">
          <div class="poi-icon">🏛️</div>
          <div class="poi-tooltip">Temple Ancien</div>
        </div>
        
        <div class="map-poi village" style="top: 55%; left: 25%;" @click="selectPOI('mirefall')">
          <div class="poi-icon">🏘️</div>
          <div class="poi-tooltip">Village de Mirefall</div>
        </div>
      </div>
      
      <div class="map-info" v-if="selectedPOIInfo">
        <h3>{{ selectedPOIInfo.name }}</h3>
        <p>{{ selectedPOIInfo.description }}</p>
        
        <div class="location-actions">
          <button v-if="selectedPOIInfo.canTravel" class="travel-button" @click="travelToPOI(selectedPOI)">
            Voyager vers cet endroit
          </button>
          
          <div v-if="selectedPOIInfo.hasQuest" class="quest-indicator">
            <span class="quest-icon">📜</span> Quête disponible
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Propriétés reçues du parent
const props = defineProps({
  // On peut passer un selectedPOI de l'extérieur si nécessaire
  initialSelectedPOI: {
    type: String,
    default: null
  }
});

// État local
const selectedPOI = ref(props.initialSelectedPOI);

// Données des points d'intérêt (ceci pourrait venir d'un store global)
const pointsOfInterest = [
  {
    id: 'vestifall',
    name: 'Ville de Vestifall',
    description: 'La plus grande ville du royaume, réputée pour sa grande bibliothèque des vestiges. Un lieu incontournable pour tout Héritier cherchant à comprendre son pouvoir.',
    type: 'city',
    canTravel: true,
    hasQuest: true
  },
  {
    id: 'ancient_temple',
    name: 'Temple Ancien',
    description: 'Un temple datant d\'avant le Grand Cataclysme. On raconte qu\'il abriterait l\'un des premiers vestiges jamais découverts.',
    type: 'dungeon',
    canTravel: true,
    hasQuest: true
  },
  {
    id: 'mirefall',
    name: 'Village de Mirefall',
    description: 'Un petit village paisible au bord d\'un marais. Récemment, des créatures étranges ont commencé à émerger des profondeurs...',
    type: 'village',
    canTravel: true,
    hasQuest: true
  }
];

// Informations sur le POI sélectionné
const selectedPOIInfo = computed(() => {
  if (!selectedPOI.value) return null;
  return pointsOfInterest.find(poi => poi.id === selectedPOI.value);
});

// Sélectionner un point d'intérêt
function selectPOI(poiId) {
  selectedPOI.value = poiId;
}

// Voyager vers un point d'intérêt
function travelToPOI(poiId) {
  const poi = pointsOfInterest.find(p => p.id === poiId);
  if (poi) {
    alert(`Voyage vers ${poi.name} initié. La route risque d'être dangereuse...`);
    // Ici, on pourrait déclencher un événement pour informer le composant parent
    // ou appeler une action du store pour changer l'état du jeu
  }
}
</script>

<style scoped>
.map-view {
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

.map-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-container {
  height: 500px;
  background-color: rgba(40, 40, 50, 0.5);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23333333' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-color: #1a1a1a;
  background-size: 50px;
  opacity: 0.5;
}

.map-region {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 1;
  transition: all 0.3s ease;
}

.map-region.discovered {
  background-color: rgba(24, 144, 255, 0.1);
  border-color: rgba(24, 144, 255, 0.3);
}

.map-region.fog {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.region-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 14px;
  white-space: nowrap;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.map-region.fog .region-name {
  color: #777;
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
  background-color: rgba(30, 30, 40, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.map-poi:hover .poi-icon {
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(24, 144, 255, 0.5);
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
  border-color: rgba(24, 144, 255, 0.6);
}

.map-poi.dungeon .poi-icon {
  border-color: rgba(255, 77, 79, 0.6);
}

.map-poi.village .poi-icon {
  border-color: rgba(82, 196, 26, 0.6);
}

.map-info {
  background-color: rgba(40, 40, 50, 0.5);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.map-info h3 {
  margin-top: 0;
  color: #1890ff;
  margin-bottom: 10px;
  font-size: 18px;
}

.map-info p {
  color: #bbb;
  margin-bottom: 15px;
  line-height: 1.5;
}

.location-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.travel-button {
  background-color: rgba(24, 144, 255, 0.3);
  color: #1890ff;
  border: 1px solid rgba(24, 144, 255, 0.5);
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.travel-button:hover {
  background-color: rgba(24, 144, 255, 0.4);
  color: white;
}

.quest-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #faad14;
  font-size: 14px;
}

.quest-icon {
  font-size: 16px;
}
</style>