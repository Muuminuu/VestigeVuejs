import { Character } from './Character';
import type { Stats } from '../types/Stats';
import type { Vestige } from '../types/Vestige';

export class Hero extends Character {
    vestiges: Vestige[];
    
    constructor(id: string, name: string, stats: Stats) {
        super(id, name, stats);
        this.vestiges = [];
    }

    // Incorporate a vestige into the hero
    incorporateVestige(vestige: Vestige): void {
        // Add the vestige to the hero's collection
        this.vestiges.push(vestige);
        
        // Apply stat bonuses from the vestige
        if (vestige.bonus.statBonuses) {
            const bonuses = vestige.bonus.statBonuses;
            
            // Apply each stat bonus
            if (bonuses.maxHealth) this.stats.maxHealth += bonuses.maxHealth;
            if (bonuses.currentHealth) this.stats.currentHealth += bonuses.currentHealth;
            if (bonuses.healthRegen) this.stats.healthRegen += bonuses.healthRegen;
            if (bonuses.attack) this.stats.attack += bonuses.attack;
            if (bonuses.defense) this.stats.defense += bonuses.defense;
            if (bonuses.speed) this.stats.speed += bonuses.speed;
            // Apply other stat bonuses as needed...
        }
        
        // Add the vestige's ability if it exists
        if (vestige.bonus.ability && !this.hasAbility(vestige.bonus.ability.id)) {
            this.abilities.push(vestige.bonus.ability);
        }
    }
    
    // Check if the hero already has an ability
    private hasAbility(abilityId: string): boolean {
        return this.abilities.some(ability => ability.id === abilityId);
    }
    
    // When the hero dies, create a vestige
    createVestige(): Vestige {
        // Determine which ability to pass on (could be random or based on most used)
        const legacyAbility = this.abilities.length > 0 
            ? this.abilities[Math.floor(Math.random() * this.abilities.length)] 
            : undefined;
            
        // Create stat bonuses based on character's level and stats
        const statMultiplier = 0.1 + (this.level * 0.02); // Higher level = more stats passed on
        
        // Collect all ancestor vestige IDs
        const ancestorIds = this.vestiges.map(v => v.id);
        // Also include ancestors of ancestors for a complete lineage
        this.vestiges.forEach(v => {
            if (v.ancestors && v.ancestors.length > 0) {
                ancestorIds.push(...v.ancestors);
            }
        });
        
        // Remove duplicates from ancestor IDs
        const uniqueAncestors = [...new Set(ancestorIds)];
        
        return {
            id: `vestige-${this.id}-${Date.now()}`,
            name: `${this.name}'s Vestige`,
            level: this.level,
            description: `The spiritual remnant of ${this.name}, a level ${this.level} hero.`,
            acquisitionDate: new Date(),
            ancestors: uniqueAncestors,
            bonus: {
                statBonuses: {
                    maxHealth: Math.floor(this.stats.maxHealth * 0.05 * statMultiplier),
                    attack: Math.floor(this.stats.attack * 0.1 * statMultiplier),
                    defense: Math.floor(this.stats.defense * 0.1 * statMultiplier)
                },
                ability: legacyAbility,
                description: `Grants a portion of ${this.name}'s power.`
            }
        };
    }
}