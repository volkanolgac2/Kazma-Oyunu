import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerProgress, SoilCellData, LevelConfig, CostumeId, ToolId, ActiveScreen } from './types/game';
import { loadPlayerProgress, savePlayerProgress, resetPlayerProgress, DEFAULT_PROGRESS } from './utils/storage';
import { getLevelConfig, buildLevelGrid, THEME_DATA } from './data/levels';
import { COSTUMES, TOOLS } from './data/items';
import { sound } from './utils/audio';

import { HomeScreen } from './components/HomeScreen';
import { TopBar } from './components/TopBar';
import { DiggingBoard } from './components/DiggingBoard';
import { BottomControls } from './components/BottomControls';
import { AdventurerCharacter } from './components/AdventurerCharacter';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ShopModal } from './components/ShopModal';
import { CharacterModal } from './components/CharacterModal';
import { SettingsModal } from './components/SettingsModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';

export default function App() {
  // Player persistence
  const [progress, setProgress] = useState<PlayerProgress>(DEFAULT_PROGRESS);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Active view & Modals
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCharacterOpen, setIsCharacterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'lives' | 'time'>('lives');

  // Active Level State
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => getLevelConfig(1));
  const [cells, setCells] = useState<SoilCellData[]>(() => buildLevelGrid(getLevelConfig(1)));
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [levelDiamondsCollected, setLevelDiamondsCollected] = useState(0);
  const [objectiveCurrent, setObjectiveCurrent] = useState(0);
  const [characterMood, setCharacterMood] = useState<'idle' | 'digging' | 'surprised' | 'cheering' | 'sad'>('idle');
  const [levelRewardStats, setLevelRewardStats] = useState<{ stars: number; bonus: number }>({ stars: 3, bonus: 10 });
  const [screenShake, setScreenShake] = useState(false);
  const [isCounterPulsing, setIsCounterPulsing] = useState(false);

  // Real-time shovel coordinates for dog character companion tracking
  const [shovelTrackPos, setShovelTrackPos] = useState<{ x: number; y: number } | null>(null);

  // Ref to guarantee EXACTLY 1 life lost per mole encounter
  const triggeredHazardsRef = useRef<Set<string>>(new Set());
  const shovelDockRef = useRef<HTMLDivElement>(null);

  // Load progress once on mount
  useEffect(() => {
    const saved = loadPlayerProgress();
    setProgress(saved);
    sound.soundEnabled = saved.soundEnabled;
    sound.musicEnabled = saved.musicEnabled;
    if (saved.musicEnabled) {
      sound.startMusic();
    }
    setHasLoadedStorage(true);
  }, []);

  // Save progress whenever it updates
  useEffect(() => {
    if (hasLoadedStorage) {
      savePlayerProgress(progress);
    }
  }, [progress, hasLoadedStorage]);

  // Retrieve equipped items
  const equippedCostumeItem = COSTUMES.find(c => c.id === progress.equippedCostume) || COSTUMES[0];
  const equippedToolItem = TOOLS.find(t => t.id === progress.equippedTool) || TOOLS[0];

  // Target diamonds required to complete any level (User Mandate: 3 mücevher bulunca level bitsin)
  const targetDiamondsToWin = levelConfig.objective.target || 3;
  const maxDiamondsInLevel = targetDiamondsToWin;

  // Trigger level victory with star calculation and persistence
  const triggerLevelVictory = useCallback((collectedCount: number, currentLives: number) => {
    setIsLevelComplete(prev => {
      if (prev) return true;
      setCharacterMood('cheering');

      // Calculate Stars based on lives remaining
      let stars = 1;
      let bonus = 5;
      if (currentLives >= 3) {
        stars = 3;
        bonus = 15;
      } else if (currentLives === 2) {
        stars = 2;
        bonus = 10;
      }

      setLevelRewardStats({ stars, bonus });

      // Persist star rating and unlock next level
      setProgress(oldProg => {
        const nextLevel = levelConfig.level + 1;
        const newUnlocked = Math.max(oldProg.unlockedLevel, Math.min(100, nextLevel));
        const updatedStars = {
          ...oldProg.levelStars,
          [levelConfig.level]: Math.max(oldProg.levelStars[levelConfig.level] || 0, stars)
        };

        return {
          ...oldProg,
          totalDiamonds: oldProg.totalDiamonds + bonus,
          unlockedLevel: newUnlocked,
          levelStars: updatedStars,
          tutorialCompleted: true
        };
      });

      return true;
    });
  }, [levelConfig.level]);

  // Board version counter to cleanly remount and redraw fresh unexcavated soil on restart/retry
  const [boardVersion, setBoardVersion] = useState(0);

  // Delay game over modal display so player sees the 3rd mole jump and soil crumble for 3 seconds
  const [isGameOverPending, setIsGameOverPending] = useState(false);
  const gameOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Delay victory modal display so player sees the last diamond emerge, dashed silhouette appear, and dog celebrate for 3 seconds
  const [isVictoryPending, setIsVictoryPending] = useState(false);
  const victoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3rd mole found: Shovel breaks and digging is strictly disabled
  const [isShovelBroken, setIsShovelBroken] = useState(false);
  const lastCreatureDamageTimestampRef = useRef<number>(0);

  // In-Game Power-Ups: Dynamite & Hint Modes
  const [isDynamiteActive, setIsDynamiteActive] = useState(false);
  const [hintTriggerTime, setHintTriggerTime] = useState(0);
  const [isHintActive, setIsHintActive] = useState(false);

  const handleToggleDynamite = useCallback(() => {
    if (isGameOver || isGameOverPending || isLevelComplete || isVictoryPending || isPaused || isShovelBroken) return;
    setIsDynamiteActive(prev => {
      const next = !prev;
      sound.playButtonClick();
      return next;
    });
  }, [isGameOver, isGameOverPending, isLevelComplete, isVictoryPending, isPaused, isShovelBroken]);

  const handleTriggerHint = useCallback(() => {
    if (isGameOver || isGameOverPending || isLevelComplete || isVictoryPending || isPaused || isShovelBroken) return;
    sound.playDiamondShimmer();
    setHintTriggerTime(Date.now());
    setIsHintActive(true);
    setTimeout(() => setIsHintActive(false), 1600);
  }, [isGameOver, isGameOverPending, isLevelComplete, isVictoryPending, isPaused, isShovelBroken]);

  const handleRelocateGem = useCallback((oldCellId: string, targetCellId: string, _targetX: number, _targetY: number) => {
    setCells(prevCells => {
      const fromIndex = prevCells.findIndex(c => c.id === oldCellId);
      const toIndex = prevCells.findIndex(c => c.id === targetCellId);
      if (fromIndex === -1 || toIndex === -1) return prevCells;

      const nextCells = [...prevCells];
      const sourceGemCell = { ...nextCells[fromIndex] };
      const targetEmptyCell = { ...nextCells[toIndex] };

      nextCells[toIndex] = {
        ...targetEmptyCell,
        type: sourceGemCell.type,
        creatureType: undefined,
        isExcavated: false,
        hasTriggeredHazard: false,
      };

      nextCells[fromIndex] = {
        ...sourceGemCell,
        type: 'empty',
        creatureType: undefined,
        isExcavated: false,
        hasTriggeredHazard: false,
      };

      return nextCells;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (gameOverTimeoutRef.current) {
        clearTimeout(gameOverTimeoutRef.current);
      }
      if (victoryTimeoutRef.current) {
        clearTimeout(victoryTimeoutRef.current);
      }
    };
  }, []);

  // Initialize / Start a level
  const startLevel = useCallback((levelNum: number) => {
    if (gameOverTimeoutRef.current) {
      clearTimeout(gameOverTimeoutRef.current);
      gameOverTimeoutRef.current = null;
    }
    setIsGameOverPending(false);

    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current);
      victoryTimeoutRef.current = null;
    }
    setIsVictoryPending(false);
    setIsShovelBroken(false);
    setIsDynamiteActive(false);
    setHintTriggerTime(0);
    setIsHintActive(false);

    const safeNum = Math.max(1, Math.min(100, levelNum));
    const config = getLevelConfig(safeNum);
    // Re-randomize object positions on each start or retry
    const randomSeed = Math.floor(Math.random() * 1000000) + 1;
    const initialGrid = buildLevelGrid(config, randomSeed);

    setLevelConfig(config);
    setCells(initialGrid);
    setLives(3);
    setTimeLeft(60);
    setLevelDiamondsCollected(0);
    setObjectiveCurrent(0);
    setCharacterMood('idle');
    setGameOverReason('lives');
    setIsLevelComplete(false);
    setIsGameOver(false);
    setIsPaused(false);
    setIsLevelSelectOpen(false);
    setShovelTrackPos(null);
    triggeredHazardsRef.current.clear();
    lastCreatureDamageTimestampRef.current = 0;
    setBoardVersion(v => v + 1);
    setActiveScreen('gameplay');

    setProgress(prev => ({
      ...prev,
      currentLevel: safeNum
    }));
  }, []);

  // Restart current level
  const restartCurrentLevel = () => {
    startLevel(progress.currentLevel);
  };

  // Return to Main Menu cleanly closing all modals and resetting game over/victory states
  const handleGoHome = useCallback(() => {
    sound.playButtonClick();
    setIsGameOver(false);
    setIsGameOverPending(false);
    setIsLevelComplete(false);
    setIsVictoryPending(false);
    setIsShovelBroken(false);
    setIsDynamiteActive(false);
    setHintTriggerTime(0);
    setIsHintActive(false);
    setIsPaused(false);
    if (gameOverTimeoutRef.current) {
      clearTimeout(gameOverTimeoutRef.current);
      gameOverTimeoutRef.current = null;
    }
    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current);
      victoryTimeoutRef.current = null;
    }
    setActiveScreen('home');
  }, []);

  // 45-Second Countdown Timer Engine
  useEffect(() => {
    if (activeScreen !== 'gameplay' || isLevelComplete || isVictoryPending || isGameOver || isGameOverPending || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timer reached 0!
          // User mandate: "Her bölümde bir süre sayacı olmalı (45sn) süre bitiminde eğer 3 can da bitmediyse ve en az 3 mücevher bulunabilindiyse geçilmeli."
          if (lives > 0 && levelDiamondsCollected >= 3) {
            triggerLevelVictory(levelDiamondsCollected, lives);
          } else {
            setGameOverReason(lives <= 0 ? 'lives' : 'time');
            setIsGameOver(true);
            setCharacterMood('sad');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeScreen, isLevelComplete, isVictoryPending, isGameOver, isGameOverPending, isPaused, lives, levelDiamondsCollected, triggerLevelVictory]);

  // Handle Diamond Collection: Her bulunan mücevher kesinlikle 1 adet sayılır
  const handleDiamondCollect = useCallback((_value?: number) => {
    if (isGameOver || isGameOverPending || isLevelComplete || isVictoryPending) return;

    setIsCounterPulsing(true);
    setTimeout(() => setIsCounterPulsing(false), 450);

    sound.playDiamondCollect();

    setLevelDiamondsCollected(prev => {
      // Her bulunan mücevher kesinlikle 1 adet sayılır
      const updatedCount = prev + 1;
      // Mandate: "Son mücevher buluduktan 3 saniye sonra kazandı ekranı gelsin."
      if (updatedCount >= maxDiamondsInLevel) {
        setIsVictoryPending(true);
        setCharacterMood('cheering');

        if (victoryTimeoutRef.current) {
          clearTimeout(victoryTimeoutRef.current);
        }
        // Tam 3 saniye sonra kazandı ekranı gelsin
        victoryTimeoutRef.current = setTimeout(() => {
          triggerLevelVictory(updatedCount, lives);
          setIsVictoryPending(false);
        }, 3000);
      }
      return updatedCount;
    });

    setObjectiveCurrent(prev => prev + 1);
    setProgress(prev => ({
      ...prev,
      totalDiamonds: prev.totalDiamonds + 1
    }));
  }, [maxDiamondsInLevel, lives, isGameOver, isGameOverPending, isLevelComplete, isVictoryPending, triggerLevelVictory]);

  // Core Digging Execution on a Cell
  const handleDigCell = useCallback((targetCell: SoilCellData) => {
    if (isLevelComplete || isVictoryPending || isGameOver || isGameOverPending || isPaused || isShovelBroken) return;

    setCells(prevCells => {
      const nextCells = [...prevCells];
      const cellIndex = nextCells.findIndex(c => c.id === targetCell.id);
      if (cellIndex === -1) return prevCells;

      const cell = { ...nextCells[cellIndex] };
      if (cell.isExcavated) return prevCells;

      // If cell is a creature (Mole)
      if (cell.type === 'creature') {
        cell.isExcavated = true;
        const now = Date.now();
        if (!cell.hasTriggeredHazard && !triggeredHazardsRef.current.has(cell.id)) {
          lastCreatureDamageTimestampRef.current = now;

          cell.hasTriggeredHazard = true;
          triggeredHazardsRef.current.add(cell.id);

          sound.playCreatureSurprise();
          sound.playLifeLost();
          sound.playShovelBreak();

          // Screen shake feedback
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 300);

          // Dalmatian puppy scared/sad reaction
          setCharacterMood('sad');

          // USER MANDATE: "Her bölümde sadece 1 adet köstebek olsun, o köstebek bulunursa kürek veya kullanılan ekipman neyse o kırılsın ve 3 saniye sonra game over ekranı gelsin."
          setIsShovelBroken(true);
          setLives(0);
          setGameOverReason('lives');
          setIsGameOverPending(true);

          if (gameOverTimeoutRef.current) {
            clearTimeout(gameOverTimeoutRef.current);
          }
          // Köstebek bulunduktan ve kürek kırıldıktan tam 3 saniye sonra Game Over ekranı gelsin
          gameOverTimeoutRef.current = setTimeout(() => {
            setIsGameOver(true);
            setIsGameOverPending(false);
          }, 3000);
        }
        nextCells[cellIndex] = cell;
        return nextCells;
      }

      // Tool power determines damage to soil
      const power = equippedToolItem.power || 1;
      cell.soilHealth = Math.max(0, cell.soilHealth - power);

      if (cell.soilHealth > 0) {
        sound.playDig();
        nextCells[cellIndex] = cell;
        return nextCells;
      }

      // Fully excavated!
      cell.isExcavated = true;
      nextCells[cellIndex] = cell;

      // Check contents
      if (cell.type === 'diamond' || cell.type === 'large_diamond' || cell.type === 'rare_diamond') {
        cell.hasCollected = true;
      } else if (cell.type === 'rock') {
        sound.playRockHit();
      } else {
        sound.playDig();
      }

      return nextCells;
    });
  }, [isLevelComplete, isVictoryPending, isGameOver, isGameOverPending, isPaused, equippedToolItem.power]);

  // Shop actions
  const handleBuyCostume = (costumeId: CostumeId, price: number) => {
    setProgress(prev => ({
      ...prev,
      totalDiamonds: prev.totalDiamonds - price,
      ownedCostumes: [...prev.ownedCostumes, costumeId],
      equippedCostume: costumeId
    }));
  };

  const handleBuyTool = (toolId: ToolId, price: number) => {
    setProgress(prev => ({
      ...prev,
      totalDiamonds: prev.totalDiamonds - price,
      ownedTools: [...prev.ownedTools, toolId],
      equippedTool: toolId
    }));
  };

  const handleEquipCostume = (costumeId: CostumeId) => {
    setProgress(prev => ({
      ...prev,
      equippedCostume: costumeId
    }));
  };

  const handleEquipTool = (toolId: ToolId) => {
    setProgress(prev => ({
      ...prev,
      equippedTool: toolId
    }));
  };

  const handleUpdateSettings = (soundEnabled: boolean, musicEnabled: boolean) => {
    setProgress(prev => ({
      ...prev,
      soundEnabled,
      musicEnabled
    }));
    sound.soundEnabled = soundEnabled;
    sound.musicEnabled = musicEnabled;
    if (musicEnabled) {
      sound.startMusic();
    } else {
      sound.stopMusic();
    }
  };

  const handleResetProgress = () => {
    const fresh = resetPlayerProgress();
    setProgress(fresh);
    startLevel(1);
    setActiveScreen('home');
  };

  const themeVisuals = THEME_DATA[levelConfig.theme];

  return (
    <div className={`relative w-full h-screen h-[100dvh] max-h-screen bg-[#0c0704] text-white flex flex-col items-center justify-center overflow-hidden ${screenShake ? 'animate-screen-shake' : ''}`}>
      {/* Game Content Container (max-w-md, bounds all game elements) */}
      <div className="relative w-full max-w-md h-full max-h-[100dvh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:border-x sm:border-amber-950/40 overflow-hidden">
        
        {/* Exact Static Background Image Asset - Dimmed / Silik & Bounded to Game Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#150d08]">
          <img 
            src="/assets/backgroud.png"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallbackCount) {
                target.dataset.fallbackCount = '1';
                target.src = '/assets/background.png';
              } else if (target.dataset.fallbackCount === '1') {
                target.dataset.fallbackCount = '2';
                target.src = '/assets/dig-diamond-background.png';
              }
            }}
            alt="Game Background"
            className="w-full h-full object-cover object-center select-none opacity-40 brightness-90 contrast-95"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient vignette to blend smoothly into top and bottom HUD/control zones */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65 pointer-events-none" />
        </div>

        {/* Main Screen Container (z-10+) */}
        <main className="w-full flex-1 flex flex-col relative z-10 overflow-hidden">
        {activeScreen === 'home' && (
          <HomeScreen
            progress={progress}
            onPlay={() => startLevel(progress.currentLevel)}
            onOpenLevels={() => setIsLevelSelectOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenCharacter={() => setIsCharacterOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeScreen === 'gameplay' && (
          // Active Gameplay View
          <div className="relative w-full h-full flex flex-col justify-between p-1.5 sm:p-2.5 overflow-hidden">
            {/* Top HUD with 45s timer and max diamonds tracker */}
            <TopBar
              level={levelConfig.level}
              lives={lives}
              maxLives={3}
              totalDiamonds={progress.totalDiamonds}
              levelDiamondsCollected={levelDiamondsCollected}
              maxDiamondsInLevel={maxDiamondsInLevel}
              timeLeft={timeLeft}
              onPauseClick={() => setIsPaused(true)}
              isCounterPulsing={isCounterPulsing}
            />

            {/* Center Underground Excavation Board (Expanded to fill vertical space) */}
            <div className="flex-1 w-full my-1 z-10 min-h-0 flex flex-col justify-center">
              <DiggingBoard
                key={`board_${levelConfig.level}_${boardVersion}`}
                levelConfig={levelConfig}
                cells={cells}
                equippedTool={equippedToolItem}
                showTutorial={levelConfig.level === 1 && !progress.tutorialCompleted}
                disabled={isGameOver || isGameOverPending || isLevelComplete || isVictoryPending || isPaused || isShovelBroken}
                isShovelBroken={isShovelBroken}
                isVictoryPending={isVictoryPending}
                isDynamiteActive={isDynamiteActive}
                onDynamiteUsed={() => setIsDynamiteActive(false)}
                hintTriggerTime={hintTriggerTime}
                onRelocateGem={handleRelocateGem}
                onDigCell={handleDigCell}
                onDiamondCollect={handleDiamondCollect}
                onTriggerCheer={() => {
                  setCharacterMood('cheering');
                  setTimeout(() => setCharacterMood('idle'), 1400);
                }}
                onTriggerScared={() => {
                  setCharacterMood('surprised');
                  setTimeout(() => setCharacterMood('idle'), 1400);
                }}
                onShovelMove={setShovelTrackPos}
                shovelRestingRef={shovelDockRef}
              />
            </div>

            {/* Bottom Controls Strip with In-Game Quick Tool Switcher, Dog on Left, Shop & Clothes on Right, Dynamite & Hint buttons flanking Shovel */}
            <BottomControls
              equippedTool={equippedToolItem}
              ownedTools={progress.ownedTools}
              onEquipTool={handleEquipTool}
              onOpenShop={() => setIsShopOpen(true)}
              onOpenCharacter={() => setIsCharacterOpen(true)}
              shovelDockRef={shovelDockRef}
              isShovelBroken={isShovelBroken}
              isDynamiteActive={isDynamiteActive}
              onToggleDynamite={handleToggleDynamite}
              isHintActive={isHintActive}
              onTriggerHint={handleTriggerHint}
              companionCostume={progress.equippedCostume}
              companionMood={characterMood}
              companionTrackTarget={shovelTrackPos}
              remainingDiamonds={cells.filter(c => (c.type === 'diamond' || c.type === 'large_diamond' || c.type === 'rare_diamond') && !c.hasCollected).length}
              onCompanionClick={() => {
                setCharacterMood('cheering');
                sound.playDiamondCollect();
                setTimeout(() => setCharacterMood('idle'), 1200);
              }}
            />
          </div>
        )}

        {/* Level Select Modal */}
        {isLevelSelectOpen && (
          <LevelSelectModal
            progress={progress}
            onSelectLevel={startLevel}
            onClose={() => setIsLevelSelectOpen(false)}
          />
        )}

        {/* Shop Modal */}
        {isShopOpen && (
          <ShopModal
            progress={progress}
            onBuyCostume={handleBuyCostume}
            onBuyTool={handleBuyTool}
            onEquipCostume={handleEquipCostume}
            onEquipTool={handleEquipTool}
            onClose={() => setIsShopOpen(false)}
          />
        )}

        {/* Character Wardrobe Modal */}
        {isCharacterOpen && (
          <CharacterModal
            progress={progress}
            onEquipCostume={handleEquipCostume}
            onEquipTool={handleEquipTool}
            onClose={() => setIsCharacterOpen(false)}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            progress={progress}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Pause Modal */}
        {isPaused && (
          <PauseModal
            level={levelConfig.level}
            onResume={() => setIsPaused(false)}
            onRestart={restartCurrentLevel}
            onSelectLevels={() => {
              setIsPaused(false);
              setIsLevelSelectOpen(true);
            }}
            onHome={handleGoHome}
          />
        )}

        {/* Victory Level Complete Modal */}
        {isLevelComplete && (
          <LevelCompleteModal
            level={levelConfig.level}
            stars={levelRewardStats.stars}
            diamondsEarned={levelDiamondsCollected}
            bonusDiamonds={levelRewardStats.bonus}
            costume={progress.equippedCostume}
            onNextLevel={() => {
              if (levelConfig.level < 100) {
                startLevel(levelConfig.level + 1);
              } else {
                handleGoHome();
              }
            }}
            onReplay={restartCurrentLevel}
            onHome={handleGoHome}
          />
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <GameOverModal
            level={levelConfig.level}
            diamondsCollected={levelDiamondsCollected}
            costume={progress.equippedCostume}
            reason={gameOverReason}
            onRetry={restartCurrentLevel}
            onHome={handleGoHome}
          />
        )}
      </main>
      </div>
    </div>
  );
}
