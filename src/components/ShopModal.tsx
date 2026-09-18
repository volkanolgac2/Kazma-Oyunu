import React, { useState } from 'react';
import { X, Check, Lock, Sparkles, Shirt, Wrench } from 'lucide-react';
import { PlayerProgress, CostumeId, ToolId } from '../types/game';
import { COSTUMES, TOOLS } from '../data/items';
import { DiamondVisual } from './DiamondVisual';
import { ToolVisual } from './ToolVisual';
import { AdventurerCharacter } from './AdventurerCharacter';
import { sound } from '../utils/audio';

interface ShopModalProps {
  progress: PlayerProgress;
  onBuyCostume: (costumeId: CostumeId, price: number) => void;
  onBuyTool: (toolId: ToolId, price: number) => void;
  onEquipCostume: (costumeId: CostumeId) => void;
  onEquipTool: (toolId: ToolId) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  progress,
  onBuyCostume,
  onBuyTool,
  onEquipCostume,
  onEquipTool,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'costumes' | 'tools'>('costumes');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col game-card-wood rounded-3xl border-4 border-amber-950 shadow-2xl overflow-hidden">
        {/* Header with Diamond Balance */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <h2 className="text-xl font-black text-amber-100">Kazı Mağazası</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Diamond Balance */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-sky-400/40 px-3 py-1 rounded-xl shadow">
              <DiamondVisual size="sm" />
              <span className="text-white text-sm font-black">{progress.totalDiamonds}</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-red-600 border border-red-900 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-700 shadow"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Tab Switcher (Costumes vs Tools) */}
        <div className="grid grid-cols-2 p-2 bg-amber-950/40 gap-2 border-b border-amber-950">
          <button
            onClick={() => setActiveTab('costumes')}
            className={`py-2 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'costumes'
                ? 'game-btn-gold text-amber-950 shadow-md'
                : 'bg-black/30 text-amber-200 hover:bg-black/50'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Kostümler</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`py-2 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'tools'
                ? 'game-btn-gold text-amber-950 shadow-md'
                : 'bg-black/30 text-amber-200 hover:bg-black/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Aletler</span>
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className="bg-amber-400 text-amber-950 text-xs font-black py-1 px-3 text-center animate-bounce">
            {feedbackMsg}
          </div>
        )}

        {/* Catalog List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'costumes' ? (
            // Costumes catalog
            COSTUMES.map(item => {
              const isOwned = progress.ownedCostumes.includes(item.id);
              const isEquipped = progress.equippedCostume === item.id;
              const canAfford = progress.totalDiamonds >= item.price;

              return (
                <div
                  key={item.id}
                  className="game-card-soil p-3 rounded-2xl border-2 border-amber-950 flex items-center justify-between gap-3 shadow"
                >
                  {/* Left preview avatar */}
                  <div className="w-16 h-20 flex-shrink-0 bg-black/40 rounded-xl p-1 flex items-center justify-center border border-white/10">
                    <AdventurerCharacter costume={item.id} size="sm" mood="idle" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{item.badge}</span>
                      <h3 className="text-white text-sm font-black truncate">{item.name}</h3>
                    </div>
                    <p className="text-amber-200/80 text-[11px] leading-tight mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.specialTrait}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isEquipped ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-700/80 border border-emerald-400 text-emerald-100 text-xs font-black flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Giyildi</span>
                      </div>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          onEquipCostume(item.id);
                          sound.playEquip();
                          showFeedback(`${item.name} giyildi!`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl game-btn-blue text-white text-xs font-black cursor-pointer shadow hover:scale-105"
                      >
                        Giy
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            onBuyCostume(item.id, item.price);
                            sound.playShopPurchase();
                            showFeedback(`${item.name} satın alındı!`);
                          } else {
                            sound.playRockHit();
                            showFeedback(`${item.price - progress.totalDiamonds} mücevher daha gerekli!`);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer ${
                          canAfford
                            ? 'game-btn-gold text-amber-950 hover:scale-105'
                            : 'bg-stone-700 text-stone-300 border border-stone-600'
                        }`}
                      >
                        <DiamondVisual size="sm" animate={false} />
                        <span>{item.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Tools catalog
            TOOLS.map(item => {
              const isOwned = progress.ownedTools.includes(item.id);
              const isEquipped = progress.equippedTool === item.id;
              const canAfford = progress.totalDiamonds >= item.price;

              return (
                <div
                  key={item.id}
                  className="game-card-soil p-3 rounded-2xl border-2 border-amber-950 flex items-center justify-between gap-3 shadow"
                >
                  {/* Tool icon */}
                  <div className="w-16 h-16 flex-shrink-0 bg-black/40 rounded-xl p-1 flex items-center justify-center border border-white/10">
                    <ToolVisual toolId={item.id} size="sm" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white text-sm font-black truncate">{item.name}</h3>
                      {item.areaBadge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          {item.areaBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-200/80 text-[11px] leading-tight mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] flex-wrap">
                      <span className="text-amber-300 font-bold">Güç: {item.power}x</span>
                      <span className="text-sky-300 font-bold">• {item.specialAbility}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isEquipped ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-700/80 border border-emerald-400 text-emerald-100 text-xs font-black flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Kullanılıyor</span>
                      </div>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          onEquipTool(item.id);
                          sound.playEquip();
                          showFeedback(`${item.name} kuşandı!`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl game-btn-blue text-white text-xs font-black cursor-pointer shadow hover:scale-105"
                      >
                        Kuşan
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            onBuyTool(item.id, item.price);
                            sound.playShopPurchase();
                            showFeedback(`${item.name} satın alındı!`);
                          } else {
                            sound.playRockHit();
                            showFeedback(`${item.price - progress.totalDiamonds} mücevher daha gerekli!`);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer ${
                          canAfford
                            ? 'game-btn-gold text-amber-950 hover:scale-105'
                            : 'bg-stone-700 text-stone-300 border border-stone-600'
                        }`}
                      >
                        <DiamondVisual size="sm" animate={false} />
                        <span>{item.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
