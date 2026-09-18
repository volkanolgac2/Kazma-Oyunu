export type CostumeId = 
  | 'explorer' 
  | 'miner' 
  | 'cowboy' 
  | 'astronaut' 
  | 'royal' 
  | 'gold_miner';

export type ToolId = 
  | 'small_brush'
  | 'big_brush'
  | 'rake'
  | 'basic_shovel' 
  | 'steel_shovel' 
  | 'pickaxe'
  | 'golden_shovel' 
  | 'drill' 
  | 'legendary_tool'
  | 'excavator';

export type CreatureType = 
  | 'mole' 
  | 'caterpillar' 
  | 'worm' 
  | 'spider' 
  | 'bat';

export type CellType = 
  | 'empty' 
  | 'diamond' 
  | 'large_diamond' 
  | 'rare_diamond' 
  | 'rock' 
  | 'pebbles' 
  | 'creature';

export interface SoilCellData {
  id: string;
  x: number; // column index
  y: number; // row index
  maxSoilHealth: number;
  soilHealth: number; // 0 means completely excavated
  isExcavated: boolean;
  type: CellType;
  creatureType?: CreatureType;
  diamondValue: number;
  hasTriggeredHazard?: boolean;
  hasCollected?: boolean;
  rockHardness: number; // hits needed
}

export type EnvironmentTheme = 
  | 'backyard'
  | 'forest'
  | 'rocky'
  | 'desert'
  | 'jungle'
  | 'crystal'
  | 'ancient'
  | 'deep_earth'
  | 'diamond_cavern'
  | 'diamond_kingdom';

export interface ObjectiveConfig {
  type: 'collectDiamonds' | 'findLargeDiamond' | 'excavateAll';
  target: number;
  title: string;
  description: string;
}

export interface LevelConfig {
  level: number;
  title: string;
  theme: EnvironmentTheme;
  themeName: string;
  cols: number;
  rows: number;
  diamonds: number;
  largeDiamonds: number;
  rareDiamonds: number;
  hazards: Partial<Record<CreatureType, number>>;
  rocks: number;
  objective: ObjectiveConfig;
}

export interface PlayerProgress {
  currentLevel: number;
  unlockedLevel: number;
  totalDiamonds: number;
  levelStars: Record<number, number>; // 1, 2, 3 stars
  levelScores: Record<number, number>;
  ownedCostumes: CostumeId[];
  equippedCostume: CostumeId;
  ownedTools: ToolId[];
  equippedTool: ToolId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  tutorialCompleted: boolean;
}

export interface CostumeItem {
  id: CostumeId;
  name: string;
  description: string;
  price: number;
  hatColor: string;
  vestColor: string;
  badge: string;
  specialTrait: string;
}

export interface ToolItem {
  id: ToolId;
  name: string;
  description: string;
  price: number;
  power: number; // damage dealt per hit
  digRadius: number; // radius of carved soil per touch/drag (px)
  speedMultiplier: number;
  specialAbility: string;
  rarityColor: string;
  areaBadge?: string; // e.g. "Hassas", "Geniş", "Devasa"
}

export type ActiveScreen = 
  | 'home' 
  | 'gameplay' 
  | 'level_select' 
  | 'shop' 
  | 'character' 
  | 'settings';
