<template>
  <div class="decorative-frame" :class="`theme-${theme}`">
    <!-- Coins du cadre -->
    <div class="frame-corner top-left"></div>
    <div class="frame-corner top-right"></div>
    <div class="frame-corner bottom-left"></div>
    <div class="frame-corner bottom-right"></div>
    
    <!-- Bords du cadre -->
    <div class="frame-edge top"></div>
    <div class="frame-edge right"></div>
    <div class="frame-edge bottom"></div>
    <div class="frame-edge left"></div>
    
    <!-- Ornements -->
    <div v-if="level > 1" class="frame-ornaments">
      <div v-for="i in Math.min(level - 1, 4)" :key="i" 
           class="ornament" :class="`ornament-${i}`"></div>
    </div>
    
    <!-- Contenu du cadre -->
    <div class="frame-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
</script>

<style scoped>
.decorative-frame {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
}

.frame-content {
  width: 100%;
  height: 100%;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Coins et bords du cadre */
.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid;
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

.frame-edge {
  position: absolute;
  background: transparent;
  border: 1px dashed;
  opacity: 0.7;
  z-index: 2;
}

.frame-edge.top, .frame-edge.bottom {
  left: 30px;
  right: 30px;
  height: 0;
}

.frame-edge.left, .frame-edge.right {
  top: 30px;
  bottom: 30px;
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
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.ornament-1 { top: 15px; left: 50%; transform: translateX(-50%); }
.ornament-2 { top: 50%; right: 15px; transform: translateY(-50%); }
.ornament-3 { bottom: 15px; left: 50%; transform: translateX(-50%); }
.ornament-4 { top: 50%; left: 15px; transform: translateY(-50%); }

/* Thèmes du cadre */
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

/* Animation subtile des bords pour certains thèmes */
.theme-deferment .frame-edge {
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  100% { opacity: 0.9; }
}
</style>