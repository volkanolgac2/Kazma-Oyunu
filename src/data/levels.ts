import { LevelConfig, EnvironmentTheme, CreatureType, SoilCellData, CellType } from '../types/game';

export interface ThemeVisuals {
  name: string;
  skyGradient: string;
  soilSurfaceColor: string;
  soilDeepColor: string;
  soilBorderColor: string;
  cellUndugBg: string;
  cellDugBg: string;
  foliageColor: string;
  ambientParticles: string;
}

export const THEME_DATA: Record<EnvironmentTheme, ThemeVisuals> = {
  backyard: {
    name: 'Arka Bahçe Kazı Alanı',
    skyGradient: 'from-emerald-600 via-teal-500 to-green-100',
    soilSurfaceColor: '#22c55e',
    soilDeepColor: '#052e16',
    soilBorderColor: '#022c22',
    cellUndugBg: 'linear-gradient(180deg, #16a34a 0%, #15803d 50%, #052e16 100%)',
    cellDugBg: '#031f0f',
    foliageColor: '#4ade80',
    ambientParticles: '🍃'
  },
  forest: {
    name: 'Orman Toprağı',
    skyGradient: 'from-emerald-700 via-green-600 to-emerald-200',
    soilSurfaceColor: '#16a34a',
    soilDeepColor: '#042813',
    soilBorderColor: '#021a0c',
    cellUndugBg: 'linear-gradient(180deg, #15803d 0%, #166534 50%, #042813 100%)',
    cellDugBg: '#02180b',
    foliageColor: '#22c55e',
    ambientParticles: '🌿'
  },
  rocky: {
    name: 'Kayalık Vadi',
    skyGradient: 'from-emerald-800 to-stone-400',
    soilSurfaceColor: '#15803d',
    soilDeepColor: '#064e3b',
    soilBorderColor: '#022c22',
    cellUndugBg: 'linear-gradient(180deg, #166534 0%, #0f766e 60%, #042f2e 100%)',
    cellDugBg: '#021e1d',
    foliageColor: '#10b981',
    ambientParticles: '🪨'
  },
  desert: {
    name: 'Çöl Vadisi',
    skyGradient: 'from-teal-600 to-emerald-300',
    soilSurfaceColor: '#10b981',
    soilDeepColor: '#064e3b',
    soilBorderColor: '#022c22',
    cellUndugBg: 'linear-gradient(180deg, #059669 0%, #047857 60%, #064e3b 100%)',
    cellDugBg: '#022c22',
    foliageColor: '#34d399',
    ambientParticles: '✨'
  },
  jungle: {
    name: 'Yağmur Ormanı',
    skyGradient: 'from-emerald-800 to-teal-400',
    soilSurfaceColor: '#15803d',
    soilDeepColor: '#052e16',
    soilBorderColor: '#021a0c',
    cellUndugBg: 'linear-gradient(180deg, #16a34a 0%, #15803d 60%, #052e16 100%)',
    cellDugBg: '#02140a',
    foliageColor: '#22c55e',
    ambientParticles: '🌿'
  },
  crystal: {
    name: 'Kristal Mağarası',
    skyGradient: 'from-teal-800 to-cyan-400',
    soilSurfaceColor: '#0d9488',
    soilDeepColor: '#042f2e',
    soilBorderColor: '#021e1d',
    cellUndugBg: 'linear-gradient(180deg, #0f766e 0%, #115e59 60%, #042f2e 100%)',
    cellDugBg: '#021e1d',
    foliageColor: '#2dd4bf',
    ambientParticles: '💎'
  },
  ancient: {
    name: 'Antik Kazı Alanı',
    skyGradient: 'from-emerald-900 to-green-500',
    soilSurfaceColor: '#059669',
    soilDeepColor: '#064e3b',
    soilBorderColor: '#022c22',
    cellUndugBg: 'linear-gradient(180deg, #10b981 0%, #059669 60%, #064e3b 100%)',
    cellDugBg: '#022c22',
    foliageColor: '#6ee7b7',
    ambientParticles: '🏺'
  },
  deep_earth: {
    name: 'Derin Toprak Tabakası',
    skyGradient: 'from-green-950 to-emerald-800',
    soilSurfaceColor: '#047857',
    soilDeepColor: '#022c22',
    soilBorderColor: '#011c15',
    cellUndugBg: 'linear-gradient(180deg, #065f46 0%, #064e3b 60%, #022c22 100%)',
    cellDugBg: '#011c15',
    foliageColor: '#10b981',
    ambientParticles: '🔥'
  },
  diamond_cavern: {
    name: 'Nadir Mücevher Mağarası',
    skyGradient: 'from-emerald-900 to-cyan-600',
    soilSurfaceColor: '#0891b2',
    soilDeepColor: '#042f2e',
    soilBorderColor: '#021e1d',
    cellUndugBg: 'linear-gradient(180deg, #0e7490 0%, #155e75 60%, #083344 100%)',
    cellDugBg: '#041f2a',
    foliageColor: '#22d3ee',
    ambientParticles: '✨'
  },
  diamond_kingdom: {
    name: 'Mücevher Krallığı',
    skyGradient: 'from-emerald-600 via-teal-400 to-yellow-200',
    soilSurfaceColor: '#10b981',
    soilDeepColor: '#042f2e',
    soilBorderColor: '#021e1d',
    cellUndugBg: 'linear-gradient(180deg, #059669 0%, #047857 60%, #064e3b 100%)',
    cellDugBg: '#022c22',
    foliageColor: '#facc15',
    ambientParticles: '👑'
  }
};

export function getLevelTheme(level: number): EnvironmentTheme {
  if (level <= 10) return 'backyard';
  if (level <= 20) return 'forest';
  if (level <= 30) return 'rocky';
  if (level <= 40) return 'desert';
  if (level <= 50) return 'jungle';
  if (level <= 60) return 'crystal';
  if (level <= 70) return 'ancient';
  if (level <= 80) return 'deep_earth';
  if (level <= 90) return 'diamond_cavern';
  return 'diamond_kingdom';
}

export function getLevelConfig(level: number): LevelConfig {
  const safeLevel = Math.max(1, Math.min(100, Math.floor(level)));
  const theme = getLevelTheme(safeLevel);
  const themeInfo = THEME_DATA[theme];

  // Grid dimensions & progressive difficulty starting at Level 3:
  // Level 1-2: 4 cols x 5 rows = 20 cells
  // Level 3-4: 4 cols x 6 rows = 24 cells (slight difficulty increase)
  // Level 5+: 5 cols x 6 rows = 30 cells (expanded underground site)
  let cols = 4;
  let rows = 5;
  if (safeLevel >= 3 && safeLevel <= 4) {
    cols = 4;
    rows = 6;
  } else if (safeLevel >= 5) {
    cols = 5;
    rows = 6;
  }

  const totalCells = cols * rows;

  // Diamond count starts at 10 on Level 1, decreasing by 1 each level down to a minimum of 3
  // User mandate: "ilk bölümlerde çok sayıda mücevher gizlenmiş olsun (10), 3 tanesini bulunca level 1 bitsin.
  // İkinci bölümde 9 mücevhere düşsün 1 azalsın ama yine 3 tane mücevher bulunca level 2 bitsin."
  const totalHiddenDiamonds = Math.max(3, 10 - (safeLevel - 1));
  
  let rareDiamonds = 1;
  let largeDiamonds = totalHiddenDiamonds >= 5 ? 2 : (totalHiddenDiamonds >= 4 ? 1 : 1);
  let diamonds = totalHiddenDiamonds - rareDiamonds - largeDiamonds;
  if (diamonds < 0) {
    diamonds = 1;
    largeDiamonds = 1;
    rareDiamonds = 1;
  }

  // USER MANDATE:
  // Seviye 6 dan itibaren köstebek sayısını 2 ye çıkart, seviye 11 den itibaren köstebek sayısını 3 e çıkart.
  let moleCount = 1;
  if (safeLevel >= 11) {
    moleCount = 3;
  } else if (safeLevel >= 6) {
    moleCount = 2;
  }

  const hazards: Partial<Record<CreatureType, number>> = {
    mole: moleCount
  };

  // Rocks/Obstacles: Level 1-2 clean discovery, slight terrain obstacles from Level 3+
  let rocks = 0;
  if (safeLevel >= 3 && safeLevel <= 5) rocks = 1;
  if (safeLevel > 5) rocks = 2;

  // Objective: Her bölümde 3 tane mücevher bulunca level bitsin!
  const requiredDiamonds = 3;

  const objective = {
    type: 'collectDiamonds' as const,
    target: requiredDiamonds,
    title: `Hedef: ${requiredDiamonds} Mücevher`,
    description: `Gizli ${totalHiddenDiamonds} mücevherden 3 tanesini bul! Köstebeğe çarparsan küreğin kırılır!`
  };

  return {
    level: safeLevel,
    title: safeLevel === 100 ? 'Seviye 100 – Büyük Elmas Krallığı' : `Seviye ${safeLevel} – ${themeInfo.name}`,
    theme,
    themeName: themeInfo.name,
    cols,
    rows,
    diamonds,
    largeDiamonds,
    rareDiamonds,
    hazards,
    rocks,
    objective
  };
}

// Cell generator with customizable seed: supports fresh randomization on retry
export function buildLevelGrid(config: LevelConfig, customSeed?: number): SoilCellData[] {
  const { cols, rows, level, diamonds, largeDiamonds, rareDiamonds, hazards, rocks } = config;
  const totalCells = cols * rows;

  // Pseudo-random generator seeded by level + optional custom seed
  let seed = ((customSeed !== undefined ? customSeed : level * 1337) * 9301 + 49297) % 233280;
  function random(): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Array of indices
  const indices: number[] = Array.from({ length: totalCells }, (_, i) => i);
  
  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const cells: SoilCellData[] = [];
  const assignedTypes: Record<number, { type: CellType; creatureType?: CreatureType; diamondValue: number; rockHardness: number }> = {};

  let indexPointer = 0;

  // Place Rare Diamonds
  for (let i = 0; i < rareDiamonds && indexPointer < indices.length; i++) {
    assignedTypes[indices[indexPointer++]] = {
      type: 'rare_diamond',
      diamondValue: 1,
      rockHardness: 0
    };
  }

  // Place Large Diamonds
  for (let i = 0; i < largeDiamonds && indexPointer < indices.length; i++) {
    assignedTypes[indices[indexPointer++]] = {
      type: 'large_diamond',
      diamondValue: 1,
      rockHardness: 0
    };
  }

  // Place Normal Diamonds
  for (let i = 0; i < diamonds && indexPointer < indices.length; i++) {
    assignedTypes[indices[indexPointer++]] = {
      type: 'diamond',
      diamondValue: 1,
      rockHardness: 0
    };
  }

  // Place Hazards with guaranteed spacing so moles are never adjacent to each other
  const placedHazardIndices: number[] = [];
  const isTooCloseToOtherHazard = (candidateIdx: number): boolean => {
    const cx = candidateIdx % cols;
    const cy = Math.floor(candidateIdx / cols);
    for (const hIdx of placedHazardIndices) {
      const hx = hIdx % cols;
      const hy = Math.floor(hIdx / cols);
      // Chebyshev distance <= 1 means adjacent (orthogonally or diagonally)
      if (Math.abs(cx - hx) <= 1 && Math.abs(cy - hy) <= 1) {
        return true;
      }
    }
    return false;
  };

  Object.entries(hazards).forEach(([creature, count]) => {
    for (let i = 0; i < (count || 0); i++) {
      // Find an available index in remaining indices that is separated from other hazards
      let chosenIndex: number | null = null;
      let chosenArrIdx = -1;

      for (let k = 0; k < indices.length; k++) {
        const candidate = indices[k];
        if (assignedTypes[candidate] === undefined && !isTooCloseToOtherHazard(candidate)) {
          chosenIndex = candidate;
          chosenArrIdx = k;
          break;
        }
      }

      // Fallback if tight grid
      if (chosenIndex === null) {
        for (let k = 0; k < indices.length; k++) {
          const candidate = indices[k];
          if (assignedTypes[candidate] === undefined) {
            chosenIndex = candidate;
            chosenArrIdx = k;
            break;
          }
        }
      }

      if (chosenIndex !== null && chosenArrIdx !== -1) {
        indices.splice(chosenArrIdx, 1);
        placedHazardIndices.push(chosenIndex);
        assignedTypes[chosenIndex] = {
          type: 'creature',
          creatureType: creature as CreatureType,
          diamondValue: 0,
          rockHardness: 0
        };
      }
    }
  });

  // Place Rocks
  for (let i = 0; i < rocks && indexPointer < indices.length; i++) {
    assignedTypes[indices[indexPointer++]] = {
      type: 'rock',
      diamondValue: 0,
      rockHardness: level > 40 ? 2 : 1
    };
  }

  // Build full cell grid (0 to cols-1, 0 to rows-1)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      const cellInfo = assignedTypes[idx] || {
        type: 'empty',
        diamondValue: 0,
        rockHardness: 0
      };

      // Soil hardness scales gently with level and depth
      const maxSoilHealth = level > 35 && y >= 3 ? 2 : 1;

      cells.push({
        id: `cell_${x}_${y}`,
        x,
        y,
        maxSoilHealth,
        soilHealth: maxSoilHealth,
        isExcavated: false,
        type: cellInfo.type,
        creatureType: cellInfo.creatureType,
        diamondValue: cellInfo.diamondValue,
        hasTriggeredHazard: false,
        hasCollected: false,
        rockHardness: cellInfo.rockHardness
      });
    }
  }

  return cells;
}
