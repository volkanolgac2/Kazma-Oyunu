import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { PlayerProgress, CostumeId, ToolId } from '../types/game';
import { COSTUMES, TOOLS } from '../data/items';
import { AdventurerCharacter } from './AdventurerCharacter';
import { ToolVisual } from './ToolVisual';
import { sound } from '../utils/audio';

interface CharacterModalProps {
  progress: PlayerProgress;
  onEquipCostume: (costumeId: CostumeId) => void;
  onEquipTool: (toolId: ToolId) => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  progress,
  onEquipCostume,
  onEquipTool,
  onClose
}) => {
  const [characterMood, setCharacterMood] = useState<'idle' | 'cheering'>('idle');

  const activeCostume = COSTUMES.find(c => c.id === progress.equippedCostume) || COSTUMES[0];
  const activeTool = TOOLS.find(t => t.id === progress.equippedTool) || TOOLS[0];

  const handleSelectCostume = (costumeId: CostumeId) => {
    onEquipCostume(costumeId);
    sound.playEquip();
    setCharacterMood('cheering');
    setTimeout(() => setCharacterMood('idle'), 1400);
  };

  const handleSelectTool = (toolId: ToolId) => {
    onEquipTool(toolId);
    sound.playEquip();
    setCharacterMood('cheering');
    setTimeout(() => setCharacterMood('idle'), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col game-card-wood rounded-3xl border-4 border-amber-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤠</span>
            <h2 className="text-xl font-black text-amber-100">Gardırop &amp; Ekipman</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-red-600 border border-red-900 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-700 shadow"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Character Stage Pedestal */}
        <div className="relative bg-gradient-to-b from-sky-400/40 via-amber-200/20 to-black/60 p-4 flex flex-col items-center justify-center border-b border-amber-950">
          {/* Pedestal glow */}
          <div className="absolute bottom-4 w-40 h-8 rounded-full bg-amber-400/30 blur-md pointer-events-none" />

          {/* 3D Character */}
          <div className="relative z-10 my-2">
            <AdventurerCharacter
              costume={progress.equippedCostume}
              mood={characterMood}
              size="lg"
            />
          </div>

          {/* Equipped Details */}
          <div className="relative z-10 flex items-center gap-2 mt-1 px-3 py-1 bg-black/60 rounded-full border border-white/20">
            <span className="text-sm">{activeCostume.badge}</span>
            <span className="text-xs font-black text-amber-200">{activeCostume.name}</span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-xs font-bold text-sky-200">{activeTool.name}</span>
          </div>
        </div>

        {/* Wardrobe Selectors */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Outfits selection */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kostüm Seç</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {COSTUMES.map(item => {
                const isOwned = progress.ownedCostumes.includes(item.id);
                const isEquipped = progress.equippedCostume === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={!isOwned}
                    onClick={() => handleSelectCostume(item.id)}
                    className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                      !isOwned
                        ? 'bg-stone-900/60 border-stone-800 opacity-40 cursor-not-allowed'
                        : isEquipped
                        ? 'game-btn-green border-green-300 ring-2 ring-yellow-400'
                        : 'game-card-soil border-amber-950 hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl">{item.badge}</span>
                    <span className="text-[11px] font-black text-white truncate max-w-full text-center">
                      {item.name}
                    </span>
                    {isEquipped && (
                      <span className="text-[9px] bg-green-900 text-green-200 font-bold px-1.5 py-0.5 rounded-full">
                        GİYİLDİ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools selection */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kazma Aleti Seç</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TOOLS.map(tool => {
                const isOwned = progress.ownedTools.includes(tool.id);
                const isEquipped = progress.equippedTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    disabled={!isOwned}
                    onClick={() => handleSelectTool(tool.id)}
                    className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                      !isOwned
                        ? 'bg-stone-900/60 border-stone-800 opacity-40 cursor-not-allowed'
                        : isEquipped
                        ? 'game-btn-gold border-yellow-300 ring-2 ring-white text-amber-950'
                        : 'game-card-soil border-amber-950 hover:scale-105'
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <ToolVisual toolId={tool.id} size="sm" />
                    </div>
                    <span className="text-[11px] font-black text-white truncate max-w-full text-center">
                      {tool.name}
                    </span>
                    {isEquipped && (
                      <span className="text-[9px] bg-amber-900 text-amber-200 font-bold px-1.5 py-0.5 rounded-full">
                        KULLANILIYOR
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
