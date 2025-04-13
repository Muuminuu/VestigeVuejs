import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { Hero } from '../core/entities/Hero';
import type { Vestige } from '../core/types/Vestige';
import { VestigeManager } from '../core/managers/VestigeManager';
import type { Stats } from '../core/types/Stats';
import { v4 as uuidv4 } from 'uuid'; // Vous devrez installer ce package

export const useGameStore = defineStore('game', () => {
  // Current hero
  const hero = ref<Hero | null>(null);
  
  // Initialiser depuis localStorage au chargement du store
  function initializeFromLocalStorage() {
    try {
      const savedHeroJSON = localStorage.getItem('current_hero');
      
      if (savedHeroJSON) {
        const savedHero = JSON.parse(savedHeroJSON);
        
        // Recréer l'objet Hero à partir des données sauvegardées
        hero.value = new Hero(
          savedHero.id,
          savedHero.name,
          savedHero.stats
        );
        
        // Restaurer les autres propriétés
        hero.value.level = savedHero.level;
        hero.value.experience = savedHero.experience;
        hero.value.abilities = savedHero.abilities || [];
        
        // Restaurer les vestiges
        if (savedHero.vestiges && Array.isArray(savedHero.vestiges)) {
          hero.value.vestiges = savedHero.vestiges;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration du héros:', error);
      // En cas d'erreur, on part sur un héros null
      hero.value = null;
    }
  }
  
  // Appeler l'initialisation
  initializeFromLocalStorage();
  
  // Observer les changements du héros pour les sauvegarder
  watch(hero, (newHero) => {
    if (newHero) {
      saveHero();
    } else {
      localStorage.removeItem('current_hero');
    }
  }, { deep: true });
  
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
    
    // Sauvegarder le héros
    saveHero();
  }
  
  // Sauvegarder le héros dans localStorage
  function saveHero() {
    if (hero.value) {
      localStorage.setItem('current_hero', JSON.stringify(hero.value));
    }
  }
  
  // Hero death handler
  function handleHeroDeath(createVestige = true) {
    if (!hero.value) return;
    
    // Create a vestige from the dying hero if requested
    if (createVestige) {
      const vestige = hero.value.createVestige();
      
      // Add the vestige to our collection
      VestigeManager.getInstance().addVestige(vestige);
    }
    
    // Clear the current hero
    hero.value = null;
    localStorage.removeItem('current_hero');
  }
  
  // Add a vestige to the current hero
  function incorporateVestige(vestigeId: string) {
    if (!hero.value) return false;
    
    const allVestiges = VestigeManager.getInstance().getVestiges();
    const vestige = allVestiges.find(v => v.id === vestigeId);
    
    if (vestige) {
      hero.value.incorporateVestige(vestige);
      saveHero();
      return true;
    }
    return false;
  }
  
  // Mettre à jour les statistiques du héros
  function updateHeroStats(stats: Partial<Stats>) {
    if (!hero.value) return;
    
    // Mettre à jour les statistiques du héros
    if (stats.maxHealth) hero.value.stats.maxHealth = stats.maxHealth;
    if (stats.currentHealth !== undefined) hero.value.stats.currentHealth = stats.currentHealth;
    if (stats.healthRegen) hero.value.stats.healthRegen = stats.healthRegen;
    if (stats.stamina !== undefined) hero.value.stats.stamina = stats.stamina;
    if (stats.maxStamina) hero.value.stats.maxStamina = stats.maxStamina;
    if (stats.staminaRegen) hero.value.stats.staminaRegen = stats.staminaRegen;
    if (stats.vitality !== undefined) hero.value.stats.vitality = stats.vitality;
    if (stats.maxVitality) hero.value.stats.maxVitality = stats.maxVitality;
    if (stats.vitalityRegen) hero.value.stats.vitalityRegen = stats.vitalityRegen;
    if (stats.vitalEnergy !== undefined) hero.value.stats.vitalEnergy = stats.vitalEnergy;
    if (stats.maxVitalEnergy) hero.value.stats.maxVitalEnergy = stats.maxVitalEnergy;
    if (stats.vitalEnergyRegen) hero.value.stats.vitalEnergyRegen = stats.vitalEnergyRegen;
    if (stats.attack) hero.value.stats.attack = stats.attack;
    if (stats.defense) hero.value.stats.defense = stats.defense;
    if (stats.speed) hero.value.stats.speed = stats.speed;
    
    // Sauvegarder les changements
    saveHero();
  }
  
  // Ajouter de l'expérience au héros
  function addExperience(amount: number) {
    if (!hero.value) return;
    
    hero.value.experience += amount;
    
    // Vérifier si le héros peut gagner un niveau
    const expForNextLevel = hero.value.level * 100; // Simple formula: level * 100
    
    if (hero.value.experience >= expForNextLevel) {
      hero.value.level++;
      hero.value.experience -= expForNextLevel;
      
      // Bonus de statistiques pour le niveau supérieur
      hero.value.stats.maxHealth += 10;
      hero.value.stats.currentHealth = hero.value.stats.maxHealth; // Full heal on level up
      hero.value.stats.attack += 3;
      hero.value.stats.defense += 2;
      hero.value.stats.speed += 1;
    }
    
    // Sauvegarder les changements
    saveHero();
  }
  
  // Helper function to generate base stats
  function getBaseStats(): Stats {
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
    incorporateVestige,
    updateHeroStats,
    addExperience,
    saveHero
  };
});