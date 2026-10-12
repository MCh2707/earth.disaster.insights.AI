import React from 'react';
import { 
  Lock, 
  BarChart3, 
  Database, 
  ShieldCheck
} from 'lucide-react';

export default function BrowserBar({ 
  onOpenMetrics, 
  onOpenDataStatus, 
  onOpenDisclaimer,
  dataStatus 
}) {
  const isLive = dataStatus?.active_data_source?.includes('LIVE');

  return (
    <div style={{
      height: '46px',
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      flexShrink: 0,
      zIndex: 40,
      userSelect: 'none',
    }}>


      {/* Center: Address Bar Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '5px 18px',
        width: '360px',
        maxWidth: '40vw',
        fontSize: '12px',
        color: '#475569',
        fontWeight: 500,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <Lock size={12} color={isLive ? '#16a34a' : '#64748b'} />
        <span style={{ color: '#0f172a', fontWeight: 600, letterSpacing: '0.2px' }}>earthwatch.ai</span>

      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Additional Tools */}
        <button onClick={onOpenMetrics} title="ML Model Metrics" style={iconBtnStyle}>
          <BarChart3 size={15} />
        </button>
        <button onClick={onOpenDataStatus} title="Data Status" style={iconBtnStyle}>
          <Database size={15} />
        </button>
        <button onClick={onOpenDisclaimer} title="Scientific Disclaimer" style={iconBtnStyle}>
          <ShieldCheck size={15} />
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: '#64748b',
  transition: 'color 0.15s, background 0.15s',
};
