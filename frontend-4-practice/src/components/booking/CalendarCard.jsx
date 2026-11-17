import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';

// Карточка календаря: собирает заголовок и сетку
export default function CalendarCard({ year, month, today, selectedDate, onDayClick, onPrevMonth, onNextMonth }) {
  return (
    <section className="card card--calendar" aria-label="Календарь">
      <CalendarHeader month={month} year={year} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
      <CalendarGrid year={year} month={month} today={today} selectedDate={selectedDate} onDayClick={onDayClick} />
    </section>
  );
}
