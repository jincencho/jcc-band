import React, { useState } from 'react';
import Hero from './components/Hero';
import Reservation from './components/Reservation';
import AdminSchedule from './components/AdminSchedule';
import About from './components/About';
import WhySamsung from './components/WhySamsung';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'reservation', 'about', 'why-samsung'

  // 페이지 이동 시 최상단으로 스크롤
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="app-container">
      {/* Navigation Bar (Simple Mock) */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div 
          onClick={() => setCurrentView('home')}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            lineHeight: 1
          }}
        >
          <div style={{ 
            fontFamily: "'Great Vibes', cursive", 
            fontSize: '2.5rem', 
            background: 'linear-gradient(to bottom, #f1d592 0%, #d4af37 50%, #b8860b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '-0.5rem',
            display: 'flex',
            alignItems: 'baseline'
          }}>
            <span style={{ fontSize: '3.5rem', marginRight: '-0.2rem' }}>J</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900, letterSpacing: '1px' }}>incencho</span>
          </div>
          <div style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontSize: '0.55rem', 
            letterSpacing: '2.5px', 
            color: 'var(--accent-gold)', 
            fontWeight: 600,
            textTransform: 'uppercase',
            opacity: 0.8,
            paddingLeft: '0.4rem'
          }}>
            Jinju Centum Chojunseok
          </div>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('home'); }} style={{ color: currentView === 'home' ? 'var(--text-primary)' : 'inherit', textDecoration: 'none' }}>홈</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }} style={{ color: currentView === 'about' || currentView === 'why-samsung' ? 'var(--text-primary)' : 'inherit', textDecoration: 'none' }}>더 알아보기</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('reservation'); }} style={{ color: currentView === 'reservation' ? 'var(--text-primary)' : 'inherit', textDecoration: 'none' }}>상담 예약</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('admin'); }} style={{ color: currentView === 'admin' ? 'var(--text-primary)' : 'inherit', textDecoration: 'none' }}>관리자</a>
        </div>
      </nav>

      <main>
        {currentView === 'home' && <Hero onNavigateToReservation={() => setCurrentView('reservation')} onNavigateToAbout={() => setCurrentView('about')} />}
        {currentView === 'about' && <About onNavigateToWhySamsung={() => setCurrentView('why-samsung')} onBack={() => setCurrentView('home')} />}
        {currentView === 'why-samsung' && <WhySamsung onBack={() => setCurrentView('about')} />}
        {currentView === 'reservation' && <Reservation onBack={() => setCurrentView('home')} />}
        {currentView === 'admin' && <AdminSchedule onBack={() => setCurrentView('home')} />}
      </main>

      <footer style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <p>&copy; 2026 JCC (JINJU CENTUM CHOJUNSEOK). All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
