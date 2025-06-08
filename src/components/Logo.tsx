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
      {/* SOLVISロゴアイコン - 完全にインラインSVG実装 */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-lg overflow-hidden bg-white shadow-lg border border-gray-100`}>
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 白い背景 */}
          <rect width="400" height="400" fill="white"/>
          
          <defs>
            {/* 中央の円のグラデーション */}
            <radialGradient id={`sunGrad-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="1" />
              <stop offset="30%" stopColor="#f5f5f5" stopOpacity="1" />
              <stop offset="100%" stopColor="#e5e5e5" stopOpacity="1" />
            </radialGradient>
            
            {/* 水面のグラデーション */}
            <linearGradient id={`waterGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* 太陽の放射線 - 提供された画像に完全準拠 */}
          <g stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
            {/* 上方向の放射線群 */}
            <line x1="200" y1="35" x2="200" y2="75" />
            <line x1="215" y1="37" x2="212" y2="77" />
            <line x1="230" y1="42" x2="223" y2="80" />
            <line x1="244" y1="49" x2="233" y2="85" />
            <line x1="257" y1="58" x2="242" y2="92" />
            <line x1="268" y1="69" x2="250" y2="100" />
            <line x1="278" y1="81" x2="257" y2="109" />
            <line x1="287" y1="94" x2="263" y2="119" />
            
            {/* 右方向の放射線群 */}
            <line x1="295" y1="108" x2="269" y2="128" />
            <line x1="301" y1="123" x2="274" y2="138" />
            <line x1="306" y1="138" x2="278" y2="148" />
            <line x1="309" y1="154" x2="281" y2="158" />
            <line x1="311" y1="170" x2="283" y2="168" />
            <line x1="312" y1="186" x2="284" y2="178" />
            <line x1="311" y1="202" x2="283" y2="188" />
            <line x1="309" y1="218" x2="281" y2="198" />
            
            {/* 下方向の放射線群 */}
            <line x1="306" y1="234" x2="278" y2="208" />
            <line x1="301" y1="249" x2="274" y2="218" />
            <line x1="295" y1="264" x2="269" y2="228" />
            <line x1="287" y1="278" x2="263" y2="237" />
            <line x1="278" y1="291" x2="257" y2="247" />
            <line x1="268" y1="303" x2="250" y2="256" />
            <line x1="257" y1="314" x2="242" y2="264" />
            <line x1="244" y1="323" x2="233" y2="271" />
            
            {/* 下方向の放射線群（続き） */}
            <line x1="230" y1="330" x2="223" y2="276" />
            <line x1="215" y1="335" x2="212" y2="279" />
            <line x1="200" y1="337" x2="200" y2="281" />
            <line x1="185" y1="335" x2="188" y2="279" />
            <line x1="170" y1="330" x2="177" y2="276" />
            <line x1="156" y1="323" x2="167" y2="271" />
            <line x1="143" y1="314" x2="158" y2="264" />
            <line x1="132" y1="303" x2="150" y2="256" />
            
            {/* 左方向の放射線群 */}
            <line x1="122" y1="291" x2="143" y2="247" />
            <line x1="113" y1="278" x2="137" y2="237" />
            <line x1="105" y1="264" x2="131" y2="228" />
            <line x1="99" y1="249" x2="126" y2="218" />
            <line x1="94" y1="234" x2="122" y2="208" />
            <line x1="91" y1="218" x2="119" y2="198" />
            <line x1="89" y1="202" x2="117" y2="188" />
            <line x1="88" y1="186" x2="116" y2="178" />
            
            {/* 左方向の放射線群（続き） */}
            <line x1="89" y1="170" x2="117" y2="168" />
            <line x1="91" y1="154" x2="119" y2="158" />
            <line x1="94" y1="138" x2="122" y2="148" />
            <line x1="99" y1="123" x2="126" y2="138" />
            <line x1="105" y1="108" x2="131" y2="128" />
            <line x1="113" y1="94" x2="137" y2="119" />
            <line x1="122" y1="81" x2="143" y2="109" />
            <line x1="132" y1="69" x2="150" y2="100" />
            <line x1="143" y1="58" x2="158" y2="92" />
            <line x1="156" y1="49" x2="167" y2="85" />
            <line x1="170" y1="42" x2="177" y2="80" />
            <line x1="185" y1="37" x2="188" y2="77" />
          </g>
          
          {/* 中央の太陽ディスク */}
          <circle 
            cx="200" 
            cy="200" 
            r="65" 
            fill={`url(#sunGrad-${size})`}
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          
          {/* 水面の波線 - 下部に美しく配置 */}
          <g stroke={`url(#waterGrad-${size})`} strokeWidth="2.5" fill="none" opacity="0.8">
            <path d="M110 285 Q130 280 150 285 Q170 290 190 285 Q210 280 230 285 Q250 290 270 285 Q290 280 310 285" />
            <path d="M120 300 Q140 295 160 300 Q180 305 200 300 Q220 295 240 300 Q260 305 280 300 Q300 295 300 300" />
            <path d="M130 315 Q150 310 170 315 Q190 320 210 315 Q230 310 250 315 Q270 320 290 315" />
            <path d="M140 330 Q160 325 180 330 Q200 335 220 330 Q240 325 260 330 Q280 335 280 330" />
            <path d="M150 345 Q170 340 190 345 Q210 350 230 345 Q250 340 270 345" />
          </g>
          
          {/* SOLVISテキスト - 中央に美しく配置 */}
          <text 
            x="200" 
            y="205" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="#64748b"
            fontSize="24"
            fontWeight="bold"
            letterSpacing="2.5"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            style={{ 
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))'
            }}
          >
            SOLVIS
          </text>
          
          {/* 微細なハイライト効果 */}
          <circle 
            cx="200" 
            cy="200" 
            r="65" 
            fill="none"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="1"
          />
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