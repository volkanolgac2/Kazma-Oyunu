import React, { useState, useEffect } from 'react';
import { CostumeId } from '../types/game';

interface AdventurerCharacterProps {
  costume: CostumeId;
  mood?: 'idle' | 'digging' | 'surprised' | 'cheering' | 'sad';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  trackTarget?: { x: number; y: number } | null;
  hideEarSpots?: boolean;
}

export const AdventurerCharacter: React.FC<AdventurerCharacterProps> = ({
  costume,
  mood = 'idle',
  size = 'md',
  className = '',
  onClick,
  trackTarget,
  hideEarSpots = false
}) => {
  const [tailWag, setTailWag] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Playful spontaneous tail wag
  useEffect(() => {
    const wagInterval = window.setInterval(() => {
      setTailWag(prev => !prev);
    }, 450);
    return () => clearInterval(wagInterval);
  }, []);

  // Natural spontaneous eye blink every 3.5s
  useEffect(() => {
    const blinkInterval = window.setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeMap = {
    sm: 'w-16 h-20',
    md: 'w-24 h-28',
    lg: 'w-36 h-42',
    xl: 'w-48 h-56'
  };

  // Calculate eye pupil / head shift based on tracking target
  let eyeOffsetX = 0;
  let eyeOffsetY = 0;
  let headTiltDeg = 0;

  if (trackTarget) {
    // Normalizing screen coordinates around center of board
    const normX = (trackTarget.x / (window.innerWidth || 400)) - 0.5;
    const normY = (trackTarget.y / (window.innerHeight || 700)) - 0.5;
    eyeOffsetX = Math.max(-2.5, Math.min(2.5, normX * 5));
    eyeOffsetY = Math.max(-2, Math.min(2.5, normY * 4));
    headTiltDeg = Math.max(-6, Math.min(6, normX * 12));
  }

  // Dynamic mood body posture (no pulse or flashing)
  const moodAnimationClass = 
    mood === 'cheering' 
      ? 'animate-bounce' 
      : '';

  const moodTransform = 
    mood === 'cheering' 
      ? 'translateY(-10px) scale(1.08)' 
      : mood === 'surprised'
      ? 'translateY(-4px) scale(0.98) rotate(-2deg)'
      : mood === 'sad'
      ? 'translateY(4px) scale(0.96) rotate(2deg)'
      : mood === 'digging'
      ? 'translateY(2px) rotate(-3deg)'
      : 'translateY(0px)';

  return (
    <div 
      id="dalmatian-puppy-character"
      className={`relative inline-block select-none cursor-pointer transition-transform duration-300 ease-out active:scale-95 ${sizeMap[size]} ${className}`}
      onClick={onClick}
      style={{ transform: moodTransform }}
      title="Sevimli Benekli Köpekçik!"
    >
      <svg 
        viewBox="0 0 110 125" 
        className={`w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.4)] overflow-visible ${moodAnimationClass}`}
      >
        <defs>
          {/* Pure White Puppy Coat with Soft Depth */}
          <radialGradient id="dogWhiteFur" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>

          {/* Floppy Ear Velvet Inner */}
          <radialGradient id="dogEarPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="70%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </radialGradient>

          {/* Glossy Yellow Raincoat Material */}
          <linearGradient id="raincoatYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="75%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Raincoat Trim / Straps */}
          <linearGradient id="raincoatTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Steel Shovel Blade Gradient */}
          <linearGradient id="shovelBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Shovel Wood Handle */}
          <linearGradient id="shovelWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Wet Doggy Nose Specular */}
          <radialGradient id="dogNose" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>

          {/* Big Puppy Eyes */}
          <radialGradient id="dogEyeIris" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="40%" stopColor="#451a03" />
            <stop offset="85%" stopColor="#1c0701" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Contact ground shadow */}
          <radialGradient id="dogShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Contact Shadow beneath paws */}
        <ellipse cx="55" cy="118" rx="26" ry="5.5" fill="url(#dogShadow)" />

        {/* ------------------------------------------------------------- */}
        {/* SPOTTED PUPPY TAIL (Animated wagging) */}
        {/* ------------------------------------------------------------- */}
        <g 
          id="dog-tail"
          className="transition-transform duration-300 ease-in-out origin-[75px_95px]"
          style={{
            transform: tailWag || mood === 'cheering' ? 'rotate(18deg)' : 'rotate(-8deg)'
          }}
        >
          {/* Base white tail */}
          <path 
            d="M 72,92 C 86,90 98,78 94,62 C 92,54 84,54 82,62 C 80,72 74,86 68,92 Z" 
            fill="url(#dogWhiteFur)" 
            stroke="#cbd5e1" 
            strokeWidth="0.8" 
          />
          {/* Black spots on tail */}
          <ellipse cx="86" cy="68" rx="3.5" ry="4.5" fill="#1e293b" transform="rotate(20 86 68)" />
          <circle cx="78" cy="80" r="3" fill="#1e293b" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* PUPPY BODY & CUTE RAINCOAT */}
        {/* ------------------------------------------------------------- */}
        <g id="dog-body">
          {/* Chubby White Puppy Body */}
          <path 
            d="M 36,70 C 32,64 78,64 74,70 C 80,82 82,106 72,112 C 64,116 46,116 38,112 C 28,106 30,82 36,70 Z" 
            fill="url(#dogWhiteFur)" 
          />

          {/* Black Dalmatian Spots on lower body/belly */}
          <circle cx="42" cy="104" r="3.2" fill="#0f172a" />
          <ellipse cx="68" cy="102" rx="4" ry="3" fill="#0f172a" />

          {/* ------------------------------------------------------------- */}
          {/* YELLOW WATERPROOF RAINCOAT */}
          {/* ------------------------------------------------------------- */}
          <g id="yellow-raincoat">
            {/* Main Raincoat Poncho / Jacket */}
            <path 
              d="M 33,68 C 30,62 80,62 77,68 C 83,80 83,100 75,103 C 67,105 43,105 35,103 C 27,100 27,80 33,68 Z" 
              fill="url(#raincoatYellow)" 
              stroke="#ca8a04" 
              strokeWidth="1.2" 
            />

            {/* Glossy Raincoat Light Reflection curve */}
            <path 
              d="M 38,72 Q 55,75 72,72" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.7" 
            />

            {/* Cute Raincoat Collar */}
            <path 
              d="M 37,67 Q 55,74 73,67 L 70,75 Q 55,80 40,75 Z" 
              fill="url(#raincoatTrim)" 
              stroke="#9a3412" 
              strokeWidth="0.8" 
            />

            {/* Raincoat center seam & button toggles */}
            <line x1="55" y1="74" x2="55" y2="103" stroke="#b45309" strokeWidth="1.2" strokeDasharray="2,2" />
            
            {/* Wooden / Dark Button Toggles */}
            <ellipse cx="55" cy="80" rx="3" ry="2" fill="#451a03" stroke="#fef08a" strokeWidth="0.6" />
            <ellipse cx="55" cy="88" rx="3" ry="2" fill="#451a03" stroke="#fef08a" strokeWidth="0.6" />
            <ellipse cx="55" cy="96" rx="3" ry="2" fill="#451a03" stroke="#fef08a" strokeWidth="0.6" />

            {/* Pocket on Raincoat */}
            <rect x="38" y="86" width="10" height="9" rx="2" fill="#eab308" stroke="#a16207" strokeWidth="0.8" />
            <line x1="39" y1="88" x2="47" y2="88" stroke="#ca8a04" strokeWidth="1" />
          </g>

          {/* Costume Accessories Adaptations */}
          {costume === 'explorer' && (
            <g id="costume-explorer-badge">
              <circle cx="68" cy="86" r="4.5" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
              <polygon points="68,83 69.5,86 68,89 66.5,86" fill="#ef4444" />
            </g>
          )}

          {costume === 'miner' && (
            <g id="costume-miner-pocket">
              {/* Pocket tool clip */}
              <rect x="64" y="84" width="7" height="12" rx="1.5" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
              <circle cx="67.5" cy="87" r="1.5" fill="#facc15" />
            </g>
          )}

          {costume === 'royal' && (
            <g id="costume-royal-cloak">
              <path d="M 33,70 L 26,104 L 36,102 Z" fill="#9333ea" />
              <path d="M 77,70 L 84,104 L 74,102 Z" fill="#9333ea" />
            </g>
          )}

          {/* Chubby White Puppy Feet with Black Paw Pads */}
          <ellipse cx="42" cy="112" rx="6" ry="4" fill="url(#dogWhiteFur)" stroke="#cbd5e1" strokeWidth="0.8" />
          <ellipse cx="68" cy="112" rx="6" ry="4" fill="url(#dogWhiteFur)" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Black spot on right foot */}
          <circle cx="70" cy="111" r="2.2" fill="#0f172a" />
          {/* Toe divisions */}
          <circle cx="39" cy="113" r="1" fill="#e2e8f0" />
          <circle cx="42" cy="114" r="1" fill="#e2e8f0" />
          <circle cx="45" cy="113" r="1" fill="#e2e8f0" />
          <circle cx="65" cy="113" r="1" fill="#e2e8f0" />
          <circle cx="68" cy="114" r="1" fill="#e2e8f0" />
          <circle cx="71" cy="113" r="1" fill="#e2e8f0" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* SHOVEL IN PAW (User mandate: "elinde küreği olan bir köpek") */}
        {/* ------------------------------------------------------------- */}
        <g 
          id="dog-shovel-in-paw"
          className="transition-transform duration-200 ease-out origin-[25px_80px]"
          style={{
            transform: mood === 'cheering' 
              ? 'translateY(-10px) rotate(-18deg)' 
              : mood === 'digging'
              ? 'translateY(4px) rotate(14deg)'
              : 'translateY(0px) rotate(0deg)'
          }}
        >
          {/* Wooden handle shaft */}
          <line x1="26" y1="52" x2="21" y2="108" stroke="url(#shovelWood)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Top D-Grip handle on shovel */}
          <path d="M 23,53 C 23,45 32,45 32,53" stroke="url(#shovelWood)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="25" y="47" width="5" height="3" rx="1" fill="#ca8a04" />

          {/* Shiny Metallic Spade Shovel Blade */}
          <path 
            d="M 16,92 L 27,90 L 26,108 C 24,115 18,115 16,108 Z" 
            fill="url(#shovelBlade)" 
            stroke="#1e293b" 
            strokeWidth="1.2" 
          />
          {/* Blade specular shine line */}
          <path d="M 19,94 L 18,106" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

          {/* White Front Paw grasping the shovel */}
          <ellipse cx="25" cy="74" rx="5" ry="4.5" fill="url(#dogWhiteFur)" stroke="#94a3b8" strokeWidth="0.8" transform="rotate(-15 25 74)" />
          {/* Spot on paw */}
          <circle cx="26" cy="74" r="1.8" fill="#0f172a" />
          <circle cx="23" cy="73" r="1" fill="#cbd5e1" />
          <circle cx="25" cy="76" r="1" fill="#cbd5e1" />
        </g>

        {/* Left Paw (Free / Clapping / Cheering) */}
        {mood === 'cheering' ? (
          <g id="left-paw-cheer">
            <ellipse cx="78" cy="68" rx="5" ry="5.5" fill="url(#dogWhiteFur)" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="78" cy="68" r="2.2" fill="#fda4af" opacity="0.8" />
            {/* Clapping sparks */}
            <text x="82" y="62" fontSize="11" fill="#facc15">✨</text>
          </g>
        ) : (
          <g id="left-paw-idle">
            <ellipse cx="73" cy="80" rx="5" ry="4.5" fill="url(#dogWhiteFur)" stroke="#94a3b8" strokeWidth="0.8" transform="rotate(15 73 80)" />
            <circle cx="73" cy="80" r="1.6" fill="#0f172a" />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ADORABLE DALMATIAN PUPPY HEAD (White with Black Spots) */}
        {/* ------------------------------------------------------------- */}
        <g 
          id="dog-head"
          className="transition-transform duration-200 ease-out origin-[55px_50px]"
          style={{
            transform: `rotate(${headTiltDeg}deg)`
          }}
        >
          {/* Floppy Left Ear (Behind head slightly) */}
          <g id="dog-left-ear">
            <path 
              d="M 28,34 C 14,24 10,48 16,62 C 18,66 26,64 28,52 Z" 
              fill="url(#dogWhiteFur)" 
              stroke="#94a3b8" 
              strokeWidth="0.8" 
            />
            <path d="M 22,38 C 16,32 15,48 19,56 C 21,58 25,56 24,46 Z" fill="url(#dogEarPink)" opacity="0.8" />
            {/* Black spot on left floppy ear */}
            {!hideEarSpots && (
              <ellipse cx="17" cy="50" rx="4.5" ry="6" fill="#0f172a" transform="rotate(15 17 50)" />
            )}
          </g>

          {/* Floppy Right Ear */}
          <g id="dog-right-ear">
            <path 
              d="M 82,34 C 96,24 100,48 94,62 C 92,66 84,64 82,52 Z" 
              fill="url(#dogWhiteFur)" 
              stroke="#94a3b8" 
              strokeWidth="0.8" 
            />
            <path d="M 88,38 C 94,32 95,48 91,56 C 89,58 85,56 86,46 Z" fill="url(#dogEarPink)" opacity="0.8" />
            {/* Black spot on right ear tip */}
            {!hideEarSpots && (
              <circle cx="92" cy="54" r="4.2" fill="#0f172a" />
            )}
          </g>

          {/* Chubby Round Head Shape (White Coat) */}
          <ellipse cx="55" cy="46" rx="28" ry="24" fill="url(#dogWhiteFur)" stroke="#cbd5e1" strokeWidth="0.8" />

          {/* ----------------------------------------------------------- */}
          {/* AUTHENTIC DALMATIAN SPOTS (Benekler) */}
          {/* ----------------------------------------------------------- */}
          {/* Iconic Dalmatian Eye Patch (Surrounding Left Eye) */}
          <path 
            d="M 33,35 C 30,42 32,54 41,54 C 47,54 48,44 45,36 C 42,30 35,30 33,35 Z" 
            fill="#0f172a" 
          />

          {/* Spots on forehead and temple */}
          {!hideEarSpots && (
            <>
              <circle cx="56" cy="30" r="2.8" fill="#0f172a" />
              <circle cx="70" cy="34" r="2.4" fill="#0f172a" />
            </>
          )}
          {/* Spot on right cheek */}
          <ellipse cx="74" cy="48" rx="4.5" ry="3.2" fill="#0f172a" transform="rotate(-15 74 48)" />

          {/* Cute White Snout / Muzzle */}
          <ellipse cx="55" cy="54" rx="14" ry="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />

          {/* Shiny Black Puppy Nose */}
          <path 
            d="M 50,48 C 50,45 60,45 60,48 C 60,52 56,55 55,55 C 54,55 50,52 50,48 Z" 
            fill="url(#dogNose)" 
          />
          {/* Specular White Catchlight on Nose */}
          <ellipse cx="53" cy="47.5" rx="1.6" ry="0.9" fill="#ffffff" opacity="0.95" />

          {/* Freckle dots on muzzle */}
          <circle cx="46" cy="53" r="0.6" fill="#64748b" />
          <circle cx="48" cy="55" r="0.6" fill="#64748b" />
          <circle cx="62" cy="53" r="0.6" fill="#64748b" />
          <circle cx="64" cy="55" r="0.6" fill="#64748b" />

          {/* Expressive Puppy Mouth */}
          {mood === 'cheering' ? (
            <g id="dog-mouth-cheer">
              {/* Wide open happy doggy smile */}
              <path d="M 48,55 Q 55,65 62,55 Z" fill="#991b1b" stroke="#0f172a" strokeWidth="1" />
              {/* Pink tongue sticking out happily! */}
              <path d="M 52,59 C 52,65 58,65 58,59 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="0.5" />
            </g>
          ) : mood === 'surprised' || mood === 'sad' ? (
            <g id="dog-mouth-sad">
              {/* Worried / scared trembling mouth */}
              <path d="M 49,58 Q 55,54 61,58" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              {/* Little blue teardrop of sadness */}
              <circle cx="37" cy="56" r="2.2" fill="#38bdf8" />
              <path d="M 37,53 L 35,56 L 39,56 Z" fill="#38bdf8" />
            </g>
          ) : (
            <g id="dog-mouth-happy">
              {/* Classic cute puppy 'W' shaped smile */}
              <path d="M 48,55 Q 51.5,59 55,55 Q 58.5,59 62,55" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* ----------------------------------------------------------- */}
          {/* BIG SPARKLING PUPPY EYES (Animated + Tracks shovel) */}
          {/* ----------------------------------------------------------- */}
          <g id="dog-eyes">
            {isBlinking && mood !== 'surprised' && mood !== 'cheering' ? (
              // Soft momentary blink
              <g stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none">
                <path d="M 36,44 Q 42,46 48,44" />
                <path d="M 62,44 Q 68,46 74,44" />
              </g>
            ) : mood === 'cheering' ? (
              // Joyful curved arcs
              <g stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" fill="none">
                <path d="M 36,44 Q 42,39 48,44" />
                <path d="M 62,44 Q 68,39 74,44" />
              </g>
            ) : mood === 'surprised' ? (
              // Huge wide scared eyes!
              <g id="dog-eyes-scared">
                {/* Left Eye */}
                <ellipse cx="42" cy="42" rx="7.5" ry="8" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                <circle cx="42" cy="42" r="3" fill="#0f172a" />
                <circle cx="40.5" cy="40.5" r="1.2" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse cx="68" cy="42" rx="7.5" ry="8" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                <circle cx="68" cy="42" r="3" fill="#0f172a" />
                <circle cx="66.5" cy="40.5" r="1.2" fill="#ffffff" />
              </g>
            ) : (
              // Big Warm Pixar Puppy Eyes with eye tracking!
              <g id="dog-eyes-open">
                {/* Left Eye */}
                <ellipse cx="42" cy="43" rx="6.5" ry="7.5" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />
                <ellipse cx={42 + eyeOffsetX} cy={43 + eyeOffsetY} rx="5" ry="6" fill="url(#dogEyeIris)" />
                <circle cx={42 + eyeOffsetX} cy={43 + eyeOffsetY} r="3.2" fill="#090d16" />
                {/* Shiny white catchlights */}
                <ellipse cx={40 + eyeOffsetX} cy={40.5 + eyeOffsetY} rx="1.8" ry="2.2" fill="#ffffff" transform="rotate(-15 40 40.5)" />
                <circle cx={44 + eyeOffsetX} cy={45 + eyeOffsetY} r="0.9" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse cx="68" cy="43" rx="6.5" ry="7.5" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />
                <ellipse cx={68 + eyeOffsetX} cy={43 + eyeOffsetY} rx="5" ry="6" fill="url(#dogEyeIris)" />
                <circle cx={68 + eyeOffsetX} cy={43 + eyeOffsetY} r="3.2" fill="#090d16" />
                <ellipse cx={66 + eyeOffsetX} cy={40.5 + eyeOffsetY} rx="1.8" ry="2.2" fill="#ffffff" transform="rotate(-15 66 40.5)" />
                <circle cx={70 + eyeOffsetX} cy={45 + eyeOffsetY} r="0.9" fill="#ffffff" />
              </g>
            )}

            {/* Cute Puppy Eyebrows */}
            <path d="M 37,36 Q 42,32 47,35" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 63,35 Q 68,32 73,36" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>

          {/* Cute Raincoat Hood resting on top/behind head */}
          <path 
            d="M 34,28 C 42,16 68,16 76,28" 
            stroke="url(#raincoatYellow)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            fill="none" 
            opacity="0.85" 
          />

          {/* Hats & Accents */}
          {costume === 'miner' && (
            <g id="dog-miner-hat">
              <path d="M 38,24 C 40,12 70,12 72,24 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
              <rect x="50" y="14" width="10" height="7" rx="2" fill="#334155" />
              <circle cx="55" cy="17.5" r="2.8" fill="#fef08a" />
            </g>
          )}

          {costume === 'astronaut' && (
            <g id="dog-astronaut-bubble">
              <ellipse cx="55" cy="42" rx="36" ry="30" fill="rgba(56,189,248,0.18)" stroke="#e2e8f0" strokeWidth="3" />
            </g>
          )}

          {costume === 'cowboy' && (
            <g id="dog-cowboy-hat">
              <path d="M 28,26 Q 55,18 82,26 Q 55,30 28,26 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <path d="M 40,24 C 42,10 68,10 70,24 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            </g>
          )}

          {costume === 'royal' && (
            <g id="dog-royal-crown">
              <path d="M 42,24 L 44,14 L 50,19 L 55,10 L 60,19 L 66,14 L 68,24 Z" fill="#facc15" stroke="#b45309" strokeWidth="1" />
              <circle cx="55" cy="9.5" r="2" fill="#38bdf8" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
