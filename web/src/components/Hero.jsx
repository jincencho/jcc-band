import React from 'react';
import '../index.css';
import Reservation from './Reservation';

export default function Hero({ onNavigateToReservation, onNavigateToAbout }) {
  const handleShare = () => {
    const shareData = {
      title: 'JCC (진센조) - 가전 전문가 조준석',
      text: '혼수·이사·입주 가전 전문가 조준석입니다. 백화점과 로드샵의 혜택을 한 곳에서 확인하세요!',
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('홈페이지 주소가 복사되었습니다. 필요하신 곳에 붙여넣기 하세요!');
    }
  };

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(11,15,25,0) 70%)',
        borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(11,15,25,0) 70%)',
        borderRadius: '50%', zIndex: -1
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Image */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/images/진센조 메인사진.png" 
            alt="진센조 메인사진" 
            style={{ width: '100%', maxWidth: '500px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
          />
        </div>

        {/* Right Side: Text */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2, wordBreak: 'keep-all' }}>
            결국 가전은 진주에서<br />
            <span className="text-gradient">완벽하게 졸업했다</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '1rem', fontWeight: 300, wordBreak: 'keep-all', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)', letterSpacing: '1px', fontSize: '0.95rem' }}>JINJU CENTUM CHOJUNSEOK</strong>
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '2.5rem', fontWeight: 300, wordBreak: 'keep-all', lineHeight: 1.9 }}>
            이곳저곳 비교하며 쌓인 피로를 덜어드립니다.<br />
            경남 진주 <strong style={{ color: 'var(--text-primary)' }}>전국 최초 통합매장</strong>에서<br />
            백화점과 로드샵의 혜택을 <strong style={{ color: 'var(--text-primary)' }}>한 번에 종결하세요.</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn-primary pulse" onClick={onNavigateToReservation} style={{ flex: 1, minWidth: '200px' }}>
              지금 바로 상담예약 📅
            </button>
            <button className="btn-secondary" onClick={onNavigateToAbout} style={{ flex: 1, minWidth: '200px' }}>
              조준석 약력 확인하기 🔍
            </button>
            <button className="glass-panel" onClick={handleShare} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'rgba(197, 160, 89, 0.05)', color: 'var(--accent-gold-light)', border: '1px dashed var(--accent-gold)', fontSize: '0.9rem' }}>
              주변에 공유하기 🔗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
