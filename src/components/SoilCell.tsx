import React from 'react';
import { SoilCellData, EnvironmentTheme } from '../types/game';
import { THEME_DATA } from '../data/levels';
import { DiamondVisual } from './DiamondVisual';
import { CreatureVisual } from './CreatureVisual';

interface SoilCellProps {
  cell: SoilCellData;
  theme: EnvironmentTheme;
  isHovered: boolean;
  onCellClick?: () => void;
}

export const SoilCell: React.FC<SoilCellProps> = ({
  cell,
  theme,
  isHovered,
  onCellClick
}) => {
  const themeVisuals = THEME_DATA[theme];
  const { isExcavated, soilHealth, maxSoilHealth, type, creatureType, hasCollected } = cell;

  // Undug tile styling
  const isPartiallyDamaged = !isExcavated && soilHealth < maxSoilHealth;

  return (
    <div
      data-cell-id={cell.id}
      data-x={cell.x}
      data-y={cell.y}
      onClick={onCellClick}
      className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-150 select-none ${
        isHovered ? 'ring-4 ring-amber-300 ring-offset-2 ring-offset-black scale-[1.02] z-10' : ''
      }`}
      style={{
        boxShadow: isExcavated
          ? 'inset 0 4px 8px rgba(0,0,0,0.8), inset 0 0 12px rgba(0,0,0,0.6)'
          : '0 4px 6px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.2)'
      }}
    >
      {/* Background Cavity (when dug out) */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-1"
        style={{
          backgroundColor: themeVisuals.cellDugBg,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)'
        }}
      >
        {/* If excavated, show the revealed content */}
        {isExcavated && (
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-75 duration-200">
            {type === 'diamond' && !hasCollected && (
              <DiamondVisual size="md" variant="normal" />
            )}
            {type === 'large_diamond' && !hasCollected && (
              <DiamondVisual size="lg" variant="large" />
            )}
            {type === 'rare_diamond' && !hasCollected && (
              <DiamondVisual size="lg" variant="rare" />
            )}
            {type === 'creature' && creatureType && (
              <div className="animate-bounce duration-700">
                <CreatureVisual type={creatureType} size="md" />
              </div>
            )}
            {type === 'rock' && (
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
                  <polygon points="12,24 24,10 44,12 52,32 40,50 18,48 8,36" fill="#78716c" stroke="#44403c" strokeWidth="2.5" />
                  <polygon points="24,10 44,12 36,26 22,24" fill="#a8a29e" opacity="0.6" />
                  <line x1="28" y1="24" x2="34" y2="40" stroke="#44403c" strokeWidth="1.5" />
                </svg>
              </div>
            )}
            {type === 'empty' && (
              <div className="opacity-40 flex items-center justify-center">
                {/* Small harmless pebbles or root tendril in empty dirt */}
                <svg viewBox="0 0 40 40" className="w-6 h-6">
                  <circle cx="15" cy="20" r="3" fill="#44403c" />
                  <circle cx="26" cy="24" r="2" fill="#57534e" />
                  <path d="M 8,10 Q 20,18 32,15" stroke="#713f12" strokeWidth="1.5" fill="none" opacity="0.5" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Undug Soil Layer */}
      {!isExcavated && (
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{
            background: themeVisuals.cellUndugBg,
            border: '2px solid rgba(0,0,0,0.3)',
            borderRadius: '10px'
          }}
        >
          {/* Subtle 3D Soil Clod & Pebble Textures */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="30" cy="30" rx="8" ry="5" fill="#1c0e05" opacity="0.4" />
              <ellipse cx="70" cy="65" rx="10" ry="6" fill="#1c0e05" opacity="0.4" />
              <circle cx="50" cy="80" r="3" fill="#ffffff" opacity="0.1" />
              <circle cx="80" cy="25" r="2.5" fill="#ffffff" opacity="0.1" />
              <circle cx="20" cy="60" r="2" fill="#000000" opacity="0.3" />
            </svg>
          </div>

          {/* Crack overlays if partially excavated (multi-hit soil) */}
          {isPartiallyDamaged && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <path d="M 20,40 L 40,36 L 50,55 L 65,48" stroke="#1c0e05" strokeWidth="2.5" fill="none" />
                <path d="M 40,36 L 35,18" stroke="#1c0e05" strokeWidth="2" fill="none" />
              </svg>
            </div>
          )}

          {/* Golden digging dashed highlight guide when hovered */}
          {isHovered && (
            <div className="absolute inset-1 border-2 border-dashed border-yellow-300 rounded-lg pointer-events-none animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};
