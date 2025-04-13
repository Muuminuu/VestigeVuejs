<template>
  <div class="map-view">
    <h2>Carte du Monde</h2>
    
    <div v-if="hero" class="map-content">
      <div class="map-controls">
        <div class="region-selector">
          <label for="region-select">Région:</label>
          <select id="region-select" v-model="selectedRegion">
            <option value="all">Toutes les régions</option>
            <option v-for="region in regions" :key="region.id" :value="region.id">
              {{ region.name }}
            </option>
          </select>
        </div>
        
        <div class="map-actions">
          <button class="map-button" @click="zoomIn" :disabled="zoomLevel >= 2">
            <span class="zoom-icon">+</span>
          </button>
          <button class="map-button" @click="zoomOut" :disabled="zoomLevel <= 0.5">
            <span class="zoom-icon">-</span>
          </button>
          <button class="map-button" @click="resetView">
            <span class="reset-icon">↺</span>
          </button>
        </div>
      </div>
      
      <div class="map-container" @mousemove="panMap" @mousedown="startPan" @mouseup="stopPan" @mouseleave="stopPan">
        <div class="map-wrapper" :style="mapStyle">
          <!-- Placeholder pour la carte du monde -->
          <div class="map-background">
            <!-- Régions de la carte -->
            <div 
              v-for="region in regions" 
              :key="region.id" 
              class="map-region"
              :class="{ 
                active: selectedRegion === region.id || selectedRegion === 'all',
                discovered: region.discovered
              }"
              :style="getRegionStyle(region)"
              @click="selectRegion(region.id)"
            >
              <div class="region-name" v-if="region.discovered">{{ region.name }}</div>
            </div>
            
            <!-- Marqueurs de points d'intérêt -->
            <div 
              v-for="poi in visiblePOIs" 
              :key="poi.id" 
              class="map-poi"
              :class="poi.type"
              :style="{ left: `${poi.x}%`, top: `${poi.y}%` }"
              @click="selectPOI(poi)"
            >
              <div class="poi-icon" :class="{ 'quest-active': poi.hasActiveQuest }">
                {{ getPoiIcon(poi.type) }}
              </div>
              <div class="poi-tooltip">
                <div class="poi-name">{{ poi.name }}</div>
                <div class="poi-type">{{ getPoiTypeLabel(poi.type) }}</div>
              </div>
            </div>
            
            <!-- Position du héros -->
            <div 
              v-if="heroPosition" 
              class="hero-marker"
              :style="{ left: `${heroPosition.x}%`, top: `${heroPosition.y}%` }"
            >
              <div class="hero-icon">⚔</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="map-info" v-if="selectedPOI">
        <h3>{{ selectedPOI.name }}</h3>
        <div class="poi-details">
          <div class="poi-type-info">{{ getPoiTypeLabel(selectedPOI.type) }}</div>
          <div class="poi-description">{{ selectedPOI.description }}</div>
          
          <div class="poi-actions" v-if="selectedPOI.canTravel">
            <button class="travel-button" @click="travelToPOI(selectedPOI)">
              Voyager vers cet endroit
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-hero">
      <p>Aucun héros actif. Créez un nouveau héros pour accéder à la carte.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import type { Region, PointOfInterest } from '../../core/types/ViewTypes';

const gameStore = useGameStore();
const hero = computed(() => gameStore.hero);

// Zoom et déplacement de la carte
const zoomLevel = ref(1);
const mapPosition = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const startPosition = ref({ x: 0, y: 0 });

// Région et POI sélectionnés
const selectedRegion = ref('all');
const selectedPOI = ref<PointOfInterest | null>(null);

// Position du héros (pour démonstration)
const heroPosition = ref({ x: 45, y: 38 });

// Données des régions (à remplacer par vos données réelles)
const regions = ref<Region[]>([
  {
    id: 'forest',
    name: 'Forêt des Vestiges',
    discovered: true,
    x: 30,
    y: 20,
    width: 25,
    height: 30,
    color: '#7cb305'
  },
  {
    id: 'mountains',
    name: 'Montagnes du Désespoir',
    discovered: true,
    x: 60,
    y: 10,
    width: 30,
    height: 35,
    color: '#8c8c8c'
  },
  {
    id: 'plains',
    name: 'Plaines de l\'Aurore',
    discovered: true,
    x: 25,
    y: 55,
    width: 35,
    height: 25,
    color: '#b7eb8f'
  },
  {
    id: 'swamp',
    name: 'Marais des Ombres',
    discovered: false,
    x: 65,
    y: 55,
    width: 20,
    height: 30,
    color: '#5c6b3c'
  },
  {
    id: 'desert',
    name: 'Désert des Illusions',
    discovered: false,
    x: 10,
    y: 15,
    width: 15,
    height: 25,
    color: '#d4b106'
  }
]);

// Points d'intérêt sur la carte
const pointsOfInterest = ref<PointOfInterest[]>([
  {
    id: 'poi1',
    name: 'Ville de Vestifall',
    type: 'city',
    regionId: 'plains',
    x: 35,
    y: 65,
    description: 'La plus grande ville du royaume, réputée pour sa grande bibliothèque des vestiges.',
    canTravel: true,
    hasActiveQuest: true,
    discovered: true
  },
  {
    id: 'poi2',
    name: 'Tour des Mages',
    type: 'landmark',
    regionId: 'plains',
    x: 45,
    y: 60,
    description: 'Une tour imposante où résident les mages étudiant les mystères des vestiges.',
    canTravel: true,
    hasActiveQuest: false,
    discovered: true
  },
  {
    id: 'poi3',
    name: 'Ruines d\'Ancor',
    type: 'dungeon',
    regionId: 'forest',
    x: 40,
    y: 30,
    description: 'Les ruines d\'une ancienne cité, maintenant infestées de créatures corrompues.',
    canTravel: true,
    hasActiveQuest: true,
    discovered: true
  },
  {
    id: 'poi4',
    name: 'Forteresse du Pic',
    type: 'landmark',
    regionId: 'mountains',
    x: 70,
    y: 25,
    description: 'Une forteresse perchée sur le plus haut sommet, gardant un ancien vestige.',
    canTravel: true,
    hasActiveQuest: false,
    discovered: true
  },
  {
    id: 'poi5',
    name: 'Village de Mirefall',
    type: 'village',
    regionId: 'plains',
    x: 30,
    y: 70,
    description: 'Un petit village paisible connu pour ses traditions et ses herbes médicinales.',
    canTravel: true,
    hasActiveQuest: true,
    discovered: true
  },
  {
    id: 'poi6',
    name: 'Cavernes Profondes',
    type: 'dungeon',
    regionId: 'mountains',
    x: 65,
    y: 15,
    description: 'Un réseau de grottes mystérieuses, rumeur d\'abriter des créatures anciennes.',
    canTravel: true,
    hasActiveQuest: false,
    discovered: true
  },
  {
    id: 'poi7',
    name: '?????',
    type: 'undiscovered',
    regionId: 'swamp',
    x: 70,
    y: 65,
    description: 'Un lieu mystérieux dont vous avez entendu des rumeurs.',
    canTravel: false,
    hasActiveQuest: false,
    discovered: false
  }
]);

// Filtre les POI visibles selon la région sélectionnée et leur découverte
const visiblePOIs = computed(() => {
  return pointsOfInterest.value.filter(poi => {
    // Filtre par région
    const regionMatch = selectedRegion.value === 'all' || poi.regionId === selectedRegion.value;
    
    // Filtre par découverte
    const regionDiscovered = regions.value.find(r => r.id === poi.regionId)?.discovered || false;
    
    return regionMatch && (poi.discovered || (poi.type === 'undiscovered' && regionDiscovered));
  });
});

// Style de positionnement et zoom de la carte
const mapStyle = computed(() => {
  return {
    transform: `scale(${zoomLevel.value}) translate(${mapPosition.value.x}px, ${mapPosition.value.y}px)`,
    transformOrigin: 'center'
  };
});

// Obtenir le style CSS pour une région
function getRegionStyle(region: Region) {
  return {
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    backgroundColor: region.color,
    opacity: region.discovered ? 0.6 : 0.2
  };
}

// Obtenir l'icône pour un type de POI
function getPoiIcon(type: string) {
  switch (type) {
    case 'city': return '🏙️';
    case 'village': return '🏘️';
    case 'dungeon': return '🏛️';
    case 'landmark': return '🗿';
    case 'undiscovered': return '❓';
    default: return '📍';
  }
}

// Obtenir le label pour un type de POI
function getPoiTypeLabel(type: string) {
  switch (type) {
    case 'city': return 'Cité';
    case 'village': return 'Village';
    case 'dungeon': return 'Donjon';
    case 'landmark': return 'Point d\'intérêt';
    case 'undiscovered': return 'Zone inexplorée';
    default: return 'Lieu';
  }
}

// Fonctions de zoom et déplacement
function zoomIn() {
  zoomLevel.value = Math.min(2, zoomLevel.value + 0.25);
}

function zoomOut() {
  zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.25);
}

function resetView() {
  zoomLevel.value = 1;
  mapPosition.value = { x: 0, y: 0 };
}

function startPan(event: MouseEvent) {
  isPanning.value = true;
  startPosition.value = { x: event.clientX, y: event.clientY };
}

function panMap(event: MouseEvent) {
  if (!isPanning.value) return;
  
  const dx = (event.clientX - startPosition.value.x) / zoomLevel.value;
  const dy = (event.clientY - startPosition.value.y) / zoomLevel.value;
  
  mapPosition.value = { 
    x: mapPosition.value.x + dx, 
    y: mapPosition.value.y + dy 
  };
  
  startPosition.value = { x: event.clientX, y: event.clientY };
}

function stopPan() {
  isPanning.value = false;
}

// Fonctions de sélection
function selectRegion(regionId: string) {
  selectedRegion.value = regionId;
  selectedPOI.value = null;
}

function selectPOI(poi: PointOfInterest) {
  selectedPOI.value = poi;
}

function travelToPOI(poi: PointOfInterest) {
  // Implémentez ici la logique de voyage vers un point d'intérêt
  alert(`Voyage vers ${poi.name} en cours...`);
  
  // Simuler le déplacement du héros
  heroPosition.value = { x: poi.x, y: poi.y };
  
  // Réinitialiser la sélection
  selectedPOI.value = null;
}
</script>

<style scoped>
.map-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Contrôles de la carte */
.map-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.region-selector {
  display: flex;
  align-items: center;
}

.region-selector label {
  margin-right: 10px;
  font-weight: bold;
}

.region-selector select {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: white;
}

.map-actions {
  display: flex;
  gap: 5px;
}

.map-button {
  width: 36px;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.map-button:hover {
  background-color: #f5f5f5;
}

.map-button:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.zoom-icon, .reset-icon {
  font-size: 18px;
  font-weight: bold;
}

/* Conteneur de la carte */
.map-container {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #f0f0f0;
  cursor: grab;
  min-height: 400px;
}

.map-container:active {
  cursor: grabbing;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.1s ease;
}

.map-background {
  width: 100%;
  height: 100%;
  background-color: #e6f7ff;
  position: relative;
  border: 2px solid #1890ff;
  box-sizing: border-box;
}

/* Régions de la carte */
.map-region {
  position: absolute;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.2;
}

.map-region.active {
  border: 2px solid #1890ff;
}

.map-region.discovered {
  opacity: 0.6;
}

.map-region:hover {
  opacity: 0.8;
}

.region-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: bold;
  text-shadow: 0 0 3px white;
  white-space: nowrap;
  pointer-events: none;
}

/* Points d'intérêt */
.map-poi {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.poi-icon {
  width: 30px;
  height: 30px;
  background-color: white;
  border: 2px solid #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.poi-icon.quest-active {
  border-color: #faad14;
  box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.3);
}

.map-poi:hover .poi-icon {
  transform: scale(1.2);
}

.map-poi:hover .poi-tooltip {
  display: block;
}

.poi-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 5px 10px;
  width: max-content;
  max-width: 200px;
  display: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  margin-bottom: 5px;
  z-index: 20;
}

.poi-name {
  font-weight: bold;
  font-size: 0.9rem;
}

.poi-type {
  font-size: 0.8rem;
  color: #666;
}

/* Types spécifiques de POI */
.map-poi.city .poi-icon {
  background-color: #e6f7ff;
}

.map-poi.village .poi-icon {
  background-color: #f9f9f9;
}

.map-poi.dungeon .poi-icon {
  background-color: #fff2e8;
}

.map-poi.landmark .poi-icon {
  background-color: #f6ffed;
}

.map-poi.undiscovered .poi-icon {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  opacity: 0.7;
}

/* Marqueur du héros */
.hero-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 15;
}

.hero-icon {
  width: 36px;
  height: 36px;
  background-color: #f6ffed;
  border: 3px solid #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(82, 196, 26, 0); }
  100% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0); }
}

/* Informations sur le POI sélectionné */
.map-info {
  margin-top: 15px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #1890ff;
}

.poi-type-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.poi-description {
  margin-bottom: 15px;
  line-height: 1.5;
}

.poi-actions {
  display: flex;
  justify-content: flex-end;
}

.travel-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.travel-button:hover {
  background-color: #40a9ff;
}

/* Pas de héros */
.no-hero {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>