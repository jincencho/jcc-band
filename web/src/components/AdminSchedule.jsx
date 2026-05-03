import React, { useState, useEffect } from 'react';

export default function AdminSchedule({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedData, setBlockedData] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('jcc_blocked_times_v2');
    if (saved) {
      setBlockedData(JSON.parse(saved));
    } else {
      // 마이그레이션 (이전 버전 데이터가 있다면)
      const oldSaved = localStorage.getItem('jcc_blocked_times');
      if (oldSaved) {
        const oldData = JSON.parse(oldSaved);
        const newData = {};
        for (const date in oldData) {
          newData[date] = { hours: oldData[date], reason: null };
        }
        setBlockedData(newData);
        localStorage.setItem('jcc_blocked_times_v2', JSON.stringify(newData));
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === '1207') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
      setPasswordInput('');
    }
  };

  const saveBlockedData = (newData) => {
    setBlockedData(newData);
    localStorage.setItem('jcc_blocked_times_v2', JSON.stringify(newData));
  };

  const toggleTimeBlock = (hour) => {
    if (!selectedDate) return alert('날짜를 먼저 선택해주세요.');
    
    const newData = { ...blockedData };
    if (!newData[selectedDate]) newData[selectedDate] = { hours: [], reason: null };
    
    // 만약 휴무/출장 등으로 전체 블록된 상태라면 사유를 초기화
    if (newData[selectedDate].reason) {
      newData[selectedDate].reason = null;
    }
    
    if (newData[selectedDate].hours.includes(hour)) {
      newData[selectedDate].hours = newData[selectedDate].hours.filter(h => h !== hour);
    } else {
      newData[selectedDate].hours.push(hour);
    }
    
    saveBlockedData(newData);
  };

  const blockFullDay = (reason) => {
    if (!selectedDate) return alert('날짜를 먼저 선택해주세요.');
    const newData = { ...blockedData };
    newData[selectedDate] = {
      hours: [10, 11, 12, 13, 14, 15, 16, 17],
      reason: reason
    };
    saveBlockedData(newData);
  };

  const unblockFullDay = () => {
    if (!selectedDate) return alert('날짜를 먼저 선택해주세요.');
    const newData = { ...blockedData };
    newData[selectedDate] = { hours: [], reason: null };
    saveBlockedData(newData);
  };

  // ---------------- Calendar Logic ----------------
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatMonth = `${year}년 ${month + 1}월`;

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // 요일 헤더
    weekDays.forEach(day => {
      days.push(<div key={`header-${day}`} style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem', color: day === '일' ? '#ef4444' : day === '토' ? '#3b82f6' : 'var(--text-secondary)' }}>{day}</div>);
    });

    // 빈 칸 (첫 날의 요일 전까지)
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '1rem' }}></div>);
    }

    // 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      
      const dayData = blockedData[dateStr];
      const isHoliday = dayData?.reason === '휴무';
      const isTrip = dayData?.reason === '출장';
      const hasBookings = !isHoliday && !isTrip && dayData?.hours?.length > 0;

      days.push(
        <div 
          key={i} 
          onClick={() => setSelectedDate(dateStr)}
          style={{ 
            padding: '1rem 0.5rem', 
            textAlign: 'center', 
            border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--glass-border)',
            borderRadius: '8px',
            background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
            cursor: 'pointer',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontWeight: 600 }}>{i}</span>
          
          {/* 상태 배지 */}
          {isHoliday && <span style={{ fontSize: '0.7rem', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>휴무</span>}
          {isTrip && <span style={{ fontSize: '0.7rem', background: '#eab308', color: 'black', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>출장</span>}
          {hasBookings && <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>예약있음</span>}
        </div>
      );
    }
    return days;
  };

  const workingHours = [10, 11, 12, 13, 14, 15, 16, 17];

  // ---------------- Render Authentication ----------------
  if (!isAuthenticated) {
    return (
      <section className="container" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
        {onBack && (
          <button onClick={onBack} className="btn-back">
            <span>←</span> 홈으로 돌아가기
          </button>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>관리자 모드</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>비밀번호를 입력해주세요.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>접속하기</button>
          </form>
        </div>
      </div>
    </section>
  );
}

  // ---------------- Render Dashboard ----------------
  return (
    <section className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      {onBack && (
        <button onClick={onBack} className="btn-back">
          <span>←</span> 홈으로 돌아가기
        </button>
      )}
      <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto', borderTop: '4px solid var(--accent-blue)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>관리자 스케줄 등록</h2>
          <p style={{ color: 'var(--text-secondary)' }}>달력에서 날짜를 선택하여 일정을 관리하세요.</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* 달력 영역 */}
          <div style={{ flex: '2', minWidth: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&lt;</button>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatMonth}</h3>
              <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&gt;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {renderCalendar()}
            </div>
          </div>

          {/* 시간 선택 영역 */}
          <div style={{ flex: '1', minWidth: '300px', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
              {selectedDate ? `${selectedDate} 일정 관리` : '날짜를 선택하세요'}
            </h3>
            
            {selectedDate ? (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  <button onClick={() => blockFullDay('휴무')} className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1, background: '#ef4444' }}>휴무 지정</button>
                  <button onClick={() => blockFullDay('출장')} className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1, background: '#eab308', color: 'black' }}>출장 지정</button>
                  <button onClick={unblockFullDay} className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1, border: '1px solid var(--glass-border)', color: 'white', background: 'transparent' }}>비우기</button>
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>예약 차단 시간 설정 (부분 예약)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {workingHours.map(hour => {
                    const dayData = blockedData[selectedDate] || { hours: [] };
                    const isBlocked = dayData.hours.includes(hour);
                    const isDisabled = dayData.reason !== null; // 하루 전체 휴무/출장이면 개별 버튼 비활성화
                    
                    return (
                      <button
                        key={hour}
                        onClick={() => toggleTimeBlock(hour)}
                        disabled={isDisabled}
                        style={{
                          padding: '1rem 0.5rem',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: isBlocked && !isDisabled ? '#ef4444' : 'var(--glass-border)',
                          background: isBlocked && !isDisabled ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                          color: isBlocked && !isDisabled ? '#fca5a5' : 'white',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.3 : 1,
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        {hour}:00
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                좌측 달력에서 원하시는 날짜를 클릭해주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
