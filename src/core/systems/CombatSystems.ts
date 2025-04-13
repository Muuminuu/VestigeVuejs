import type { Hero } from '../entities/Hero';
import type { Enemy } from '../entities/Enemy';
import type { Ability } from '../types/Ability';
import type { Combatant } from '../types/Combatant';
import { DamageType } from '../types/DamageType';

export interface CombatResult {
    victory: boolean;
    remainingHealth: number;
    turnsElapsed: number;
    experienceGained: number;
}

export interface CombatAction {
    actor: Combatant;
    target: Combatant;
    ability?: Ability;
    damage: number;
    damageType: DamageType;
    isCritical: boolean;
}

export interface CombatState {
    hero: Hero;
    enemy: Enemy;
    actions: CombatAction[];
    currentTurn: number;
    isHeroTurn: boolean;
    inProgress: boolean;
    victory?: boolean;
}

export class CombatSystem {
    private state: CombatState;

    constructor(hero: Hero, enemy: Enemy) {
        this.state = {
            hero,
            enemy,
            actions: [],
            currentTurn: 1,
            isHeroTurn: true, //Hero goes first
            inProgress: true
        };
    }

    public getState(): CombatState {
        return { ...this.state };
    }

    public performHeroAction(ability?: Ability): CombatAction | null {
        if (!this.state.inProgress || !this.state.isHeroTurn) {
            return null;
        }
        
        let action: CombatAction;
        
        if (ability) {
            // Use the specified ability
            const damage = this.calculateAbilityDamage(this.state.hero, ability);
            const isCritical = Math.random() < 0.1; // 10% chance of critical
            
            if (isCritical) {
                damage * 1.5;
            }
            
            action = {
                actor: this.state.hero,
                target: this.state.enemy,
                ability,
                damage,
                damageType: ability.damageType,
                isCritical
            };
            
            this.state.enemy.takeDamage(damage, ability.damageType);
        } else {
            // Basic attack
            const damage = this.calculateBasicAttackDamage(this.state.hero);
            const isCritical = Math.random() < 0.1; // 10% chance of critical
            
            if (isCritical) {
                damage * 1.5;
            }
            
            action = {
                actor: this.state.hero,
                target: this.state.enemy,
                damage,
                damageType: DamageType.PHYSICAL,
                isCritical
            };
            
            this.state.enemy.takeDamage(damage);
        }
        
        this.state.actions.push(action);
        
        // Check if enemy is defeated
        if (this.state.enemy.stats.currentHealth <= 0) {
            this.endCombat(true);
            return action;
        }
        
        // Switch to enemy turn
        this.state.isHeroTurn = false;
        
        return action;
    }
    
    public performEnemyAction(): CombatAction | null {
        if (!this.state.inProgress || this.state.isHeroTurn) {
            return null;
        }
        
        // Enemy AI choose ability
        const ability = this.state.enemy.chooseAbility(this.state.hero);
        let action: CombatAction;
        
        if (ability) {
            // Use the chosen ability
            const damage = this.calculateAbilityDamage(this.state.enemy, ability);
            const isCritical = Math.random() < 0.05; // 5% chance of critical for enemy
            
            if (isCritical) {
                damage * 1.5;
            }
            
            action = {
                actor: this.state.enemy,
                target: this.state.hero,
                ability,
                damage,
                damageType: ability.damageType,
                isCritical
            };
            
            this.state.hero.takeDamage(damage, ability.damageType);
        } else {
            // Basic attack
            const damage = this.calculateBasicAttackDamage(this.state.enemy);
            const isCritical = Math.random() < 0.05; // 5% chance of critical for enemy
            
            if (isCritical) {
                damage * 1.5;
            }
            
            action = {
                actor: this.state.enemy,
                target: this.state.hero,
                damage,
                damageType: DamageType.PHYSICAL,
                isCritical
            };
            
            this.state.hero.takeDamage(damage);
        }
        
        this.state.actions.push(action);
        
        // Check if hero is defeated
        if (this.state.hero.stats.currentHealth <= 0) {
            this.endCombat(false);
            return action;
        }
        
        // Switch to hero turn and increment turn counter
        this.state.isHeroTurn = true;
        this.state.currentTurn++;
        
        // Reduce cooldowns on abilities
        this.decreaseCooldowns();
        
        return action;
    }
    
    private calculateBasicAttackDamage(attacker: Combatant): number {
        // Basic formula: attacker's attack stat with some randomness
        const baseDamage = attacker.stats.attack;
        const randomFactor = 0.8 + (Math.random() * 0.4); // 80% to 120% of base damage
        return Math.floor(baseDamage * randomFactor);
    }
    
    private calculateAbilityDamage(attacker: Combatant, ability: Ability): number {
        // Formula: ability power * attacker's attack / 100 with some randomness
        const baseDamage = ability.power * (attacker.stats.attack / 100);
        const randomFactor = 0.9 + (Math.random() * 0.2); // 90% to 110% of base damage
        return Math.floor(baseDamage * randomFactor);
    }
    
    private decreaseCooldowns(): void {
        // Decrease cooldowns for hero abilities
        this.state.hero.abilities.forEach(ability => {
            if (ability.currentCooldown > 0) {
                ability.currentCooldown--;
            }
        });
        
        // Decrease cooldowns for enemy abilities
        this.state.enemy.abilities.forEach(ability => {
            if (ability.currentCooldown > 0) {
                ability.currentCooldown--;
            }
        });
    }
    
    private endCombat(victory: boolean): void {
        this.state.inProgress = false;
        this.state.victory = victory;
        
        if (victory) {
            // Calculate experience gained
            const experienceGained = Math.floor(
                this.state.enemy.level * 20 * (1 + this.state.enemy.level / this.state.hero.level)
            );
            
            // Award experience to hero
            // This would typically be handled by the game store
        }
    }
    
    public getCombatResult(): CombatResult {
        return {
            victory: this.state.victory || false,
            remainingHealth: this.state.hero.stats.currentHealth,
            turnsElapsed: this.state.currentTurn,
            experienceGained: this.state.victory ? this.calculateExperienceGained() : 0
        };
    }
    
    private calculateExperienceGained(): number {
        // Base experience is enemy level * 20
        const baseExperience = this.state.enemy.level * 20;
        
        // Modify based on level difference
        const levelDifference = this.state.enemy.level - this.state.hero.level;
        const levelModifier = levelDifference > 0 
            ? 1 + (levelDifference * 0.1) // Bonus for defeating stronger enemies
            : Math.max(0.5, 1 - (Math.abs(levelDifference) * 0.1)); // Penalty for defeating weaker enemies
        
        // Modify based on how quickly the battle was won
        const turnModifier = Math.max(0.8, 1 - (this.state.currentTurn * 0.01)); // Slight bonus for quick victories
        
        return Math.floor(baseExperience * levelModifier * turnModifier);
    }
}