import { TimeSystem } from "../systems/TimeSystem";

export class TimeManager {
    private timeSystem: TimeSystem;

    constructor() {
        this.timeSystem = new TimeSystem();
    }

    triggerTimeAdvance(hours: number): void {
        console.log(`Avancement du temps de ${hours} heure(s).`);
        this.timeSystem.advanceTime(hours);
    }

    loadTime(): { year: number; season: string; day: number; hour: number } {
        // Retourne l'état actuel du temps
        return this.timeSystem.currentTime;
    }

    getCurrentTime(): { year: number; season: string; day: number; hour: number } {
        return this.timeSystem.currentTime;
    }
}