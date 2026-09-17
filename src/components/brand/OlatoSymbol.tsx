import React from 'react';

interface OlatoSymbolProps {
  className?: string;
  size?: number;
  color?: string;
}

export function OlatoSymbol({
  className = '',
  size = 32,
  color = '#5B5CE2',
}: OlatoSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Olato Symbol"
    >
      <defs>
        {/* Soft directional gradient highlight on O */}
        <linearGradient
          id="olatoCircleGrad"
          x1="8"
          y1="6"
          x2="32"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7577F1" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#4344B6" />
        </linearGradient>

        {/* Integrated handle texture/grain gradient at 4-5 o'clock position */}
        <linearGradient
          id="olatoHandleGrad"
          x1="26"
          y1="26"
          x2="35"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7577F1" stopOpacity="0.9" />
          <stop offset="35%" stopColor={color} />
          <stop offset="100%" stopColor="#3C3D9E" />
        </linearGradient>

        <filter id="subtleGlow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#5B5CE2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main custom circular search O body with soft highlight */}
      <circle
        cx="19"
        cy="19"
        r="12.5"
        stroke="url(#olatoCircleGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#subtleGlow)"
      />

      {/* Smooth inner directional accent stroke */}
      <path
        d="M12 11C13.8 9.2 16.3 8.2 19 8.2"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />

      {/* Handle emerging naturally from LOWER-RIGHT (4-5 o'clock) with grain transition */}
      {/* Seamless transition junction at (27, 27) -> (34, 34) */}
      <path
        d="M26.8 26.8 L34.5 34.5"
        stroke="url(#olatoHandleGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Grain accent dot near transition junction */}
      <circle cx="28.5" cy="28.5" r="0.8" fill="#FFFFFF" fillOpacity="0.5" />
    </svg>
  );
}
