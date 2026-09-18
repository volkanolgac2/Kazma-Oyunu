import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, RotateCcw, Info, Check } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  progress: PlayerProgress;
  onUpdateSettings: (soundEnabled: boolean, musicEnabled: boolean) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateSettings,
  onResetProgress,
  onClose
}) => {
  const [soundOn, setSoundOn] = useState(progress.soundEnabled);
  const [musicOn, setMusicOn] = useState(progress.musicEnabled);
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.soundEnabled = next;
    onUpdateSettings(next, musicOn);
    if (next) sound.playButtonClick();
  };

  const toggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    sound.musicEnabled = next;
    if (next) {
      sound.startMusic();
    } else {
      sound.stopMusic();
    }
    onUpdateSettings(soundOn, next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md flex flex-col game-card-wood rounded-3xl border-4 border-amber-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-black text-amber-100">Ayarlar</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-red-600 border border-red-900 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-700 shadow"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 space-y-3">
          {/* Sound Effects Toggle */}
          <div className="game-card-soil p-3.5 rounded-2xl border-2 border-amber-950 flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/60 flex items-center justify-center text-amber-200">
                {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-50" />}
              </div>
              <div>
                <h4 className="text-white text-sm font-black">Ses Efektleri</h4>
                <p className="text-amber-200/70 text-xs">Kazma sesleri, taş darbeleri ve mücevher çanları</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer border-2 ${
                soundOn ? 'bg-green-600 border-green-800' : 'bg-stone-700 border-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  soundOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="game-card-soil p-3.5 rounded-2xl border-2 border-amber-950 flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/60 flex items-center justify-center text-amber-200">
                <Music className={`w-5 h-5 ${musicOn ? 'text-sky-300' : 'opacity-50'}`} />
              </div>
              <div>
                <h4 className="text-white text-sm font-black">Macera Müziği</h4>
                <p className="text-amber-200/70 text-xs">Neşeli yeraltı marimba melodileri</p>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer border-2 ${
                musicOn ? 'bg-green-600 border-green-800' : 'bg-stone-700 border-stone-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  musicOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* About / Game Info */}
          <div className="game-card-soil p-3 rounded-2xl border-2 border-amber-950 text-center">
            <h4 className="text-amber-300 text-sm font-black">Dig &amp; Diamond</h4>
            <p className="text-stone-300 text-xs mt-1">Sürüm 1.0.0 • Mobil Macera Oyunu</p>
            <p className="text-amber-200/60 text-[11px] mt-1">“Derinleri Kaz. Daha Fazlasını Keşfet!”</p>
          </div>

          {/* Reset Progress Danger Zone */}
          <div className="pt-2">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-300 text-xs font-bold hover:bg-stone-800 hover:text-red-400 flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>İlerlemeyi Sıfırla</span>
              </button>
            ) : (
              <div className="p-3 bg-red-950/80 border-2 border-red-800 rounded-2xl text-center space-y-2">
                <p className="text-red-200 text-xs font-black">Tüm 100 seviye ve kazanılan eşyaları sıfırlamak istediğinize emin misiniz?</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-700 text-stone-200 text-xs font-bold cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black cursor-pointer shadow hover:bg-red-700"
                  >
                    Evet, Sıfırla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
