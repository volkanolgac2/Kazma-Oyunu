import React from 'react';

interface DashedDiamondSilhouetteProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DashedDiamondSilhouette: React.FC<DashedDiamondSilhouetteProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${sizeMap[size]} ${className}`}
      title="Mücevher İzi"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
      >
        {/* Tek katmanlı, basit beyaz kesik çizgili mücevher silüeti */}
        <polygon 
          points="28,24 72,24 92,44 50,92 8,44" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2.5" 
          strokeDasharray="6 4" 
          strokeLinejoin="round" 
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
