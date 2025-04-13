import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Hero } from '../core/entities/Hero';
import type { Vestige } from '../core/types/Vestige';
import { VestigeManager } from '../core/managers/VestigeManager';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

export const useGameStore = defineStore('game', () => {
  // Current hero
  const hero = ref<Hero | null>(null);
  
  // Available vestiges
  const vestiges = computed(() => {
    return VestigeManager.getInstance().getVestiges();
  });
  
  // Create a new hero
  function createHero(name: string) {
    // Generate base stats
    const baseStats = getBaseStats();
    
    // Create the hero
    hero.value = new Hero(
      uuidv4(),
      name,
      baseStats
    );
    
    // Automatically incorporate all available vestiges
    const availableVestiges = VestigeManager.getInstance().getVestiges();
    if (availableVestiges.length > 0) {
      for (const vestige of availableVestiges) {
        hero.value.incorporateVestige(vestige);
      }
    }
  }
  
  // Hero death handler
  function handleHeroDeath() {
    if (!hero.value) return;
    
    // Create a vestige from the dying hero
    const vestige = hero.value.createVestige();
    
    // Add the vestige to our collection
    VestigeManager.getInstance().addVestige(vestige);
    
    // Force refresh of vestiges list (ajoutez cette ligne)
    const refreshedVestiges = VestigeManager.getInstance().getVestiges();
    
    // Clear the current hero
    hero.value = null;
  }
  
  // Add a vestige to the current hero
  function incorporateVestige(vestigeId: string) {
    if (!hero.value) return;
    
    const allVestiges = VestigeManager.getInstance().getVestiges();
    const vestige = allVestiges.find(v => v.id === vestigeId);
    
    if (vestige) {
      hero.value.incorporateVestige(vestige);
      return true;
    }
    return false;
  }
  
  // Helper function to generate base stats
  function getBaseStats() {
    return {
      maxHealth: 100,
      currentHealth: 100,
      healthRegen: 1,
      stamina: 80,
      maxStamina: 80,
      staminaRegen: 2,
      vitality: 50,
      maxVitality: 50,
      vitalityRegen: 1,
      vitalEnergy: 30,
      maxVitalEnergy: 30,
      vitalEnergyRegen: 0.5,
      attack: 15,
      defense: 10,
      speed: 8
    };
  }
  
  return {
    hero,
    vestiges,
    createHero,
    handleHeroDeath,
    incorporateVestige
  };
});