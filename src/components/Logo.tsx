import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', variant = 'light', showText = true, className = '' }: LogoProps) {
  const [svgError, setSvgError] = useState(false);
  const [pngError, setPngError] = useState(false);
  
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
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100`}>
        {!svgError ? (
          <img
            src="/solvis-logo.svg"
            alt="SOLVIS Tax Accounting Logo"
            className="w-full h-full object-contain"
            onError={() => setSvgError(true)}
          />
        ) : !pngError ? (
          <img
            src="/solvis-logo.png"
            alt="SOLVIS Tax Accounting Logo"
            className="w-full h-full object-contain"
            onError={() => setPngError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-lg">
            <span className="text-blue-600 font-bold text-xs">SOLVIS</span>
          </div>
        )}
      </div>
      
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