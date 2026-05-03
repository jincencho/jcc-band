import React, { useState } from 'react';
import Hero from './components/Hero';
import Reservation from './components/Reservation';
import AdminSchedule from './components/AdminSchedule';
import About from './components/About';
import WhySamsung from './components/WhySamsung';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'reservation', 'about', 'why-samsung'
  return (
    <div className="app-container">
      {/* Navigation Bar (Simple Mock) */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div 
          onClick={() => setCurrentView('home')}
          style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px', cursor: 'pointer' }}
        >
          <span className="text-gradient">JCC</span>
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
