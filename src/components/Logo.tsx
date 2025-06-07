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
      {/* ロゴアイコン */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl ring-1 ring-white/20`}>
        <svg 
          viewBox="0 0 32 32" 
          className="w-3/5 h-3/5 text-white" 
          fill="currentColor"
        >
          {/* 専門的な税理士アイコンデザイン */}
          <g>
            {/* メインドキュメント */}
            <rect x="6" y="8" width="14" height="18" rx="2" fill="currentColor" opacity="0.9"/>
            <rect x="20" y="10" width="8" height="14" rx="1" fill="currentColor" opacity="0.7"/>
            
            {/* 計算機のキーパッド */}
            <circle cx="9" cy="12" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="9" cy="15" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="15" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="9" cy="18" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="15" cy="18" r="1" fill="currentColor" opacity="0.8"/>
            
            {/* 'S' for SOLVIS - より洗練されたデザイン */}
            <path 
              d="M22 13 Q24 11.5 26 13 Q28 14.5 26 16 Q24 17.5 26 19 Q28 20.5 26 22" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none" 
              opacity="0.9"
              strokeLinecap="round"
            />
          </g>
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