import React from 'react';

export default function About({ onNavigateToWhySamsung, onBack }) {
  const career = [
    {
      year: '2007.03',
      title: '삼성전자서비스 입사',
      desc: '가전의 기초부터 사후 관리까지 기술적인 토대를 쌓았습니다.',
      icon: '🔧'
    },
    {
      year: '2008.03',
      title: '삼성전자판매 입사 (울산)',
      desc: '울산에서 가전 전문가로서의 첫 걸음을 시작했습니다.',
      icon: '🚀'
    },
    {
      year: '2012.04 ~ 2021.04',
      title: '부점장 (10년 근무)',
      desc: '매장 운영 총괄 및 고객 상담 최전선에서 수천 건의 가전 구매를 함께했습니다.',
      icon: '🏦'
    },
    {
      year: '2016 ~ 2019',
      title: '울산지역 사내강사',
      desc: '삼성전자판매 직원들을 대상으로 제품 교육 및 고객 응대 기법을 강의했습니다.',
      icon: '📚'
    },
    {
      year: '2018',
      title: 'CS명장 수상',
      desc: '고객만족도를 기반으로 선발되는 최고 영예의 CS명장을 수상했습니다.',
      icon: '🏆'
    },
    {
      year: '2021',
      title: '혼수견적서 시스템 개발',
      desc: '고객님들께 더 직관적이고 실질적인 혜택을 제안할 수 있는 시스템을 구축했습니다.',
      icon: '💻'
    },
    {
      year: '2026.04',
      title: '진주 통합점 합류',
      desc: '전국 최초 백화점·로드샵 통합매장에서 고객님께 가장 이로운 혜택을 드리고 있습니다.',
      icon: '🌟'
    },
  ];

  return (
    <section className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {onBack && (
        <button onClick={onBack} className="btn-back">
          <span>←</span> 이전으로 돌아가기
        </button>
      )}

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 600, letterSpacing: '2px', marginBottom: '0.75rem', fontSize: '0.9rem' }}>ABOUT JCC</p>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
          17년의 진심이 만든<br />
          <span className="text-gradient">가전 전문가, 조준석</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8, wordBreak: 'keep-all' }}>
          단순히 제품을 파는 것이 아닌, 고객의 라이프스타일에 맞는 최적의 솔루션을 제안합니다.
          삼성맨으로서 17년, 여러분의 현명한 선택을 도와드리겠습니다.
        </p>
      </div>

      {/* 버튼 섹션 (서브 페이지 링크) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={onNavigateToWhySamsung}
          className="btn-primary pulse" 
        >
          <span>💡</span>
          <span>왜 삼성인가요? 핵심 이유 확인하기</span>
          <span>→</span>
        </button>
      </div>

      {/* 왜 삼성인가요? (영상 갤러리) */}
      <div style={{ marginBottom: '5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-gold)' }}>
          🎞️ 왜 삼성인가요? (영상으로 보기)
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {[
            { id: 'D9rgFRrK_Bw', title: '삼성 AI 가전 1', url: 'https://youtu.be/D9rgFRrK_Bw?si=2-4gLvnkX089BOe9' },
            { id: 'eyKZ0sKpZK4', title: '삼성 AI 가전 2', url: 'https://youtu.be/eyKZ0sKpZK4?si=uqexYUr-LAVHlG2w' },
            { id: 'wlB0MAocZAg', title: '삼성 AI 가전 3', url: 'https://youtu.be/wlB0MAocZAg?si=ZRfgp16Rr80r-ycE' },
            { id: 'V_9Z1q5dDxk', title: '삼성 AI 가전 4', url: 'https://youtu.be/V_9Z1q5dDxk?si=Ajb2qB6M8qWvLsKF' },
            { id: 'pVIYIYe_Cl4', title: '삼성 AI 가전 5', url: 'https://youtu.be/pVIYIYe_Cl4?si=NzYviICqJ7XH7ZSp' },
            { id: '0xZgFIsBcGg', title: '삼성 AI 가전 6', url: 'https://youtu.be/0xZgFIsBcGg?si=CQKUzaen_Ax1yKDY' },
          ].map((video, idx) => (
            <a 
              key={idx} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-panel"
              style={{ 
                padding: '0.5rem', 
                textDecoration: 'none', 
                color: 'inherit',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 116, 228, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                  alt={video.title}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                  }}
                />
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                  background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem',
                    paddingLeft: '4px'
                  }}>▶</div>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                영상 {idx + 1} 확인하기
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* 프로필 + 캐리어 타임라인 */}
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* 왼쪽: 프로필 카드 */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '260px', maxWidth: '320px', textAlign: 'center', borderTop: '4px solid var(--accent-blue)' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem',
            overflow: 'hidden', border: '3px solid var(--accent-gold)',
            boxShadow: '0 8px 24px rgba(197, 160, 89, 0.3)'
          }}>
            <img 
              src="/images/profile.jpg" 
              alt="조준석 매니저" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>조준석</h3>
          <p style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '1px' }}>
            진센조
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            {[
              { label: '경력', value: '17년+' },
              { label: '출신', value: '울산' },
              { label: '현재', value: '경남 진주' },
              { label: '삼성 경력', value: '2007년~현재' },
              { label: '전문분야', value: '혼수·이사·입주 가전' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 타임라인 */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>CAREER TIMELINE</h3>
          <div style={{ position: 'relative' }}>
            {/* 타임라인 수직선 */}
            <div style={{
              position: 'absolute', left: '20px', top: '0', bottom: '0',
              width: '2px', background: 'linear-gradient(to bottom, var(--accent-blue), var(--accent-purple))'
            }}></div>

            {career.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', position: 'relative' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-color)', border: '2px solid var(--accent-blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', zIndex: 1
                }}>
                  {item.icon}
                </div>
                <div className="glass-panel" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '1px' }}>{item.year}</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, wordBreak: 'keep-all' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 진주로 온 이유 스토리 */}
      <div className="glass-panel" style={{ margin: '3rem 0', borderLeft: '4px solid var(--accent-blue)', borderRadius: '12px', padding: '2rem 2rem 2rem 2.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-blue)' }}>Why Jinju? 진주를 선택한 이유</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, wordBreak: 'keep-all', fontSize: '1.05rem' }}>
          저는 태어나고 자라며 오래 일해온 <strong style={{ color: 'var(--text-primary)' }}>울산 사람입니다.</strong><br />
          2007년부터 삼성에서만 17년간 꾸준히 경력을 쌓아온 끝,<br />
          <strong style={{ color: 'var(--text-primary)' }}>2026년 4월</strong>, 저는 진주를 선택했습니다.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, wordBreak: 'keep-all', fontSize: '1.05rem', marginTop: '1rem' }}>
          그 이유는 단 하나입니다 —<br />
          경남 진주에 자리잡은 <strong style={{ color: 'var(--text-primary)' }}>전국 최초 통합매장</strong>은,<br />
          <strong style={{ color: 'var(--text-primary)' }}>백화점과 로드샵</strong>의 정책과 혜택을 한 곳에서 한 번에 제공하는 곳으로,<br />
          고객께 <strong style={{ color: 'var(--text-primary)' }}>가장 유리한 조건과 최대의 혜택</strong>을 드릴 수 있는 유일한 공간이기 때문입니다.<br />
          오랜 터전인 울산을 떠나 진주로 온 만큼, 여러분께 있는 힘껏 유리하고 성실하게 상담해 드리겠습니다.
        </p>
      </div>

      {/* 하단 강조 문구 */}
      <div className="glass-panel" style={{ marginTop: '3rem', textAlign: 'center', borderTop: '4px solid var(--accent-purple)', padding: '2.5rem' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.9, wordBreak: 'keep-all', color: 'var(--text-secondary)' }}>
          "저는 <strong style={{ color: 'var(--text-primary)' }}>고객이 만족할 때까지</strong> 옆에 있겠습니다.<br />
          경남 진주 <strong style={{ color: 'var(--text-primary)' }}>전국 최초 통합매장</strong>에서,<br />
          백화점과 로드샵의 모든 혜택을 한번에 누리세요."
        </p>
        <p style={{ marginTop: '1rem', color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '1px' }}>— 조준석 (JCC)</p>
      </div>
    </section>
  );
}
