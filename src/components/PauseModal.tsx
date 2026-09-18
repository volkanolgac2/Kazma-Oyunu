import React from 'react';
import { Play, RotateCcw, Home, Grid } from 'lucide-react';
import { sound } from '../utils/audio';

interface PauseModalProps {
  level: number;
  onResume: () => void;
  onRestart: () => void;
  onSelectLevels: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  level,
  onResume,
  onRestart,
  onSelectLevels,
  onHome
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-xs flex flex-col items-center game-card-wood rounded-3xl border-4 border-amber-950 shadow-2xl p-5 text-center">
        {/* Title */}
        <h2 className="text-2xl font-black text-amber-100 tracking-wide mb-1">
          OYUN DURAKLATILDI
        </h2>
        <p className="text-xs text-amber-200/80 mb-4">Bölüm {level} devam ediyor</p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              sound.playButtonClick();
              onResume();
            }}
            className="w-full h-12 rounded-xl game-btn-green text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow hover:scale-102 transition-transform"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Devam Et</span>
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onRestart();
            }}
            className="w-full h-11 rounded-xl game-card-wood border-2 border-amber-950 text-amber-100 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow hover:bg-amber-800"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bölümü Yeniden Başlat</span>
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onSelectLevels();
            }}
            className="w-full h-11 rounded-xl game-card-wood border-2 border-amber-950 text-amber-100 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow hover:bg-amber-800"
          >
            <Grid className="w-4 h-4" />
            <span>Bölüm Seç</span>
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onHome();
            }}
            className="w-full h-11 rounded-xl game-card-soil border-2 border-amber-950 text-amber-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow hover:bg-black/60"
          >
            <Home className="w-4 h-4" />
            <span>Ana Menüye Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
