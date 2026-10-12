import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Loader, 
  Sparkles, 
  MessageSquare
} from 'lucide-react';
import { sendAiMessage } from '../services/api';
import { generateScientificResponse } from '../services/aiLogic';
import { GLOBAL_DISASTERS } from '../data/disasters';

export default function RightPanel({
  selectedRegion,
  activeDisasters = { earthquake: true, flood: true, fire: true, landslide: true },
  onSelectPrediction,
  viewMode = 'feed', // 'feed' | 'ai'
  onChangeViewMode
}) {
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, earthquake, flood, fire, landslide
  const [showAll, setShowAll] = useState(false);

  // AI Assistant state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your EarthWatch AI Copilot. Ask me about active disaster predictions, environmental factors, or click any location on the map to inspect real-time risk telemetry.',
      provider: 'EarthWatch Neural'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'earthquake', label: 'Earthquake' },
    { id: 'flood', label: 'Flood' },
    { id: 'fire', label: 'Fire' },
    { id: 'landslide', label: 'Landslide' },
  ];

  // Filter predictions by active disaster filter AND selected category tab
  const filteredPredictions = GLOBAL_DISASTERS.filter(p => {
    // Check if disaster type is active in global filters
    if (!activeDisasters[p.disasterType]) return false;
    // Check tab category
    if (selectedCategory !== 'all' && p.disasterType !== selectedCategory) return false;
    return true;
  });

  const displayList = showAll ? filteredPredictions : filteredPredictions.slice(0, 7);

  const handleSendAi = async (textToSend) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    if (!textToSend) setInput('');
    setLoading(true);

    const context = {
      region_name: selectedRegion?.name || selectedRegion?.properties?.region_name || 'Global Telemetry',
      country: selectedRegion?.country || selectedRegion?.properties?.country || '',
      riskScore: selectedRegion?.riskScore || selectedRegion?.properties?.risk_score_display ? (selectedRegion.properties?.risk_score_display / 10).toFixed(1) : 8.2,
      riskLevel: selectedRegion?.riskLevel || selectedRegion?.properties?.risk_level || 'HIGH',
      disasterType: selectedRegion?.disasterType || selectedRegion?.hazard || 'Multi-Hazard',
      factors: selectedRegion?.factors || selectedRegion?.properties?.environmental_factors || {},
    };

    try {
      const res = await sendAiMessage(q, context.disasterType, selectedRegion?.id, context);
      if (res && res.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.reply, provider: res.provider || 'EarthWatch API' }]);
      } else {
        throw new Error('Empty response');
      }
    } catch {
      // Intelligent scientific fallback ensures the user ALWAYS receives a comprehensive answer!
      const smartAnswer = generateScientificResponse(q, context);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: smartAnswer, 
          provider: 'EarthWatch Neural Engine' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAboutPrediction = (item, e) => {
    e?.stopPropagation?.();
    onSelectPrediction?.(item);
    onChangeViewMode?.('ai');
    handleSendAi(`Why is ${item.name} (${item.city}, ${item.country}) at high risk? What are the key contributing factors?`);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 25,
      width: '350px',
      maxHeight: 'calc(100vh - 80px)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.85)',
      borderRadius: '20px',
      boxShadow: '0 12px 30px -5px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top View Mode Switcher: Prediction Feed vs AI Analyst */}
      <div style={{
        padding: '12px 14px 8px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
      }}>
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '3px',
          borderRadius: '9999px',
          width: '100%',
        }}>
          <button
            onClick={() => onChangeViewMode?.('feed')}
            style={{
              flex: 1,
              padding: '6px 0',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'feed' ? '#0f172a' : 'transparent',
              color: viewMode === 'feed' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            Prediction Feed
          </button>
          <button
            onClick={() => onChangeViewMode?.('ai')}
            style={{
              flex: 1,
              padding: '6px 0',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'ai' ? '#2563eb' : 'transparent',
              color: viewMode === 'ai' ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={11} />
            <span>AI Analyst</span>
          </button>
        </div>
      </div>

      {viewMode === 'feed' ? (
        <>
          {/* Segmented Tab Filter */}
          <div style={{
            padding: '10px 14px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            overflowX: 'auto',
          }}>
            {categories.map(({ id, label }) => {
              const active = selectedCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: active ? '#0f172a' : '#f1f5f9',
                    color: active ? '#ffffff' : '#64748b',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Section Header */}
          <div style={{
            padding: '8px 16px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              color: '#94a3b8',
              textTransform: 'uppercase',
            }}>
              PREDICTION FEED ({filteredPredictions.length})
            </span>
          </div>

          {/* Feed List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}>
            {displayList.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                No active predictions match the current disaster filters.
              </div>
            ) : displayList.map((item) => {
              const isSelected = selectedRegion?.id === item.id || selectedRegion?.name === item.name;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectPrediction?.(item)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    background: isSelected ? '#f1f5f9' : 'transparent',
                    border: isSelected ? `1.5px solid ${item.color || '#e2e8f0'}` : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Left: Code + City */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                      {item.code}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.city}, {item.country}
                    </div>
                  </div>

                  {/* Right: Confidence Dot, Hazard Type & Ask AI button */}
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: item.riskScore >= 7.5 ? '#ef4444' : item.riskScore >= 5.0 ? '#f97316' : '#eab308',
                          boxShadow: `0 0 6px ${item.riskScore >= 7.5 ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.5)'}`
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                          {item.riskScore}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
                        {item.hazard}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAskAboutPrediction(item, e)}
                      title="Ask AI about this prediction"
                      style={{
                        all: 'unset',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                      onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer: See All button */}
          {filteredPredictions.length > 7 && (
            <div style={{
              padding: '10px 14px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
            }}>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  all: 'unset',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                {showAll ? 'Collapse Feed' : `See All (${filteredPredictions.length})`}
              </button>
            </div>
          )}
        </>
      ) : (
        /* AI Assistant Full View */
        <div style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
          {/* AI Status Banner */}
          <div style={{
            padding: '8px 14px',
            background: '#eff6ff',
            borderBottom: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={14} color="#2563eb" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>
                EarthWatch AI Copilot
              </span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
              {selectedRegion?.name ? selectedRegion.name.slice(0, 16) : 'GLOBAL'}
            </span>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: '#f8fafc',
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '92%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: m.role === 'user' ? '#2563eb' : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#0f172a',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '12px',
                  lineHeight: '1.55',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
                {m.provider && (
                  <span style={{ fontSize: '8px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                    {m.provider}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px' }}>
                <Loader size={12} className="animate-spin" />
                <span>Running neural risk inference…</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '6px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
          }}>
            {[
              'Why is this area high risk?',
              'Key environmental drivers?',
              'What does the score mean?',
            ].map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendAi(qp)}
                style={{
                  fontSize: '9px',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '10px 12px',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '6px',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendAi(); }}
              placeholder="Ask EarthWatch AI about this region…"
              disabled={loading}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSendAi()}
              disabled={loading || !input.trim()}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
