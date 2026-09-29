'use client';

import React, { useRef, useState } from 'react';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  theme?: 'light' | 'dark';
}

export function GlowingCard({
  children,
  className = '',
  glowColor,
  theme = 'light',
}: GlowingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const defaultGlow = theme === 'light' ? 'rgba(91, 92, 226, 0.1)' : 'rgba(91, 92, 226, 0.2)';
  const activeGlow = glowColor || defaultGlow;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const themeClasses =
    theme === 'light'
      ? 'bg-white border border-[#E7E7EC] shadow-sm hover:border-[#5B5CE2]/40 hover:shadow-xl text-[#15151A]'
      : 'bg-[#14141E] border border-[#262638] hover:border-[#3A3B54] text-white';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${themeClasses} ${className}`}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 40%)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
