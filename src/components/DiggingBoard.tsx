import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SoilCellData, LevelConfig, ToolItem } from '../types/game';
import { ToolVisual } from './ToolVisual';
import { DiamondVisual } from './DiamondVisual';
import { DashedDiamondSilhouette } from './DashedDiamondSilhouette';
import { CreatureVisual } from './CreatureVisual';
import { RockVisual } from './RockVisual';
import { PlantedShovelWithStars } from './PlantedShovelWithStars';
import { THEME_DATA } from '../data/levels';
import { sound } from '../utils/audio';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface FlyingJewel {
  id: string;
  value: number;
  variant: 'normal' | 'large' | 'rare';
  startScreen: { x: number; y: number };
  targetScreen: { x: number; y: number };
  phase: 'emerging' | 'flying';
  currentPos: { x: number; y: number };
  currentScale: number;
}

interface DiggingBoardProps {
  levelConfig: LevelConfig;
  cells: SoilCellData[];
  equippedTool: ToolItem;
  showTutorial: boolean;
  disabled?: boolean;
  isShovelBroken?: boolean;
  isVictoryPending?: boolean;
  onDigCell: (cell: SoilCellData) => void;
  onDiamondCollect: (value: number, x: number, y: number) => void;
  onTriggerCheer?: () => void;
  onTriggerScared?: () => void;
  onShovelMove?: (pos: { x: number; y: number } | null) => void;
  shovelRestingRef?: React.RefObject<HTMLDivElement | null>;
  isDynamiteActive?: boolean;
  onDynamiteUsed?: () => void;
  hintTriggerTime?: number;
  onRelocateGem?: (oldCellId: string, targetCellId: string, targetX: number, targetY: number) => void;
  onTransformCell?: (cellId: string, newType: CellType) => void;
}

export const DiggingBoard: React.FC<DiggingBoardProps> = ({
  levelConfig,
  cells,
  equippedTool,
  showTutorial,
  disabled = false,
  isShovelBroken = false,
  isVictoryPending = false,
  onDigCell,
  onDiamondCollect,
  onTriggerCheer,
  onTriggerScared,
  onShovelMove,
  isDynamiteActive = false,
  onDynamiteUsed,
  hintTriggerTime = 0,
  onRelocateGem,
  onTransformCell
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [shovelPos, setShovelPos] = useState<{ x: number; y: number } | null>(null);
  const [isDiggingAnim, setIsDiggingAnim] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Broken shovel impact location on soil
  const [brokenSpot, setBrokenSpot] = useState<{ x: number; y: number } | null>(null);
  const lastActivePointerPos = useRef<{ x: number; y: number } | null>(null);
  
  // Flying jewel: emerges from soil small -> grows large -> flies to counter
  const [flyingJewel, setFlyingJewel] = useState<FlyingJewel | null>(null);
  // Discovered mole IDs: starts jumping enthusiastically in place as soon as found
  const [discoveredMoleIds, setDiscoveredMoleIds] = useState<Set<string>>(new Set());
  // Defeated mole IDs: killed by dynamite blast!
  const [defeatedMoleIds, setDefeatedMoleIds] = useState<Set<string>>(new Set());
  const defeatedMoleIdsRef = useRef<Set<string>>(new Set());
  // Extracted gem IDs: displays dashed diamond outline where jewels were excavated
  const [extractedGemIds, setExtractedGemIds] = useState<Set<string>>(new Set());
  // Departed gem IDs: permanently removes static diamond graphic once excavated so it NEVER reappears in hole after animation finishes
  const [departedGemIds, setDepartedGemIds] = useState<Set<string>>(new Set());
  // Uncovered gem IDs: 100% of soil has been cleared, waiting 1s before launching extraction animation
  const [uncoveredGemIds, setUncoveredGemIds] = useState<Set<string>>(new Set());
  // Red glowing gem IDs: gems revealed when a mole is triggered that shine with glowing red light
  const [redGlowingGemIds, setRedGlowingGemIds] = useState<Set<string>>(new Set());
  // Last excavated diamond position for victory planted shovel
  const [lastExcavatedPos, setLastExcavatedPos] = useState<{ x: number; y: number } | null>(null);

  // Active Hint glowing gem ID
  const [activeHintGemId, setActiveHintGemId] = useState<string | null>(null);

  // Dynamite state: placed bomb on canvas & aiming position
  const [placedDynamite, setPlacedDynamite] = useState<{ id: string; x: number; y: number; stage: 'fuse' | 'boom' } | null>(null);
  const [dynamiteAimPos, setDynamiteAimPos] = useState<{ x: number; y: number } | null>(null);
  const [fleeingGems, setFleeingGems] = useState<Array<{ id: string; from: { x: number; y: number }; to: { x: number; y: number }; variant: 'normal' | 'large' | 'rare' }>>([]);
  const [boardShake, setBoardShake] = useState(false);
  
  // Set of collected diamond IDs to avoid duplicate collection
  const collectedGemIds = useRef<Set<string>>(new Set());
  // Active 1-second delay timers for 100% uncovered gems
  const pendingGemTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  // Set of triggered creature hazard IDs to ensure EXACTLY 1 heart loss per mole
  const triggeredHazardIds = useRef<Set<string>>(new Set());
  // Guard: prevents uncovering more than 1 mole in a single digging stroke / action
  const moleTriggeredInCurrentDig = useRef<boolean>(false);
  const lastMoleTriggerTimestamp = useRef<number>(0);
  // Active timers for 1.5s delay after finding a mole before wiping all soil
  const moleSoilTimers = useRef<NodeJS.Timeout[]>([]);

  const lastDigSoundTime = useRef<number>(0);
  const lastDigPoint = useRef<{ x: number; y: number } | null>(null);
  const lastBreakCoordRef = useRef<{ x: number; y: number } | null>(null);
  const digAnimTimer = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedHintTimeRef = useRef<number>(0);

  // -------------------------------------------------------------
  // HINT TRIGGER LOGIC: HIGHLIGHT A SINGLE HIDDEN DIAMOND
  // -------------------------------------------------------------
  useEffect(() => {
    if (!hintTriggerTime || hintTriggerTime <= 0) return;
    if (hintTriggerTime <= lastProcessedHintTimeRef.current) return;

    lastProcessedHintTimeRef.current = hintTriggerTime;

    // Find any uncollected hidden diamond
    const uncollectedGems = cells.filter(c => 
      (c.type === 'diamond' || c.type === 'large_diamond' || c.type === 'rare_diamond') &&
      !collectedGemIds.current.has(c.id) &&
      !departedGemIds.has(c.id)
    );

    if (uncollectedGems.length > 0) {
      // Prioritize rare -> large -> normal
      const sorted = [...uncollectedGems].sort((a, b) => (b.diamondValue || 1) - (a.diamondValue || 1));
      const target = sorted[0];
      setActiveHintGemId(target.id);

      const timer = setTimeout(() => {
        setActiveHintGemId(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [hintTriggerTime, cells, departedGemIds]);

  useEffect(() => {
    // Clear any active pending gem timers
    pendingGemTimers.current.forEach(t => clearTimeout(t));
    pendingGemTimers.current.clear();

    moleSoilTimers.current.forEach(t => clearTimeout(t));
    moleSoilTimers.current = [];

    collectedGemIds.current.clear();
    triggeredHazardIds.current.clear();
    defeatedMoleIdsRef.current.clear();
    setDefeatedMoleIds(new Set());
    moleTriggeredInCurrentDig.current = false;
    lastMoleTriggerTimestamp.current = 0;
    setDiscoveredMoleIds(new Set());
    setExtractedGemIds(new Set());
    setDepartedGemIds(new Set());
    setUncoveredGemIds(new Set());
    setRedGlowingGemIds(new Set());
    setLastExcavatedPos(null);
    setBrokenSpot(null);
  }, [levelConfig.level]);

  // Victory sequence: play planted shovel impact and celestial chime
  useEffect(() => {
    if (isVictoryPending) {
      sound.playShovelPlant();
    }
  }, [isVictoryPending]);

  useEffect(() => {
    if (disabled) {
      setIsDragging(false);
      setShovelPos(null);
      if (onShovelMove) onShovelMove(null);
    }
  }, [disabled, onShovelMove]);

  // When 3rd mole is found and shovel breaks: trigger animation and shatter particles
  useEffect(() => {
    if (isShovelBroken) {
      setIsDragging(false);
      setIsDiggingAnim(false);
      if (onShovelMove) onShovelMove(null);

      // Determine where the tool broke (exact scraping spot)
      let spot = lastBreakCoordRef.current || shovelPos || lastDigPoint.current || lastActivePointerPos.current;
      if (!spot && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        spot = { x: rect.width / 2, y: rect.height / 2 };
      }
      if (spot) {
        setBrokenSpot(spot);
        spawnShovelBreakEffect(spot.x, spot.y);
      }
    } else {
      setBrokenSpot(null);
      lastBreakCoordRef.current = null;
    }
  }, [isShovelBroken]);

  useEffect(() => {
    return () => {
      pendingGemTimers.current.forEach(t => clearTimeout(t));
      pendingGemTimers.current.clear();
      if (digAnimTimer.current) clearTimeout(digAnimTimer.current);
    };
  }, []);

  const themeVisuals = THEME_DATA[levelConfig.theme];

  // Tool radius: tailored to each equipment's physical specification (11px to 48px)
  const toolRadius = equippedTool.digRadius || Math.max(12, Math.min(50, 14 + (equippedTool.power || 1) * 3.5));

  // -------------------------------------------------------------
  // REALISTIC DIRT PARTICLES
  // -------------------------------------------------------------
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.35,
            life: p.life - 0.06
          }))
          .filter(p => p.life > 0)
      );
    }, 20);

    return () => clearInterval(interval);
  }, [particles.length]);

  const spawnDirtParticles = (x: number, y: number, count = 4) => {
    const colors = ['#5a2e0e', '#3f1c05', '#2a1102', '#78350f', '#92400e', '#351806'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.2;
      newParticles.push({
        id: `p_${Date.now()}_${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        life: 1.0
      });
    }
    setParticles(prev => [...prev.slice(-50), ...newParticles]);
  };

  const spawnRockParticles = (rx: number, ry: number) => {
    const rockColors = ['#94a3b8', '#64748b', '#475569', '#334155', '#cbd5e1', '#e2e8f0'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      newParticles.push({
        id: `rock_p_${Date.now()}_${i}_${Math.random()}`,
        x: rx,
        y: ry,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.0,
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        size: 3 + Math.random() * 4.5,
        life: 1.2
      });
    }
    setParticles(prev => [...prev.slice(-60), ...newParticles]);
  };

  const spawnMoleCrumbleEffect = (cx: number, cy: number, rx: number, ry: number) => {
    const colors = ['#6a3510', '#4a250c', '#351806', '#854d0e', '#a16207', '#2e1204', '#1f0d04'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random();
      const px = cx + Math.cos(angle) * rx * dist;
      const py = cy + Math.sin(angle) * ry * dist;
      newParticles.push({
        id: `mole_crumble_${Date.now()}_${i}_${Math.random()}`,
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 4.5,
        vy: 1.5 + Math.random() * 5.5, // tumbling downwards like crumbling soil
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.5 + Math.random() * 4.5,
        life: 1.2
      });
    }
    setParticles(prev => [...prev.slice(-60), ...newParticles]);
  };

  const spawnGemSoilShedEffect = (cx: number, cy: number, r: number) => {
    const colors = ['#6a3510', '#4a250c', '#351806', '#854d0e', '#a16207', '#2e1204', '#ef4444', '#f87171'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random();
      const px = cx + Math.cos(angle) * r * dist;
      const py = cy + Math.sin(angle) * r * dist;
      newParticles.push({
        id: `gem_shed_${Date.now()}_${i}_${Math.random()}`,
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 4.0,
        vy: 2.0 + Math.random() * 5.5, // soil falling and tumbling away
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.0 + Math.random() * 3.8,
        life: 1.2
      });
    }
    setParticles(prev => [...prev.slice(-70), ...newParticles]);
  };

  const spawnMassiveSoilClearEffect = (w: number, h: number) => {
    const colors = ['#6a3510', '#4a250c', '#351806', '#854d0e', '#a16207', '#2e1204', '#ef4444', '#f87171', '#fbbf24'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 65; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      newParticles.push({
        id: `board_clear_${Date.now()}_${i}_${Math.random()}`,
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 6.0,
        vy: 1.5 + Math.random() * 6.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.5 + Math.random() * 4.5,
        life: 1.4
      });
    }
    setParticles(prev => [...prev.slice(-85), ...newParticles]);
  };

  const spawnShovelBreakEffect = (cx: number, cy: number) => {
    const colors = ['#ca8a04', '#a16207', '#78350f', '#854d0e', '#ef4444', '#cbd5e1', '#475569', '#f87171'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      newParticles.push({
        id: `shovel_break_${Date.now()}_${i}_${Math.random()}`,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        life: 1.4
      });
    }
    setParticles(prev => [...prev.slice(-60), ...newParticles]);
  };

  const spawnDynamiteExplosionEffect = (cx: number, cy: number) => {
    const colors = ['#ef4444', '#f97316', '#fbbf24', '#fef08a', '#ffffff', '#78350f', '#451a03', '#292524'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 52; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 9.0;
      newParticles.push({
        id: `dyn_blast_${Date.now()}_${i}_${Math.random()}`,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3.5 + Math.random() * 5.5,
        life: 1.5
      });
    }
    setParticles(prev => [...prev.slice(-90), ...newParticles]);
  };

  const triggerDynamitePlacement = (x: number, y: number) => {
    const explosionId = `dyn_${Date.now()}`;
    setPlacedDynamite({ id: explosionId, x, y, stage: 'fuse' });
    setDynamiteAimPos(null);
    if (onDynamiteUsed) onDynamiteUsed();

    // Sizzling fuse sound
    sound.playDynamiteFuse();

    // Spark particles during fuse
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const sparkAngle = (Math.random() - 0.5) * Math.PI;
        setParticles(prev => [
          ...prev,
          {
            id: `fuse_spark_${Date.now()}_${i}`,
            x: x,
            y: y - 18,
            vx: Math.sin(sparkAngle) * 2.5,
            vy: -1.5 - Math.random() * 2.0,
            color: ['#fbbf24', '#f97316', '#ef4444', '#ffffff'][Math.floor(Math.random() * 4)],
            size: 2.5,
            life: 0.6
          }
        ]);
      }, i * 80);
    }

    // Explosion after 600ms
    setTimeout(() => {
      setPlacedDynamite({ id: explosionId, x, y, stage: 'boom' });
      sound.playDynamiteExplosion();
      setBoardShake(true);
      setTimeout(() => setBoardShake(false), 450);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          // Blast out soil in radius ~78px
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(x, y, 78, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        const width = canvas.width;
        const height = canvas.height;
        const blastRadius = 82;

        spawnDynamiteExplosionEffect(x, y);

        // 1. Köstebek kontrolü: Patlama etki alanı içindeki veya açığa çıkan köstebekler ölür / yok edilir (asla oyun bitirmez!)
        cells.forEach(cell => {
          if (cell.type === 'creature') {
            const mx = ((cell.x + 0.5) / levelConfig.cols) * width;
            const my = ((cell.y + 0.5) / levelConfig.rows) * height;
            const dist = Math.hypot(x - mx, y - my);
            // Patlama çemberi ve çevresindeki köstebekleri etkisiz hale getir
            if (dist < blastRadius + 30) {
              defeatedMoleIdsRef.current.add(cell.id);
              triggeredHazardIds.current.add(cell.id);
              setDefeatedMoleIds(prev => new Set(prev).add(cell.id));
              sound.playMoleDefeat();
              if (onTriggerCheer) onTriggerCheer();
            }
          }
        });

        // 2. Mücevher kontrolü: Patlama etki alanı içinde mücevher varsa diğer açılmamış toprak alanına kaçsın!
        cells.forEach(cell => {
          const isGem = cell.type === 'diamond' || cell.type === 'large_diamond' || cell.type === 'rare_diamond';
          if (isGem && !collectedGemIds.current.has(cell.id) && !departedGemIds.has(cell.id)) {
            const gx = ((cell.x + 0.5) / levelConfig.cols) * width;
            const gy = ((cell.y + 0.5) / levelConfig.rows) * height;
            const dist = Math.hypot(x - gx, y - gy);

            if (dist < blastRadius) {
              // Find empty distant cells that haven't been excavated
              const candidateCells = cells.filter(c => 
                c.id !== cell.id &&
                c.type === 'empty' &&
                !c.hasCollected &&
                Math.hypot(x - ((c.x + 0.5) / levelConfig.cols) * width, y - ((c.y + 0.5) / levelConfig.rows) * height) > 95
              );

              if (candidateCells.length > 0) {
                const targetCell = candidateCells[Math.floor(Math.random() * candidateCells.length)];
                const targetGx = ((targetCell.x + 0.5) / levelConfig.cols) * width;
                const targetGy = ((targetCell.y + 0.5) / levelConfig.rows) * height;

                const variant = (cell.type === 'rare_diamond' ? 'rare' : cell.type === 'large_diamond' ? 'large' : 'normal') as 'normal' | 'large' | 'rare';
                
                // Add fleeing gem animation
                const fleeItem = {
                  id: cell.id,
                  from: { x: gx, y: gy },
                  to: { x: targetGx, y: targetGy },
                  variant
                };

                setFleeingGems(prev => [...prev, fleeItem]);
                sound.playGemEscape();
                if (onTriggerScared) onTriggerScared();

                setTimeout(() => {
                  setFleeingGems(prev => prev.filter(f => f.id !== cell.id));
                  if (onRelocateGem) {
                    onRelocateGem(cell.id, targetCell.id, targetCell.x, targetCell.y);
                  }
                }, 650);
              }
            }
          }
        });

        // 3. Taş Kaya kontrolü: Patlama etki alanı içindeki kayalar küçük parçalara ayrılır, içinden küçük bir mücevher çıkabilir!
        cells.forEach(cell => {
          if (cell.type === 'rock') {
            const rx = ((cell.x + 0.5) / levelConfig.cols) * width;
            const ry = ((cell.y + 0.5) / levelConfig.rows) * height;
            const dist = Math.hypot(x - rx, y - ry);

            if (dist < blastRadius + 20) {
              spawnRockParticles(rx, ry);
              const revealsGem = Math.random() < 0.65;
              const newType = revealsGem ? 'diamond' : 'empty';
              if (onTransformCell) {
                onTransformCell(cell.id, newType as CellType);
              }
              sound.playPickaxeStrike();
            }
          }
        });

        // Check if any gems were fully uncovered by the explosion (skip hazard checks so moles never end the game)
        setTimeout(() => {
          checkUndergroundEntities(x, y, undefined, undefined, true);
        }, 120);
      }

      // Cleanup placed dynamite after boom animation
      setTimeout(() => {
        setPlacedDynamite(null);
      }, 700);
    }, 600);
  };

  // -------------------------------------------------------------
  // INITIALIZE SOIL TEXTURE ON CANVAS (1:1 PIXEL COORDINATE MATCH)
  // -------------------------------------------------------------
  const initSoilCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use exact client bounding rect size for 1:1 coordinate matching
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(10, Math.floor(rect.width));
    const height = Math.max(10, Math.floor(rect.height));

    // Internal buffer matches displayed dimensions exactly
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Natural Soil Strata Gradient
    const soilGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (levelConfig.theme === 'desert') {
      soilGrad.addColorStop(0, '#b45309');
      soilGrad.addColorStop(0.3, '#92400e');
      soilGrad.addColorStop(0.7, '#78350f');
      soilGrad.addColorStop(1, '#451a03');
    } else if (levelConfig.theme === 'crystal') {
      soilGrad.addColorStop(0, '#1e293b');
      soilGrad.addColorStop(0.35, '#0f172a');
      soilGrad.addColorStop(0.75, '#082f49');
      soilGrad.addColorStop(1, '#020617');
    } else if (levelConfig.theme === 'deep_earth') {
      soilGrad.addColorStop(0, '#4a1535');
      soilGrad.addColorStop(0.4, '#2e0c20');
      soilGrad.addColorStop(0.8, '#1b0613');
      soilGrad.addColorStop(1, '#0f020a');
    } else {
      soilGrad.addColorStop(0, '#5f3314');
      soilGrad.addColorStop(0.25, '#4a250c');
      soilGrad.addColorStop(0.65, '#351806');
      soilGrad.addColorStop(1, '#1e0c02');
    }

    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Procedural organic dirt clods and clumps
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const dirtTones = ['#3d1c06', '#261003', '#6b3711', '#4d260a', '#170801', '#783e15'];
    for (let i = 0; i < 380; i++) {
      const rx = rng(i * 1.7 + levelConfig.level) * width;
      const ry = rng(i * 2.9 + levelConfig.level) * height;
      const rRad = 1.2 + rng(i * 3.3) * 4.5;
      ctx.fillStyle = dirtTones[Math.floor(rng(i * 5.1) * dirtTones.length)];
      ctx.beginPath();
      ctx.arc(rx, ry, rRad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Quartz sand specks
    for (let i = 0; i < 45; i++) {
      const qx = rng(i * 6.3 + 42) * width;
      const qy = rng(i * 7.1 + 84) * height;
      ctx.fillStyle = 'rgba(254, 243, 199, 0.35)';
      ctx.beginPath();
      ctx.arc(qx, qy, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Root filaments
    ctx.strokeStyle = 'rgba(180, 110, 20, 0.3)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      let curX = rng(i * 8.8) * width;
      let curY = 0;
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      for (let s = 0; s < 5; s++) {
        curX += (rng(i * 14 + s) - 0.5) * 30;
        curY += 20 + rng(i * 16 + s) * 22;
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();
    }

    // 5. Lush top grass turf fringe
    const foliage = themeVisuals.foliageColor || '#84cc16';
    for (let x = 0; x < width; x += 4) {
      const h = 5 + rng(x * 3.1) * 7;
      ctx.strokeStyle = rng(x) > 0.4 ? foliage : '#365314';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (rng(x * 2) - 0.5) * 5, h);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

  }, [levelConfig.level, levelConfig.theme, themeVisuals.foliageColor]);

  // Re-initialize on level change
  useEffect(() => {
    collectedGemIds.current.clear();
    const timer = setTimeout(initSoilCanvas, 50);
    return () => clearTimeout(timer);
  }, [levelConfig.level, initSoilCanvas]);

  // Handle window resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => initSoilCanvas());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [initSoilCanvas]);

  // -------------------------------------------------------------
  // ACCURATE SHOVEL CARVING (EXACT PIXEL COORDINATES)
  // -------------------------------------------------------------
  const carveSoilAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const r = toolRadius;
    const power = equippedTool.power || 1.2;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    if (equippedTool.id === 'rake') {
      // 3-Tined Rake claw scratch pattern
      const offsets = [-r * 0.65, 0, r * 0.65];
      offsets.forEach(off => {
        ctx.beginPath();
        ctx.arc(x + off, y, Math.max(3.5, r * 0.28), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fill();
      });
      // Soft comb sweep in-between
      ctx.beginPath();
      ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();
    } else if (equippedTool.id === 'small_brush') {
      // Gentle archaeological bristle dusting
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fill();
    } else if (equippedTool.id === 'big_brush') {
      // Broad soft sweeping stroke
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fill();
    } else if (equippedTool.id === 'pickaxe') {
      // Sharp fractured triangular rock crater
      const points = 6;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const jitter = 0.75 + Math.random() * 0.5;
        const px = x + Math.cos(angle) * (r * jitter);
        const py = y + Math.sin(angle) * (r * jitter);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
      ctx.fill();
    } else if (equippedTool.id === 'excavator') {
      // Massive hydraulic excavator scoop
      const points = 10;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const jitter = 0.9 + Math.random() * 0.2;
        const px = x + Math.cos(angle) * (r * jitter);
        const py = y + Math.sin(angle) * (r * jitter);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
      ctx.fill();
    } else {
      // Shovels and standard tools
      const points = 8;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const jitter = 0.85 + Math.random() * 0.3;
        const px = x + Math.cos(angle) * (r * jitter);
        const py = y + Math.sin(angle) * (r * jitter);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const outerAlpha = Math.min(0.9, 0.45 + power * 0.08);
      const innerAlpha = Math.min(1.0, 0.65 + power * 0.09);

      ctx.fillStyle = `rgba(0, 0, 0, ${outerAlpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${innerAlpha})`;
      ctx.fill();
    }

    ctx.restore();

    // Dig sound
    const now = Date.now();
    const soundThrottle = equippedTool.id === 'drill' ? 80 : equippedTool.id === 'small_brush' ? 140 : 110;
    if (now - lastDigSoundTime.current > soundThrottle) {
      sound.playDig(equippedTool.id);
      lastDigSoundTime.current = now;
    }

    const particleCount = equippedTool.id === 'excavator' ? 6 : equippedTool.id === 'small_brush' ? 2 : 3;
    spawnDirtParticles(x, y, particleCount);
  };

  // Distance from point to line segment
  const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  };

  const carveSoilLine = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const step = Math.max(4, toolRadius * 0.35);
    const steps = Math.ceil(dist / step);

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 1 : i / steps;
      const ix = p1.x + (p2.x - p1.x) * t;
      const iy = p1.y + (p2.y - p1.y) * t;
      carveSoilAtPoint(ix, iy);
    }

    // Check diamonds and creatures at shovel position and along the line segment
    checkUndergroundEntities(p2.x, p2.y, p1.x, p1.y);
  };

  // -------------------------------------------------------------
  // FULL UNCOVERING CHECK: DIAMOND IS WON ONLY WHEN COMPLETELY VISIBLE
  // CREATURE HAZARDS (MOLES): STAY STATIC UNTIL TOUCHED, THEN JUMP & ALL DIRT FALLS AWAY
  // -------------------------------------------------------------
  const checkUndergroundEntities = (
    shovelX?: number, 
    shovelY?: number, 
    prevShovelX?: number, 
    prevShovelY?: number,
    isDynamite?: boolean
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Diamonds check: Must be 100% fully scraped away with NO soil remaining on top!
    cells.forEach(cell => {
      const isGem = cell.type === 'diamond' || cell.type === 'large_diamond' || cell.type === 'rare_diamond';
      if (!isGem) return;
      if (collectedGemIds.current.has(cell.id) || pendingGemTimers.current.has(cell.id)) return;

      // Exact pixel center of the gem in the canvas
      const gemX = ((cell.x + 0.5) / levelConfig.cols) * width;
      const gemY = ((cell.y + 0.5) / levelConfig.rows) * height;
      const gemR = cell.type === 'rare_diamond' ? 22 : cell.type === 'large_diamond' ? 19 : 15;

      // Sample 17 probe points across the gem to guarantee 100% full uncovering (center, inner, mid, outer perimeter)
      const probeOffsets = [
        // Center
        { dx: 0, dy: 0 },
        // Inner circle
        { dx: -gemR * 0.35, dy: 0 },
        { dx: gemR * 0.35, dy: 0 },
        { dx: 0, dy: -gemR * 0.35 },
        { dx: 0, dy: gemR * 0.35 },
        // Mid diagonal
        { dx: -gemR * 0.45, dy: -gemR * 0.45 },
        { dx: gemR * 0.45, dy: -gemR * 0.45 },
        { dx: -gemR * 0.45, dy: gemR * 0.45 },
        { dx: gemR * 0.45, dy: gemR * 0.45 },
        // Mid cardinal
        { dx: -gemR * 0.72, dy: 0 },
        { dx: gemR * 0.72, dy: 0 },
        { dx: 0, dy: -gemR * 0.72 },
        { dx: 0, dy: gemR * 0.72 },
        // Outer perimeter edge
        { dx: -gemR * 0.65, dy: -gemR * 0.65 },
        { dx: gemR * 0.65, dy: -gemR * 0.65 },
        { dx: -gemR * 0.65, dy: gemR * 0.65 },
        { dx: gemR * 0.65, dy: gemR * 0.65 },
      ];

      let clearedProbes = 0;

      for (const p of probeOffsets) {
        const px = Math.floor(gemX + p.dx);
        const py = Math.floor(gemY + p.dy);
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const pixelAlpha = ctx.getImageData(px, py, 1, 1).data[3];
          // Soil must be scraped completely clean (alpha < 30)
          if (pixelAlpha < 30) {
            clearedProbes++;
          }
        }
      }

      // KULLANICI KURALI: "mücevherin tamamı kazılıp üzerinde hiç toprak kalmadıktan 1 saniye sonra mücevher bulundu kazanıldı animasyonu çalışsın"
      // Tüm kontrol noktaları (%100) tamamen temizlendiğinde:
      if (clearedProbes === probeOffsets.length) {
        // Gem is 100% fully uncovered!
        setUncoveredGemIds(prev => {
          if (prev.has(cell.id)) return prev;
          const next = new Set(prev);
          next.add(cell.id);
          return next;
        });

        // Start exactly 1-second (1000ms) delay timer before triggering the collected animation
        const timer = setTimeout(() => {
          collectedGemIds.current.add(cell.id);
          // SADECE DIŞ ÇİZGİLERDEN OLUŞAN BEYAZ KESİKLİ ÇİZGİLİ MÜCEVHER İZİ
          setExtractedGemIds(prev => {
            const next = new Set(prev);
            next.add(cell.id);
            return next;
          });
          // Mücevher topraktan ayrıldı: statik görsel kalıcı olarak kalkar
          setDepartedGemIds(prev => {
            const next = new Set(prev);
            next.add(cell.id);
            return next;
          });
          setActiveHintGemId(prev => (prev === cell.id ? null : prev));
          setLastExcavatedPos({ x: gemX, y: gemY });
          onDigCell(cell);

          launchJewelEmergence(cell, gemX, gemY);
          pendingGemTimers.current.delete(cell.id);
        }, 1000);

        pendingGemTimers.current.set(cell.id, timer);
      }
    });

    // 2. Creature Hazards (Moles):
    // Dinamitle patlatma yapıldıysa köstebek açılsa dahi oyun asla sona ermez (bu yakalanma sayılmaz!)
    if (isDynamite) {
      return;
    }

    // "bir kazma işlemi yapılırken aynı anda 2 köstebeğin veya 3 köstebeğin aynı anda açılmasını engelleyecek şekilde"
    // Tek bir kazma hareketinde veya soğuma süresi içinde birden fazla köstebeğin açılması engellenir!
    if (moleTriggeredInCurrentDig.current || Date.now() - lastMoleTriggerTimestamp.current < 1400) {
      return;
    }

    for (const cell of cells) {
      if (
        cell.type !== 'creature' || 
        cell.hasTriggeredHazard || 
        defeatedMoleIds.has(cell.id) || 
        defeatedMoleIdsRef.current.has(cell.id) || 
        triggeredHazardIds.current.has(cell.id)
      ) continue;

      const creatureX = ((cell.x + 0.5) / levelConfig.cols) * width;
      const creatureY = ((cell.y + 0.5) / levelConfig.rows) * height;
      const cellW = width / levelConfig.cols;
      const cellH = height / levelConfig.rows;

      // Mole graphic dimensions
      const moleHalfW = Math.min(22, cellW * 0.35);
      const moleHalfH = Math.min(22, cellH * 0.35);

      // KULLANICI KURALI: "Köstebeğin herhangi bir yeri kazıldığında değil sadece köstebeğin sarı şapkasına denk gelen bir kazı yapıldığında veya şapkasına denk gelen bir toprak döküldüğünde köstebek bulunmuş olsun"
      // Mole's yellow helmet location:
      // Centered horizontally on creatureX, located on upper crown (creatureY - moleHalfH * 0.55)
      const hatCenterX = creatureX;
      const hatCenterY = creatureY - moleHalfH * 0.55;
      const hatRadiusX = moleHalfW * 0.52;

      let isHit = false;

      // Check 1: Did the tool dig directly across the yellow hat area?
      if (shovelX !== undefined && shovelY !== undefined) {
        let dist = 999999;
        if (prevShovelX !== undefined && prevShovelY !== undefined) {
          dist = distToSegment(hatCenterX, hatCenterY, prevShovelX, prevShovelY, shovelX, shovelY);
        } else {
          dist = Math.hypot(shovelX - hatCenterX, shovelY - hatCenterY);
        }

        // Trigger only if the tool stroke strikes the yellow helmet
        if (dist < toolRadius + hatRadiusX * 0.75) {
          isHit = true;
        }
      }

      // Check 2: Did the soil specifically covering the yellow hat get cleared / dug away?
      if (!isHit) {
        const hatProbePoints = [
          { dx: 0, dy: -moleHalfH * 0.75 }, // Hat top dome
          { dx: -hatRadiusX * 0.5, dy: -moleHalfH * 0.65 }, // Upper left dome
          { dx: hatRadiusX * 0.5, dy: -moleHalfH * 0.65 }, // Upper right dome
          { dx: 0, dy: -moleHalfH * 0.55 }, // Hat center
          { dx: -hatRadiusX * 0.75, dy: -moleHalfH * 0.45 }, // Hat brim left
          { dx: hatRadiusX * 0.75, dy: -moleHalfH * 0.45 }, // Hat brim right
          { dx: 0, dy: -moleHalfH * 0.4 }, // Hat brim center
        ];

        for (const pt of hatProbePoints) {
          const px = Math.floor(creatureX + pt.dx);
          const py = Math.floor(creatureY + pt.dy);
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const alpha = ctx.getImageData(px, py, 1, 1).data[3];
            // 255 is untouched dirt; alpha < 240 means soil over the yellow hat was cleared/dug
            if (alpha < 240) {
              isHit = true;
              break;
            }
          }
        }
      }

      if (isHit) {
        // Save exact break position where tool struck/scraped so broken tool stays there and doesn't jump onto mole
        if (!lastBreakCoordRef.current) {
          lastBreakCoordRef.current = {
            x: shovelX ?? (shovelPos ? shovelPos.x : lastDigPoint.current ? lastDigPoint.current.x : hatCenterX),
            y: shovelY ?? (shovelPos ? shovelPos.y : lastDigPoint.current ? lastDigPoint.current.y : hatCenterY)
          };
        }

        // Bu kazma işleminde bir köstebeğin açıldığını işaretle ve zaman damgasını kaydet
        moleTriggeredInCurrentDig.current = true;
        lastMoleTriggerTimestamp.current = Date.now();

        // Guard against any repeated hazard triggering
        triggeredHazardIds.current.add(cell.id);
        setDiscoveredMoleIds(prev => {
          const next = new Set(prev);
          next.add(cell.id);
          return next;
        });

        // "köstebek zıplamaya başladığında köstebeği kaplayan tüm topraklar dökülüp kaybolmalı"
        // Completely carve away all soil covering this mole and its jump zone
        const clearRx = Math.max(38, cellW * 0.66);
        const clearRy = Math.max(44, cellH * 0.75);
        const clearCenterY = creatureY - 12; // Shift upward so the jumping animation headroom is completely clear!

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.ellipse(creatureX, clearCenterY, clearRx, clearRy, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();

        // Spawn rich tumbling dirt crumble particles for the leaping mole
        spawnMoleCrumbleEffect(creatureX, creatureY, clearRx, clearRy);

        // KULLANICI KURALI: "köstebek bulunduktan 1,5 saniye sonra tüm toprak alanını tümüyle kaldır ve mücevherler kırmızı ışıkla ışıldasın."
        const moleDelayTimer = setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const currentCtx = canvas.getContext('2d');
            if (currentCtx) {
              currentCtx.save();
              currentCtx.clearRect(0, 0, canvas.width, canvas.height);
              currentCtx.restore();
            }
            spawnMassiveSoilClearEffect(canvas.width, canvas.height);
          }

          // Bulunamamış tüm mücevherleri kırmızı ışıkla ışıldat
          const unfoundGemIds = new Set<string>();
          cells.forEach(c => {
            const isGem = c.type === 'diamond' || c.type === 'large_diamond' || c.type === 'rare_diamond';
            if (isGem && !collectedGemIds.current.has(c.id) && !departedGemIds.has(c.id)) {
              unfoundGemIds.add(c.id);
            }
          });

          if (unfoundGemIds.size > 0) {
            setRedGlowingGemIds(prev => {
              const next = new Set(prev);
              unfoundGemIds.forEach(id => next.add(id));
              return next;
            });
          }
        }, 1500);

        moleSoilTimers.current.push(moleDelayTimer);

        // Notify companion dog to react with fright/sadness
        if (onTriggerScared) onTriggerScared();

        // Trigger single life loss and start mole jumping animation
        onDigCell(cell);

        // KESİN ENGEL: Aynı anda 2 veya 3 köstebeğin açılmasını engellemek için döngüden hemen çık!
        break;
      }
    }
  };

  // -------------------------------------------------------------
  // JEWEL EMERGENCE: RISES FROM SOIL -> GROWS IN FULL VIEW -> FLIES & SHRINKS TO COUNTER
  // -------------------------------------------------------------
  const launchJewelEmergence = (cell: SoilCellData, canvasX: number, canvasY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Starting screen position right where the gem was dug up
    const screenX = rect.left + canvasX;
    const screenY = rect.top + canvasY;

    // Center of screen for dramatic zoom & grow
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight * 0.45;

    // Locate top diamond counter target
    const targetEl = document.getElementById('top-diamond-target');
    let targetX = window.innerWidth * 0.84;
    let targetY = 32;
    if (targetEl) {
      const tRect = targetEl.getBoundingClientRect();
      targetX = tRect.left + tRect.width / 2;
      targetY = tRect.top + tRect.height / 2;
    }

    const variant = 
      cell.type === 'rare_diamond' ? 'rare' : 
      cell.type === 'large_diamond' ? 'large' : 'normal';

    // Step 1: Jewel starts right in the excavated soil hole
    const newJewel: FlyingJewel = {
      id: cell.id,
      value: 1, // Her bulunan mücevher kesinlikle 1 adet sayılır
      variant,
      startScreen: { x: screenX, y: screenY },
      targetScreen: { x: targetX, y: targetY },
      phase: 'emerging',
      currentPos: { x: screenX, y: screenY },
      currentScale: 0.5
    };

    setFlyingJewel(newJewel);
    sound.playDiamondBigReveal();
    if (onTriggerCheer) onTriggerCheer();

    // Step 2: Jewel rises out of hole, grows LARGE toward the player with glowing shine
    setTimeout(() => {
      setFlyingJewel(prev => {
        if (!prev) return null;
        // Moves up slightly towards center and expands to 2.2x scale
        const midX = screenX + (viewportCenterX - screenX) * 0.35;
        const midY = screenY - 50;
        return {
          ...prev,
          currentPos: { x: midX, y: midY },
          currentScale: 2.1
        };
      });
    }, 40);

    // Step 3: Shrinks down and smoothly swoops into top diamond counter
    setTimeout(() => {
      sound.playDiamondSwoop();
      setFlyingJewel(prev => {
        if (!prev) return null;
        return {
          ...prev,
          phase: 'flying',
          currentPos: { x: targetX, y: targetY },
          currentScale: 0.35
        };
      });

      // Step 4: Impacts top diamond counter -> increments bank + sparkles
      setTimeout(() => {
        sound.playDiamondCollect();
        // Her bulunan mücevher 1 adet sayılır
        onDiamondCollect(1, targetX, targetY);
        setFlyingJewel(null);
      }, 550);

    }, 620); // Held in front of player for ~600ms so the growth animation is clearly appreciated
  };

  // -------------------------------------------------------------
  // DIRECT POINTER EVENTS ON CANVAS (100% PRECISE MATCH)
  // -------------------------------------------------------------
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // 1:1 pixel coordinate matching canvas buffer
    const x = Math.max(0, Math.min(canvas.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(canvas.height, e.clientY - rect.top));
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || isShovelBroken) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const { x, y } = getCanvasCoords(e);
    lastActivePointerPos.current = { x, y };

    // Dynamite mode: tap to place and ignite dynamite!
    if (isDynamiteActive) {
      triggerDynamitePlacement(x, y);
      return;
    }

    moleTriggeredInCurrentDig.current = false;

    setIsDragging(true);
    setIsDiggingAnim(true);
    if (digAnimTimer.current) {
      clearTimeout(digAnimTimer.current);
      digAnimTimer.current = null;
    }

    setShovelPos({ x, y });
    lastDigPoint.current = { x, y };

    // Real-time character tracking
    if (onShovelMove) onShovelMove({ x: e.clientX, y: e.clientY });

    carveSoilAtPoint(x, y);
    checkUndergroundEntities(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || isShovelBroken) return;
    e.preventDefault();

    const { x, y } = getCanvasCoords(e);
    lastActivePointerPos.current = { x, y };

    // Dynamite aiming cursor update
    if (isDynamiteActive) {
      setDynamiteAimPos({ x, y });
      return;
    }

    if (!isDragging) return;

    setIsDiggingAnim(true);
    if (digAnimTimer.current) {
      clearTimeout(digAnimTimer.current);
      digAnimTimer.current = null;
    }

    setShovelPos({ x, y });

    // Real-time character tracking of shovel position
    if (onShovelMove) onShovelMove({ x: e.clientX, y: e.clientY });

    if (lastDigPoint.current) {
      carveSoilLine(lastDigPoint.current, { x, y });
    } else {
      carveSoilAtPoint(x, y);
      checkUndergroundEntities(x, y);
    }

    lastDigPoint.current = { x, y };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (isDynamiteActive) {
      return;
    }

    moleTriggeredInCurrentDig.current = false;

    if (isShovelBroken) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);
    lastDigPoint.current = null;

    if (onShovelMove) onShovelMove(null);

    // Complete the shovel digging scoop stroke even on a quick tap
    if (digAnimTimer.current) clearTimeout(digAnimTimer.current);
    digAnimTimer.current = setTimeout(() => {
      setIsDiggingAnim(false);
    }, 240);
  };

  return (
    <div 
      id="unified-excavation-site"
      className={`relative w-full max-w-md mx-auto touch-none select-none flex-1 flex flex-col min-h-0 h-full ${
        boardShake ? 'animate-[shake_0.4s_ease-in-out]' : ''
      }`}
    >
      {/* Archaeology Dig Pit Container - Deep Soil / Dark Bedrock Theme */}
      <div 
        ref={containerRef}
        className="relative w-full flex-1 h-full min-h-[360px] rounded-2xl overflow-hidden border-3 sm:border-4 border-emerald-950 shadow-[0_10px_28px_rgba(0,0,0,0.65),inset_0_4px_8px_rgba(0,0,0,0.5)]"
        style={{
          background: 'linear-gradient(180deg, #2b1406 0%, #1c0c04 45%, #100602 100%)'
        }}
        onPointerLeave={() => {
          if (isDynamiteActive) setDynamiteAimPos(null);
        }}
      >
        {/* UNDERGROUND BED (Diamonds & Treasures wait beneath the soil) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle natural deep earth ambient shading */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_35%,rgba(75,35,12,0.6)_0%,transparent_80%)]" />

          {cells.map(cell => {
            const posXPercent = ((cell.x + 0.5) / levelConfig.cols) * 100;
            const posYPercent = ((cell.y + 0.5) / levelConfig.rows) * 100;

            const isDiamond = cell.type === 'diamond' || cell.type === 'large_diamond' || cell.type === 'rare_diamond';
            const diamondVariant = 
              cell.type === 'rare_diamond' ? 'rare' : 
              cell.type === 'large_diamond' ? 'large' : 'normal';

            // Once collected or currently flying out, hide from the static hole so it emerges cleanly!
            const isAlreadyCollectedOrFlying = collectedGemIds.current.has(cell.id) || (flyingJewel && flyingJewel.id === cell.id);
            const isDefeatedMole = cell.type === 'creature' && defeatedMoleIds.has(cell.id);
            const isDiscoveredMole = cell.type === 'creature' && !isDefeatedMole && (cell.hasTriggeredHazard || discoveredMoleIds.has(cell.id));
            const isHintTarget = activeHintGemId === cell.id && !departedGemIds.has(cell.id);

            return (
              <div
                key={cell.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 ${
                  isDiscoveredMole || isHintTarget ? 'z-30' : isDefeatedMole ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: `${posXPercent}%`,
                  top: `${posYPercent}%`,
                }}
              >
                {isDiamond ? (
                  <div className="relative group flex items-center justify-center">
                    {/* Mücevher gitmeye başladığı anda (departed) beyaz kesikli çizgiler o mücevherin yerinde belirir */}
                    {departedGemIds.has(cell.id) ? (
                      <div className="flex items-center justify-center pointer-events-none animate-fade-in">
                        <DashedDiamondSilhouette
                          size={cell.type === 'rare_diamond' ? 'lg' : cell.type === 'large_diamond' ? 'md' : 'sm'}
                        />
                      </div>
                    ) : (
                      /* Mücevher yerindeyken sadece mücevherin kendisi görünür (beyaz çizgiler görünmez) */
                      <div className={`transition-all duration-300 ${
                        redGlowingGemIds.has(cell.id)
                          ? 'scale-115 drop-shadow-[0_0_24px_rgba(239,68,68,1)] animate-bounce'
                          : uncoveredGemIds.has(cell.id)
                          ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.95)] animate-pulse'
                          : ''
                      }`}>
                        <DiamondVisual
                          variant={diamondVariant}
                          size={cell.type === 'rare_diamond' ? 'lg' : cell.type === 'large_diamond' ? 'md' : 'sm'}
                          animate={uncoveredGemIds.has(cell.id) || redGlowingGemIds.has(cell.id)}
                          isRedGlow={redGlowingGemIds.has(cell.id)}
                        />
                      </div>
                    )}
                  </div>
                ) : cell.type === 'creature' && cell.creatureType ? (
                  (() => {
                    if (isDefeatedMole) {
                      return (
                        <div className="relative flex flex-col items-center justify-center opacity-70 scale-90 transition-all">
                          {/* Dizzy stars spinning above defeated mole */}
                          <div className="absolute -top-3 flex items-center gap-1 text-[11px] animate-spin" style={{ animationDuration: '2.5s' }}>
                            <span>💫</span>
                            <span>✨</span>
                          </div>
                          <div className="grayscale-[40%] rotate-12">
                            <CreatureVisual
                              type={cell.creatureType}
                              size="md"
                              isDiscovered={true}
                            />
                          </div>
                          {/* Bold Red "X" Overlay directly over defeated mole */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <span className="text-red-600 font-black text-2xl sm:text-3xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-pulse select-none">
                              ❌
                            </span>
                          </div>
                        </div>
                      );
                    }

                    const isDiscovered = cell.hasTriggeredHazard || discoveredMoleIds.has(cell.id);
                    return (
                      <div className={`relative flex flex-col items-center justify-center ${
                        isDiscovered ? 'animate-mole-jump z-30' : 'z-0'
                      }`}>
                        <CreatureVisual
                          type={cell.creatureType}
                          size="md"
                          isDiscovered={isDiscovered}
                        />
                      </div>
                    );
                  })()
                ) : cell.type === 'rock' ? (
                  <RockVisual size="lg" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* TOP SOIL CANVAS: Pointer events attached directly to canvas for 1:1 precision */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute inset-0 z-10 w-full h-full touch-none ${
            isShovelBroken ? 'cursor-not-allowed pointer-events-none' : disabled ? 'cursor-default pointer-events-none' : isDynamiteActive ? 'cursor-crosshair' : 'cursor-crosshair'
          }`}
        />

        {/* Fleeing Jewels Animation (scurrying away from blast) */}
        {fleeingGems.map(flee => {
          return (
            <div
              key={`fleeing_${flee.id}`}
              className="absolute pointer-events-none z-45 flex flex-col items-center justify-center transition-all ease-in-out duration-600"
              style={{
                left: `${flee.to.x}px`,
                top: `${flee.to.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Dust Cloud & Sprint Trail */}
              <div className="absolute text-sm -bottom-1 -left-3 animate-bounce">💨</div>
              <div className="relative animate-bounce drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]">
                <DiamondVisual variant={flee.variant} size="md" animate={true} />
              </div>
              <div className="px-1.5 py-0.2 bg-sky-950/90 border border-cyan-400 rounded-full text-[8px] font-black text-cyan-200 mt-0.5 animate-pulse whitespace-nowrap shadow">
                KAÇTI! 🏃💨
              </div>
            </div>
          );
        })}

        {/* Hint Sonar Ping: Red Expanding Concentric Rings (küçükten büyüğe doğru giden kırmızı halkalar) */}
        {activeHintGemId && (() => {
          const hintCell = cells.find(c => c.id === activeHintGemId);
          if (!hintCell || departedGemIds.has(hintCell.id)) return null;
          const posXPercent = ((hintCell.x + 0.5) / levelConfig.cols) * 100;
          const posYPercent = ((hintCell.y + 0.5) / levelConfig.rows) * 100;

          return (
            <div
              className="pointer-events-none absolute z-35 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
              style={{
                left: `${posXPercent}%`,
                top: `${posYPercent}%`,
              }}
            >
              {/* Central Glowing Red Beacon Core */}
              <div className="absolute w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-ping" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-white ring-2 ring-red-500" />

              {/* 4 Cascading Expanding Red Sonar Rings (from small to large) */}
              <div className="absolute w-20 h-20 rounded-full border-2 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.85)] animate-sonar-red-1" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.85)] animate-sonar-red-2" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.85)] animate-sonar-red-3" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.85)] animate-sonar-red-4" />

              {/* Subtle Red Ambient Radar Pulse Background */}
              <div className="absolute w-28 h-28 rounded-full bg-red-500/10 blur-sm animate-pulse pointer-events-none" />
            </div>
          );
        })()}

        {/* Dynamite Aiming Reticle Cursor */}
        {isDynamiteActive && dynamiteAimPos && !placedDynamite && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${dynamiteAimPos.x}px`,
              top: `${dynamiteAimPos.y}px`,
            }}
          >
            {/* Blast Radius Dashed Circle (diameter ~156px) */}
            <div className="w-[156px] h-[156px] rounded-full border-2 border-dashed border-red-500 bg-red-500/15 animate-pulse flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <span className="text-[9px] font-black text-red-200 uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded border border-red-500/50 shadow">
                💥 PATLAMA ALANI
              </span>
            </div>

            {/* Dynamite Stick cursor */}
            <div className="absolute -top-6 text-2xl filter drop-shadow animate-bounce">
              🧨
            </div>
          </div>
        )}

        {/* Placed Active Dynamite (Fuse & Blast) */}
        {placedDynamite && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            style={{
              left: `${placedDynamite.x}px`,
              top: `${placedDynamite.y}px`,
            }}
          >
            {placedDynamite.stage === 'fuse' ? (
              <div className="flex flex-col items-center justify-center">
                {/* Sizzling spark at top */}
                <div className="text-sm animate-ping -mb-1 text-yellow-300">💥</div>
                {/* Dynamite stick vibrating */}
                <div className="text-3xl animate-bounce filter drop-shadow-[0_0_14px_rgba(239,68,68,0.9)]">
                  🧨
                </div>
                {/* Fuse countdown indicator */}
                <div className="w-10 h-1.5 bg-stone-900 border border-red-500 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
            ) : (
              /* Blast Flash Shockwave */
              <div className="relative flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-radial from-yellow-200 via-orange-500 to-transparent animate-ping opacity-90" />
                <div className="absolute text-5xl filter drop-shadow-[0_0_25px_rgba(239,68,68,1)] animate-bounce">
                  💥
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real Dirt Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none z-20"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.life,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
            }}
          />
        ))}

        {/* Shovel Visual directly follows finger/mouse cursor with authentic digging motion */}
        {!isShovelBroken && !isVictoryPending && !isDynamiteActive && isDragging && shovelPos && (
          <div 
            className={`pointer-events-none absolute z-30 ${
              equippedTool.id === 'pickaxe'
                ? (isDiggingAnim ? 'animate-pickaxe-dig' : 'pickaxe-idle-held')
                : (isDiggingAnim ? 'animate-shovel-dig' : 'shovel-idle-held')
            }`}
            style={{
              left: `${shovelPos.x}px`,
              top: `${shovelPos.y}px`
            }}
          >
            <ToolVisual
              toolId={equippedTool.id}
              size="md"
              isDigging={isDiggingAnim}
            />
          </div>
        )}

        {/* Victory Planted Shovel thrust into ground with twinkling stars and sound */}
        {isVictoryPending && (
          <PlantedShovelWithStars
            toolId={equippedTool.id}
            x={lastExcavatedPos?.x ?? shovelPos?.x ?? (canvasRef.current ? canvasRef.current.width / 2 : 160)}
            y={lastExcavatedPos?.y ?? shovelPos?.y ?? (canvasRef.current ? canvasRef.current.height / 2 : 180)}
          />
        )}

        {/* Broken Tool Display on Excavation Soil */}
        {isShovelBroken && brokenSpot && (
          <div 
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${brokenSpot.x}px`,
              top: `${brokenSpot.y}px`
            }}
          >
            {/* Red Shockwave ring behind break */}
            <div className="absolute -inset-8 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />

            {/* Broken Tool Graphic (Shovel, Drill, Pickaxe, etc.) with scale pop */}
            <div className="relative animate-tool-break-pop">
              <ToolVisual
                toolId={equippedTool.id}
                size="lg"
                isBroken={true}
              />
            </div>
          </div>
        )}

        {/* Tutorial Hint */}
        {showTutorial && !isDragging && !isDynamiteActive && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-black/20">
            <div className="animate-hand-drag text-3xl sm:text-4xl filter drop-shadow">
              👆
            </div>
            <div className="mt-3 px-3.5 py-1.5 bg-amber-100/95 border-2 border-amber-950 rounded-xl text-amber-950 font-black text-xs sm:text-sm shadow-xl">
              Mücevherleri ortaya çıkarmak için kaz!
            </div>
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* IN-GAME JEWEL EMERGENCE: RISES OUT OF HOLE -> GROWS -> FLIES TO COUNTER */}
      {/* ======================================================= */}
      {flyingJewel && (
        <div 
          id="flying-jewel-actor"
          className="fixed pointer-events-none z-50 flex flex-col items-center justify-center transition-all ease-out"
          style={{
            left: `${flyingJewel.currentPos.x}px`,
            top: `${flyingJewel.currentPos.y}px`,
            transform: `translate(-50%, -50%) scale(${flyingJewel.currentScale})`,
            transitionDuration: flyingJewel.phase === 'flying' ? '540ms' : '400ms',
            transitionTimingFunction: flyingJewel.phase === 'flying' ? 'cubic-bezier(0.2, 0.9, 0.3, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Jewel Radial Aura Glow */}
          <div className="absolute inset-0 -m-8 rounded-full bg-cyan-400/30 blur-xl animate-pulse pointer-events-none" />

          {/* Jewel Graphic with Sparkle Glow */}
          <div className="relative filter drop-shadow-[0_8px_20px_rgba(56,189,248,0.95)] drop-shadow-[0_0_35px_rgba(14,165,233,0.8)]">
            <DiamondVisual
              variant={flyingJewel.variant}
              size="lg"
              animate={true}
            />
          </div>

          {/* "+1 💎" Float Badge */}
          {flyingJewel.phase === 'emerging' && (
            <div className="mt-1 px-2.5 py-0.5 bg-gradient-to-r from-sky-950 via-teal-900 to-sky-950 border-2 border-cyan-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)] text-cyan-200 font-black text-xs flex items-center gap-1 animate-bounce">
              <span>+{flyingJewel.value}</span>
              <span>💎</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
