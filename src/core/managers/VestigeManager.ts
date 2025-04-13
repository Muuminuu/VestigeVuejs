import type { Vestige } from '../types/Vestige';

// VestigeManager is responsible for storing and retrieving vestiges
export class VestigeManager {
    private static instance: VestigeManager;
    private vestiges: Vestige[] = [];
    private storageKey = 'game_vestiges';
    
    private constructor() {
        this.loadVestiges();
    }
    
    // Singleton pattern to ensure only one instance exists
    public static getInstance(): VestigeManager {
        if (!VestigeManager.instance) {
            VestigeManager.instance = new VestigeManager();
        }
        return VestigeManager.instance;
    }
    
    // Get all available vestiges
    public getVestiges(): Vestige[] {
        this.loadVestiges();
        return [...this.vestiges];
    }
    
    // Add a new vestige to the collection
    public addVestige(vestige: Vestige): void {
        this.vestiges.push(vestige);
        this.saveVestiges();
    }
    
    // Remove a vestige from the collection (for testing or administrative purposes)
    public removeVestige(vestigeId: string): void {
        this.vestiges = this.vestiges.filter(v => v.id !== vestigeId);
        this.saveVestiges();
    }
    
    // Save vestiges to local storage
    private saveVestiges(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.vestiges));
    }
    
    // Load vestiges from local storage
    private loadVestiges(): void {
        const savedVestiges = localStorage.getItem(this.storageKey);
        if (savedVestiges) {
            try {
                this.vestiges = JSON.parse(savedVestiges);
                
                // Convert date strings back to Date objects
                this.vestiges.forEach(vestige => {
                    vestige.acquisitionDate = new Date(vestige.acquisitionDate);
                });
            } catch (error) {
                console.error('Failed to parse saved vestiges:', error);
                this.vestiges = [];
            }
        }
    }
    
    // Clear all vestiges (for testing or game reset)
    public clearVestiges(): void {
        this.vestiges = [];
        this.saveVestiges();
    }
}