import React from 'react';

export default function DisclaimerModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px 28px', width: '460px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Legal</div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>Scientific Disclaimer</h2>

        {[
          { title: 'Research Prototype Only', text: 'TerraSignal is a NASA Space Apps Challenge prototype for research and demonstration purposes only. It should NOT be used for emergency planning, disaster response, or life-safety decisions.' },
          { title: 'AI-Generated Risk Estimates', text: 'Risk scores are produced by machine learning models trained on a synthetic, physics-calibrated dataset. They are not validated by meteorological or geological authorities.' },
          { title: 'Data Sources', text: 'The platform uses NASA POWER and EONET APIs when available. A deterministic demo dataset is used as fallback when live sources are unavailable.' },
          { title: 'No Warranty', text: 'The developers make no representations about the accuracy, completeness, or fitness for any particular purpose of the information provided.' },
        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{title}</div>
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}

        <button onClick={onClose} style={{ width: '100%', marginTop: '8px', padding: '9px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
          I understand — Close
        </button>
      </div>
    </div>
  );
}
