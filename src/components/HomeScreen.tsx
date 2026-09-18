import React from 'react';
import { Play, Grid, ShoppingBag, Shirt, Settings } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { AdventurerCharacter } from './AdventurerCharacter';
import { DiamondVisual } from './DiamondVisual';

interface HomeScreenProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onOpenLevels: () => void;
  onOpenShop: () => void;
  onOpenCharacter: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onPlay,
  onOpenLevels,
  onOpenShop,
  onOpenCharacter,
  onOpenSettings
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 overflow-hidden bg-transparent select-none">
      {/* Top Header Strip: Diamonds & Settings */}
      <header className="relative w-full max-w-md flex items-center justify-between z-10 pt-1">
        {/* Diamond Counter */}
        <div className="flex items-center gap-2 bg-emerald-950/70 backdrop-blur-sm border border-emerald-400/40 px-3 py-1 rounded-2xl shadow-lg">
          <DiamondVisual size="sm" />
          <span className="text-white text-sm sm:text-base font-black tracking-wide">
            {progress.totalDiamonds}
          </span>
        </div>

        {/* Current Unlocked Level Badge */}
        <div className="text-[11px] sm:text-xs font-bold text-emerald-200/90 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 flex items-center shadow-sm">
          Max: Seviye {progress.unlockedLevel}/100
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-950/70 border border-emerald-400/30 flex items-center justify-center text-emerald-200 hover:text-white cursor-pointer shadow-md hover:bg-emerald-900/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </header>

      {/* Hero Title Emblem */}
      <div className="relative z-10 flex flex-col items-center my-1">
        {/* Lush green billboard banner */}
        <div className="relative game-card-green px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-3 sm:border-4 border-emerald-950 shadow-[0_8px_20px_rgba(0,0,0,0.45)] text-center transform -rotate-1">
          {/* Decorative screws */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-emerald-950/80 border border-emerald-400/50" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-950/80 border border-emerald-400/50" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-emerald-950/80 border border-emerald-400/50" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-950/80 border border-emerald-400/50" />

          {/* Big Cartoon Logo: Kazma Oyunu */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_3px_0_#052e16]">
            <span className="text-yellow-300 drop-shadow-[0_3px_0_#14532d]">Kazma</span>{' '}
            <span className="text-cyan-300 drop-shadow-[0_3px_0_#065f46]">Oyunu</span>
          </h1>

          {/* Subtitle tag */}
          <div className="mt-0.5 px-2.5 py-0.5 bg-emerald-950/70 rounded-full inline-block">
            <p className="text-[10px] sm:text-xs font-black tracking-wider text-emerald-200 uppercase">
              Kaz, Keşfet ve Mücevherleri Topla!
            </p>
          </div>
        </div>
      </div>

      {/* Character Hero Spotlight */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 my-1">
        {/* Dalmatian Puppy Character - Expanded upwards and 30% larger on Home Screen */}
        <div className="transform scale-[1.3] sm:scale-[1.4] scale-y-[1.35] transition-transform origin-bottom my-1.5">
          <AdventurerCharacter
            costume={progress.equippedCostume}
            size="lg"
            mood="idle"
            hideEarSpots={true}
          />
        </div>

        {/* Feature badges post */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200/90 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 shadow-sm">
            <span>⛏️</span>
            <span>100 Seviye</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200/90 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 shadow-sm">
            <span>🐶</span>
            <span>Sevimli Dost</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200/90 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 shadow-sm">
            <span>🧰</span>
            <span>Kürekler</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200/90 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 shadow-sm">
            <span>💎</span>
            <span>Mücevherler</span>
          </span>
        </div>
      </div>

      {/* Navigation Buttons Strip */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-2 mb-1">
        {/* Main Big Play Button - Vibrant Orange Gradient */}
        <button
          onClick={onPlay}
          className="w-full h-13 sm:h-15 rounded-2xl game-btn-orange text-white font-black text-xl sm:text-2xl flex items-center justify-center gap-2.5 cursor-pointer shadow-xl tracking-wide group"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white group-hover:scale-110 transition-transform" />
          <span>BÖLÜM {progress.currentLevel} BAŞLAT</span>
        </button>

        {/* Sub Navigation: Levels, Shop, Wardrobe */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={onOpenLevels}
            className="h-11 sm:h-13 rounded-2xl game-btn-green text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer shadow-md"
          >
            <Grid className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>100 Bölüm</span>
          </button>

          <button
            onClick={onOpenShop}
            className="h-11 sm:h-13 rounded-2xl game-btn-gold text-amber-950 font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Market</span>
          </button>

          <button
            onClick={onOpenCharacter}
            className="h-11 sm:h-13 rounded-2xl game-btn-blue text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer shadow-md"
          >
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Kostümler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
