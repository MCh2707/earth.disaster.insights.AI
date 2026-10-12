import React from 'react';

export default function DataStatusModal({ dataStatus, onClose }) {
  if (!dataStatus) return null;
  const isLive = dataStatus.active_data_source?.includes('LIVE');
  const checks = [
    { label: 'NASA POWER API',   ok: dataStatus.nasa_power_available },
    { label: 'NASA EONET API',   ok: dataStatus.nasa_eonet_available },
    { label: 'ML Models Loaded', ok: dataStatus.ml_models_loaded },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px 28px', width: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Data Source</div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Connection Status</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: isLive ? '#f0fdf4' : '#fffbeb', border: `1px solid ${isLive ? '#86efac' : '#fcd34d'}`, borderRadius: '8px', marginBottom: '16px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLive ? '#22c55e' : '#f59e0b', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: isLive ? '#16a34a' : '#b45309' }}>{isLive ? 'NASA Live Data Connected' : 'Demo Fallback Active'}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{dataStatus.active_data_source}</div>
          </div>
        </div>

        {checks.map(({ label, ok }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>{label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: ok ? '#16a34a' : '#dc2626', background: ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`, borderRadius: '4px', padding: '2px 8px' }}>
              {ok ? '✓ Online' : '✗ Offline'}
            </span>
          </div>
        ))}

        <button onClick={onClose} style={{ width: '100%', marginTop: '16px', padding: '9px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}
