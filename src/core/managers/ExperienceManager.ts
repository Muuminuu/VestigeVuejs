export interface ExperienceEntity {
    id: string;
    level: number;
    experience: number;
    experienceForNextLevel: number;
    onLevelUp?: (newLevel: number) => void; // Callback pour gérer les effets d'un niveau supérieur
}

export class ExperienceManager {
    // Ajoute de l'expérience à une entité
    static addExperience(entity: ExperienceEntity, amount: number): void {
        entity.experience += amount;

        // Vérifie si l'entité peut monter de niveau
        while (this.canLevelUp(entity)) {
            this.levelUp(entity);
        }
    }

    // Vérifie si l'entité peut monter de niveau
    static canLevelUp(entity: ExperienceEntity): boolean {
        return entity.experience >= entity.experienceForNextLevel;
    }

    // Monte l'entité d'un niveau
    static levelUp(entity: ExperienceEntity): void {
        entity.experience -= entity.experienceForNextLevel;
        entity.level++;
        entity.experienceForNextLevel = this.calculateExperienceForNextLevel(entity.level);

        // Appelle le callback de montée de niveau, si défini
        if (entity.onLevelUp) {
            entity.onLevelUp(entity.level);
        }
    }

    // Calcule l'expérience nécessaire pour le prochain niveau
    static calculateExperienceForNextLevel(level: number): number {
        const baseExperience = 200; // Expérience nécessaire pour le premier niveau
        const incrementPerLevel = 20; // Augmentation fixe par niveau
        return baseExperience + (level - 1) * incrementPerLevel;
    }
}