import React from 'react';

const RISK_COLORS = { LOW: '#10b981', MEDIUM: '#eab308', ELEVATED: '#f97316', HIGH: '#ef4444' };

function HazardBar({ label, score, level }) {
  const color = RISK_COLORS[level] || '#64748b';
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{label}</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}50`, borderRadius: '4px', padding: '1px 6px' }}>{level}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{score}</span>
        </div>
      </div>
      <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export default function MultiHazardView({ regionData, onClose }) {
  if (!regionData) return null;
  const loc = regionData.location || {};
  const hazards = regionData.hazard_breakdown || {};
  const overall = regionData.overall_risk_level || 'MEDIUM';
  const overallScore = regionData.overall_risk_score_display ?? 50;
  const overallColor = RISK_COLORS[overall] || '#64748b';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px 28px', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Multi-Hazard Breakdown</div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{loc.region_name}</h2>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '18px' }}>{loc.country}</p>

        {/* Overall */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: `${overallColor}10`, border: `1px solid ${overallColor}40`, borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 800, color: overallColor }}>{overallScore}</div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>composite</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: overallColor }}>{overall} RISK</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Weighted across all three hazard models.</div>
          </div>
        </div>

        {[['flood','Flood'],['landslide','Landslide'],['wildfire','Wildfire']].map(([key, label]) => {
          const h = hazards[key] || {};
          return <HazardBar key={key} label={label} score={h.risk_score_display ?? 0} level={h.risk_level || 'LOW'} />;
        })}

        <button onClick={onClose} style={{ width: '100%', marginTop: '12px', padding: '9px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}
