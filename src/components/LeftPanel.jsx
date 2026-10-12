import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Box, 
  Users, 
  Activity, 
  FileText, 
  Shield, 
  Settings,
  MapPin
} from 'lucide-react';

export default function LeftPanel({
  selectedRegion,
  onOpenDataStatus,
  onOpenMetrics,
  onOpenDisclaimer,
}) {
  const [activeDockTab, setActiveDockTab] = useState('activity');

  // Extract selected region values or intuitive defaults
  const locationName = selectedRegion?.name || selectedRegion?.properties?.region_name || 'Global Active Composite';
  const country = selectedRegion?.country || selectedRegion?.properties?.country || 'Multinational';
  const riskScore = selectedRegion?.riskScore || (selectedRegion?.properties?.risk_score_display ? (selectedRegion.properties.risk_score_display / 10).toFixed(1) : '8.2');
  const riskLevel = selectedRegion?.riskLevel || selectedRegion?.properties?.risk_level || 'SEVERE';
  const disasterType = selectedRegion?.disasterType || selectedRegion?.hazard || 'Earthquake';
  const factors = selectedRegion?.factors || selectedRegion?.properties?.environmental_factors || {
    slope: '22°',
    precipitation: '18 mm/d',
    soilMoisture: '34%',
    temperature: '24°C',
    faultProximity: '3.2 km'
  };

  // Sparkline points derived from region's historical trend
  const trendPoints = selectedRegion?.trend || [6.2, 6.8, 7.4, 7.9, 8.2, 8.5, parseFloat(riskScore) || 8.2];
  
  // Calculate SVG path from trend points
  const minVal = 0;
  const maxVal = 10;
  const width = 280;
  const height = 48;
  const stepX = width / (trendPoints.length - 1);
  
  const pathD = trendPoints.map((val, idx) => {
    const x = idx * stepX;
    const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 10) - 5;
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  // Color logic based on score:
  // Green: Safe / Low (0 - 2.4)
  // Yellow: Moderate (2.5 - 4.9)
  // Orange: High (5.0 - 7.4)
  // Red: Severe (7.5 - 10.0)
  const numericScore = parseFloat(riskScore);
  const riskColor = numericScore >= 7.5 ? '#ef4444' : numericScore >= 5.0 ? '#f97316' : numericScore >= 2.5 ? '#eab308' : '#10b981';

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 25,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '320px',
      pointerEvents: 'none',
    }}>
      {/* 1. Top Icon Dock */}
      <div style={{
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        borderRadius: '16px',
        padding: '5px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}>
        {[
          { id: 'grid', Icon: LayoutGrid, title: 'Overview' },
          { id: 'box', Icon: Box, title: '3D Layers' },
          { id: 'users', Icon: Users, title: 'Collaboration' },
          { id: 'activity', Icon: Activity, title: 'Risk Index' },
          { id: 'file', Icon: FileText, title: 'Reports' },
          { id: 'shield', Icon: Shield, title: 'Compliance' },
          { id: 'settings', Icon: Settings, title: 'Settings' },
        ].map(({ id, Icon, title }) => {
          const isActive = activeDockTab === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActiveDockTab(id);
                if (id === 'settings') onOpenDataStatus?.();
                if (id === 'shield') onOpenDisclaimer?.();
                if (id === 'file') onOpenMetrics?.();
              }}
              title={title}
              style={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>

      {/* 2. Card 1: DYNAMIC RISK INDEX CARD */}
      <div style={{
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        borderRadius: '18px',
        padding: '16px 18px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 4px 10px -2px rgba(0,0,0,0.03)',
      }}>
        {/* Dynamic Location Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <MapPin size={13} color={riskColor} style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {locationName}
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '4px',
            background: `${riskColor}18`,
            color: riskColor,
            border: `1px solid ${riskColor}40`,
            fontFamily: 'monospace',
            flexShrink: 0,
          }}>
            {riskLevel}
          </span>
        </div>

        {/* Dynamic Risk Index Score */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
            RISK INDEX:
          </h2>
          <span style={{ fontSize: '20px', fontWeight: 900, color: riskColor, letterSpacing: '-0.3px' }}>
            {riskScore}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
            / 10
          </span>
        </div>

        {/* Dynamic Subtitle */}
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
          {country} · {disasterType.toUpperCase()} TREND (30 DAYS)
        </div>

        {/* Dynamic Sparkline Chart */}
        <div style={{ position: 'relative', width: '100%', height: '48px', marginBottom: '8px' }}>
          <svg viewBox="0 0 280 48" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="dynamicRiskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={riskColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={riskColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#dynamicRiskGrad)" />
            <path d={pathD} fill="none" stroke={riskColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
            <span>Day -30</span>
            <span>Day -15</span>
            <span>Current Telemetry</span>
          </div>
        </div>

        {/* Dynamic Environmental Contributing Factors */}
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', marginTop: '10px' }}>
          KEY RISK FACTORS ({disasterType.toUpperCase()})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {factors.slope && (
            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>Slope Gradient</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>{factors.slope}</div>
            </div>
          )}
          {factors.precipitation && (
            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>Precipitation</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>{factors.precipitation}</div>
            </div>
          )}
          {factors.soilMoisture && (
            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>Soil Saturation</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>{factors.soilMoisture}</div>
            </div>
          )}
          {factors.temperature && (
            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>Temperature</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', fontFamily: 'monospace' }}>{factors.temperature}</div>
            </div>
          )}
          {factors.faultProximity && factors.faultProximity !== 'N/A' && (
            <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>Fault Line Proximity</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', fontFamily: 'monospace' }}>{factors.faultProximity}</div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Card 2: Active Predictions */}
      <div style={{
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        borderRadius: '18px',
        padding: '12px 18px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 4px 10px -2px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            ACTIVE PREDICTIONS
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
            {country}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            background: '#1e293b',
            color: '#ffffff',
            padding: '3px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
          }}>
            {numericScore >= 8.0 ? '14' : numericScore >= 6.0 ? '8' : '3'}
          </div>

          <div style={{ width: '100%', position: 'relative', height: '12px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '2px', position: 'relative' }}>
              <div style={{ width: `${Math.min(100, numericScore * 10)}%`, height: '100%', background: riskColor, borderRadius: '2px' }} />
            </div>
            <div style={{
              position: 'absolute',
              left: `${Math.min(100, numericScore * 10)}%`,
              transform: 'translateX(-50%)',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: riskColor,
              boxShadow: `0 0 0 3px ${riskColor}33`,
            }} />
          </div>
        </div>
      </div>

      {/* 4. Card 3: Model Confidence */}
      <div style={{
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        borderRadius: '18px',
        padding: '12px 16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 4px 10px -2px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            MODEL CONFIDENCE
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
            calibrated
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { label: 'Seismic', pct: 92, color: '#ea580c' },
            { label: 'Hydrological', pct: 88, color: '#0284c7' },
            { label: 'Atmospheric', pct: 95, color: '#16a34a' },
          ].map(({ label, pct, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '34px', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 64 36" style={{ width: '60px', height: '34px' }}>
                  <path
                    d="M 6 34 A 26 26 0 0 1 58 34"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 6 34 A 26 26 0 0 1 58 34"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="82"
                    strokeDashoffset={82 - (82 * (pct / 100))}
                  />
                </svg>
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#334155', marginTop: '1px', textAlign: 'center' }}>
                {label}
              </div>
              <div style={{ fontSize: '9px', fontWeight: 600, color: color, fontFamily: 'monospace' }}>
                ({pct}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
