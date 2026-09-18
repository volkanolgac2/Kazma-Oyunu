import React from 'react';
import { CreatureType } from '../types/game';

interface CreatureVisualProps {
  type: CreatureType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isDiscovered?: boolean;
}

export const CreatureVisual: React.FC<CreatureVisualProps> = ({
  type,
  size = 'md',
  className = '',
  isDiscovered = false
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-[45px] h-[45px]',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]">
        <defs>
          <radialGradient id="moleGrad" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#a87148" />
            <stop offset="70%" stopColor="#78411e" />
            <stop offset="100%" stopColor="#451e08" />
          </radialGradient>

          <radialGradient id="caterpillarGrad" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>

          <radialGradient id="wormGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="60%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>

          <radialGradient id="spiderGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="60%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>
        </defs>

        {type === 'mole' ? (
          // Cute Mole: Calm before discovery; jumping with glowing lamp and surprised eyes when discovered!
          <g id="mole-creature">
            {/* Dirt mound rim */}
            <ellipse cx="50" cy="85" rx="42" ry="12" fill="#361b0c" />
            <ellipse cx="50" cy="83" rx="36" ry="9" fill="#200d04" />

            {/* Mole Head & Body */}
            <ellipse cx="50" cy={isDiscovered ? 50 : 56} rx="28" ry={isDiscovered ? 32 : 30} fill="url(#moleGrad)" />

            {/* Clean Yellow Miner Hat on Mole */}
            <path 
              d={isDiscovered ? "M 26,26 C 26,10 38,6 50,6 C 62,6 74,10 74,26 L 77,30 L 23,30 Z" : "M 28,34 C 28,18 38,14 50,14 C 62,14 72,18 72,34 L 75,38 L 25,38 Z"} 
              fill="#facc15" 
              stroke="#ca8a04" 
              strokeWidth="2" 
            />
            <ellipse 
              cx="50" 
              cy={isDiscovered ? 29 : 37} 
              rx={isDiscovered ? 27 : 25} 
              ry="3" 
              fill="#eab308" 
              stroke="#ca8a04" 
              strokeWidth="1.5" 
            />

            {/* Mole Snout */}
            <ellipse cx="50" cy={isDiscovered ? 56 : 62} rx="16" ry="11" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
            <ellipse cx="50" cy={isDiscovered ? 52 : 58} rx="6" ry="4" fill="#be185d" />

            {/* Cute Whiskers */}
            <line x1="28" y1={isDiscovered ? 56 : 62} x2="14" y2={isDiscovered ? 52 : 60} stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="28" y1={isDiscovered ? 60 : 66} x2="16" y2={isDiscovered ? 64 : 68} stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="72" y1={isDiscovered ? 56 : 62} x2="86" y2={isDiscovered ? 52 : 60} stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="72" y1={isDiscovered ? 60 : 66} x2="84" y2={isDiscovered ? 64 : 68} stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />

            {/* Cute Eyes (Surprised & Wide when discovered!) */}
            {isDiscovered ? (
              <>
                <circle cx="38" cy="40" r="6" fill="#0f172a" />
                <circle cx="36" cy="38" r="2.2" fill="#ffffff" />
                <circle cx="62" cy="40" r="6" fill="#0f172a" />
                <circle cx="60" cy="38" r="2.2" fill="#ffffff" />
                {/* Surprised Open Mouth */}
                <ellipse cx="50" cy="62" rx="4" ry="5" fill="#831843" />
              </>
            ) : (
              <>
                <circle cx="40" cy="46" r="4.5" fill="#0f172a" />
                <circle cx="39" cy="44" r="1.5" fill="#ffffff" />
                <circle cx="60" cy="46" r="4.5" fill="#0f172a" />
                <circle cx="59" cy="44" r="1.5" fill="#ffffff" />
              </>
            )}

            {/* Front Paws: Rested on dirt mound when calm; Raised up in surprise when discovered! */}
            {isDiscovered ? (
              <>
                <ellipse cx="22" cy="60" rx="9" ry="7" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" transform="rotate(-25 22 60)" />
                <ellipse cx="78" cy="60" rx="9" ry="7" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" transform="rotate(25 78 60)" />
              </>
            ) : (
              <>
                <ellipse cx="28" cy="80" rx="9" ry="6" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
                <ellipse cx="72" cy="80" rx="9" ry="6" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
              </>
            )}
          </g>
        ) : type === 'caterpillar' ? (
          // Cute Smiling Caterpillar
          <g id="caterpillar-creature">
            {/* Body Segments */}
            <circle cx="28" cy="74" r="14" fill="url(#caterpillarGrad)" />
            <circle cx="44" cy="64" r="15" fill="url(#caterpillarGrad)" />
            <circle cx="62" cy="52" r="16" fill="url(#caterpillarGrad)" />
            <circle cx="70" cy="36" r="17" fill="url(#caterpillarGrad)" />

            {/* Antennas */}
            <path d="M 66,22 Q 62,10 56,12" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="55" cy="12" r="4" fill="#facc15" />
            <path d="M 76,22 Q 78,8 84,10" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="85" cy="10" r="4" fill="#facc15" />

            {/* Friendly Eyes */}
            <circle cx="64" cy="34" r="5" fill="#ffffff" />
            <circle cx="65" cy="34" r="3.2" fill="#0f172a" />
            <circle cx="63.5" cy="32.5" r="1.2" fill="#ffffff" />

            <circle cx="78" cy="34" r="5" fill="#ffffff" />
            <circle cx="79" cy="34" r="3.2" fill="#0f172a" />
            <circle cx="77.5" cy="32.5" r="1.2" fill="#ffffff" />

            {/* Rosy Cheeks & Smile */}
            <circle cx="60" cy="42" r="3" fill="#f43f5e" opacity="0.6" />
            <circle cx="82" cy="42" r="3" fill="#f43f5e" opacity="0.6" />
            <path d="M 68,42 Q 72,48 76,42" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : type === 'worm' ? (
          // Cute Wiggling Earthworm
          <g id="worm-creature">
            {/* Curled Body */}
            <path 
              d="M 24,80 C 18,65 30,50 45,55 C 60,60 70,40 68,26" 
              stroke="url(#wormGrad)" 
              strokeWidth="20" 
              strokeLinecap="round" 
              fill="none" 
            />
            {/* Worm Rings */}
            <circle cx="48" cy="46" r="10" fill="#fbcfe8" opacity="0.4" />
            {/* Head */}
            <circle cx="68" cy="24" r="14" fill="url(#wormGrad)" />
            {/* Eyes */}
            <circle cx="64" cy="21" r="3.5" fill="#0f172a" />
            <circle cx="63" cy="20" r="1" fill="#ffffff" />
            <circle cx="74" cy="21" r="3.5" fill="#0f172a" />
            <circle cx="73" cy="20" r="1" fill="#ffffff" />
            {/* Smile */}
            <path d="M 66,28 Q 70,33 74,28" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Cute Round Purple Spider
          <g id="spider-creature">
            {/* 8 cute curved legs */}
            <g stroke="#3b0764" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 32,48 Q 12,38 8,56" />
              <path d="M 30,54 Q 10,54 10,72" />
              <path d="M 32,60 Q 14,70 18,84" />
              <path d="M 68,48 Q 88,38 92,56" />
              <path d="M 70,54 Q 90,54 90,72" />
              <path d="M 68,60 Q 86,70 82,84" />
            </g>

            {/* Round Fluffy Body */}
            <circle cx="50" cy="55" r="24" fill="url(#spiderGrad)" stroke="#2e1065" strokeWidth="2" />

            {/* Big Friendly Anime Eyes */}
            <circle cx="42" cy="50" r="7" fill="#ffffff" />
            <circle cx="42" cy="50" r="4.5" fill="#1e1b4b" />
            <circle cx="40" cy="48" r="2" fill="#ffffff" />

            <circle cx="58" cy="50" r="7" fill="#ffffff" />
            <circle cx="58" cy="50" r="4.5" fill="#1e1b4b" />
            <circle cx="56" cy="48" r="2" fill="#ffffff" />

            {/* Cute Little Fangs / Smile */}
            <path d="M 46,64 Q 50,68 54,64" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};
