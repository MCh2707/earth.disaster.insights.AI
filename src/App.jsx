import React, { useState } from 'react';
import BrowserBar from './components/BrowserBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import BottomNav from './components/BottomNav';
import MiniMapInset from './components/MiniMapInset';
import MapViewer from './components/MapViewer';
import DisasterFilters from './components/DisasterFilters';
import ModelMetricsModal from './components/ModelMetricsModal';
import DataStatusModal from './components/DataStatusModal';
import DisclaimerModal from './components/DisclaimerModal';
import { GLOBAL_DISASTERS } from './data/disasters';

export default function App() {
  // Disaster filter checkboxes state (Requirement 2)
  const [activeDisasters, setActiveDisasters] = useState({
    earthquake: true,
    flood: true,
    fire: true,
    landslide: true,
  });

  // Risk layer toggle state - default FALSE (Requirement 1: no fixed red blur by default)
  const [showRiskLayers, setShowRiskLayers] = useState(false);

  // Selected region - dynamically drives LeftPanel and AI context (Requirement 3)
  const [selectedRegion, setSelectedRegion] = useState(GLOBAL_DISASTERS[0]); // Defaults to first active hotspot

  // Right panel view mode: 'feed' or 'ai'
  const [rightPanelViewMode, setRightPanelViewMode] = useState('feed');

  // Modals
  const [showMetrics, setShowMetrics] = useState(false);
  const [showDataStatus, setShowDataStatus] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleToggleDisaster = (type) => {
    setActiveDisasters(prev => {
      const next = { ...prev, [type]: !prev[type] };
      // Ensure at least one type remains active
      const hasAny = Object.values(next).some(Boolean);
      return hasAny ? next : prev;
    });
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#cbd5e1',
      padding: '0',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Browser Window Mockup Frame */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.25)',
      }}>
        {/* Top Browser Bar (earthwatch.ai) */}
        <BrowserBar
          dataStatus={{ active_data_source: 'NASA Earthdata — LIVE' }}
          onOpenMetrics={() => setShowMetrics(true)}
          onOpenDataStatus={() => setShowDataStatus(true)}
          onOpenDisclaimer={() => setShowDisclaimer(true)}
        />

        {/* Main Stage */}
        <div style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          height: 'calc(100% - 46px)',
          overflow: 'hidden',
        }}>
          {/* Base Map Stage with clean 2D terrain (Voyager) */}
          <MapViewer
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            showRiskLayers={showRiskLayers}
            activeDisasters={activeDisasters}
          />

          {/* Disaster Type Filter Toggles (Requirement 2) */}
          <DisasterFilters
            activeDisasters={activeDisasters}
            onToggleDisaster={handleToggleDisaster}
          />

          {/* Left Panel: Dynamic Risk Index & Factor Breakdown (Requirement 3 & 4) */}
          <LeftPanel
            selectedRegion={selectedRegion}
            onOpenDataStatus={() => setShowDataStatus(true)}
            onOpenMetrics={() => setShowMetrics(true)}
            onOpenDisclaimer={() => setShowDisclaimer(true)}
          />

          {/* Right Panel: Prediction Feed & AI Copilot with offline-resilient reasoning */}
          <RightPanel
            selectedRegion={selectedRegion}
            activeDisasters={activeDisasters}
            onSelectPrediction={handleSelectRegion}
            viewMode={rightPanelViewMode}
            onChangeViewMode={setRightPanelViewMode}
          />

          {/* Bottom Navigation: Risk Layers toggle, Model Performance Metrics, AI Chat (Requirement 1 & 4) */}
          <BottomNav
            showRiskLayers={showRiskLayers}
            onToggleRiskLayers={() => {
              setShowRiskLayers(prev => {
                const next = !prev;
                showToast(next ? 'Risk Layer activated: Global color-coded risk assessment overlay enabled.' : 'Risk Layer hidden: Base topographical view active.');
                return next;
              });
            }}
            onOpenMetrics={() => setShowMetrics(true)}
            onToggleAiChat={() => setRightPanelViewMode(prev => prev === 'ai' ? 'feed' : 'ai')}
            aiChatOpen={rightPanelViewMode === 'ai'}
          />

          {/* Bottom Right Mini-Map Inset with country filters */}
          <MiniMapInset
            onFocusRegion={(reg) => {
              const match = GLOBAL_DISASTERS.find(d => d.id === 'eq-rome-naples') || reg;
              setSelectedRegion(match);
            }}
            onSelectCountry={(country) => {
              const matchedDisaster = GLOBAL_DISASTERS.find(d => d.country.toLowerCase() === country.toLowerCase());
              if (matchedDisaster) {
                setSelectedRegion(matchedDisaster);
                showToast(`Focused on active telemetry for ${country}: ${matchedDisaster.name}`);
              } else {
                showToast(`Filtered seismic & thermal hazard layers for ${country}`);
              }
            }}
          />

          {/* Toast Notification */}
          {toastMessage && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              background: '#0f172a',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.2s ease-out',
            }}>
              {toastMessage}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showMetrics && (
        <ModelMetricsModal
          onClose={() => setShowMetrics(false)}
        />
      )}
      {showDataStatus && (
        <DataStatusModal
          dataStatus={{ active_data_source: 'NASA Earthdata — LIVE' }}
          onClose={() => setShowDataStatus(false)}
        />
      )}
      {showDisclaimer && (
        <DisclaimerModal
          onClose={() => setShowDisclaimer(false)}
        />
      )}
    </div>
  );
}
