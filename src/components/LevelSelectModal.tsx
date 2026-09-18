import React, { useState } from 'react';
import { X, Lock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { THEME_DATA, getLevelTheme } from '../data/levels';

interface LevelSelectModalProps {
  progress: PlayerProgress;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  progress,
  onSelectLevel,
  onClose
}) => {
  // Current chapter (0 = 1-10, 1 = 11-20, ... 9 = 91-100)
  const [chapter, setChapter] = useState(() => {
    return Math.min(9, Math.floor((progress.currentLevel - 1) / 10));
  });

  const startLevel = chapter * 10 + 1;
  const endLevel = startLevel + 9;
  const chapterLevels = Array.from({ length: 10 }, (_, i) => startLevel + i);

  const themeKey = getLevelTheme(startLevel);
  const themeVisuals = THEME_DATA[themeKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col game-card-wood rounded-3xl border-4 border-amber-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/50 border-b-2 border-amber-950">
          <h2 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2">
            <span>🗺️</span>
            <span>Bölüm Seç</span>
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-red-600 border border-red-900 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-700 shadow"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Chapter Carousel Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-amber-900/40 border-b border-amber-950/60">
          <button
            onClick={() => setChapter(prev => Math.max(0, prev - 1))}
            disabled={chapter === 0}
            className="p-2 rounded-xl bg-amber-800/80 border border-amber-950 text-white disabled:opacity-30 cursor-pointer shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
              Bölüm {chapter + 1} / 10
            </span>
            <div className="text-sm sm:text-base font-black text-white flex items-center justify-center gap-1.5">
              <span>{themeVisuals.ambientParticles}</span>
              <span>{themeVisuals.name}</span>
            </div>
          </div>

          <button
            onClick={() => setChapter(prev => Math.min(9, prev + 1))}
            disabled={chapter === 9}
            className="p-2 rounded-xl bg-amber-800/80 border border-amber-950 text-white disabled:opacity-30 cursor-pointer shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid (10 levels per chapter) */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
            {chapterLevels.map(lvl => {
              const isUnlocked = lvl <= progress.unlockedLevel;
              const isCurrent = lvl === progress.currentLevel;
              const stars = progress.levelStars[lvl] || 0;

              return (
                <button
                  key={lvl}
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(lvl)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 border-2 transition-all cursor-pointer shadow-md ${
                    !isUnlocked
                      ? 'bg-stone-800/80 border-stone-900 opacity-60 cursor-not-allowed'
                      : isCurrent
                      ? 'game-btn-green border-green-300 scale-105 ring-4 ring-yellow-300'
                      : 'game-card-wood border-amber-900 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-base sm:text-lg font-black text-white drop-shadow">
                        {lvl}
                      </span>
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= stars
                                ? 'text-yellow-300 fill-yellow-300 filter drop-shadow-[0_0_2px_#facc15]'
                                : 'text-stone-600 fill-stone-800'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <Lock className="w-5 h-5 text-stone-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick jump chapter pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5 pt-3 border-t border-amber-950/60">
            {Array.from({ length: 10 }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setChapter(idx)}
                className={`px-2 py-1 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                  chapter === idx
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900'
                }`}
              >
                {idx * 10 + 1}–{idx * 10 + 10}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
