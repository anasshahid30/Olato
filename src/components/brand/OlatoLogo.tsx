import React from 'react';
import Link from 'next/link';
import { OlatoSymbol } from './OlatoSymbol';

interface OlatoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  showTagline?: boolean;
}

export function OlatoLogo({
  size = 'md',
  href = '/',
  className = '',
  showTagline = false,
}: OlatoLogoProps) {
  const iconSizes = {
    sm: 26,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Standalone Symbol */}
      <OlatoSymbol size={iconSizes[size]} />
      
      {/* Complete, correctly spelled Wordmark "Olato" */}
      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight text-[#15151A] ${textSizes[size]}`}
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Olato
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium text-[#6F7078] tracking-wide uppercase -mt-1">
            Local Discovery
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-[#5B5CE2] rounded-lg p-0.5">
        {content}
      </Link>
    );
  }

  return content;
}
