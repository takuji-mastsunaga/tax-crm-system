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
      {/* SOLVISロゴアイコン - 提供された太陽と水面のデザイン */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full" 
          fill="none"
        >
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
          
          {/* 太陽の放射線 - 提供された画像に基づく */}
          <g stroke={variant === 'light' ? '#60a5fa' : '#3b82f6'} strokeWidth="2.5" strokeLinecap="round">
            {/* メインの8方向放射線 */}
            <line x1="60" y1="8" x2="60" y2="25" />
            <line x1="60" y1="95" x2="60" y2="112" />
            <line x1="8" y1="60" x2="25" y2="60" />
            <line x1="95" y1="60" x2="112" y2="60" />
            <line x1="21.2" y1="21.2" x2="32.7" y2="32.7" />
            <line x1="87.3" y1="87.3" x2="98.8" y2="98.8" />
            <line x1="98.8" y1="21.2" x2="87.3" y2="32.7" />
            <line x1="32.7" y1="87.3" x2="21.2" y2="98.8" />
            
            {/* 中間の16方向放射線 */}
            <line x1="38.5" y1="12.8" x2="43.2" y2="22.5" />
            <line x1="81.5" y1="12.8" x2="76.8" y2="22.5" />
            <line x1="107.2" y1="38.5" x2="97.5" y2="43.2" />
            <line x1="107.2" y1="81.5" x2="97.5" y2="76.8" />
            <line x1="81.5" y1="107.2" x2="76.8" y2="97.5" />
            <line x1="38.5" y1="107.2" x2="43.2" y2="97.5" />
            <line x1="12.8" y1="81.5" x2="22.5" y2="76.8" />
            <line x1="12.8" y1="38.5" x2="22.5" y2="43.2" />
            
            {/* 細い放射線 */}
            <line x1="30" y1="15" x2="33" y2="21" opacity="0.7" strokeWidth="1.5" />
            <line x1="90" y1="15" x2="87" y2="21" opacity="0.7" strokeWidth="1.5" />
            <line x1="105" y1="30" x2="99" y2="33" opacity="0.7" strokeWidth="1.5" />
            <line x1="105" y1="90" x2="99" y2="87" opacity="0.7" strokeWidth="1.5" />
            <line x1="90" y1="105" x2="87" y2="99" opacity="0.7" strokeWidth="1.5" />
            <line x1="30" y1="105" x2="33" y2="99" opacity="0.7" strokeWidth="1.5" />
            <line x1="15" y1="90" x2="21" y2="87" opacity="0.7" strokeWidth="1.5" />
            <line x1="15" y1="30" x2="21" y2="33" opacity="0.7" strokeWidth="1.5" />
          </g>
          
          {/* 中央の太陽ディスク */}
          <circle 
            cx="60" 
            cy="60" 
            r="28" 
            fill="url(#sunGradient)"
            stroke={variant === 'light' ? '#1e40af' : '#2563eb'}
            strokeWidth="1.5"
          />
          
          {/* 水面の波線 - 提供された画像に基づく */}
          <g stroke="url(#waterGradient)" strokeWidth="2" fill="none">
            <path d="M35 65 Q42 62 49 65 Q56 68 63 65 Q70 62 77 65 Q84 68 85 65" />
            <path d="M37 72 Q44 69 51 72 Q58 75 65 72 Q72 69 79 72 Q83 74 83 72" />
            <path d="M39 79 Q46 76 53 79 Q60 82 67 79 Q74 76 81 79" />
          </g>
          
          {/* SOLVISテキスト（大きなサイズのみ） */}
          {(size === 'lg' || size === 'xl') && (
            <text 
              x="60" 
              y="60" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="white"
              fontSize="11"
              fontWeight="bold"
              letterSpacing="1.5"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              SOLVIS
            </text>
          )}
          
          {/* 小さなサイズ用のSマーク */}
          {(size === 'sm' || size === 'md') && (
            <text 
              x="60" 
              y="60" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="white"
              fontSize="18"
              fontWeight="bold"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
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