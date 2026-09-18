import React from 'react';

interface DiamondVisualProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'normal' | 'large' | 'rare';
  className?: string;
  animate?: boolean;
  isRedGlow?: boolean;
}

export const DiamondVisual: React.FC<DiamondVisualProps> = ({
  size = 'md',
  variant = 'normal',
  className = '',
  animate = true,
  isRedGlow = false
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Color themes for diamond variants
  const colorMap = {
    normal: {
      light: '#7dd3fc',
      mid: '#0ea5e9',
      dark: '#0369a1',
      deep: '#0c4a6e',
      glow: 'rgba(56, 189, 248, 0.7)'
    },
    large: {
      light: '#a5f3fc',
      mid: '#06b6d4',
      dark: '#0891b2',
      deep: '#155e75',
      glow: 'rgba(34, 211, 238, 0.85)'
    },
    rare: {
      light: '#fbcfe8',
      mid: '#f43f5e',
      dark: '#be123c',
      deep: '#881337',
      glow: 'rgba(244, 63, 94, 0.85)'
    }
  };

  const colors = isRedGlow ? {
    light: '#fecaca',
    mid: '#ef4444',
    dark: '#b91c1c',
    deep: '#7f1d1d',
    glow: 'rgba(239, 68, 68, 0.95)'
  } : colorMap[variant];

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${animate ? 'animate-float' : ''} ${className}`}
      style={{
        filter: isRedGlow 
          ? 'drop-shadow(0 0 16px rgba(239,68,68,1)) drop-shadow(0 0 28px rgba(220,38,38,0.85)) drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
          : `drop-shadow(0 0 10px ${colors.glow}) drop-shadow(0 4px 6px rgba(0,0,0,0.3))`
      }}
    >
      {/* Intense pulsing red aura halo when red light is active */}
      {isRedGlow && (
        <>
          <div className="absolute inset-0 -m-3 rounded-full bg-red-500/40 blur-md animate-ping pointer-events-none" />
          <div className="absolute inset-0 -m-2 rounded-full bg-red-600/50 blur-sm animate-pulse pointer-events-none" />
        </>
      )}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={`tableGrad_${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor={colors.light} />
            <stop offset="100%" stopColor={colors.mid} />
          </linearGradient>

          <linearGradient id={`facetLeft_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="100%" stopColor={colors.dark} />
          </linearGradient>

          <linearGradient id={`facetRight_${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.deep} />
          </linearGradient>

          <linearGradient id={`pavilionCenter_${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.dark} />
          </linearGradient>
        </defs>

        {/* Outer Diamond Crystal Silhouette */}
        {/* Top Flat Table */}
        <polygon 
          points="28,24 72,24 88,44 50,48 12,44" 
          fill={`url(#tableGrad_${variant})`} 
          stroke="#ffffff" 
          strokeWidth="1.2" 
          strokeLinejoin="round" 
        />

        {/* Crown Upper Facets */}
        <polygon points="28,24 50,48 12,44" fill={colors.light} opacity="0.85" />
        <polygon points="72,24 50,48 88,44" fill={colors.dark} opacity="0.85" />
        <polygon points="28,24 72,24 50,48" fill={`url(#tableGrad_${variant})`} />

        {/* Crown Outer Corner Triangles */}
        <polygon points="12,44 28,24 8,44" fill={colors.mid} opacity="0.7" />
        <polygon points="88,44 72,24 92,44" fill={colors.deep} opacity="0.7" />

        {/* Bottom Pointed Pavilion Facets */}
        <polygon 
          points="12,44 50,48 50,92" 
          fill={`url(#facetLeft_${variant})`} 
          stroke={colors.dark} 
          strokeWidth="0.8" 
          strokeLinejoin="round" 
        />
        <polygon 
          points="88,44 50,48 50,92" 
          fill={`url(#facetRight_${variant})`} 
          stroke={colors.deep} 
          strokeWidth="0.8" 
          strokeLinejoin="round" 
        />

        {/* Outer Pavilion Wings */}
        <polygon points="12,44 28,58 50,92" fill={colors.mid} opacity="0.6" />
        <polygon points="88,44 72,58 50,92" fill={colors.deep} opacity="0.9" />

        {/* Central Brilliant Core Sparkle */}
        <polygon points="38,46 50,48 62,46 50,78" fill="#ffffff" opacity="0.4" />

        {/* Specular White Catchlight Glints */}
        <ellipse cx="40" cy="30" rx="6" ry="2.5" transform="rotate(-15 40 30)" fill="#ffffff" opacity="0.9" />
        <circle cx="68" cy="32" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="50" cy="52" r="1.5" fill="#ffffff" opacity="0.95" />

        {/* Sparkle cross rays */}
        {animate && (
          <g transform="translate(74, 20) scale(0.6)">
            <path d="M 0,-15 Q 0,0 15,0 Q 0,0 0,15 Q 0,0 -15,0 Q 0,0 0,-15" fill="#ffffff" />
            <circle cx="0" cy="0" r="3" fill="#f0fdfa" />
          </g>
        )}
      </svg>
    </div>
  );
};
