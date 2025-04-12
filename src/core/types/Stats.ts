export interface Stats {
    maxHealth: number; // Maximum health points
    currentHealth: number; // Current health points
    healthRegen: number; // Health regeneration per second
    stamina: number; // Stamina points
    maxStamina: number; // Maximum stamina points
    staminaRegen: number; // Stamina regeneration per second
    vitality: number; // Vitality points (health-related stat)
    maxVitality: number; // Maximum vitality points
    vitalityRegen: number; // Vitality regeneration per second
    vitalEnergy: number; // Vital energy points (energy-related stat)
    maxVitalEnergy: number; // Maximum vital energy points
    vitalEnergyRegen: number; // Vital energy regeneration per second

    attack: number; // Attack power
    defense: number; // Defense power
    speed: number; // Speed of the character
}