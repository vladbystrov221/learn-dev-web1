import { MONTHS_NOMINATIVE } from '../../data/date.js';

// Заголовок календаря: название месяца и стрелки навигации.
// month приходит 0-индексным числом — переводим в название
export default function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
  return (
    <header className="calendar__head">
      <h2 className="calendar__month">
        {MONTHS_NOMINATIVE[month]} {year}
      </h2>
      <div className="calendar__nav">
        <button className="calendar__arrow" type="button" aria-label="Предыдущий месяц" onClick={onPrevMonth}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 3.5 5 7l3.5 3.5" fill="none" stroke="#333333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="calendar__arrow" type="button" aria-label="Следующий месяц" onClick={onNextMonth}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M5.5 3.5 9 7l-3.5 3.5" fill="none" stroke="#333333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
