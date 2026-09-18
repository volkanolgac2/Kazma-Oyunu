import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Play, RotateCcw, Home } from 'lucide-react';
import { CostumeId } from '../types/game';
import { AdventurerCharacter } from './AdventurerCharacter';
import { DiamondVisual } from './DiamondVisual';
import { sound } from '../utils/audio';

interface LevelCompleteModalProps {
  level: number;
  stars: number;
  diamondsEarned: number;
  bonusDiamonds: number;
  costume: CostumeId;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  stars,
  diamondsEarned,
  bonusDiamonds,
  costume,
  onNextLevel,
  onReplay,
  onHome
}) => {
  useEffect(() => {
    // Sound & Confetti celebration
    sound.playLevelComplete();

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 1 }
        });
      }, 250);
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm flex flex-col items-center game-card-green rounded-3xl border-4 border-emerald-950 shadow-2xl p-5 text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Victory Header Banner */}
        <div className="relative -mt-2 px-6 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl border-2 border-amber-900 shadow-lg transform -rotate-1">
          <h2 className="text-2xl font-black text-amber-950 tracking-wide">
            BÖLÜM TAMAMLANDI!
          </h2>
          <p className="text-[11px] font-black text-amber-900 uppercase">
            Bölüm {level} Başarıyla Geçildi
          </p>
        </div>

        {/* 3 Golden Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map(s => {
            const isFilled = s <= stars;
            return (
              <div
                key={s}
                className={`transform transition-all duration-500 ${
                  s === 2 ? '-translate-y-2' : ''
                } ${isFilled ? 'scale-110 animate-bounce' : 'scale-90 opacity-40 grayscale'}`}
                style={{ animationDelay: `${s * 150}ms` }}
              >
                <Star
                  className={`w-12 h-12 stroke-[2] ${
                    isFilled
                      ? 'text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_12px_#facc15]'
                      : 'text-stone-600 fill-stone-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Cheering Dalmatian Puppy Character */}
        <div className="my-1">
          <AdventurerCharacter
            costume={costume}
            mood="cheering"
            size="md"
          />
        </div>

        {/* Reward Tally Card */}
        <div className="w-full bg-emerald-950/80 p-3 rounded-2xl border-2 border-emerald-900 my-3 flex items-center justify-around shadow-inner">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Bulunan Mücevher</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <DiamondVisual size="sm" animate={false} />
              <span className="text-base font-black text-white">+{diamondsEarned}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-emerald-800/60" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Yıldız Bonusu</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-base font-black text-yellow-300">+{bonusDiamonds}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={onNextLevel}
            className="w-full h-14 rounded-2xl game-btn-orange text-white font-black text-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>SONRAKİ BÖLÜM</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 rounded-xl bg-emerald-950 border-2 border-emerald-800 text-emerald-100 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow hover:bg-emerald-900"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
            </button>

            <button
              onClick={onHome}
              className="py-2.5 rounded-xl bg-emerald-950 border-2 border-emerald-800 text-emerald-100 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow hover:bg-emerald-900"
            >
              <Home className="w-4 h-4" />
              <span>Menü</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
