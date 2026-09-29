'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outlineDark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MagneticButton({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;

    setOffset({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 select-none active:scale-95 group overflow-hidden cursor-pointer';

  const variants = {
    primary:
      'bg-[#5B5CE2] text-white hover:bg-[#4B4CCB] shadow-lg shadow-[#5B5CE2]/25 hover:shadow-xl hover:shadow-[#5B5CE2]/40 border border-[#8B8CFE]/30',
    secondary:
      'bg-[#10B981] text-white hover:bg-[#059669] shadow-lg shadow-[#10B981]/25 hover:shadow-xl hover:shadow-[#10B981]/40 border border-[#34D399]/30',
    outline:
      'bg-white text-[#15151A] border border-[#E7E7EC] hover:border-[#5B5CE2] hover:bg-[#F4F3F0] shadow-sm',
    outlineDark:
      'bg-[#14141E] text-white border border-[#262638] hover:border-[#5B5CE2] hover:bg-[#1C1C2B]',
    ghost:
      'text-[#6F7078] hover:text-[#15151A] hover:bg-[#F0EFF4]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5 rounded-xl',
    md: 'px-6 py-3.5 text-sm gap-2 rounded-2xl',
    lg: 'px-8 py-4.5 text-base gap-3 rounded-2xl',
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
            {icon}
          </span>
        )}
      </span>
    </button>
  );
}
