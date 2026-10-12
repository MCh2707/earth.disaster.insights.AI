import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { GLOBAL_DISASTERS, GLOBAL_RISK_REGIONS } from '../data/disasters';

const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY || 'cb1_4aqo_1_051da285a03438ead739eb6d';

// Clean topographical 2D styling (Voyager raster tiles)
const LIGHT_MAP_STYLE = {
  version: 8,
  sources: {
    'carto-light': {
      type: 'raster',
      tiles: [
        `https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
        `https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
        `https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
        `https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap © CARTO',
    }
  },
  layers: [{ id: 'carto-light-layer', type: 'raster', source: 'carto-light', minzoom: 0, maxzoom: 19 }]
};

// Build GeoJSON FeatureCollection for Risk Layers with Green, Yellow, Orange, Red color grading
const RISK_LAYER_GEOJSON = {
  type: 'FeatureCollection',
  features: GLOBAL_RISK_REGIONS.map((r, i) => ({
    type: 'Feature',
    id: `risk-region-${i}`,
    properties: {
      name: r.name,
      riskScore: r.riskScore,
      level: r.level,
      color: r.color,
    },
    geometry: {
      type: 'Point',
      coordinates: r.center
    }
  }))
};

export default function MapViewer({ 
  selectedRegion, 
  onSelectRegion,
  showRiskLayers = false,
  activeDisasters = { earthquake: true, flood: true, fire: true, landslide: true }
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectRegionRef = useRef(onSelectRegion);
  useEffect(() => { onSelectRegionRef.current = onSelectRegion; }, [onSelectRegion]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: LIGHT_MAP_STYLE,
      center: [20.0, 32.0],
      zoom: 2.5,
      minZoom: 1.5,
      maxZoom: 14,
    });

    map.on('load', () => {
      setMapLoaded(true);
      map.resize();

      // 1. Color-Coded Global Risk Layer
      // Green: Safe / Low Risk
      // Yellow: Moderate Risk
      // Orange: High Risk
      // Red: Severe / Critical Risk
      map.addSource('global-risk-source', {
        type: 'geojson',
        data: RISK_LAYER_GEOJSON
      });

      // Ambient blur halo layer
      map.addLayer({
        id: 'global-risk-halo',
        type: 'circle',
        source: 'global-risk-source',
        layout: {
          visibility: 'none', // Controlled by showRiskLayers
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            1, 60,
            3, 140,
            6, 260
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.38,
          'circle-blur': 0.9,
        }
      });

      // Core focused risk circle layer
      map.addLayer({
        id: 'global-risk-core',
        type: 'circle',
        source: 'global-risk-source',
        layout: {
          visibility: 'none',
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            1, 25,
            3, 65,
            6, 130
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.45,
          'circle-blur': 0.6,
        }
      });

      // Interactive click on risk zones
      map.on('click', 'global-risk-core', (e) => {
        if (e.features?.length > 0) {
          const props = e.features[0].properties;
          onSelectRegionRef.current?.({
            name: props.name,
            country: 'Risk Assessment Zone',
            riskScore: (props.riskScore / 10).toFixed(1),
            riskLevel: props.level,
            disasterType: 'Multi-Hazard',
            factors: {
              hazardLevel: props.level,
              score: props.riskScore,
            }
          });
        }
      });
    });

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);
    mapRef.current = map;
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
    };
  }, []);

  // Toggle Risk Layer visibility based strictly on showRiskLayers (Requirement 1)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const visibility = showRiskLayers ? 'visible' : 'none';
    if (mapRef.current.getLayer('global-risk-halo')) {
      mapRef.current.setLayoutProperty('global-risk-halo', 'visibility', visibility);
    }
    if (mapRef.current.getLayer('global-risk-core')) {
      mapRef.current.setLayoutProperty('global-risk-core', 'visibility', visibility);
    }
  }, [showRiskLayers, mapLoaded]);

  // Render & Filter Disaster Markers with STABLE Hitbox (Requirement 2 & 3)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Filter disasters based on activeDisasters toggle switches
    const visibleDisasters = GLOBAL_DISASTERS.filter(
      d => activeDisasters[d.disasterType]
    );

    visibleDisasters.forEach(pin => {
      // 1. Stable Outer Hitbox Container (Fixed size, no translate jitter, no scale jump)
      const hitContainer = document.createElement('div');
      hitContainer.style.cssText = `
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        user-select: none;
      `;

      // 2. Inner Visual Badge
      const badge = document.createElement('div');
      const isSelected = selectedRegion?.id === pin.id;
      
      badge.style.cssText = `
        width: 26px;
        height: 26px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isSelected ? `0 0 0 3px ${pin.color}, 0 6px 16px rgba(0,0,0,0.22)` : '0 2px 8px rgba(0,0,0,0.14)'};
        border: 1.5px solid ${isSelected ? pin.color : 'rgba(255,255,255,0.95)'};
        transition: box-shadow 0.15s ease, border-color 0.15s ease;
        pointer-events: none; /* Let container handle clicks cleanly */
      `;

      // Icon SVG inside badge based on disaster type
      let iconSvg = '';
      if (pin.disasterType === 'earthquake') {
        iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h5l2 8 5-16 2 8h6"/></svg>`;
      } else if (pin.disasterType === 'flood') {
        iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`;
      } else if (pin.disasterType === 'fire') {
        iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      } else {
        // Landslide (Mountain)
        iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
      }

      badge.innerHTML = iconSvg;
      hitContainer.appendChild(badge);

      // Stable mouse hover (no jumping or size jitter!)
      hitContainer.onmouseenter = () => {
        badge.style.boxShadow = `0 0 0 3px ${pin.color}40, 0 6px 16px rgba(0,0,0,0.22)`;
        badge.style.borderColor = pin.color;
        setHoveredPoint(pin);
      };

      hitContainer.onmouseleave = () => {
        if (selectedRegion?.id !== pin.id) {
          badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.14)';
          badge.style.borderColor = 'rgba(255,255,255,0.95)';
        }
        setHoveredPoint(null);
      };

      // Click immediately selects region and triggers dynamic updates
      hitContainer.onclick = (e) => {
        e.stopPropagation();
        onSelectRegion?.(pin);
      };

      const marker = new maplibregl.Marker({ element: hitContainer })
        .setLngLat([pin.lng, pin.lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, activeDisasters, selectedRegion, onSelectRegion]);

  // Fly to selected region smoothly
  useEffect(() => {
    if (!mapRef.current || !selectedRegion) return;
    const { lat, latitude, lng, longitude } = selectedRegion;
    const targetLat = lat ?? latitude;
    const targetLng = lng ?? longitude;
    if (targetLat && targetLng) {
      mapRef.current.flyTo({
        center: [targetLng, targetLat],
        zoom: 4.8,
        duration: 1400,
        essential: true,
      });
    }
  }, [selectedRegion]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#dcebf2' }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '12px',
          padding: '8px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
              {hoveredPoint.name}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              {hoveredPoint.city}, {hoveredPoint.country} · {hoveredPoint.hazard}
            </div>
          </div>
          <span style={{
            background: hoveredPoint.color || '#ef4444',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'monospace',
          }}>
            {hoveredPoint.riskScore}
          </span>
        </div>
      )}

      {/* Risk Layers Active Legend Pill */}
      {showRiskLayers && (
        <div style={{
          position: 'absolute',
          bottom: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(226, 232, 240, 0.85)',
          borderRadius: '9999px',
          padding: '5px 14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          fontSize: '10px',
          fontWeight: 700,
        }}>
          <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Layers:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: '#059669' }}>Safe</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} />
            <span style={{ color: '#b45309' }}>Moderate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }} />
            <span style={{ color: '#c2410c' }}>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ color: '#b91c1c' }}>Severe</span>
          </div>
        </div>
      )}

      {/* Quick Map Zoom Controls */}
      <div style={{
        position: 'absolute',
        bottom: '22px',
        left: '20px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '2px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          title="Zoom In"
          style={{ all: 'unset', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          title="Zoom Out"
          style={{ all: 'unset', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}
        >
          <ZoomOut size={14} />
        </button>
      </div>
    </div>
  );
}
