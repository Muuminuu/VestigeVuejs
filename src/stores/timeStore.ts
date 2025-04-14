import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import { TimeManager } from '../core/managers/TimeManager';

const timeManager = new TimeManager();

export const useTimeStore = defineStore('time', () => {
    // État réactif
    const state = reactive({
        year: 0,
        season: '',
        day: 0,
        hour: 0,
    });

    // Actions
    function loadTime() {
        const { year, season, day, hour } = timeManager.loadTime();
        updateTime({ year, season, day, hour });
    }

    function advanceTime(hours: number) {
        timeManager.triggerTimeAdvance(hours);
        const { year, season, day, hour } = timeManager.getCurrentTime();
        updateTime({ year, season, day, hour });
    }

    function updateTime({ year, season, day, hour }: { year: number; season: string; day: number; hour: number }) {
        state.year = year;
        state.season = season;
        state.day = day;
        state.hour = hour;
    }

    // Getters
    const currentTime = computed(() => ({
        year: state.year,
        season: state.season,
        day: state.day,
        hour: state.hour,
    }));

    return {
        state,
        currentTime,
        loadTime,
        advanceTime,
        updateTime,
    };
});