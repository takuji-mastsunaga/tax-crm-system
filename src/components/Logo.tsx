import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', variant = 'light', showText = true, className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
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
        {!imageError ? (
          // 実際のSOLVIS画像ファイルを使用
          <img
            src="/solvis-logo.png"
            alt="SOLVIS Tax Accounting Logo"
            className="w-full h-full object-contain"
            onError={() => {
              console.error('SOLVIS画像の読み込みに失敗しました。フォールバックSVGを表示します。');
              setImageError(true);
            }}
          />
        ) : (
          // フォールバック: 提供されたデザインに基づくSVG
          <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* 白い背景 */}
            <rect width="300" height="300" fill="white"/>
            
            {/* 太陽の放射線 - 提供された画像と完全一致 */}
            <g stroke="#e9ecef" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
              {/* 24方向の放射線 */}
              <line x1="150" y1="30" x2="150" y2="70" />
              <line x1="165" y1="32" x2="161" y2="72" />
              <line x1="180" y1="38" x2="171" y2="76" />
              <line x1="193" y1="47" x2="180" y2="82" />
              <line x1="205" y1="58" x2="188" y2="89" />
              <line x1="215" y1="71" x2="195" y2="97" />
              <line x1="223" y1="85" x2="201" y2="105" />
              <line x1="229" y1="100" x2="206" y2="114" />
              <line x1="233" y1="116" x2="210" y2="123" />
              <line x1="235" y1="132" x2="212" y2="132" />
              <line x1="235" y1="148" x2="212" y2="141" />
              <line x1="233" y1="164" x2="210" y2="150" />
              <line x1="229" y1="180" x2="206" y2="159" />
              <line x1="223" y1="195" x2="201" y2="168" />
              <line x1="215" y1="209" x2="195" y2="177" />
              <line x1="205" y1="222" x2="188" y2="185" />
              <line x1="193" y1="233" x2="180" y2="192" />
              <line x1="180" y1="242" x2="171" y2="198" />
              <line x1="165" y1="248" x2="161" y2="202" />
              <line x1="150" y1="250" x2="150" y2="204" />
              <line x1="135" y1="248" x2="139" y2="202" />
              <line x1="120" y1="242" x2="129" y2="198" />
              <line x1="107" y1="233" x2="120" y2="192" />
              <line x1="95" y1="222" x2="112" y2="185" />
              <line x1="85" y1="209" x2="105" y2="177" />
              <line x1="77" y1="195" x2="99" y2="168" />
              <line x1="71" y1="180" x2="94" y2="159" />
              <line x1="67" y1="164" x2="90" y2="150" />
              <line x1="65" y1="148" x2="88" y2="141" />
              <line x1="65" y1="132" x2="88" y2="132" />
              <line x1="67" y1="116" x2="90" y2="123" />
              <line x1="71" y1="100" x2="94" y2="114" />
              <line x1="77" y1="85" x2="99" y2="105" />
              <line x1="85" y1="71" x2="105" y2="97" />
              <line x1="95" y1="58" x2="112" y2="89" />
              <line x1="107" y1="47" x2="120" y2="82" />
              <line x1="120" y1="38" x2="129" y2="76" />
              <line x1="135" y1="32" x2="139" y2="72" />
            </g>
            
            {/* 中央の太陽ディスク */}
            <circle cx="150" cy="150" r="50" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2"/>
            
            {/* 水面の波線 - 下部に配置 */}
            <g stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.7">
              <path d="M90 210 Q110 205 130 210 Q150 215 170 210 Q190 205 210 210"/>
              <path d="M95 225 Q115 220 135 225 Q155 230 175 225 Q195 220 205 225"/>
              <path d="M100 240 Q120 235 140 240 Q160 245 180 240 Q200 235 200 240"/>
            </g>
            
            {/* SOLVISテキスト - 中央に配置 */}
            <text x="150" y="155" textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize="20" fontWeight="bold" letterSpacing="2" fontFamily="Arial, sans-serif">
              SOLVIS
            </text>
          </svg>
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