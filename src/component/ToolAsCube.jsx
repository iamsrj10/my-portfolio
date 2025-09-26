// src/component/ToolAsCube.jsx
import React, { useState } from 'react';
import ThreeCubeTile from './ThreeCubeTile';

export default function ToolAsCube({ short = 'VS', title = 'Visual Studio Code', size = 160 }) {
  const [hover, setHover] = useState(false);

  // prepare 6 face texts (customize per tool)
  const faces = [
    short,           // front
    title,           // back
    `${short} • Dev`,// right
    'Code',          // left
    'IDE',           // top
    'Tools'          // bottom
  ];

  return (
    <div
      className="relative p-4 rounded-lg bg-slate-900/70 border border-slate-700 flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      tabIndex={0}
      role="button"
      aria-label={`${title} tool`}
      style={{ minHeight: `${size + 80}px` }}
    >
      {/* Cube overlay (visible when hovered) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hover ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!hover}
      >
        <div style={{ width: `${size}px`, height: `${size}px` }}>
          <ThreeCubeTile size={size} playing={hover} faceTexts={faces} />
        </div>
      </div>

      {/* Default content (hidden when hovered) */}
      <div className={`text-center transition-opacity duration-200 ${hover ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-3xl font-bold text-slate-100">{short}</div>
        <div className="mt-3 text-slate-400">{title}</div>
      </div>
    </div>
  );
}
