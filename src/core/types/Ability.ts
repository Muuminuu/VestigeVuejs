import { DamageType } from './DamageType';
import { TargetType } from './TargetType';

export interface Ability {
    id: string;
    name: string;
    description: string;
    power: number; // Power of the ability
    cooldown: number; // Cooldown time in seconds
    currentCooldown: number; // Current cooldown time remaining
    targetType: TargetType; // Type of target (e.g., single, area)
    damageType: DamageType; // Type of damage (e.g., physical, magical)
    manaCost: number; // Mana cost to use the ability
    isPassive: boolean; // Whether the ability is passive or active
}