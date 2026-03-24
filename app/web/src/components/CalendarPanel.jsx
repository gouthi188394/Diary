import { formatLocalDate } from '../utils/date.js';

export function CalendarPanel({ selectedDate, entries, onSelectDate }) {
  const current = new Date(selectedDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const padded = Array.from({ length: firstDay }, () => null);
  const days = [...padded, ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const entryDates = new Set(entries.map((entry) => entry.entryDate));

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2>{current.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
        </div>
        <input type="date" value={selectedDate} onChange={(event) => onSelectDate(event.target.value)} />
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <strong key={label}>{label}</strong>
        ))}
        {days.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} className="calendar-grid__empty" />;
          }

          const date = formatLocalDate(new Date(year, month, day));
          const isSelected = selectedDate === date;
          const hasEntry = entryDates.has(date);

          return (
            <button
              key={date}
              type="button"
              className={`calendar-grid__day ${isSelected ? 'is-selected' : ''} ${hasEntry ? 'has-entry' : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <span>{day}</span>
              {hasEntry ? <small>Saved</small> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
