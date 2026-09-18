import React from 'react';
import { Pause, Heart, Clock } from 'lucide-react';
import { DiamondVisual } from './DiamondVisual';

interface TopBarProps {
  level: number;
  lives: number;
  maxLives: number;
  totalDiamonds: number;
  levelDiamondsCollected: number;
  maxDiamondsInLevel: number;
  timeLeft: number;
  onPauseClick: () => void;
  isCounterPulsing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  level,
  lives,
  maxLives,
  totalDiamonds,
  levelDiamondsCollected,
  maxDiamondsInLevel,
  timeLeft,
  onPauseClick,
  isCounterPulsing = false
}) => {
  const isTimeLow = timeLeft <= 10;

  return (
    <header className="w-full max-w-md mx-auto flex flex-col gap-1 px-2 sm:px-3 pt-1 pb-0.5 z-20 select-none">
      {/* Primary Top Row */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {/* Pause Button */}
        <button
          onClick={onPauseClick}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl game-btn-blue flex items-center justify-center cursor-pointer shadow-md text-white font-bold"
          aria-label="Pause Game"
        >
          <Pause className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Level Indicator Badge - Green Theme */}
        <div className="game-card-green px-2.5 py-0.5 sm:py-1 rounded-xl shadow-md flex items-center gap-1 border border-emerald-950">
          <span className="text-emerald-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Seviye</span>
          <span className="text-white text-sm sm:text-base font-black">{level}</span>
        </div>

        {/* 45s Countdown Timer */}
        <div 
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl border shadow-inner transition-all duration-300 ${
            isTimeLow 
              ? 'bg-rose-950/90 border-rose-500 animate-pulse text-rose-200' 
              : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
          }`}
          title="Bölüm Süresi"
        >
          <Clock className={`w-3.5 h-3.5 ${isTimeLow ? 'text-rose-400 animate-spin' : 'text-emerald-400'}`} />
          <span className="text-xs sm:text-sm font-black font-mono tracking-wider">
            {timeLeft}s
          </span>
        </div>

        {/* Heart Lives Indicator */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-emerald-950/70 px-2 py-0.5 sm:py-1 rounded-xl border border-white/10 shadow-inner">
          {Array.from({ length: maxLives }, (_, i) => {
            const isActive = i < lives;
            return (
              <div 
                key={i} 
                className={`transition-all duration-300 transform ${isActive ? 'scale-100' : 'scale-90 opacity-30 grayscale'}`}
              >
                <Heart 
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isActive ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]' : 'text-stone-600 fill-stone-800'}`} 
                />
              </div>
            );
          })}
        </div>

        {/* Total Bank Diamond Counter */}
        <div 
          id="top-diamond-target"
          className={`flex items-center gap-1 bg-emerald-950/90 border border-emerald-400/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl shadow-md transition-all duration-300 ${
            isCounterPulsing ? 'scale-115 ring-3 ring-cyan-300 bg-teal-800 shadow-[0_0_20px_rgba(56,189,248,0.8)]' : 'scale-100'
          }`}
        >
          <DiamondVisual size="sm" animate={isCounterPulsing} />
          <span className={`text-xs sm:text-sm font-black tracking-wide transition-colors ${isCounterPulsing ? 'text-yellow-200' : 'text-emerald-100'}`}>
            {totalDiamonds}
          </span>
        </div>
      </div>

      {/* Secondary Progress Bar Row: Level Max Diamonds Goal (User Mandate) */}
      <div className="w-full flex items-center justify-between px-2.5 py-0.5 bg-black/40 rounded-xl border border-white/10 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1 text-emerald-200 font-bold">
          <span className="text-xs">💎</span>
          <span>Bölüm Mücevherleri:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Progress Pill */}
          <div className="w-20 sm:w-24 h-2 bg-emerald-950/90 rounded-full overflow-hidden border border-emerald-500/30 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (levelDiamondsCollected / Math.max(1, maxDiamondsInLevel)) * 100)}%`
              }}
            />
          </div>
          <span className="font-black text-white text-[11px] sm:text-xs tracking-wider">
            {levelDiamondsCollected} / {maxDiamondsInLevel}
          </span>
        </div>
      </div>
    </header>
  );
};
