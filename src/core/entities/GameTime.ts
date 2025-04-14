import { Season, type TimeCycle } from "../types/TimeTypes"

export class GameTime implements TimeCycle {
    currentSeason: Season;
    private totalHours: number = 0;

    constructor() {
        this.currentSeason = this.getRandomSeason();
    }

    get currentDay(): number {
        return Math.floor(this.totalHours / 24) % 30 + 1;
    }

    get currentHour(): number {
        return this.totalHours % 24;
    }

    get currentYear(): number {
        return Math.floor(Math.floor(this.totalHours / 24) / 120) + 1;
    }

    advanceTime(hours: number): void {
        this.totalHours += hours;
        const daysElapsed = Math.floor(this.totalHours / 24);
        const seasonIndex = Math.floor(daysElapsed / 30) % 4;
        this.currentSeason = Object.values(Season)[seasonIndex] as Season;
    }

    private getRandomSeason(): Season {
        const seasons = Object.values(Season); // Récupère toutes les valeurs de l'énumération
        const randomIndex = Math.floor(Math.random() * seasons.length); // Génère un index aléatoire
        return seasons[randomIndex] as Season; // Retourne une saison aléatoire
    }
}