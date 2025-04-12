import { Entity } from './Entity';
import type { Stats } from '../types/Stats';
import type { Ability } from '../types/Ability';
import type { Combatant } from '../types/Combatant';

export abstract class Character extends Entity {
    stats: Stats;
    abilities: Ability[];
    level: number;
    experience: number;

    constructor(id:string, name:string, stats:Stats) {
        super(id, name);
        this.stats = stats;
        this.abilities = [];
        this.level = 1;
        this.experience = 0;
    }

    takeDamage(amount: number): void {
        this.stats.currentHealth = Math.max(0, this.stats.currentHealth - amount);
    }

    useAbility(ability: Ability, target: Combatant): void {
        if (ability.currentCooldown > 0) return;
    
        const damage = Math.floor(ability.power * (this.stats.attack / 100));
        target.takeDamage(damage, ability.damageType);

        ability.currentCooldown = ability.cooldown;
    }
}