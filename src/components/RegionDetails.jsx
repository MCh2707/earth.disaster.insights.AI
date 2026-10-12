import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';

const RISK_COLORS = {
  LOW:      '#10b981',
  MEDIUM:   '#eab308',
  ELEVATED: '#f97316',
  HIGH:     '#ef4444',
};

export default function RegionDetails({ regionData, onAskAi, _selectedHazard }) {
  if (!regionData) {
    return (
      <div style={{ padding: '20px 16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px 0', textAlign: 'center' }}>
          <MapPin size={22} color="#cbd5e1" />
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Select a region on the map</span>
        </div>
      </div>
    );
  }

  const loc     = regionData.location || {};
  const factors = regionData.environmental_factors || {};
  const score   = regionData.risk_score_display ?? regionData.overall_risk_score_display ?? 50;
  const level   = regionData.risk_level || regionData.overall_risk_level || 'MEDIUM';
  const source  = regionData.data_source || 'DEMO';
  const color   = RISK_COLORS[level] || '#64748b';

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px' }}>
      {/* Region header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            {loc.region_name || 'Selected Location'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <MapPin size={10} color="#2563eb" />
            <span>{loc.country} · {loc.latitude?.toFixed(2)}°, {loc.longitude?.toFixed(2)}°</span>
          </div>
        </div>
        <span style={{
          background: `${color}18`, border: `1px solid ${color}60`,
          color: color, padding: '3px 8px', borderRadius: '4px',
          fontSize: '11px', fontWeight: 800, fontFamily: 'monospace',
        }}>
          {level}
        </span>
      </div>

      {/* Risk score bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
          <span>Risk Score</span>
          <span style={{ fontWeight: 700, color, fontFamily: 'monospace' }}>{score} / 100</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Env metrics */}
      <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
        Environmental Metrics
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
        {[
          { label: 'Precipitation', value: `${factors.precipitation_mm_day ?? '–'} mm/d` },
          { label: 'Soil Moisture',  value: `${factors.soil_moisture_pct ?? '–'}%` },
          { label: 'Temperature',    value: `${factors.temperature_c ?? '–'} °C` },
          { label: 'Slope / Elev.',  value: `${factors.slope_deg ?? '–'}° / ${factors.elevation_m ?? '–'}m` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{label}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace', marginTop: '2px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Data source */}
      <div style={{ fontSize: '10px', color: source.includes('LIVE') ? '#16a34a' : '#b45309', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
        {source}
      </div>

      {/* Ask AI button */}
      <button
        onClick={() => onAskAi(regionData)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          padding: '9px', borderRadius: '8px',
          background: '#2563eb', border: 'none',
          color: '#ffffff', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <Sparkles size={14} />
        Ask AI about this area
      </button>
    </div>
  );
}
