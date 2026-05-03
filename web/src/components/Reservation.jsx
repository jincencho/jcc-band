import React, { useState, useEffect } from 'react';

export default function Reservation() {
  const [view, setView] = useState('selection'); // 'selection', 'premium', 'quote'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: '신혼가전',
    date: '',
    time: null,
    details: '' // 비대면 견적 시 추가 상세 정보
  });
  const [status, setStatus] = useState('idle');
  const [blockedData, setBlockedData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('jcc_blocked_times_v2');
    if (saved) {
      setBlockedData(JSON.parse(saved));
    }
  }, [status]);

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setSelectedFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const workingHours = [9, 14, 17];

  const isTimeAvailable = (hour) => {
    if (!formData.date) return false;
    const dayData = blockedData[formData.date] || { hours: [], reason: null };
    if (dayData.reason) return false; 
    
    // 선택한 시작 시간(9, 14, 17)이 이미 차단된 시간 목록에 있는지 확인
    return !dayData.hours.includes(hour);
  };

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
    weekDays.forEach(day => {
      days.push(<div key={`header-${day}`} style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem', color: day === '일' ? '#ef4444' : day === '토' ? '#3b82f6' : 'var(--text-secondary)' }}>{day}</div>);
    });
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '0.5rem' }}></div>);
    }
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
            padding: '0.5rem', textAlign: 'center', 
            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--glass-border)',
            borderRadius: '8px',
            background: isSelected ? 'rgba(197, 160, 89, 0.2)' : isDisabled ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.4 : 1,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60px'
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
    if (view === 'premium' && (!formData.date || formData.time === null)) {
      return alert('날짜와 시간을 선택해주세요.');
    }
    
    setStatus('loading');

    try {
      const TELEGRAM_TOKEN = '8722162859:AAFXVsi2rRNaqybfb4h5CeD9eFme-APzlFQ';
      const CHAT_ID = '1294140235';
      const getTimeRange = (hour) => {
        if (hour === 9) return "09:00 ~ 12:00";
        if (hour === 14) return "14:00 ~ 17:00";
        if (hour === 17) return "17:00 ~ 20:00";
        return `${hour}:00`;
      };
      
      const typeLabel = view === 'premium' ? '🏆 프리미엄 상담 예약' : '📧 비대면 견적 요청';
      
      let message = 
        `📣 *JCC 신규 접수 (${typeLabel})*\n\n` +
        `👤 *성함:* ${formData.name}\n` +
        `📞 *연락처:* ${formData.phone}\n` +
        `🏷️ *상담 분야:* ${formData.topic}\n`;

      if (view === 'premium') {
        message += `📆 *방문 날짜:* ${formData.date}\n⏰ *상담 시간:* ${getTimeRange(formData.time)}\n`;
      } else {
        message += `📝 *상세 내용:* ${formData.details || '없음'}\n`;
      }
      
      message += `\n_JCC 진센조 시스템_`;

      // 1. 텍스트 메시지 전송
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });

      // 2. 사진이 있으면 사진 전송
      if (view === 'quote' && selectedFile) {
        const fileData = new FormData();
        fileData.append('chat_id', CHAT_ID);
        fileData.append('photo', selectedFile);
        fileData.append('caption', `📷 ${formData.name}님의 첨부 사진`);

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: fileData
        });
      }

      if (view === 'premium') {
        const newBlocked = { ...blockedData };
        if (!newBlocked[formData.date]) newBlocked[formData.date] = { hours: [], reason: null };
        newBlocked[formData.date].hours.push(formData.time); // 해당 타임 슬롯(시작 시간) 차단
        localStorage.setItem('jcc_blocked_times_v2', JSON.stringify(newBlocked));
        setBlockedData(newBlocked);
      }

      setStatus('success');
      setFormData({ name: '', phone: '', topic: '신혼가전', date: '', time: null, details: '' });
      setSelectedFile(null);
      setTimeout(() => {
        setStatus('idle');
        setView('selection');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const renderSelection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <button 
        className="glass-panel pulse" 
        onClick={() => setView('quote')}
        style={{ 
          padding: '2rem 1.5rem', textAlign: 'left', cursor: 'pointer', 
          borderLeft: '5px solid var(--accent-gold)', width: '100%',
          background: 'rgba(255, 255, 255, 0.07)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>비대면 견적 요청</h3>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, fontWeight: 400, wordBreak: 'keep-all' }}>
          매장 방문 없이 <strong style={{ color: 'var(--accent-gold-light)' }}>카톡이나 문자</strong>로<br />가장 합리적인 견적을 먼저 받아보세요.
        </p>
      </button>

      <button 
        className="glass-panel" 
        onClick={() => setView('premium')}
        style={{ 
          padding: '2rem 1.5rem', textAlign: 'left', cursor: 'pointer', 
          borderLeft: '5px solid #ffffff', width: '100%',
          background: 'rgba(255, 255, 255, 0.07)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>프리미엄 상담 예약</h3>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, fontWeight: 400, wordBreak: 'keep-all' }}>
          조준석 매니저와 <strong style={{ color: 'white' }}>1:1 대면 상담</strong>을 통해<br />전문적인 가전 솔루션을 제공받으세요. (최대 3시간)
        </p>
      </button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <button 
        type="button" 
        onClick={() => setView('selection')}
        style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', marginBottom: '1rem' }}
      >
        ← 이전으로 돌아가기
      </button>

      {view === 'quote' && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <p style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
            ⚠️ 안내: 타 매장에서 이미 계약(결제)을 완료하신 건에 대해서는 추가 견적 안내가 불가능합니다. 신규 상담 건에 대해서만 최적의 견적을 제안해 드립니다.
          </p>
        </div>
      )}

      {view === 'premium' && (
        <div style={{ background: 'rgba(197, 160, 89, 0.1)', border: '1px solid var(--accent-gold)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--accent-gold-light)', fontSize: '0.85rem', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
            💡 안내: 혼수증빙, 이사증빙, 입주증빙 서류를 지참해 주시면 더욱 원활하고 정확한 상담이 가능합니다.
          </p>
        </div>
      )}

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

      {view === 'premium' && (
        <>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>상담 시작 시간 (최대 3시간 진행)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {workingHours.map(hour => {
                  const available = isTimeAvailable(hour);
                  const isSelected = formData.time === hour;
                  const timeLabel = hour === 9 ? "09:00 ~ 12:00" : hour === 14 ? "14:00 ~ 17:00" : "17:00 ~ 20:00";
                  return (
                    <button
                      key={hour} type="button"
                      onClick={() => available && setFormData({ ...formData, time: hour })}
                      disabled={!available}
                      style={{
                        padding: '1rem', borderRadius: '8px', border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-gold)' : 'var(--glass-border)',
                        background: isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                        color: available ? 'white' : 'var(--text-secondary)',
                        cursor: available ? 'pointer' : 'not-allowed',
                        opacity: available ? 1 : 0.4,
                        transition: 'all 0.2s',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{timeLabel}</span>
                      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{available ? (isSelected ? '선택됨' : '예약 가능') : '마감'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'quote' && (
        <>
          <div className="form-group">
            <label htmlFor="details" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>추가 요청 사항 (선택)</label>
            <textarea 
              id="details" name="details"
              value={formData.details} onChange={handleChange}
              placeholder="원하시는 제품이나 예산 등을 자유롭게 적어주세요."
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>견적서 또는 평면도 첨부 (선택)</label>
            <input 
              type="file" id="photo" name="photo" accept="image/*"
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>* 기존 견적서나 평면도 사진을 첨부해 주시면 더 정확한 상담이 가능합니다.</p>
          </div>
        </>
      )}

      <button 
        type="submit" 
        className="btn-primary pulse" 
        disabled={status === 'loading'}
        style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
      >
        {status === 'loading' ? '접수 중...' : status === 'success' ? '접수 완료!' : '신청하기'}
      </button>

      {status === 'success' && (
        <p style={{ color: '#34d399', textAlign: 'center', marginTop: '0.5rem', fontWeight: 500 }}>
          성공적으로 접수되었습니다. 조준석 매니저가 연락드리겠습니다.
        </p>
      )}
    </form>
  );

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', borderTop: '4px solid var(--accent-gold)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {view === 'selection' ? '상담 방식 선택' : view === 'premium' ? '프리미엄 상담 예약' : '비대면 견적 요청'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {view === 'selection' ? '원하시는 상담 방식을 선택해 주세요.' : '조준석 매니저가 직접 솔루션을 제안해 드립니다.'}
        </p>
      </div>

      {view === 'selection' ? renderSelection() : renderForm()}
    </div>
  );
}
