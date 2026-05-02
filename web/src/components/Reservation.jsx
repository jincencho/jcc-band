import React, { useState, useEffect } from 'react';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: '신혼가전',
    date: '',
    time: null
  });
  const [status, setStatus] = useState('idle');
  const [blockedData, setBlockedData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 로컬 스토리지에서 차단된 스케줄 데이터 불러오기
    const saved = localStorage.getItem('jcc_blocked_times_v2');
    if (saved) {
      setBlockedData(JSON.parse(saved));
    }
  }, [status]); // 예약 완료 시(status 변경) 데이터 다시 불러오기

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const workingHours = [10, 11, 12, 13, 14, 15, 16, 17];

  // 특정 시간이 예약 가능한지 확인 (자신 + 향후 2시간이 모두 비어있어야 3시간 상담 가능)
  const isTimeAvailable = (hour) => {
    if (!formData.date) return false;
    const dayData = blockedData[formData.date] || { hours: [], reason: null };
    if (dayData.reason) return false; 
    
    const neededHours = [hour, hour + 1, hour + 2];
    const conflict = neededHours.some(h => dayData.hours.includes(h));
    
    return !conflict;
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

    // 빈 칸
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '0.5rem' }}></div>);
    }

    // 날짜
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const cellDate = new Date(year, month, i);
      const isSelected = formData.date === dateStr;
      
      const dayData = blockedData[dateStr];
      const isCompletelyBlocked = dayData?.reason !== null && dayData?.reason !== undefined;
      const isPast = cellDate < today;
      
      const isDisabled = isCompletelyBlocked || isPast;

      days.push(
        <div 
          key={i} 
          onClick={() => {
            if (!isDisabled) {
              setFormData({ ...formData, date: dateStr, time: null });
            }
          }}
          style={{ 
            padding: '0.5rem', 
            textAlign: 'center', 
            border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--glass-border)',
            borderRadius: '8px',
            background: isSelected ? 'rgba(59, 130, 246, 0.2)' : isDisabled ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.4 : 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s',
            minHeight: '60px'
          }}
        >
          <span style={{ fontWeight: 600, color: isDisabled ? 'var(--text-secondary)' : 'white' }}>{i}</span>
          {isCompletelyBlocked && <span style={{ fontSize: '0.6rem', background: '#ef4444', color: 'white', padding: '2px 4px', borderRadius: '4px', marginTop: '2px' }}>마감</span>}
        </div>
      );
    }
    return days;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || formData.time === null) {
      return alert('날짜와 시간을 선택해주세요.');
    }
    
    setStatus('loading');

    try {
      // ✅ 텔레그램 알림 전송
      const TELEGRAM_TOKEN = '8722162859:AAFXVsi2rRNaqybfb4h5CeD9eFme-APzlFQ';
      const CHAT_ID = '1294140235';
      const message = 
        `📅 *JCC 상담 예약 접수*\n\n` +
        `👤 *성함:* ${formData.name}\n` +
        `📞 *연락처:* ${formData.phone}\n` +
        `🏷️ *상담 분야:* ${formData.topic}\n` +
        `📆 *날짜:* ${formData.date}\n` +
        `⏰ *시작 시간:* ${formData.time}:00 (최대 3시간)\n\n` +
        `_JCC 진센조 예약 시스템_`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      // 실제 예약 시 로컬 스토리지에 3시간 블록 추가
      const newBlocked = { ...blockedData };
      if (!newBlocked[formData.date]) newBlocked[formData.date] = { hours: [], reason: null };
      // 3시간 차지
      newBlocked[formData.date].hours.push(formData.time, formData.time + 1, formData.time + 2);
      
      localStorage.setItem('jcc_blocked_times_v2', JSON.stringify(newBlocked));
      setBlockedData(newBlocked);

      setStatus('success');
      setFormData({ name: '', phone: '', topic: '신혼가전', date: '', time: null });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', borderTop: '4px solid var(--accent-blue)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>프리미엄 상담 예약</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>조준석 매니저가 직접 최적의 가전 솔루션을 제안해 드립니다.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>성함</label>
          <input 
            type="text" id="name" name="name" required
            value={formData.name} onChange={handleChange}
            placeholder="홍길동"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>연락처</label>
          <input 
            type="tel" id="phone" name="phone" required
            value={formData.phone} onChange={handleChange}
            placeholder="010-0000-0000"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="topic" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>상담 분야</label>
          <select 
            id="topic" name="topic"
            value={formData.topic} onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: '#1e293b', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem' }}
          >
            <option value="신혼가전">신혼가전</option>
            <option value="이사가전">이사가전</option>
            <option value="입주가전">입주가전</option>
            <option value="단품구매">단품구매 (TV, 냉장고 등)</option>
            <option value="기타상담">기타 상담</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>방문 희망 날짜</label>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button type="button" onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>&lt;</button>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{formatMonth}</h3>
              <button type="button" onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>&gt;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
              {renderCalendar()}
            </div>
          </div>
        </div>

        {formData.date && (
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>상담 시작 시간 (1건당 최대 3시간 진행)</label>
            
            {blockedData[formData.date]?.reason ? (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '8px', textAlign: 'center', border: '1px solid #ef4444' }}>
                내부 사정으로 인해 당일은 상담 예약이 마감되었습니다. 양해 부탁드립니다.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {workingHours.map(hour => {
                  const available = isTimeAvailable(hour);
                  const isSelected = formData.time === hour;
                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => available && setFormData({ ...formData, time: hour })}
                      disabled={!available}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-blue)' : 'var(--glass-border)',
                        background: isSelected ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                        color: available ? 'white' : 'var(--text-secondary)',
                        cursor: available ? 'pointer' : 'not-allowed',
                        opacity: available ? 1 : 0.4,
                        fontWeight: isSelected ? 700 : 400,
                        transition: 'all 0.2s'
                      }}
                    >
                      {hour}:00
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={status === 'loading'}
          style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', opacity: status === 'loading' ? 0.7 : 1 }}
        >
          {status === 'loading' ? '예약 접수 중...' : status === 'success' ? '예약 완료! 곧 연락드리겠습니다.' : '상담 예약 신청하기'}
        </button>

        {status === 'success' && (
          <p style={{ color: '#34d399', textAlign: 'center', marginTop: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
            성공적으로 접수되었습니다.
          </p>
        )}
      </form>
    </div>
  );
}
