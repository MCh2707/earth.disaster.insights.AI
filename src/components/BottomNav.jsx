import React from 'react';
import { Layers, BarChart3, Bot } from 'lucide-react';

export default function BottomNav({ 
  showRiskLayers, 
  onToggleRiskLayers, 
  onOpenMetrics, 
  onToggleAiChat,
  aiChatOpen 
}) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '22px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 25,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.85)',
      borderRadius: '9999px',
      padding: '4px 6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      userSelect: 'none',
    }}>
      {}
      <button
        onClick={onToggleRiskLayers}
        style={{
          all: 'unset',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          background: showRiskLayers ? '#0f172a' : '#f8fafc',
          border: showRiskLayers ? '1px solid #0f172a' : '1px solid #e2e8f0',
          color: showRiskLayers ? '#ffffff' : '#475569',
          fontSize: '11px',
          fontWeight: 700,
          transition: 'all 0.15s ease',
        }}
      >
        <Layers size={13} color={showRiskLayers ? '#38bdf8' : '#64748b'} />
        <span>Risk Layers</span>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: showRiskLayers ? '#22c55e' : '#cbd5e1',
          boxShadow: showRiskLayers ? '0 0 6px #22c55e' : 'none',
        }} />
      </button>

      {}
      <button
        onClick={onOpenMetrics}
        style={{
          all: 'unset',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#475569',
          fontSize: '11px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
      >
        <BarChart3 size={13} color="#64748b" />
        <span>Model Performance Metrics</span>
      </button>

      {}
      <button
        onClick={onToggleAiChat}
        style={{
          all: 'unset',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          background: aiChatOpen ? '#eff6ff' : '#f8fafc',
          border: aiChatOpen ? '1px solid #3b82f6' : '1px solid #e2e8f0',
          color: aiChatOpen ? '#1d4ed8' : '#475569',
          fontSize: '11px',
          fontWeight: 700,
          transition: 'all 0.15s ease',
        }}
      >
        <Bot size={13} color={aiChatOpen ? '#2563eb' : '#64748b'} />
        <span>AI Chat</span>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#10b981',
        }} />
      </button>
    </div>
  );
}
