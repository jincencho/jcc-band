import React from 'react';

export default function WhySamsung({ onBack }) {
  const points = [
    {
      title: '압도적인 서비스 네트워크',
      desc: '전국 어디서나 24시간 이내 방문 가능한 서비스망을 갖추고 있습니다. 구매 후 관리가 더 중요한 가전제품에서 삼성의 서비스는 고객님의 평온한 일상을 보장합니다.',
      icon: '🛠️'
    },
    {
      title: '스마트한 초연결 경험 (SmartThings)',
      desc: '가전이 단순히 도구를 넘어 서로 연결되어 에너지를 절감하고, 사용자 동선에 맞춰 알아서 작동하는 맞춤형 라이프스타일을 제공합니다.',
      icon: '📱'
    },
    {
      title: '고객 중심의 기술 혁신',
      desc: '비스포크 냉장고의 맞춤형 디자인부터 무풍 에어컨의 쾌적함까지, 삼성은 기술력을 자랑하기보다 고객의 불편함을 해결하는 혁신에 집중합니다.',
      icon: '💡'
    },
    {
      title: '지속 가능한 내일',
      desc: 'AI 절약 모드를 통한 압도적인 에너지 효율성으로 전기료 부담은 줄이고 환경은 보호하는 스마트한 소비를 가능하게 합니다.',
      icon: '🌍'
    }
  ];

  return (
    <section className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem', maxWidth: '900px', margin: '0 auto' }}>
      {onBack && (
        <button onClick={onBack} className="btn-back">
          <span>←</span> 이전으로 돌아가기
        </button>
      )}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '2px', marginBottom: '0.75rem', fontSize: '0.9rem' }}>WHY SAMSUNG?</p>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2, wordBreak: 'keep-all' }}>
          일반 가전이 필요하시다면<br />
          <span style={{ color: 'var(--text-secondary)', fontSize: '2rem' }}>다른 브랜드를 선택하셔도 좋습니다.</span>
        </h2>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '1.5rem 3rem', border: '1px solid var(--accent-gold)', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.4rem', fontWeight: 600, lineHeight: 1.5, wordBreak: 'keep-all' }}>
            나의 일상에 편리함과 삶의 가치를 높여줄 가전은<br />
            <span className="text-gradient" style={{ fontSize: '1.8rem' }}>AI 가전 = 삼성</span> 밖에 없습니다.
          </p>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
          단순한 도구를 넘어 당신의 삶을 이해하는 똑똑한 동반자,<br />
          17년 가전 전문가 조준석이 삼성 AI 가전을 확신하는 이유입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {points.map((point, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{point.icon}</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>{point.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{point.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ marginTop: '4rem', textAlign: 'center', borderTop: '4px solid var(--accent-gold)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>전문가와 상담하세요</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          삼성 가전의 진정한 가치는 라이프스타일에 맞는 최적의 배치와 구성에서 완성됩니다.<br />
          17년 경력의 JCC가 직접 도와드리겠습니다.
        </p>
        {/* Note: In a real app, this would use a navigation function passed via props */}
        <p style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>상담 예약 메뉴에서 조준석을 찾아주세요.</p>
      </div>
    </section>
  );
}
