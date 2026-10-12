import React from 'react';
import { Mountain, Droplets, Flame, Activity } from 'lucide-react';

const DISASTER_TYPES = [
  { id: 'earthquake', label: 'Earthquake', icon: Activity, color: '#ef4444', count: 7 },
  { id: 'flood',      label: 'Flood',      icon: Droplets, color: '#0284c7', count: 6 },
  { id: 'fire',       label: 'Fire',       icon: Flame,    color: '#ea580c', count: 5 },
  { id: 'landslide',  label: 'Landslide',  icon: Mountain, color: '#f59e0b', count: 5 },
];

export default function DisasterFilters({ activeDisasters, onToggleDisaster }) {
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '350px',
      zIndex: 25,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.85)',
      borderRadius: '9999px',
      padding: '4px 8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      userSelect: 'none',
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.6px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        padding: '0 6px',
      }}>
        Hazards:
      </span>

      {DISASTER_TYPES.map(({ id, label, icon: Icon, color }) => {
        const isActive = !!activeDisasters[id];
        return (
          <button
            key={id}
            onClick={() => onToggleDisaster(id)}
            style={{
              all: 'unset',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 11px',
              borderRadius: '9999px',
              cursor: 'pointer',
              background: isActive ? `${color}16` : '#f8fafc',
              border: isActive ? `1.5px solid ${color}` : '1.5px solid #e2e8f0',
              color: isActive ? color : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: isActive ? color : 'transparent',
              border: `1.5px solid ${isActive ? color : '#94a3b8'}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {isActive && (
                <span style={{ width: '4px', height: '4px', background: '#ffffff', borderRadius: '1px' }} />
              )}
            </span>
            <Icon size={12} color={isActive ? color : '#94a3b8'} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
