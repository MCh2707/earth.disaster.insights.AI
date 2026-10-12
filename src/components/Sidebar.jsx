import React from 'react';
import { Droplets, Mountain, Flame, Layers } from 'lucide-react';

const hazards = [
  { id: 'multi',     label: 'Multi-Hazard', sub: 'Composite score',    Icon: Layers,   color: '#2563eb' },
  { id: 'flood',     label: 'Flood',        sub: 'Precipitation risk',  Icon: Droplets, color: '#0ea5e9' },
  { id: 'landslide', label: 'Landslide',    sub: 'Terrain & moisture',  Icon: Mountain, color: '#f59e0b' },
  { id: 'wildfire',  label: 'Wildfire',     sub: 'Dryness & heat',      Icon: Flame,    color: '#ef4444' },
];

export default function Sidebar({ selectedHazard, onSelectHazard, onOpenDataStatus, onOpenDisclaimer }) {
  return (
    <aside style={{
      width: '200px',
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      padding: '16px 0',
    }}>
      {/* Section label */}
      <div style={{ padding: '0 16px 10px', fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', color: '#94a3b8', textTransform: 'uppercase' }}>
        Hazard Layer
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px' }}>
        {hazards.map(({ id, label, sub, Icon, color }) => {
          const active = selectedHazard === id;
          return (
            <button
              key={id}
              onClick={() => onSelectHazard(id)}
              style={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: active ? '#ffffff' : 'transparent',
                border: active ? '1px solid #e2e8f0' : '1px solid transparent',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                background: active ? color : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}>
                <Icon size={15} color={active ? '#ffffff' : '#94a3b8'} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: active ? '#0f172a' : '#475569' }}>{label}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>{sub}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: '#e2e8f0', margin: '16px 16px' }} />

      {/* Risk legend */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
          Risk Scale
        </div>
        {[
          { color: '#10b981', label: 'Low',      range: '0–24' },
          { color: '#eab308', label: 'Medium',   range: '25–49' },
          { color: '#f97316', label: 'Elevated', range: '50–74' },
          { color: '#ef4444', label: 'High',     range: '75–100' },
        ].map(({ color, label, range }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{label}</span>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace', marginLeft: 'auto' }}>{range}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer links */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button onClick={onOpenDataStatus} style={linkBtn}>Data source status</button>
        <button onClick={onOpenDisclaimer} style={linkBtn}>Scientific disclaimer</button>
      </div>
    </aside>
  );
}

const linkBtn = {
  all: 'unset', fontSize: '11px', color: '#64748b', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '5px',
  transition: 'color 0.15s',
};
