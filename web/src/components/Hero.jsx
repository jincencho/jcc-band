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
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            혼수 · 이사 · 입주 전문가,<br />
            <span className="text-gradient">JCC (진센조)</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '1rem', fontWeight: 300, wordBreak: 'keep-all', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)', letterSpacing: '1px', fontSize: '0.95rem' }}>JINJU CENTUM CHOJUNSEOK</strong>
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '2.5rem', fontWeight: 300, wordBreak: 'keep-all', lineHeight: 1.9 }}>
            경남 진주에 <strong style={{ color: 'var(--text-primary)' }}>전국 최초 통합매장</strong>을 운영 중입니다.<br />
            <strong style={{ color: 'var(--text-primary)' }}>백화점</strong>과 <strong style={{ color: 'var(--text-primary)' }}>로드샵</strong>의 정책을<br />
            <strong style={{ color: 'var(--text-primary)' }}>한 곳에서 한 번에</strong> 이용하세요.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onNavigateToReservation}>상담예약 신청하기</button>
            <button className="glass-panel" onClick={onNavigateToAbout} style={{ padding: '0.75rem 1.5rem', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
              더 알아보기
            </button>
            <button className="glass-panel" onClick={handleShare} style={{ padding: '0.75rem 1.5rem', background: 'rgba(59, 130, 246, 0.1)', cursor: 'pointer', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', fontWeight: 600 }}>
              공유하기 🔗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
