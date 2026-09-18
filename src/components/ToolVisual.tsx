import React from 'react';
import { ToolId } from '../types/game';

interface ToolVisualProps {
  toolId: ToolId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDigging?: boolean;
  isBroken?: boolean;
}

export const ToolVisual: React.FC<ToolVisualProps> = ({
  toolId,
  size = 'md',
  className = '',
  isBroken = false
}) => {
  const sizeMap = {
    sm: 'w-10 h-14',
    md: 'w-16 h-22',
    lg: 'w-20 h-28',
    xl: 'w-28 h-36'
  };

  return (
    <div 
      className={`relative inline-block select-none ${sizeMap[size]} ${className}`}
    >
      <svg 
        viewBox="0 0 100 140" 
        className="w-full h-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)] overflow-visible"
      >
        <defs>
          {/* Wood shaft gradient */}
          <linearGradient id="woodShaft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="40%" stopColor="#ca8a04" />
            <stop offset="80%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Dark wood shaft */}
          <linearGradient id="darkWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#291204" />
          </linearGradient>

          {/* Basic iron spade */}
          <linearGradient id="basicIron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Steel blue spade */}
          <linearGradient id="steelBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Golden shovel */}
          <linearGradient id="goldSpade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Drill casing */}
          <linearGradient id="drillCasing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Excavator Yellow gradient */}
          <linearGradient id="excavatorYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Brush Bristles gradient */}
          <linearGradient id="bristleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Pickaxe Steel Head */}
          <linearGradient id="pickSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="45%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {isBroken ? (
          // ================= BROKEN STATES =================
          toolId === 'pickaxe' ? (
            <g id="broken-pickaxe">
              {/* Fractured grey steel head at top */}
              <g transform="translate(-4, -6) rotate(-22 50 35)">
                <rect x="41" y="24" width="18" height="20" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                <path 
                  d="M 8,42 Q 50,22 92,42 L 86,34 Q 50,14 14,34 Z" 
                  fill="url(#pickSteel)" 
                  stroke="#0f172a" 
                  strokeWidth="2" 
                />
                <polygon points="8,42 4,40 14,34" fill="#f8fafc" />
                <polygon points="92,42 96,40 86,34" fill="#f8fafc" />
                <path d="M 12,38 Q 50,24 88,38" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              </g>

              {/* Splinters & break sparks */}
              <line x1="42" y1="52" x2="34" y2="45" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
              <line x1="58" y1="54" x2="66" y2="48" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 40,48 L 48,56 L 44,64 L 56,70" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #ef4444)" />

              {/* Lower snapped wooden handle extending down */}
              <g transform="translate(6, 8) rotate(18 50 100)">
                <path d="M 47,58 Q 50,95 48,138" stroke="url(#darkWood)" strokeWidth="9" strokeLinecap="round" />
                <polygon points="43,62 53,62 53,46 50,52 47,44 44,51 43,48" fill="url(#darkWood)" stroke="#451a03" strokeWidth="1.2" />
                <line x1="43" y1="110" x2="53" y2="110" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="43" y1="118" x2="53" y2="118" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="43" y1="126" x2="53" y2="126" stroke="#1e293b" strokeWidth="2.5" />
              </g>
            </g>
          ) : toolId === 'drill' ? (
            <g id="broken-drill">
              <g transform="translate(-6, -4) rotate(-18 50 40)">
                <rect x="36" y="8" width="28" height="12" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="44" y="20" width="12" height="24" fill="#1e293b" />
                <path d="M 30,44 L 70,44 L 68,66 L 54,62 L 48,70 L 32,68 Z" fill="url(#drillCasing)" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="50" cy="56" r="3" fill="#ef4444" filter="drop-shadow(0 0 5px #ef4444)" />
                <path d="M 46,68 Q 42,76 38,72" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <path d="M 52,66 Q 56,75 60,70" stroke="#facc15" strokeWidth="2" fill="none" />
              </g>
              <path d="M 42,66 L 36,60 L 40,54" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" filter="drop-shadow(0 0 4px #38bdf8)" />
              <path d="M 64,68 L 72,62 L 68,55" stroke="#facc15" strokeWidth="2" fill="none" strokeLinecap="round" filter="drop-shadow(0 0 4px #facc15)" />
              <g transform="translate(10, 16) rotate(24 50 100)">
                <polygon points="50,135 28,78 48,72 58,79 72,78" fill="#64748b" stroke="#334155" strokeWidth="2" />
                <path d="M 32,86 L 68,88" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 36,98 L 64,100" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 48,74 L 54,92 L 46,110 L 50,132" stroke="#ef4444" strokeWidth="2" fill="none" />
              </g>
            </g>
          ) : toolId === 'excavator' ? (
            <g id="broken-excavator">
              <g transform="translate(-8, -6) rotate(-16 50 35)">
                <rect x="36" y="6" width="28" height="16" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                <polygon points="38,24 62,24 68,56 32,56" fill="url(#excavatorYellow)" stroke="#78350f" strokeWidth="2" />
                <rect x="42" y="32" width="16" height="20" rx="3" fill="#334155" />
              </g>
              {/* Leaking hydraulic oil & sparks */}
              <circle cx="50" cy="65" r="4" fill="#000000" opacity="0.8" />
              <path d="M 40,62 L 34,70 L 42,75" stroke="#facc15" strokeWidth="2" fill="none" />
              <path d="M 60,60 L 68,66" stroke="#ef4444" strokeWidth="2" fill="none" />
              <g transform="translate(12, 18) rotate(26 50 100)">
                <polygon points="20,70 80,70 86,105 76,126 24,126 14,105" fill="url(#excavatorYellow)" stroke="#78350f" strokeWidth="2.5" />
                <path d="M 50,70 L 46,95 L 56,110 L 50,126" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              </g>
            </g>
          ) : toolId === 'small_brush' ? (
            <g id="broken-small-brush">
              {/* Upper snapped handle */}
              <g transform="translate(-4, -6) rotate(-18 50 35)">
                <rect x="46" y="8" width="8" height="35" rx="3" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.2" />
                <polygon points="46,43 54,43 52,38 48,41" fill="url(#woodShaft)" />
              </g>
              {/* Red crack sparks */}
              <path d="M 40,42 L 48,48 L 44,56 L 54,60" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #ef4444)" />
              {/* Lower ferrule + frayed bristles */}
              <g transform="translate(8, 14) rotate(20 50 95)">
                <rect x="43" y="60" width="14" height="15" rx="2" fill="url(#basicIron)" stroke="#1e293b" strokeWidth="1.2" />
                <path d="M 41,75 C 38,95 42,120 48,124 C 55,120 62,95 59,75 Z" fill="url(#bristleGrad)" stroke="#78350f" strokeWidth="1.5" />
                <line x1="45" y1="75" x2="42" y2="115" stroke="#fef3c7" strokeWidth="1" />
                <line x1="55" y1="75" x2="58" y2="115" stroke="#451a03" strokeWidth="1" />
              </g>
            </g>
          ) : toolId === 'big_brush' ? (
            <g id="broken-big-brush">
              {/* Snapped wide grip handle */}
              <g transform="translate(-6, -6) rotate(-20 50 30)">
                <rect x="43" y="8" width="14" height="32" rx="5" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.5" />
                <circle cx="50" cy="18" r="3.5" fill="#291204" opacity="0.5" />
              </g>
              <path d="M 38,38 L 47,44 L 42,52 L 54,56" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #ef4444)" />
              {/* Lower wide ferrule + fanned bristles */}
              <g transform="translate(10, 16) rotate(22 50 95)">
                <polygon points="34,55 66,55 72,73 28,73" fill="url(#goldSpade)" stroke="#78350f" strokeWidth="1.5" />
                <path d="M 28,73 C 20,90 22,123 50,127 C 78,123 80,90 72,73 Z" fill="url(#bristleGrad)" stroke="#78350f" strokeWidth="2" />
                <line x1="38" y1="73" x2="32" y2="118" stroke="#fef3c7" strokeWidth="1.2" />
                <line x1="62" y1="73" x2="68" y2="118" stroke="#451a03" strokeWidth="1.2" />
              </g>
            </g>
          ) : toolId === 'rake' ? (
            <g id="broken-rake">
              {/* Snapped long wooden handle */}
              <g transform="translate(-6, -8) rotate(-22 50 35)">
                <rect x="46" y="6" width="8" height="52" rx="3" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.2" />
              </g>
              <path d="M 38,50 L 46,56 L 42,64 L 54,68" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #ef4444)" />
              {/* Bent and broken crossbar with tines */}
              <g transform="translate(10, 18) rotate(24 50 100)">
                <polygon points="40,70 60,70 78,84 22,84" fill="url(#basicIron)" stroke="#1e293b" strokeWidth="1.5" />
                <rect x="14" y="82" width="72" height="8" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" transform="rotate(-8 50 86)" />
                {/* Bent/broken tines */}
                <path d="M 20,90 L 14,112 Q 12,118 18,116" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 35,90 L 32,115" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 50,90 L 50,118 Q 50,122 56,120" stroke="#64748b" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 65,90 L 72,112" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 80,90 L 86,110" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            </g>
          ) : (
            <g id="broken-tool">
              <g transform="translate(-6, -6) rotate(-20 50 35)">
                <path d="M 32,10 C 32,4 68,4 68,10 L 68,26 C 68,28 62,30 50,30 C 38,30 32,28 32,26 Z" fill={toolId === 'golden_shovel' ? 'url(#goldSpade)' : toolId === 'steel_shovel' ? 'url(#steelBlue)' : toolId === 'legendary_tool' ? '#0284c7' : '#522405'} stroke="#291204" strokeWidth="2" />
                <polygon points="45,28 55,28 55,54 52,50 49,57 47,49 45,53" fill={toolId === 'legendary_tool' ? '#38bdf8' : 'url(#woodShaft)'} stroke="#451a03" strokeWidth="1.2" />
              </g>
              <path d="M 38,48 L 47,54 L 43,62 L 54,66 L 46,74" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #f87171)" />
              <g transform="translate(10, 16) rotate(22 50 95)">
                <polygon points="45,63 47,67 50,60 53,66 55,63 55,74 45,74" fill={toolId === 'legendary_tool' ? '#38bdf8' : 'url(#woodShaft)'} stroke="#451a03" strokeWidth="1" />
                <rect x="42" y="74" width="16" height="8" rx="2" fill={toolId === 'golden_shovel' ? '#facc15' : toolId === 'legendary_tool' ? '#38bdf8' : '#475569'} stroke="#1e293b" strokeWidth="1" />
                <path d="M 22,82 C 24,78 76,78 78,82 L 84,104 C 84,124 58,138 50,138 C 42,138 16,124 16,104 Z" fill={toolId === 'golden_shovel' ? 'url(#goldSpade)' : toolId === 'steel_shovel' ? 'url(#steelBlue)' : toolId === 'legendary_tool' ? 'url(#steelBlue)' : 'url(#basicIron)'} stroke={toolId === 'golden_shovel' ? '#854d0e' : '#1e293b'} strokeWidth="2" />
                <path d="M 50,82 L 44,98 L 52,112 L 48,128" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            </g>
          )
        ) : (
          // ================= INTACT TOOL VISUALS =================
          toolId === 'small_brush' ? (
            // Small Archaeology Brush
            <g id="tool-small-brush">
              {/* Slender Handle */}
              <rect x="46" y="8" width="8" height="65" rx="3" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.2" />
              {/* Metal Ferrule */}
              <rect x="43" y="73" width="14" height="15" rx="2" fill="url(#basicIron)" stroke="#1e293b" strokeWidth="1.2" />
              {/* Fine Soft Bristles */}
              <path d="M 43,88 C 41,105 45,130 50,134 C 55,130 59,105 57,88 Z" fill="url(#bristleGrad)" stroke="#78350f" strokeWidth="1.5" />
              {/* Bristle texture lines */}
              <line x1="47" y1="88" x2="48" y2="128" stroke="#fef3c7" strokeWidth="1" opacity="0.8" />
              <line x1="50" y1="88" x2="50" y2="132" stroke="#451a03" strokeWidth="1" opacity="0.6" />
              <line x1="53" y1="88" x2="52" y2="128" stroke="#fef3c7" strokeWidth="1" opacity="0.8" />
            </g>
          ) : toolId === 'big_brush' ? (
            // Big Archaeology / Dusting Brush
            <g id="tool-big-brush">
              {/* Wide Grip Handle */}
              <rect x="43" y="8" width="14" height="52" rx="5" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.5" />
              <circle cx="50" cy="18" r="3.5" fill="#291204" opacity="0.5" />
              {/* Wide Brass Ferrule */}
              <polygon points="34,60 66,60 72,78 28,78" fill="url(#goldSpade)" stroke="#78350f" strokeWidth="1.5" />
              {/* Dense Fanned Bristles */}
              <path d="M 28,78 C 22,95 24,128 50,132 C 76,128 78,95 72,78 Z" fill="url(#bristleGrad)" stroke="#78350f" strokeWidth="2" />
              {/* Bristle texture fan */}
              <line x1="38" y1="78" x2="34" y2="124" stroke="#fef3c7" strokeWidth="1.2" />
              <line x1="44" y1="78" x2="42" y2="129" stroke="#451a03" strokeWidth="1.2" />
              <line x1="50" y1="78" x2="50" y2="131" stroke="#fef3c7" strokeWidth="1.5" />
              <line x1="56" y1="78" x2="58" y2="129" stroke="#451a03" strokeWidth="1.2" />
              <line x1="62" y1="78" x2="66" y2="124" stroke="#fef3c7" strokeWidth="1.2" />
            </g>
          ) : toolId === 'rake' ? (
            // Multi-tine Garden Rake
            <g id="tool-rake">
              {/* Long Sturdy Handle */}
              <rect x="46" y="6" width="8" height="85" rx="3" fill="url(#woodShaft)" stroke="#451a03" strokeWidth="1.2" />
              {/* Rake Collar Bracket */}
              <polygon points="40,88 60,88 78,102 22,102" fill="url(#basicIron)" stroke="#1e293b" strokeWidth="1.5" />
              {/* Rake Horizontal Crossbar */}
              <rect x="14" y="100" width="72" height="8" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
              {/* 5 Sharp Curved Steel Tines */}
              <path d="M 20,108 L 18,132 Q 18,136 22,134" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 35,108 L 34,132 Q 34,136 38,134" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 50,108 L 50,134 Q 50,138 54,136" stroke="#64748b" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 65,108 L 66,132 Q 66,136 70,134" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 80,108 L 82,132 Q 82,136 86,134" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : toolId === 'pickaxe' ? (
            // Classic Heavy Miner's Pickaxe: Curved Grey Forged Head at TOP, Wooden Handle extending DOWN
            <g id="tool-pickaxe">
              {/* Curved Ash Wood Haft extending downwards */}
              <path d="M 47,20 Q 50,75 48,140" stroke="url(#darkWood)" strokeWidth="9" strokeLinecap="round" />
              <path d="M 47,20 Q 50,75 48,140" stroke="#451a03" strokeWidth="1.2" fill="none" />
              {/* Miner's leather grip bands near the bottom handle */}
              <line x1="43" y1="110" x2="53" y2="110" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="43" y1="118" x2="53" y2="118" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="43" y1="126" x2="53" y2="126" stroke="#1e293b" strokeWidth="2.5" />

              {/* Center Iron Eye / Collar */}
              <rect x="41" y="24" width="18" height="20" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="50" cy="34" r="3.2" fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />

              {/* Forged Steel Curved Pickaxe Head at the TOP */}
              <path 
                d="M 8,42 Q 50,20 92,42 L 86,32 Q 50,12 14,32 Z" 
                fill="url(#pickSteel)" 
                stroke="#0f172a" 
                strokeWidth="2" 
              />

              {/* Sharp Beveled Chisel and Spike Tips */}
              <polygon points="8,42 4,40 14,32" fill="#f8fafc" />
              <polygon points="92,42 96,40 86,32" fill="#f8fafc" />

              {/* Central Spine Ridge highlighting the curved steel blade */}
              <path d="M 12,36 Q 50,22 88,36" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.85" />
              <line x1="50" y1="20" x2="50" y2="44" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            </g>
          ) : toolId === 'excavator' ? (
            // Heavy Hydraulic Excavator Bucket / Boom
            <g id="tool-excavator">
              {/* Upper Articulated Boom Section */}
              <polygon points="36,6 64,6 68,42 32,42" fill="url(#excavatorYellow)" stroke="#78350f" strokeWidth="2" />
              {/* Industrial Warning Stripe */}
              <line x1="36" y1="18" x2="64" y2="18" stroke="#1e293b" strokeWidth="4" />
              <line x1="34" y1="30" x2="66" y2="30" stroke="#1e293b" strokeWidth="4" />
              {/* Chrome Hydraulic Piston */}
              <rect x="44" y="36" width="12" height="34" rx="2" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
              <rect x="47" y="44" width="6" height="26" fill="#f8fafc" />
              {/* Pivot Joint Pin */}
              <circle cx="50" cy="70" r="7" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
              <circle cx="50" cy="70" r="3" fill="#64748b" />
              {/* Massive Heavy-Duty Curved Excavator Bucket */}
              <path 
                d="M 16,76 L 84,76 L 90,108 C 90,132 78,136 50,136 C 22,136 10,132 10,108 Z" 
                fill="url(#excavatorYellow)" 
                stroke="#78350f" 
                strokeWidth="2.5" 
              />
              {/* Inner Dark Bucket Scoop Chamber */}
              <path 
                d="M 22,82 L 78,82 L 82,106 C 82,126 72,128 50,128 C 28,128 18,126 18,106 Z" 
                fill="#1f180e" 
              />
              {/* 4 Cast Hardened Steel Excavator Digging Teeth */}
              <polygon points="20,130 24,140 28,130" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
              <polygon points="38,132 42,142 46,132" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
              <polygon points="54,132 58,142 62,132" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
              <polygon points="72,130 76,140 80,130" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
            </g>
          ) : toolId === 'drill' ? (
            // High-Torque Pneumatic Spiral Drill
            <g id="drill-tool">
              <rect x="36" y="8" width="28" height="12" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <rect x="44" y="20" width="12" height="24" fill="#1e293b" />
              <rect x="30" y="44" width="40" height="34" rx="6" fill="url(#drillCasing)" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="38" y1="52" x2="62" y2="52" stroke="#0ea5e9" strokeWidth="2" />
              <line x1="38" y1="58" x2="62" y2="58" stroke="#0ea5e9" strokeWidth="2" />
              <circle cx="50" cy="68" r="4" fill="#22c55e" filter="drop-shadow(0 0 4px #4ade80)" />
              <polygon points="50,135 28,78 72,78" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
              <path d="M 32,86 Q 50,92 68,86" stroke="#0f172a" strokeWidth="4" fill="none" />
              <path d="M 36,98 Q 50,104 64,98" stroke="#0f172a" strokeWidth="4" fill="none" />
              <path d="M 40,110 Q 50,116 60,110" stroke="#0f172a" strokeWidth="4" fill="none" />
              <path d="M 45,122 Q 50,126 55,122" stroke="#0f172a" strokeWidth="3" fill="none" />
            </g>
          ) : (
            // Shovels: basic_shovel, steel_shovel, golden_shovel, legendary_tool
            <g id="shovel-tool">
              {/* D-Grip Handle */}
              <path 
                d="M 32,10 C 32,4 68,4 68,10 L 68,26 C 68,28 62,30 50,30 C 38,30 32,28 32,26 Z" 
                fill={toolId === 'golden_shovel' ? 'url(#goldSpade)' : toolId === 'steel_shovel' ? 'url(#steelBlue)' : toolId === 'legendary_tool' ? '#0284c7' : '#522405'} 
                stroke="#291204" 
                strokeWidth="2" 
              />
              <rect x="40" y="14" width="20" height="10" rx="3" fill="#1b1510" opacity="0.4" />

              {/* Wooden / Metallic Shaft */}
              <rect 
                x="45" 
                y="28" 
                width="10" 
                height="48" 
                rx="2" 
                fill={toolId === 'legendary_tool' ? '#38bdf8' : 'url(#woodShaft)'} 
                stroke="#451a03" 
                strokeWidth="1" 
              />

              {/* Collar / Socket Ring */}
              <rect 
                x="42" 
                y="74" 
                width="16" 
                height="8" 
                rx="2" 
                fill={toolId === 'golden_shovel' ? '#facc15' : toolId === 'legendary_tool' ? '#38bdf8' : '#475569'} 
                stroke="#1e293b" 
                strokeWidth="1" 
              />

              {/* Large 3D Excavator Spade Blade */}
              <path 
                d="M 22,82 C 24,78 76,78 78,82 L 84,104 C 84,124 58,138 50,138 C 42,138 16,124 16,104 Z" 
                fill={
                  toolId === 'golden_shovel' 
                    ? 'url(#goldSpade)' 
                    : toolId === 'steel_shovel' 
                    ? 'url(#steelBlue)' 
                    : toolId === 'legendary_tool'
                    ? 'url(#steelBlue)'
                    : 'url(#basicIron)'
                } 
                stroke={toolId === 'golden_shovel' ? '#854d0e' : '#1e293b'} 
                strokeWidth="2" 
              />

              {/* Spade Central Reinforcement Ridge */}
              <path 
                d="M 50,82 L 50,134" 
                stroke={toolId === 'golden_shovel' ? '#fef08a' : '#cbd5e1'} 
                strokeWidth="3" 
                strokeLinecap="round" 
                opacity="0.8" 
              />

              {/* Ground bevel sheen */}
              <path 
                d="M 26,86 L 36,120 Q 50,132 50,134 Q 40,126 24,104 Z" 
                fill="#ffffff" 
                opacity="0.25" 
              />

              {/* Sparkling Gem for Legendary Tool */}
              {toolId === 'legendary_tool' && (
                <circle cx="50" cy="100" r="7" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
              )}
              {toolId === 'golden_shovel' && (
                <polygon points="50,92 53,98 59,99 54,103 56,109 50,105 44,109 46,103 41,99 47,98" fill="#ffffff" />
              )}
            </g>
          )
        )}
      </svg>
    </div>
  );
};
