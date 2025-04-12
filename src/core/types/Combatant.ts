import { DamageType } from './DamageType';
import type { Stats } from './Stats';
import type { Ability } from './Ability';

export interface Combatant {
    id: string; // Unique identifier for the combatant
    name: string; // Name of the combatant
    stats: Stats; // Combatant's stats (health, stamina, etc.)
    abilities: Ability[]; // List of abilities the combatant can use

    takeDamage(amount: number, damageType?: DamageType): void; // Method to apply damage to the combatant
    useAbility(ability: Ability, target: Combatant): void; // Method to use an ability on a target
}