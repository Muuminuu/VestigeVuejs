<template>
  <div class="decorative-frame" :class="{ [themeClass]: true }">
    <!-- Coins -->
    <div class="frame-corner top-left"></div>
    <div class="frame-corner top-right"></div>
    <div class="frame-corner bottom-left"></div>
    <div class="frame-corner bottom-right"></div>
    
    <!-- Bords -->
    <div class="frame-edge top"></div>
    <div class="frame-edge right"></div>
    <div class="frame-edge bottom"></div>
    <div class="frame-edge left"></div>
    
    <!-- Contenu avec défilement si nécessaire -->
    <div class="frame-content">
      <slot></slot>
    </div>
    
    <!-- Ornements optionnels selon le niveau -->
    <div v-if="showOrnaments" class="frame-ornaments">
      <div v-for="i in ornamentCount" :key="i" class="ornament" :class="`ornament-${i}`"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  theme: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'fire', 'ice', 'nature', 'arcane', 'deferment'].includes(value)
  },
  level: {
    type: Number,
    default: 1
  }
});

// Classe CSS basée sur le thème
const themeClass = computed(() => `theme-${props.theme}`);

// Détermine si on affiche des ornements en fonction du niveau
const showOrnaments = computed(() => props.level > 1);

// Nombre d'ornements basé sur le niveau (max 4)
const ornamentCount = computed(() => Math.min(props.level - 1, 4));
</script>

<style scoped>
.decorative-frame {
  position: relative;
  width: 100%;
  height: 600px; /* Hauteur fixe */
  max-height: 600px; /* Hauteur maximale fixe */
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* Cache tout ce qui dépasse du cadre */
}

.frame-content {
  width: 100%;
  height: 100%;
  overflow-y: auto; /* Permet le défilement vertical si le contenu est trop grand */
  overflow-x: hidden; /* Empêche le défilement horizontal */
  position: relative;
  z-index: 1;
  padding: 10px;
  box-sizing: border-box;
}

/* Coins du cadre */
.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid;
  z-index: 2;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* Bords du cadre */
.frame-edge {
  position: absolute;
  background: transparent;
  border: 1px dashed;
  opacity: 0.6;
  z-index: 2;
}

.frame-edge.top, .frame-edge.bottom {
  left: 20px;
  right: 20px;
  height: 0;
}

.frame-edge.left, .frame-edge.right {
  top: 20px;
  bottom: 20px;
  width: 0;
}

.frame-edge.top { top: 0; }
.frame-edge.right { right: 0; }
.frame-edge.bottom { bottom: 0; }
.frame-edge.left { left: 0; }

/* Ornements */
.frame-ornaments {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.ornament {
  position: absolute;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.ornament-1 { top: 10px; left: 50%; transform: translateX(-50%); }
.ornament-2 { top: 50%; right: 10px; transform: translateY(-50%); }
.ornament-3 { bottom: 10px; left: 50%; transform: translateX(-50%); }
.ornament-4 { top: 50%; left: 10px; transform: translateY(-50%); }

/* Thèmes */
.theme-default {
  --frame-color: #1890ff;
}

.theme-default .frame-corner,
.theme-default .frame-edge {
  border-color: var(--frame-color);
}

.theme-fire {
  --frame-color: #fa541c;
}

.theme-fire .frame-corner,
.theme-fire .frame-edge {
  border-color: var(--frame-color);
}

.theme-ice {
  --frame-color: #00a2ae;
}

.theme-ice .frame-corner,
.theme-ice .frame-edge {
  border-color: var(--frame-color);
}

.theme-nature {
  --frame-color: #52c41a;
}

.theme-nature .frame-corner,
.theme-nature .frame-edge {
  border-color: var(--frame-color);
}

.theme-arcane {
  --frame-color: #722ed1;
}

.theme-arcane .frame-corner,
.theme-arcane .frame-edge {
  border-color: var(--frame-color);
}

.theme-deferment {
  --frame-color: #eb2f96;
}

.theme-deferment .frame-corner,
.theme-deferment .frame-edge {
  border-color: var(--frame-color);
}

/* Animation subtile des bords pour le thème de déferlement */
.theme-deferment .frame-edge {
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  100% { opacity: 0.8; }
}

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .decorative-frame {
    height: 500px;
    max-height: 500px;
  }
}

@media (max-width: 480px) {
  .decorative-frame {
    height: 400px;
    max-height: 400px;
    padding: 15px;
  }
  
  .frame-corner {
    width: 15px;
    height: 15px;
  }
  
  .frame-edge.top, .frame-edge.bottom {
    left: 15px;
    right: 15px;
  }
  
  .frame-edge.left, .frame-edge.right {
    top: 15px;
    bottom: 15px;
  }
}
</style>