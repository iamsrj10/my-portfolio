// src/component/ToolCard.jsx
import React, { useState } from 'react';
import ThreeCube from './ThreeCube';

/**
 * ToolCard (overlay style)
 * - shows label + subtitle always
 * - on hover/focus/touch, a Three.js cube overlays the tile
 * - label remains visible (on top) as caption using z-index
 */
export default function ToolCard({
  short = 'VS',
  title = 'Visual Studio Code',
  subtitle = 'Editor',
  size = 220,
  faces = null,
}) {
  const [hover, setHover] = useState(false);

  // Prepare face texts for cube (6 faces)
  const faceTexts = faces && faces.length === 6 ? faces : [
    `${short} — ${title}`,      // front
    `${title}`,                 // back
    `${short} • ${subtitle}`,   // right
    `${subtitle}`,              // left
    `${short}`,                 // top
    `${title}`,                 // bottom
  ];

  return (
    <div
      className="relative p-4 rounded-lg bg-slate-900/70 border border-slate-700 overflow-visible"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      role="button"
      tabIndex={0}
      aria-label={title}
      style={{ minHeight: `${size + 80}px` }}
    >
      {/* -- Visible label area: always shown, on top of cube (z-20) */}
      <div className="relative z-20 text-center pointer-events-none">
        <div className="text-3xl font-bold text-slate-100">{short}</div>
        <div className="mt-3 text-slate-400">{title}</div>
      </div>

      {/* -- Cube overlay (absolute) */}
      <div
        className={`absolute inset-4 transition-all duration-300 flex items-center justify-center ${hover ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ height: `${size}px` }}
        aria-hidden={!hover}
      >
        {/* Slight backdrop to make cube stand out */}
        <div className="absolute inset-0 rounded-lg bg-black/20 backdrop-blur-sm pointer-events-none" />
        <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}>
          <ThreeCube size={size} playing={hover} faceTexts={faceTexts} options={{ fontColor:'#fff', bgColor:'rgba(6,18,36,0.12)', fontSize:72 }} />
        </div>
      </div>
    </div>
  );
}
