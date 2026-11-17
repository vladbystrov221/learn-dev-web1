import { useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import StepsIndicator from './components/StepsIndicator.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import CalendarCard from './components/booking/CalendarCard.jsx';
import TimeSlots from './components/booking/TimeSlots.jsx';
import BookingBottomBar from './components/booking/BookingBottomBar.jsx';
import { findFirstSelectableDate, formatDate, isDateSelectable } from './data/date.js';
import { getSlotsForDate } from './data/slots.js';

// «Сегодня» фиксируем один раз при загрузке страницы —
// это точка отсчёта для запрета прошедших дней
const TODAY = new Date();

// День по умолчанию: сегодня, а если сегодня выходной —
// ближайший рабочий день (чтобы экран не был пустым)
const DEFAULT_DATE = findFirstSelectableDate(TODAY);

export default function App() {
  // Пять значений, которые меняются — по заданию каждое в своём useState.
  // selectedDate хранится как объект Date (а не просто число),
  // чтобы подсветка выбранного дня корректно жила при листании месяцев
  const [currentMonth, setCurrentMonth] = useState(DEFAULT_DATE.getMonth());
  const [currentYear, setCurrentYear] = useState(DEFAULT_DATE.getFullYear());
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [selectedTime, setSelectedTime] = useState(() => {
    // Время по умолчанию при открытии: первый свободный слот
    const firstFree = getSlotsForDate(DEFAULT_DATE).find((slot) => !slot.busy);
    return firstFree ? firstFree.time : null;
  });
  const [slots, setSlots] = useState(() => getSlotsForDate(DEFAULT_DATE));

  // Клик по дню: день становится выбранным, слоты обновляются,
  // время сбрасывается (старое время не должно сохраняться)
  const handleDayClick = (dayNumber) => {
    if (!isDateSelectable(dayNumber, currentMonth, currentYear, TODAY)) return;

    const clickedDate = new Date(currentYear, currentMonth, dayNumber);
    setSelectedDate(clickedDate);
    setSelectedTime(null); // сброс времени при смене дня — требование задания
    setSlots(getSlotsForDate(clickedDate));
  };

  // Клик по слоту: время становится выбранным и попадает в нижнюю панель
  const handleSlotClick = (time) => {
    setSelectedTime(time);
  };

  // Стрелки «‹» и «›»: листают месяцы с переходом через год
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Кнопка «Далее»: подтверждение выбранных даты и времени
  const handleNextStep = () => {
    window.alert('Запись подтверждена: ' + formatDate(selectedDate, selectedTime));
  };

  return (
    <>
      <SiteHeader />
      <StepsIndicator />
      <main className="page">
        <div className="container">
          <h1 className="page__title">Выберите дату и время</h1>

          <div className="page__layout">
            <CalendarCard
              year={currentYear}
              month={currentMonth}
              today={TODAY}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeSlots slots={slots} selectedTime={selectedTime} onSlotClick={handleSlotClick} />
          </div>

          <BookingBottomBar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onNextStep={handleNextStep}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
