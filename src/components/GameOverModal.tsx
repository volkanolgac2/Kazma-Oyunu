import React, { useEffect } from 'react';
import { RotateCcw, Home, Heart, Clock } from 'lucide-react';
import { CostumeId } from '../types/game';
import { AdventurerCharacter } from './AdventurerCharacter';
import { DiamondVisual } from './DiamondVisual';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  level: number;
  diamondsCollected: number;
  costume: CostumeId;
  reason?: 'lives' | 'time';
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  level,
  diamondsCollected,
  costume,
  reason = 'lives',
  onRetry,
  onHome
}) => {
  useEffect(() => {
    sound.playGameOver();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm flex flex-col items-center game-card-green rounded-3xl border-4 border-emerald-950 shadow-2xl p-5 text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative -mt-2 px-6 py-2 bg-gradient-to-r from-red-700 via-rose-600 to-red-700 rounded-2xl border-2 border-red-950 shadow-lg">
          <h2 className="text-2xl font-black text-white tracking-wide">
            {reason === 'time' ? 'SÜRE DOLDU!' : 'KÖSTEBEK ÇIKTI!'}
          </h2>
          <p className="text-[11px] font-black text-red-100 uppercase">
            {reason === 'time' 
              ? '45 sn doldu (3 mücevher gerekliydi)' 
              : 'Köstebek kazma aletini kırdı!'}
          </p>
        </div>

        {/* Reason Icon Indicator */}
        <div className="flex items-center gap-1.5 my-3 bg-black/40 px-3 py-1 rounded-full border border-white/10">
          {reason === 'time' ? (
            <>
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-200 ml-1">Süre Bitti (0s)</span>
            </>
          ) : (
            <>
              <span className="text-base">💥</span>
              <span className="text-xs font-bold text-rose-200 ml-1">Kürek Kırıldı!</span>
            </>
          )}
        </div>

        {/* Surprised / Sad Character */}
        <div className="my-1">
          <AdventurerCharacter
            costume={costume}
            mood="sad"
            size="md"
          />
        </div>

        {/* Level Tally */}
        <div className="w-full bg-emerald-950/80 p-3 rounded-2xl border-2 border-emerald-900 my-3 flex items-center justify-around shadow-inner">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Bölüm</span>
            <p className="text-lg font-black text-white">{level}</p>
          </div>

          <div className="w-px h-8 bg-emerald-800/60" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Toplanan Mücevher</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <DiamondVisual size="sm" animate={false} />
              <span className="text-base font-black text-emerald-100">+{diamondsCollected}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={onRetry}
            className="w-full h-14 rounded-2xl game-btn-gold text-amber-950 font-black text-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>TEKRAR DENE</span>
          </button>

          <button
            onClick={onHome}
            className="py-2.5 rounded-xl bg-emerald-950 border-2 border-emerald-800 text-emerald-100 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow hover:bg-emerald-900"
          >
            <Home className="w-4 h-4" />
            <span>Ana Menü</span>
          </button>
        </div>
      </div>
    </div>
  );
};
