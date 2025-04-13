import type { Ability } from './Ability';
import type { Stats } from './Stats';

export interface VestigeBonus {
    statBonuses? : Partial<Stats>;
    ability?: Ability;
    description?: string;
}

export interface Vestige {
    id: string;
    name: string;
    level: number;
    bonus: VestigeBonus;
    description: string;
    acquisitionDate: Date;
    ancestors: string[];
}