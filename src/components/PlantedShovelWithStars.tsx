import React, { useMemo } from 'react';
import { ToolId } from '../types/game';
import { ToolVisual } from './ToolVisual';

interface PlantedShovelWithStarsProps {
  toolId?: ToolId;
  x: number;
  y: number;
}

interface StarParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  type: 'four-point' | 'five-point' | 'diamond' | 'circle';
}

export const PlantedShovelWithStars: React.FC<PlantedShovelWithStarsProps> = ({
  toolId,
  x,
  y
}) => {
  // Generate 18 celebratory stars bursting outward from the planted shovel blade
  const stars = useMemo<StarParticle[]>(() => {
    const starList: StarParticle[] = [];
    const colors = ['#fde047', '#facc15', '#38bdf8', '#ffffff', '#fbbf24', '#e0f2fe'];
    const types: ('four-point' | 'five-point' | 'diamond' | 'circle')[] = [
      'four-point',
      'five-point',
      'four-point',
      'diamond',
      'five-point',
      'circle'
    ];

    for (let i = 0; i < 18; i++) {
      // Semi-circle and full radial coverage biased upwards and sideways
      const angleDeg = -160 + (i / 17) * 320; // from -160deg to +160deg
      const angleRad = (angleDeg * Math.PI) / 180;
      const distance = 40 + (i % 4) * 22 + Math.random() * 20;

      starList.push({
        id: i,
        angle: angleRad,
        distance,
        size: 14 + (i % 3) * 8 + Math.random() * 6,
        delay: 0.05 + (i % 5) * 0.08,
        duration: 1.8 + Math.random() * 0.8,
        color: colors[i % colors.length],
        type: types[i % types.length]
      });
    }
    return starList;
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-40 select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      {/* 1. Ground Impact Shockwaves */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-0 left-0 w-28 h-10 rounded-[100%] bg-amber-400/30 blur-md animate-ping" />
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-0 left-0 w-36 h-12 rounded-[100%] border-2 border-amber-300/60 animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_infinite]" />

      {/* 2. Rotating Radiant Starburst Aura behind Shovel */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-0 left-0 w-64 h-64 pointer-events-none opacity-80 animate-spin-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="starburstGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g fill="url(#starburstGrad)">
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="50,50 47,0 53,0"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 3. The Equipped Digging Tool standing/planted at the last found gem sparkle location */}
      <div className="absolute left-0 top-0 pointer-events-none z-10 flex flex-col items-center justify-center">
        <div 
          className="relative animate-shovel-plant filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] overflow-visible flex items-center justify-center w-20 h-28"
        >
          <ToolVisual
            toolId={toolId}
            size="lg"
          />
        </div>
      </div>

      {/* 4. Starry Animation: Radiating Twinkling & Floating Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {stars.map(star => {
          const tx = Math.cos(star.angle) * star.distance;
          const ty = Math.sin(star.angle) * star.distance - 25; // bias slightly upward

          return (
            <div
              key={star.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '0px',
                top: '0px',
                animation: `starFloatBurst ${star.duration}s ease-out infinite`,
                animationDelay: `${star.delay}s`,
                // Pass target translations via CSS variables
                ['--tx' as string]: `${tx}px`,
                ['--ty' as string]: `${ty}px`
              }}
            >
              <div
                className="animate-star-twinkle"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.delay}s`
                }}
              >
                {star.type === 'four-point' ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] drop-shadow-[0_0_14px_rgba(255,255,255,0.8)]"
                  >
                    <path
                      d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                      fill={star.color}
                    />
                  </svg>
                ) : star.type === 'five-point' ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]"
                  >
                    <path
                      d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z"
                      fill={star.color}
                    />
                  </svg>
                ) : star.type === 'diamond' ? (
                  <svg
                    viewBox="0 0 20 20"
                    className="w-full h-full filter drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]"
                  >
                    <polygon points="10,0 20,10 10,20 0,10" fill={star.color} />
                  </svg>
                ) : (
                  <div
                    className="rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{
                      width: `${star.size * 0.6}px`,
                      height: `${star.size * 0.6}px`,
                      backgroundColor: star.color
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Sparkling Gold Glitters in the air */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-base animate-bounce">
        <span className="animate-spin-slow">✨</span>
        <span className="text-amber-300 drop-shadow-[0_0_10px_#fde047] text-xl">⭐</span>
        <span className="animate-spin-slow">✨</span>
      </div>
    </div>
  );
};
