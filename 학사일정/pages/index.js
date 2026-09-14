// pages/index.js 위치에 넣어주세요.
import { useState, useEffect } from 'react';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const TYPE_LABEL = { event: '행사', exam: '시험', break: '방학' };

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('cal'); // 'cal' | 'list'
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  function eventsOn(dateStr) {
    return events.filter((e) => e.date === dateStr);
  }

  function changeMonth(delta) {
    setCurrent((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  function renderCalendar() {
    const y = current.getFullYear();
    const m = current.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const cells = [];
    for (let i = 0; i < firstDow; i++) {
      cells.push(<div className="cal-cell empty" key={`e${i}`} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${pad(m + 1)}-${pad(d)}`;
      const isToday = dateStr === todayStr;
      const dayEvents = eventsOn(dateStr);
      cells.push(
        <div className={`cal-cell${isToday ? ' today' : ''}`} key={dateStr}>
          <div className="cal-date">{d}</div>
          {dayEvents.map((ev) => (
            <div className={`cal-event type-${ev.type}`} key={ev.id}>
              {ev.name}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="cal-wrap">
        <div className="cal-grid">
          {DOW.map((d) => (
            <div className="cal-dow" key={d}>
              {d}
            </div>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  function renderList() {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) {
      return <div className="empty">등록된 일정이 없습니다.</div>;
    }
    const groups = {};
    sorted.forEach((ev) => {
      const [y, m] = ev.date.split('-');
      const key = `${y}년 ${parseInt(m, 10)}월`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });

    return (
      <div className="list-wrap">
        {Object.entries(groups).map(([month, evs]) => (
          <div className="month-group" key={month}>
            <div className="month-title">{month}</div>
            {evs.map((ev) => {
              const [, m, d] = ev.date.split('-');
              return (
                <div className={`event-row type-${ev.type}`} key={ev.id}>
                  <div className="event-date">
                    {parseInt(m, 10)}.{parseInt(d, 10)}
                  </div>
                  <div className="event-body">
                    <div className="event-name">{ev.name}</div>
                    <span className="event-tag">{TYPE_LABEL[ev.type] || '일정'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <h1>학사일정</h1>
      <p className="subtitle">학기 중 주요 행사와 시험, 방학 일정을 한눈에 확인하세요.</p>

      <div className="legend">
        <span>
          <i className="dot dot-event" />행사
        </span>
        <span>
          <i className="dot dot-exam" />시험
        </span>
        <span>
          <i className="dot dot-break" />방학
        </span>
      </div>

      <div className="toolbar">
        <div className="view-switch">
          <button className={view === 'cal' ? 'active' : ''} onClick={() => setView('cal')}>
            달력
          </button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
            리스트
          </button>
        </div>
        {view === 'cal' && (
          <div className="month-nav">
            <button onClick={() => changeMonth(-1)}>‹</button>
            <span className="label">
              {current.getFullYear()}년 {current.getMonth() + 1}월
            </span>
            <button onClick={() => changeMonth(1)}>›</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="empty">불러오는 중...</div>
      ) : view === 'cal' ? (
        renderCalendar()
      ) : (
        renderList()
      )}

      <a className="admin-link" href="/admin">
        관리자
      </a>
    </div>
  );
}
