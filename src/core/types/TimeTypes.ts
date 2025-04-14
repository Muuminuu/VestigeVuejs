export enum Season {
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
    WINTER = "WINTER"
}

export interface TimeCycle {
    currentSeason: Season;
    currentDay: number;
    currentHour: number;
    advanceTime(jours: number): void;
}