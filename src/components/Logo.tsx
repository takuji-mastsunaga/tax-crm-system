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

  // 提供されたSOLVISロゴのBase64データ（太陽と水面のデザイン）
  const solvisLogoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJTT0xWSVMiPgo8IS0tIOS4u+imgeeahOaUvuWwhOe6uyAtLT4KPHN0cm9rZT0iIzYwYTVmYSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CjwhLS0g5Li76KaB55qE5pS+5bCE57q7IC0tPgo8bGluZSB4MT0iNTAiIHkxPSI1IiB4Mj0iNTAiIHkyPSIxNSIvPgo8bGluZSB4MT0iNTAiIHkxPSI4NSIgeDI9IjUwIiB5Mj0iOTUiLz4KPGxpbmUgeDE9IjUiIHkxPSI1MCIgeDI9IjE1IiB5Mj0iNTAiLz4KPGxpbmUgeDE9Ijg1IiB5MT0iNTAiIHgyPSI5NSIgeTI9IjUwIi8+CjwhLS0g5pa35ZCR55qE5pS+5bCE57q7IC0tPgo8bGluZSB4MT0iMjEuNyIgeTE9IjIxLjciIHgyPSIyOC44IiB5Mj0iMjguOCIvPgo8bGluZSB4MT0iNzEuMyIgeTE9IjcxLjMiIHgyPSI3OC4zIiB5Mj0iNzguMyIvPgo8bGluZSB4MT0iNzguMyIgeTE9IjIxLjciIHgyPSI3MS4zIiB5Mj0iMjguOCIvPgo8bGluZSB4MT0iMjguOCIgeTE9IjcxLjMiIHgyPSIyMS43IiB5Mj0iNzguMyIvPgo8IS0tIOS4remdtOeahOaUvuWwhOe6uyAtLT4KPHN0cm9rZSB4MT0iMzguNCIgeTE9IjExLjYiIHgyPSI0Mi4zIiB5Mj0iMjEuOCIvPgo8bGluZSB4MT0iNjEuNiIgeTE9IjExLjYiIHgyPSI1Ny43IiB5Mj0iMjEuOCIvPgo8bGluZSB4MT0iMzguNCIgeTE9Ijg4LjQiIHgyPSI0Mi4zIiB5Mj0iNzguMiIvPgo8bGluZSB4MT0iNjEuNiIgeTE9Ijg4LjQiIHgyPSI1Ny43IiB5Mj0iNzguMiIvPgo8bGluZSB4MT0iMTEuNiIgeTE9IjM4LjQiIHgyPSIyMS44IiB5Mj0iNDIuMyIvPgo8bGluZSB4MT0iMTEuNiIgeTE9IjYxLjYiIHgyPSIyMS44IiB5Mj0iNTcuNyIvPgo8bGluZSB4MT0iODguNCIgeTE9IjM4LjQiIHgyPSI3OC4yIiB5Mj0iNDIuMyIvPgo8bGluZSB4MT0iODguNCIgeTE9IjYxLjYiIHgyPSI3OC4yIiB5Mj0iNTcuNyIvPgo8L2c+CjwhLS0g5Lit5aSu55qE5aSq6Ziz6JOY55uY77yI5rC06Z2i5LmY6KGo546w77yJIC0tPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0idXJsKCNsb2dvR3JhZGllbnQpIiBvcGFjaXR5PSIwLjkiLz4KCjwhLS0g5rC06Z2i55qE5rOi57q/IC0tPgo8ZyBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjgiPgo8cGF0aCBkPSJNMzIgNTUgUTM3IDUyIDQyIDU1IFE0NyA1OCA1MiA1NSBRNTcgNTIgNjIgNTUgUTY3IDU4IDY4IDU1Ii8+CjxwYXRoIGQ9Ik0zNCA2MCBRMzkgNTcgNDQgNjAgUTQ5IDYzIDU0IDYwIFE1OSA1NyA2NCA2MCBRNjYgNjIgNjYgNjAiLz4KPHN0cm9rZSBkPSJNMzYgNjUgUTQxIDYyIDQ2IDY1IFE1MSA2OCA1NiA2NSBRNjEgNjIgNjQgNjUiLz4KPC9nPgoKPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0ibG9nb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNiODJmNjtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MGE1ZmE7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzkzYzVmZDtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgoKPCEtLSBTT0xWSVMg44OG44Kt44K544OIICgtLT4KPHN0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBsZXR0ZXItc3BhY2luZz0iMSI+U09MVklTPC90ZXh0Pgo8L3N2Zz4K';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SOLVISロゴアイコン - 提供された画像デザインを使用 */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10`}>
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"></div>
        
        {/* SOLVISロゴ画像 */}
        <img
          src={solvisLogoBase64}
          alt="SOLVIS Tax Accounting Logo"
          className="relative z-10 w-full h-full object-contain p-1"
          style={{ filter: variant === 'light' ? 'brightness(1.1)' : 'brightness(0.9)' }}
        />
        
        {/* フォールバックSVG（画像が読み込まれない場合） */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full p-2" 
            fill="none"
          >
            {/* 太陽の放射線 */}
            <g stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9">
              {/* 主要な放射線 */}
              <line x1="50" y1="10" x2="50" y2="20" />
              <line x1="50" y1="80" x2="50" y2="90" />
              <line x1="10" y1="50" x2="20" y2="50" />
              <line x1="80" y1="50" x2="90" y2="50" />
              
              {/* 斜めの放射線 */}
              <line x1="25.9" y1="25.9" x2="32.3" y2="32.3" />
              <line x1="67.7" y1="67.7" x2="74.1" y2="74.1" />
              <line x1="74.1" y1="25.9" x2="67.7" y2="32.3" />
              <line x1="32.3" y1="67.7" x2="25.9" y2="74.1" />
              
              {/* 中間の放射線 */}
              <line x1="38.4" y1="15.7" x2="42.3" y2="23.2" />
              <line x1="61.6" y1="15.7" x2="57.7" y2="23.2" />
              <line x1="38.4" y1="84.3" x2="42.3" y2="76.8" />
              <line x1="61.6" y1="84.3" x2="57.7" y2="76.8" />
              <line x1="15.7" y1="38.4" x2="23.2" y2="42.3" />
              <line x1="15.7" y1="61.6" x2="23.2" y2="57.7" />
              <line x1="84.3" y1="38.4" x2="76.8" y2="42.3" />
              <line x1="84.3" y1="61.6" x2="76.8" y2="57.7" />
            </g>
            
            {/* 中央の太陽ディスク */}
            <circle 
              cx="50" 
              cy="50" 
              r="18" 
              fill="white" 
              opacity="0.95"
            />
            
            {/* 水面の波線 */}
            <g stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.8">
              <path d="M34 54 Q39 51 44 54 Q49 57 54 54 Q59 51 64 54 Q66 55 66 54"/>
              <path d="M36 58 Q41 55 46 58 Q51 61 56 58 Q61 55 64 58"/>
              <path d="M38 62 Q43 59 48 62 Q53 65 58 62 Q60 61 60 62"/>
            </g>
            
            {/* SOLVIS テキスト */}
            <text 
              x="50" 
              y="50" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="#3b82f6"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="1"
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