import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Shirt, Check, ChevronUp, Plus } from 'lucide-react';
import { ToolItem, ToolId, CostumeId } from '../types/game';
import { TOOLS } from '../data/items';
import { ToolVisual } from './ToolVisual';
import { AdventurerCharacter } from './AdventurerCharacter';
import { sound } from '../utils/audio';

interface BottomControlsProps {
  equippedTool: ToolItem;
  ownedTools: ToolId[];
  onEquipTool: (toolId: ToolId) => void;
  onOpenShop: () => void;
  onOpenCharacter: () => void;
  shovelDockRef?: React.RefObject<HTMLButtonElement | null> | React.RefObject<HTMLDivElement | null>;
  isShovelBroken?: boolean;
  companionCostume?: CostumeId;
  companionMood?: 'idle' | 'digging' | 'surprised' | 'cheering' | 'sad';
  companionTrackTarget?: { x: number; y: number } | null;
  onCompanionClick?: () => void;
  isDynamiteActive?: boolean;
  onToggleDynamite?: () => void;
  onTriggerHint?: () => void;
  isHintActive?: boolean;
  remainingDiamonds?: number;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  equippedTool,
  ownedTools = ['basic_shovel'],
  onEquipTool,
  onOpenShop,
  onOpenCharacter,
  shovelDockRef,
  isShovelBroken = false,
  companionCostume = 'explorer',
  companionMood = 'idle',
  companionTrackTarget = null,
  onCompanionClick,
  isDynamiteActive = false,
  onToggleDynamite,
  onTriggerHint,
  isHintActive = false,
  remainingDiamonds = 0
}) => {
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Filter owned tool items
  const ownedToolItems = TOOLS.filter(t => ownedTools.includes(t.id));

  // Close when clicking outside
  useEffect(() => {
    if (!isToolMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsToolMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isToolMenuOpen]);

  // Close tool menu automatically if tool gets broken
  useEffect(() => {
    if (isShovelBroken) {
      setIsToolMenuOpen(false);
    }
  }, [isShovelBroken]);

  const handleCenterButtonClick = () => {
    if (isShovelBroken) return;
    sound.playPop();
    setIsToolMenuOpen(prev => !prev);
  };

  const handleSelectTool = (id: ToolId) => {
    sound.playEquip();
    sound.playDig(id);
    onEquipTool(id);
    setIsToolMenuOpen(false);
  };

  return (
    <footer 
      ref={menuContainerRef} 
      className="w-full max-w-md mx-auto px-2 sm:px-3 pb-1 sm:pb-2 pt-0.5 flex flex-col gap-1 select-none z-30 relative shrink-0"
    >
      {/* Quick Tool Switcher Bubble Tray (Appears above KAZ button) */}
      {isToolMenuOpen && !isShovelBroken && (
        <div className="absolute bottom-18 left-1/2 -translate-x-1/2 w-full max-w-[360px] px-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black/95 backdrop-blur-md rounded-3xl p-3 border-2 border-emerald-500/50 shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col gap-2.5">
            {/* Header / Hint */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <span>⛏️</span> Kazı Aletini Seç
              </span>
              <span className="text-[10px] text-stone-400 font-bold">
                {ownedToolItems.length} aletin var
              </span>
            </div>

            {/* Circular Tool Bubbles */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap max-h-48 overflow-y-auto py-1 px-1 custom-scrollbar">
              {ownedToolItems.map((tool) => {
                const isSelected = tool.id === equippedTool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className={`group relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected ? 'scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Round Bubble Frame */}
                    <div 
                      className={`w-14 h-14 rounded-full p-0.5 relative flex items-center justify-center shadow-lg transition-all ${
                        isSelected 
                          ? 'ring-3 ring-emerald-400 ring-offset-2 ring-offset-stone-950 bg-gradient-to-b from-emerald-500 to-teal-700 shadow-[0_0_14px_rgba(52,211,153,0.7)]' 
                          : 'bg-gradient-to-b from-stone-700 to-stone-900 border border-white/20 hover:border-emerald-400'
                      }`}
                      style={!isSelected ? { borderColor: `${tool.rarityColor}80` } : undefined}
                    >
                      <div className="w-full h-full rounded-full bg-[#081810] flex items-center justify-center overflow-hidden">
                        <ToolVisual toolId={tool.id} size="sm" />
                      </div>

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-stone-950 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Compact Label */}
                    <span className={`text-[10px] font-black mt-1 text-center max-w-[64px] truncate leading-tight ${
                      isSelected ? 'text-emerald-300' : 'text-stone-300'
                    }`}>
                      {tool.name}
                    </span>
                    <span className="text-[8px] font-semibold text-stone-400">
                      {tool.areaBadge?.split('•')[0] || `${tool.digRadius}px`}
                    </span>
                  </button>
                );
              })}

              {/* Quick Shop Shortcut Bubble */}
              <button
                onClick={() => {
                  setIsToolMenuOpen(false);
                  onOpenShop();
                }}
                className="flex flex-col items-center justify-center hover:scale-105 transition-all cursor-pointer opacity-80 hover:opacity-100"
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500/60 bg-amber-950/40 flex items-center justify-center shadow-md">
                  <div className="flex flex-col items-center justify-center text-amber-400">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
                <span className="text-[10px] font-black text-amber-400 mt-1">Daha Fazla</span>
                <span className="text-[8px] font-semibold text-amber-300/80">Mağaza</span>
              </button>
            </div>
          </div>

          {/* Pointer Triangle Arrow pointing down */}
          <div className="w-4 h-4 bg-black/95 border-r-2 border-b-2 border-emerald-500/50 transform rotate-45 mx-auto -mt-2 shadow-lg" />
        </div>
      )}

      {/* Main Action Strip: [Dog on Left (flex-1)] [Exact Centered KAZ Shovel Circle] [Mağaza & Kıyafet Icon-only on Right (flex-1)] */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 pt-0.5 relative">
        {/* Left Side: Companion Dog Puppy & Remaining Hidden Gems Badge (flex-1 to balance right side) */}
        <div className="flex-1 flex items-center justify-start gap-1 sm:gap-1.5 min-w-0">
          <div 
            onClick={onCompanionClick}
            className="relative cursor-pointer transition-transform active:scale-95 flex items-end justify-center shrink-0 -my-1"
            title="Sevimli Dostun (Dokun ve sevindir!)"
          >
            <AdventurerCharacter
              costume={companionCostume}
              mood={companionMood}
              trackTarget={companionTrackTarget}
              size="sm"
              className="w-13 h-15 sm:w-15 sm:h-17"
            />
          </div>

          {/* Mücevher Görüntüsü ve İçinde Dinamik Kalan Gizli Mücevher Sayısı */}
          <div 
            className="relative flex items-center justify-center shrink-0 select-none"
            title={`Toprak altındaki gizli mücevher sayısı: ${remainingDiamonds}`}
          >
            {/* Ambient Cyan Glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md pointer-events-none animate-pulse" />

            {/* Diamond Image Frame */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(6,182,212,0.85)]"
              >
                <defs>
                  <linearGradient id="dogGemTableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="dogGemBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0c4a6e" />
                  </linearGradient>
                </defs>

                {/* Main Diamond Poly Body */}
                <polygon 
                  points="28,20 72,20 92,44 50,92 8,44" 
                  fill="url(#dogGemBodyGrad)" 
                  stroke="#38bdf8" 
                  strokeWidth="2.5" 
                  strokeLinejoin="round" 
                />

                {/* Top Table */}
                <polygon 
                  points="28,20 72,20 86,44 50,48 14,44" 
                  fill="url(#dogGemTableGrad)" 
                  stroke="#ffffff" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" 
                />

                {/* Facets */}
                <polygon points="14,44 50,48 50,92" fill="#0284c7" opacity="0.65" />
                <polygon points="86,44 50,48 50,92" fill="#075985" opacity="0.85" />
                <polygon points="28,20 50,48 14,44" fill="#7dd3fc" opacity="0.75" />
                <polygon points="72,20 50,48 86,44" fill="#0369a1" opacity="0.75" />

                {/* Top Catchlight Glint */}
                <ellipse cx="40" cy="28" rx="5" ry="2" transform="rotate(-15 40 28)" fill="#ffffff" opacity="0.9" />
              </svg>

              {/* Dynamic Remaining Gems Count Centered inside the Gem */}
              <div className="absolute inset-0 flex items-center justify-center pt-1 pointer-events-none">
                <span 
                  key={`rem_gems_${remainingDiamonds}`}
                  className="font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] animate-[scaleIn_0.2s_ease-out] tracking-tight leading-none select-none"
                  style={{ textShadow: '0 0 4px #082f49, 0 1px 2px #000' }}
                >
                  {remainingDiamonds}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Group: [Dynamite Small Round Button] [KAZ Large Central Shovel Anchor] [Hint Small Round Button] */}
        <div className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-2">
          {/* Left Round Button: Dynamite (🧨) */}
          <button
            onClick={onToggleDynamite}
            type="button"
            disabled={isShovelBroken}
            aria-label="Dinamit"
            title="Dinamit (Köstebekleri yok et & toprağı patlat!)"
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md border-2 transition-all cursor-pointer ${
              isDynamiteActive
                ? 'bg-gradient-to-b from-red-500 via-rose-600 to-red-950 border-yellow-300 ring-2 ring-red-400 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse'
                : 'bg-gradient-to-b from-red-600 via-red-800 to-stone-900 border-red-500 hover:scale-105 active:scale-95'
            } ${isShovelBroken ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="text-sm sm:text-base leading-none filter drop-shadow select-none">🧨</span>
            {isDynamiteActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            )}
          </button>

          {/* Center Main KAZ Button */}
          <button 
            ref={shovelDockRef as React.Ref<HTMLButtonElement>}
            onClick={handleCenterButtonClick}
            type="button"
            aria-label="Kazı aletini değiştir veya kaz"
            className={`relative w-14 h-14 sm:w-16 sm:h-16 -my-1 rounded-full p-1 shadow-[0_6px_14px_rgba(0,0,0,0.6)] border-3 sm:border-4 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isShovelBroken 
                ? 'bg-gradient-to-b from-rose-700 to-rose-950 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] cursor-not-allowed' 
                : isToolMenuOpen
                ? 'bg-gradient-to-b from-amber-500 to-emerald-900 border-yellow-300 scale-105 ring-4 ring-yellow-400/50'
                : 'bg-gradient-to-b from-emerald-600 to-emerald-950 border-emerald-400 hover:scale-105 active:scale-95'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#042412] flex items-center justify-center relative overflow-hidden pointer-events-none">
              <div className={`absolute inset-0 bg-radial pointer-events-none ${isShovelBroken ? 'from-rose-500/30' : 'from-emerald-300/20'} to-transparent`} />
              <ToolVisual toolId={equippedTool.id} size="sm" isBroken={isShovelBroken} />
            </div>

            {/* Up arrow indicator when ready to switch */}
            {!isShovelBroken && (
              <div className="absolute -top-1.5 w-4 h-4 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-md border border-white">
                <ChevronUp className={`w-3 h-3 stroke-[3] transition-transform ${isToolMenuOpen ? 'rotate-180' : ''}`} />
              </div>
            )}

            <div className={`absolute -bottom-1 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow whitespace-nowrap ${
              isShovelBroken ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-400 text-emerald-950'
            }`}>
              {isShovelBroken ? 'KIRILDI!' : 'KAZ'}
            </div>
          </button>

          {/* Right Round Button: Hint (✨) */}
          <button
            onClick={onTriggerHint}
            type="button"
            disabled={isShovelBroken || isHintActive}
            aria-label="İpucu"
            title="İpucu (Mücevherin yerini parlat!)"
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md border-2 transition-all cursor-pointer ${
              isHintActive
                ? 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-900 border-yellow-200 ring-2 ring-yellow-300 scale-110 shadow-[0_0_14px_rgba(234,179,8,0.9)] animate-bounce'
                : 'bg-gradient-to-b from-amber-500 via-amber-600 to-stone-900 border-amber-400 hover:scale-105 active:scale-95'
            } ${isShovelBroken ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="text-sm sm:text-base leading-none filter drop-shadow select-none">✨</span>
            {isHintActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>
        </div>

        {/* Right Side: Compact Icon-Only Mağaza & Kıyafet Buttons (flex-1 to balance left side) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Shop Icon Button */}
          <button
            onClick={onOpenShop}
            aria-label="Mağaza"
            title="Mağaza"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl game-btn-gold flex items-center justify-center cursor-pointer text-amber-950 shadow-md border-2 border-amber-900 hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Character Wardrobe Icon Button */}
          <button
            onClick={onOpenCharacter}
            aria-label="Kıyafet & Kostümler"
            title="Kıyafet"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl game-btn-blue flex items-center justify-center cursor-pointer text-white shadow-md border-2 border-sky-900 hover:scale-105 active:scale-95 transition-transform"
          >
            <Shirt className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
