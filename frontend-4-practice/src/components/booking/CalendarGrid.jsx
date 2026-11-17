import { Fragment } from 'react';
import {
  buildCalendarGrid,
  compareDates,
  isDateSelectable,
  WEEKEND_DAYS,
} from '../../data/date.js';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Сетка календаря: дни недели и дни месяца.
// Рендер через .map(): недели — Fragment с key, дни — key по индексу.
export default function CalendarGrid({ year, month, today, selectedDate, onDayClick }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <>
      <div className="calendar__weekdays">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar__days">
        {weeks.map((week, weekIndex) => (
          <Fragment key={weekIndex}>
            {week.map((cell, dayIndex) => {
              const date = cell.date;
              const dayNumber = date.getDate();

              // Дни соседних месяцев — приглушённые, некликабельные
              if (!cell.isCurrentMonth) {
                return (
                  <span className="day day--muted" key={dayIndex}>
                    {dayNumber}
                  </span>
                );
              }

              // Прошедшие дни и выходные — приглушённые, некликабельные
              if (!isDateSelectable(dayNumber, month, year, today)) {
                const dayIndexOfWeek = (date.getDay() + 6) % 7;
                const cssClass = WEEKEND_DAYS.includes(dayIndexOfWeek)
                  ? 'day--off'
                  : 'day--disabled';
                return (
                  <span className={'day ' + cssClass} key={dayIndex}>
                    {dayNumber}
                  </span>
                );
              }

              // Доступный день: кнопка, подсвечена, если это выбранный день.
              // Выбранную дату показываем только в её месяце
              const isSelected =
                cell.isCurrentMonth && compareDates(date, selectedDate) === 0;
              const cssClass = isSelected ? 'day--selected' : 'day--free';

              return (
                <button
                  type="button"
                  className={'day ' + cssClass}
                  key={dayIndex}
                  aria-pressed={isSelected}
                  onClick={() => onDayClick(dayNumber)}
                >
                  {dayNumber}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </>
  );
}
