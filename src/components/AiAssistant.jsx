import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader } from 'lucide-react';
import { sendAiMessage } from '../services/api';

export default function AiAssistant({ selectedRegionData, selectedHazard, initialPrompt }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to TerraSignal. Select a region on the map and ask me about hazard risk, environmental factors, or what drives the risk score.', provider: 'System' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = React.useCallback(async (text = null) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    if (!text) setInput('');
    setLoading(true);
    try {
      const context = selectedRegionData ? {
        region_name: selectedRegionData.location?.region_name,
        country: selectedRegionData.location?.country,
        hazard: selectedHazard,
        risk_score_display: selectedRegionData.risk_score_display || selectedRegionData.overall_risk_score_display,
        risk_level: selectedRegionData.risk_level || selectedRegionData.overall_risk_level,
        environmental_factors: selectedRegionData.environmental_factors,
        data_source: selectedRegionData.data_source,
      } : { selected_hazard: selectedHazard };

      const res = await sendAiMessage(q, selectedHazard, selectedRegionData?.location?.region_id, context);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply, provider: res.provider }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection failed. Make sure the backend is running on port 8000.', provider: 'Error' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, selectedHazard, selectedRegionData]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => handleSend(initialPrompt), 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, handleSend]);

  const quickPrompts = [
    'Why is this area at risk?',
    'Key contributing factors?',
    'What does the score mean?',
    'Seasonal risk patterns?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Bot size={16} color="#2563eb" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>AI Risk Assistant</span>
        </div>
        <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontFamily: 'monospace', fontWeight: 700 }}>
          CONTEXT-AWARE
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '90%', padding: '9px 12px', borderRadius: '8px',
              background: msg.role === 'user'
                ? '#eff6ff'
                : '#ffffff',
              border: msg.role === 'user'
                ? '1px solid #bfdbfe'
                : '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '12px', lineHeight: '1.55', whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            {msg.provider && (
              <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px', fontFamily: 'monospace' }}>
                {msg.provider}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#2563eb', fontSize: '11px' }}>
            <Loader size={13} className="animate-pulse-slow" />
            Analysing…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '5px', background: '#ffffff', flexShrink: 0 }}>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#475569', cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about this region's risk…"
          disabled={loading}
          style={{
            flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '6px', padding: '8px 12px', color: '#0f172a',
            fontSize: '12px', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? '#f1f5f9' : '#2563eb',
            border: 'none', borderRadius: '6px',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: loading || !input.trim() ? '#94a3b8' : '#ffffff',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
