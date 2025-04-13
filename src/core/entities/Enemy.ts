import { Character } from './Character';
import type { Stats } from '../types/Stats';
import { EnemyType } from '../types/EnemyType';
import { DamageType } from '../types/DamageType';
import type { Ability } from '../types/Ability';
import type { Combatant } from '../types/Combatant';

export class Enemy extends Character {
    enemyType: EnemyType;
    resistances: Map<DamageType, number>
    weaknesses: Map<DamageType, number>
    
    constructor(id: string, name: string, stats: Stats, enemyType: EnemyType) {
        super(id, name, stats);
        this.enemyType = enemyType;
        this.resistances = new Map<DamageType, number>();
        this.weaknesses = new Map<DamageType, number>();

        this.initializeResistancesAndWeaknesses();
    }

    private initializeResistancesAndWeaknesses(): void {
        switch (this.enemyType) {
            case EnemyType.UNDEAD:
                this.resistances.set(DamageType.POISON, 0.5);
                this.weaknesses.set(DamageType.HOLY, 2.0);
                break;
            case EnemyType.DEMON:
                this.resistances.set(DamageType.FIRE, 0.5);
                this.resistances.set(DamageType.DARK, 0.25);
                this.weaknesses.set(DamageType.HOLY, 2.0);
                break;
            case EnemyType.ELEMENTAL:
                // Elementals have different resistances based on their specific element
                // This would be extended in subclasses
                break;
            case EnemyType.DRAGON:
                this.resistances.set(DamageType.PHYSICAL, 0.75);
                this.resistances.set(DamageType.FIRE, 0.25);
                this.weaknesses.set(DamageType.ICE, 1.5);
                break;
            case EnemyType.SPIRIT:
                this.resistances.set(DamageType.PHYSICAL, 0.5);
                this.weaknesses.set(DamageType.HOLY, 1.5);
                this.weaknesses.set(DamageType.DARK, 1.5);
                break;
        }
    }

    takeDamage(amount: number, damageType: DamageType = DamageType.PHYSICAL): void {
        let finalDamage = amount;

        if (this.resistances.has(damageType)) {
            finalDamage *= this.resistances.get(damageType) || 1;
        }

        if (this.weaknesses.has(damageType)) {
            finalDamage *= this.weaknesses.get(damageType) || 1;
        }

        super.takeDamage(Math.round(finalDamage));
    }

    // AI method to determine which ability to use
    chooseAbility(target: Combatant): Ability | null {
        // Filter to abilities that are not on cooldown
        const availableAbilities = this.abilities.filter(ability => ability.currentCooldown <= 0);
        
        if (availableAbilities.length === 0) {
            return null; // No abilities available
        }
        
        // Simple AI: Just choose a random available ability
        return availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    }
    
    // Method for the enemy to take its turn in combat
    takeTurn(target: Combatant): void {
        const selectedAbility = this.chooseAbility(target);
        
        if (selectedAbility) {
            this.useAbility(selectedAbility, target);
        } else {
            // Perform a basic attack if no abilities are available
            const damage = Math.floor(this.stats.attack * 0.7); // Basic attack does 70% of attack power
            target.takeDamage(damage);
        }
    }
}