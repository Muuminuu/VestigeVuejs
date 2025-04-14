// filepath: d:\Cedric\Dev\Projets\VestigeVuejs\Vestige\src\core\systems\TimeSystem.ts
import { GameTime } from "../entities/GameTime";

export class TimeSystem {
    private gameTime: GameTime;

    constructor() {
        this.gameTime = new GameTime();
    }

    advanceTime(hours: number): void {
        this.gameTime.advanceTime(hours);
    }

    get currentTime() {
        return {
            year: this.gameTime.currentYear,
            season: this.gameTime.currentSeason,
            day: this.gameTime.currentDay,
            hour: this.gameTime.currentHour,
        };
    }
}