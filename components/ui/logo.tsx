import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function KilasGiziLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark SVG */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-kg-green text-white shadow-sm"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.65}
          height={size * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mangkuk / Salad Bowl */}
          <path
            d="M3 10C3 15.5228 7.47715 20 13 20C17.4183 20 21.1882 17.135 22.4502 13.15"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Daun Hijau Sehat */}
          <path
            d="M12 10C12 6 15 3 19 3C19 7 16 10 12 10Z"
            fill="currentColor"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Kilat / Spark AI */}
          <path
            d="M8.5 2L5 8.5H9L6.5 14"
            stroke="#E8A33D"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <span className="font-display font-bold tracking-tight text-kg-ink text-xl">
        Kilas<span className="text-kg-green">Gizi</span>
      </span>
    </div>
  );
}