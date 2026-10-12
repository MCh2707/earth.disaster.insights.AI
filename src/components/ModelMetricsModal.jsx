import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';

export default function ModelMetricsModal({ onClose }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelMetrics().then(setMetrics).catch(() => setMetrics(null)).finally(() => setLoading(false));
  }, []);

  const hazards = [
    { key: 'flood',     label: 'Flood',     color: '#0ea5e9' },
    { key: 'landslide', label: 'Landslide',  color: '#f59e0b' },
    { key: 'wildfire',  label: 'Wildfire',   color: '#ef4444' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px 28px', width: '440px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Machine Learning</div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>Model Performance Metrics</h2>

        {loading ? <p style={{ color: '#64748b', fontSize: '13px' }}>Loading…</p> : !metrics ? <p style={{ color: '#ef4444', fontSize: '13px' }}>Could not load metrics.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {hazards.map(({ key, label, color }) => {
              const m = metrics[key] || {};
              const r2 = (m.r2_score ?? m.r2 ?? 0);
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color }}>R² {(r2 * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${r2 * 100}%`, height: '100%', background: color, opacity: 0.7, borderRadius: '3px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {[['MAE', (m.mae ?? 0).toFixed(4)], ['RMSE', (m.rmse ?? 0).toFixed(4)], ['Trees', '100']].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{k}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#475569' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: '1px', background: '#f1f5f9', marginTop: '14px' }} />
                </div>
              );
            })}
          </div>
        )}
        <button onClick={onClose} style={{ width: '100%', marginTop: '16px', padding: '9px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}
