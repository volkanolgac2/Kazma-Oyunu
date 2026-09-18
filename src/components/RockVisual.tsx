import React from 'react';

interface RockVisualProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RockVisual: React.FC<RockVisualProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none pointer-events-none ${sizeMap[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]"
      >
        <defs>
          {/* Main Rock Base Gradient */}
          <linearGradient id="rockBaseGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#a8a29e" />
            <stop offset="35%" stopColor="#78716c" />
            <stop offset="70%" stopColor="#57534e" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>

          {/* Top Light Highlight Facet */}
          <linearGradient id="rockHighlightGrad" x1="10%" y1="0%" x2="90%" y2="70%">
            <stop offset="0%" stopColor="#e7e5e4" />
            <stop offset="60%" stopColor="#d6d3d1" />
            <stop offset="100%" stopColor="#a8a29e" />
          </linearGradient>

          {/* Shadow Edge Facet */}
          <linearGradient id="rockShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#44403c" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Contact Shadow */}
        <ellipse cx="50" cy="86" rx="38" ry="9" fill="rgba(0,0,0,0.55)" />

        {/* Outer Organic Boulder Silhouette */}
        <polygon 
          points="26,16 56,12 82,24 92,54 78,82 46,86 18,78 8,50 14,28" 
          fill="url(#rockBaseGrad)" 
          stroke="#1c1917" 
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Facet 1: Top-Left Sun-Lit Crest */}
        <polygon 
          points="26,16 56,12 48,36 28,38 14,28" 
          fill="url(#rockHighlightGrad)" 
          stroke="#44403c" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet 2: Upper Central Ridge */}
        <polygon 
          points="56,12 82,24 68,44 48,36" 
          fill="#a8a29e" 
          stroke="#44403c" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet 3: Right Upper Slant */}
        <polygon 
          points="82,24 92,54 72,58 68,44" 
          fill="#78716c" 
          stroke="#292524" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet 4: Center Face */}
        <polygon 
          points="28,38 48,36 68,44 72,58 48,66 26,58" 
          fill="#78716c" 
          stroke="#292524" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet 5: Left Shadow Flank */}
        <polygon 
          points="14,28 28,38 26,58 18,78 8,50" 
          fill="#57534e" 
          stroke="#292524" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet 6: Deep Bottom Undercut Shadow */}
        <polygon 
          points="26,58 48,66 72,58 78,82 46,86 18,78" 
          fill="url(#rockShadowGrad)" 
          stroke="#1c1917" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Natural Stone Fissures / Cracks */}
        <path 
          d="M 48,36 L 42,48 L 46,56 L 40,64" 
          stroke="#1c1917" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
        />
        <path 
          d="M 42,48 L 34,52" 
          stroke="#1c1917" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          fill="none" 
        />
        <path 
          d="M 68,44 L 62,52 L 64,60" 
          stroke="#1c1917" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Specular Bright Edge Highlights */}
        <line x1="28" y1="16" x2="54" y2="13" stroke="#f5f5f4" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="16" y1="28" x2="26" y2="18" stroke="#f5f5f4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
};
