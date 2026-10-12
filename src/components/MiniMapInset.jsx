import React, { useState } from 'react';
import { SlidersHorizontal, Maximize2 } from 'lucide-react';

export default function MiniMapInset({ onFocusRegion, selectedCountry = 'Italy', onSelectCountry }) {
  const [activeCountry, setActiveCountry] = useState(selectedCountry);
  const countries = ['Italy', 'France', 'Germany', 'Spain'];

  const handleCountryClick = (c) => {
    setActiveCountry(c);
    onSelectCountry?.(c);
  };

  const handleFocusRome = () => {
    onFocusRegion?.({
      name: 'Rome-Naples Risk Zone',
      id: 'rome_naples',
      country: 'Italy',
      latitude: 40.85,
      longitude: 14.26,
    });
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '18px',
      right: '18px',
      zIndex: 25,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      {/* 1. Country Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        borderRadius: '9999px',
        padding: '3px 6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ padding: '2px 6px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
          <SlidersHorizontal size={11} />
        </div>
        {countries.map(c => {
          const isActive = activeCountry === c;
          return (
            <button
              key={c}
              onClick={() => handleCountryClick(c)}
              style={{
                all: 'unset',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                background: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* 2. Mini-Map Hazard Card: Rome-Naples Risk Zone */}
      <div
        onClick={handleFocusRome}
        style={{
          width: '210px',
          height: '110px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.16)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        }}
        title="Click to zoom to Rome-Naples hazard zone"
      >
        {/* Background Visual: Topo coastline & Thermal Hazard Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#7bc1e6', // Mediterranean Sea tone
          overflow: 'hidden',
        }}>
          {/* Italian Peninsula outline silhouette */}
          <svg
            viewBox="0 0 200 100"
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            preserveAspectRatio="none"
          >
            {/* Landmass polygon */}
            <path
              d="M 20 0 L 180 0 L 190 30 Q 150 45, 120 70 Q 100 85, 70 95 L 60 100 L 0 100 L 0 0 Z"
              fill="#d9e6c3" // Soft topographical terrain color
            />
            {/* Coastline accent */}
            <path
              d="M 190 30 Q 150 45, 120 70 Q 100 85, 70 95"
              fill="none"
              stroke="#b5c99a"
              strokeWidth="2"
            />
          </svg>

          {/* Thermal Hazard Heatmap Contour Band */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '25%',
            width: '120px',
            height: '48px',
            borderRadius: '9999px',
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.9) 0%, rgba(245,158,11,0.85) 40%, rgba(16,185,129,0.7) 70%, rgba(59,130,246,0) 100%)',
            filter: 'blur(4px)',
            transform: 'rotate(-25deg)',
          }} />

          {/* Detailed Contour Lines */}
          <svg
            viewBox="0 0 200 100"
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            preserveAspectRatio="none"
          >
            <path
              d="M 50 40 Q 90 20, 140 28 Q 160 38, 170 50"
              fill="none"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.8"
            />
            <path
              d="M 60 50 Q 95 32, 130 38 Q 148 48, 155 58"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.8"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Top-Right Expand Icon Button */}
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '20px',
          height: '20px',
          borderRadius: '5px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#334155',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <Maximize2 size={10} />
        </div>

        {/* Bottom Label Badge */}
        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '8px',
          right: '8px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '3px 8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#dc2626', fontFamily: 'monospace' }}>
            #EQ-99201
          </div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Rome-Naples Risk Zone
          </div>
        </div>
      </div>
    </div>
  );
}
