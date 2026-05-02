import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap size={32} color="var(--accent-blue)" />,
      title: '초고속 퍼포먼스',
      description: '최신 웹 기술을 적용하여 지연 없는 매끄러운 사용자 경험을 제공합니다.'
    },
    {
      icon: <Shield size={32} color="var(--accent-purple)" />,
      title: '강력한 보안',
      description: '엔터프라이즈급 보안 아키텍처로 고객의 데이터를 안전하게 보호합니다.'
    },
    {
      icon: <Sparkles size={32} color="#f59e0b" />,
      title: '미래 지향적 디자인',
      description: '트렌드를 선도하는 UI/UX로 브랜드의 가치를 시각적으로 극대화합니다.'
    }
  ];

  return (
    <section className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem' }}>핵심 가치</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>우리가 제공하는 차원이 다른 차별점</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300 }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
