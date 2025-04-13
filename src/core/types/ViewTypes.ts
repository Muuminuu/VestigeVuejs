// Interfaces pour les vues

// CodexView
export interface CodexEntry {
    id: string;
    categoryId: string;
    title: string;
    summary: string;
    discoveredDate: Date;
    image: string;
    content: string;
    relatedEntries?: string[];
  }
  
  export interface CodexCategory {
    id: string;
    name: string;
    icon: string;
  }
  
  // InventoryView
  export interface EquipmentItem {
    name: string;
    type: string;
    rarity: string;
    damage?: number;
    defense?: number;
    description: string;
  }
  
  export interface InventoryItem {
    name: string;
    type: string;
    rarity: string;
    effect?: string;
    description: string;
  }
  
  // MapView
  export interface Region {
    id: string;
    name: string;
    discovered: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }
  
  export interface PointOfInterest {
    id: string;
    name: string;
    type: string;
    regionId: string;
    x: number;
    y: number;
    description: string;
    canTravel: boolean;
    hasActiveQuest: boolean;
    discovered: boolean;
  }
  
  // QuestsView
  export interface QuestObjective {
    id: string;
    description: string;
    completed: boolean;
    progress: boolean;
    current?: number;
    target?: number;
  }
  
  export interface QuestReward {
    experience: number;
    gold: number;
    items: {
      id: string;
      name: string;
      type: string;
    }[];
  }
  
  export interface Quest {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'failed';
    difficulty: 'Facile' | 'Modéré' | 'Difficile';
    tracking: boolean;
    canAbandon: boolean;
    objectives: QuestObjective[];
    rewards: QuestReward;
  }