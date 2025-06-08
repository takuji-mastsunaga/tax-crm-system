import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', variant = 'light', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const subTextSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };

  const colorClass = variant === 'light' ? 'text-white' : 'text-gray-900';
  const subColorClass = variant === 'light' ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SOLVISロゴアイコン - 太陽の放射状デザイン */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full" 
          fill="none"
        >
          {/* 太陽の放射線 */}
          <g stroke={variant === 'light' ? '#60a5fa' : '#3b82f6'} strokeWidth="1.5" strokeLinecap="round">
            {/* 上下左右の主要な放射線 */}
            <line x1="50" y1="5" x2="50" y2="15" />
            <line x1="50" y1="85" x2="50" y2="95" />
            <line x1="5" y1="50" x2="15" y2="50" />
            <line x1="85" y1="50" x2="95" y2="50" />
            
            {/* 斜めの放射線 */}
            <line x1="21.7" y1="21.7" x2="28.8" y2="28.8" />
            <line x1="71.2" y1="71.2" x2="78.3" y2="78.3" />
            <line x1="78.3" y1="21.7" x2="71.2" y2="28.8" />
            <line x1="28.8" y1="71.2" x2="21.7" y2="78.3" />
            
            {/* 中間の放射線 */}
            <line x1="50" y1="10" x2="50" y2="18" />
            <line x1="50" y1="82" x2="50" y2="90" />
            <line x1="10" y1="50" x2="18" y2="50" />
            <line x1="82" y1="50" x2="90" y2="50" />
            
            {/* より細かい放射線 */}
            <line x1="25" y1="13.4" x2="27.3" y2="19.8" />
            <line x1="75" y1="13.4" x2="72.7" y2="19.8" />
            <line x1="25" y1="86.6" x2="27.3" y2="80.2" />
            <line x1="75" y1="86.6" x2="72.7" y2="80.2" />
            <line x1="13.4" y1="25" x2="19.8" y2="27.3" />
            <line x1="13.4" y1="75" x2="19.8" y2="72.7" />
            <line x1="86.6" y1="25" x2="80.2" y2="27.3" />
            <line x1="86.6" y1="75" x2="80.2" y2="72.7" />
          </g>
          
          {/* 中央の太陽ディスク（水面も表現） */}
          <circle 
            cx="50" 
            cy="50" 
            r="20" 
            fill={variant === 'light' ? '#60a5fa' : '#3b82f6'} 
            opacity="0.9"
          />
          
          {/* 水面の波線 */}
          <g stroke={variant === 'light' ? '#93c5fd' : '#60a5fa'} strokeWidth="1" fill="none">
            <path d="M30 55 Q35 52 40 55 Q45 58 50 55 Q55 52 60 55 Q65 58 70 55" opacity="0.8"/>
            <path d="M32 60 Q37 57 42 60 Q47 63 52 60 Q57 57 62 60 Q67 63 68 60" opacity="0.6"/>
            <path d="M34 65 Q39 62 44 65 Q49 68 54 65 Q59 62 64 65" opacity="0.4"/>
          </g>
          
          {/* SOLVIS テキスト（小さなサイズでは省略） */}
          {(size === 'lg' || size === 'xl') && (
            <text 
              x="50" 
              y="50" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill={variant === 'light' ? 'white' : 'white'}
              fontSize="8"
              fontWeight="bold"
              letterSpacing="1"
            >
              S
            </text>
          )}
        </svg>
      </div>
      
      {/* テキストロゴ */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold ${colorClass} leading-tight tracking-tight`}>
            ソルビス税理士法人
          </span>
          <span className={`${subTextSizeClasses[size]} ${subColorClass} font-medium tracking-wider uppercase`}>
            SOLVIS TAX ACCOUNTING
          </span>
        </div>
      )}
    </div>
  );
} 