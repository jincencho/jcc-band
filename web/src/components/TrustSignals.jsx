import React from 'react';

export default function TrustSignals() {
  const stats = [
    { label: '글로벌 파트너', value: '150+' },
    { label: '서비스 가동률', value: '99.9%' },
    { label: '데이터 암호화', value: 'AES-256' },
    { label: '고객 만족도', value: '4.9/5' }
  ];

  return (
    <section className="container" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>숫자로 증명하는 신뢰</h2>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ textAlign: 'center', minWidth: '150px' }}>
            <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500, letterSpacing: '1px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
