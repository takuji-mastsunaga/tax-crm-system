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
      {/* SOLVISロゴアイコン - 提供された画像を再現したSVG */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-lg overflow-hidden shadow-sm`}>
        <img
          src="/solvis-logo-original.svg"
          alt="SOLVIS Tax Accounting Logo"
          className="w-full h-full object-contain"
          style={{ 
            filter: variant === 'dark' ? 'brightness(0.95) contrast(1.05)' : 'brightness(1) contrast(1.1)',
          }}
          onError={(e) => {
            // フォールバック用のインラインSVG
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        
        {/* フォールバック用のインラインSVG */}
        <div className="w-full h-full absolute inset-0 hidden">
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full" 
            fill="none"
          >
            {/* 白い背景 */}
            <rect width="400" height="400" fill="white"/>
            
            <defs>
              <radialGradient id="fallbackSunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#f8f9fa', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#e9ecef', stopOpacity: 1 }} />
              </radialGradient>
            </defs>
            
            {/* 太陽の放射線 */}
            <g stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
              {/* メインの24方向放射線 */}
              <line x1="200" y1="40" x2="200" y2="80" />
              <line x1="218" y1="42" x2="214" y2="82" />
              <line x1="235" y1="48" x2="226" y2="86" />
              <line x1="251" y1="57" x2="237" y2="92" />
              <line x1="265" y1="68" x2="246" y2="99" />
              <line x1="278" y1="81" x2="254" y2="107" />
              <line x1="289" y1="95" x2="261" y2="116" />
              <line x1="298" y1="111" x2="266" y2="125" />
              <line x1="305" y1="127" x2="270" y2="135" />
              <line x1="310" y1="144" x2="272" y2="145" />
              <line x1="313" y1="162" x2="273" y2="155" />
              <line x1="314" y1="180" x2="274" y2="165" />
              <line x1="313" y1="198" x2="273" y2="175" />
              <line x1="310" y1="216" x2="270" y2="185" />
              <line x1="305" y1="233" x2="266" y2="195" />
              <line x1="298" y1="249" x2="261" y2="204" />
              <line x1="289" y1="265" x2="254" y2="213" />
              <line x1="278" y1="279" x2="246" y2="221" />
              <line x1="265" y1="292" x2="237" y2="228" />
              <line x1="251" y1="303" x2="226" y2="234" />
              <line x1="235" y1="312" x2="214" y2="238" />
              <line x1="218" y1="318" x2="200" y2="280" />
              <line x1="200" y1="320" x2="200" y2="280" />
              <line x1="182" y1="318" x2="186" y2="278" />
              <line x1="165" y1="312" x2="174" y2="274" />
              <line x1="149" y1="303" x2="163" y2="268" />
              <line x1="135" y1="292" x2="154" y2="261" />
              <line x1="122" y1="279" x2="146" y2="253" />
              <line x1="111" y1="265" x2="139" y2="244" />
              <line x1="102" y1="249" x2="134" y2="235" />
              <line x1="95" y1="233" x2="130" y2="225" />
              <line x1="90" y1="216" x2="128" y2="215" />
              <line x1="87" y1="198" x2="127" y2="205" />
              <line x1="86" y1="180" x2="126" y2="195" />
              <line x1="87" y1="162" x2="127" y2="185" />
              <line x1="90" y1="144" x2="130" y2="175" />
              <line x1="95" y1="127" x2="134" y2="165" />
              <line x1="102" y1="111" x2="139" y2="156" />
              <line x1="111" y1="95" x2="146" y2="147" />
              <line x1="122" y1="81" x2="154" y2="139" />
              <line x1="135" y1="68" x2="163" y2="132" />
              <line x1="149" y1="57" x2="174" y2="126" />
              <line x1="165" y1="48" x2="186" y2="122" />
              <line x1="182" y1="42" x2="200" y2="120" />
            </g>
            
            {/* 中央の太陽ディスク */}
            <circle 
              cx="200" 
              cy="200" 
              r="70" 
              fill="url(#fallbackSunGradient)"
              stroke="#e9ecef"
              strokeWidth="2"
            />
            
            {/* 水面の波線 */}
            <g stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.7">
              <path d="M120 280 Q140 275 160 280 Q180 285 200 280 Q220 275 240 280 Q260 285 280 280"/>
              <path d="M130 295 Q150 290 170 295 Q190 300 210 295 Q230 290 250 295 Q270 300 270 295"/>
              <path d="M140 310 Q160 305 180 310 Q200 315 220 310 Q240 305 260 310"/>
              <path d="M150 325 Q170 320 190 325 Q210 330 230 325 Q250 320 250 325"/>
            </g>
            
            {/* SOLVISテキスト */}
            <text 
              x="200" 
              y="210" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="#6b7280"
              fontSize="28"
              fontWeight="bold"
              letterSpacing="3"
              fontFamily="Arial, sans-serif"
            >
              SOLVIS
            </text>
          </svg>
        </div>
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