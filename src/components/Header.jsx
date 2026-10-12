import React, { useState, useEffect } from 'react';
import { Globe, Radio, ShieldCheck, BarChart3, Database } from 'lucide-react';

export default function Header({ currentHazard, dataStatus, onOpenDataStatus, onOpenMetrics, onOpenDisclaimer }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isLive = dataStatus?.active_data_source?.includes('LIVE');
  const pad = n => String(n).padStart(2, '0');
  const utc = `${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())} UTC`;

  const hazardLabels = {
    flood: 'FLOOD RISK',
    landslide: 'LANDSLIDE RISK',
    wildfire: 'WILDFIRE RISK',
    multi: 'MULTI-HAZARD COMPOSITE',
  };

  return (
    <header style={{
      height: '52px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Globe size={20} color="#2563eb" />
        <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px', color: '#0f172a' }}>
          Terra<span style={{ color: '#2563eb' }}>Signal</span>
        </span>
        <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', color: '#64748b' }}>
          {hazardLabels[currentHazard] || 'EARTH RISK PLATFORM'}
        </span>
      </div>

      {/* Center: live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Radio size={12} color={isLive ? '#22c55e' : '#f59e0b'} className="animate-pulse-slow" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: isLive ? '#16a34a' : '#b45309' }}>
          {isLive ? 'NASA Earthdata — LIVE' : 'Demo Fallback Active'}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button onClick={onOpenDataStatus} style={btnStyle}>
          <Database size={13} />
          Data Status
        </button>
        <button onClick={onOpenMetrics} style={btnStyle}>
          <BarChart3 size={13} />
          ML Metrics
        </button>
        <button onClick={onOpenDisclaimer} style={btnStyle}>
          <ShieldCheck size={13} />
          Disclaimer
        </button>
        <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 4px' }} />
        <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
          {utc}
        </span>
      </div>
    </header>
  );
}

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: '5px',
  padding: '5px 10px', borderRadius: '6px',
  background: '#f8fafc', border: '1px solid #e2e8f0',
  color: '#475569', fontSize: '11px', fontWeight: 600,
  cursor: 'pointer',
};
