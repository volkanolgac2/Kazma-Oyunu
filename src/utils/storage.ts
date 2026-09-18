import { PlayerProgress, CostumeId, ToolId } from '../types/game';

const STORAGE_KEY = 'dig_and_diamond_save_v1';

export const DEFAULT_PROGRESS: PlayerProgress = {
  currentLevel: 1,
  unlockedLevel: 1,
  totalDiamonds: 30, // welcoming starter balance
  levelStars: {},
  levelScores: {},
  ownedCostumes: ['explorer'],
  equippedCostume: 'explorer',
  ownedTools: ['basic_shovel'],
  equippedTool: 'basic_shovel',
  soundEnabled: true,
  musicEnabled: true,
  tutorialCompleted: false
};

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      ownedCostumes: Array.isArray(parsed.ownedCostumes) ? parsed.ownedCostumes : DEFAULT_PROGRESS.ownedCostumes,
      ownedTools: Array.isArray(parsed.ownedTools) ? parsed.ownedTools : DEFAULT_PROGRESS.ownedTools,
      levelStars: parsed.levelStars || {},
      levelScores: parsed.levelScores || {}
    };
  } catch (err) {
    console.error('Failed to load player progress:', err);
    return DEFAULT_PROGRESS;
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save player progress:', err);
  }
}

export function resetPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset progress:', err);
  }
  return DEFAULT_PROGRESS;
}
