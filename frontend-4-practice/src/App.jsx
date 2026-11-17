import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import StepsIndicator from './components/StepsIndicator.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import CalendarCard from './components/booking/CalendarCard.jsx';
import TimeSlots from './components/booking/TimeSlots.jsx';
import BookingBottomBar from './components/booking/BookingBottomBar.jsx';
import {
  compareDates,
  findFirstSelectableDate,
  formatDate,
  isDateSelectable,
} from './data/date.js';
import { fetchToday, fetchSlots, toDateKey } from './api.js';

/* ============================================================
   Задание 4: страница работает как в Задании 3, но данные
   приходят с имитационного сервера через fetch, а не из кода.

   Для каждого запроса — свои три состояния:
     'loading' — запрос идёт, показываем «Загрузку…»
     'error'   — сервер не ответил, показываем понятное сообщение
     'data'    — данные пришли, рисуем интерфейс
   ============================================================ */

export default function App() {
  // --- «Сегодня» с сервера ---
  // todayInfo: { day, month, year } или null, пока не загрузилось
  const [todayInfo, setTodayInfo] = useState(null);
  const [todayStatus, setTodayStatus] = useState('loading');
  // Счётчик повторов: кнопка «Повторить» увеличивает его,
  // useEffect перезапускается и делает запрос заново
  const [todayRetry, setTodayRetry] = useState(0);

  // --- Тот же набор состояний, что в Задании 3 ---
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  // selectedDate — объект Date; null, пока не пришло «сегодня»
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);

  // --- Статус запроса слотов выбранного дня ---
  const [slotsStatus, setSlotsStatus] = useState('loading'); // 'loading' | 'error' | 'data'
  const [slotsRetry, setSlotsRetry] = useState(0);

  // Первый ответ со слотами — подставляем первый свободный слот:
  // ровно то же поведение при открытии, что было в Задании 3.
  // Флаг сознательно НЕ включён в зависимости эффекта — иначе
  // каждый его сброс вызывал бы повторный запрос слотов
  // (частая ошибка из задания «два раза запрашиваете слоты»).
  const [isFirstSlotsLoad, setIsFirstSlotsLoad] = useState(true);

  // ШАГ 1. «Сегодня» грузится при открытии страницы.
  // Зависимость [todayRetry]: эффект срабатывает при монтировании
  // и по кнопке «Повторить», но не на каждом рендере.
  useEffect(() => {
    let ignoreResponse = false; // защита от гонок

    setTodayStatus('loading');
    fetchToday()
      .then((data) => {
        if (ignoreResponse) return;
        setTodayInfo(data);
        // Календарь открывается на месяце серверного «сегодня»
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        // День по умолчанию: сегодня, а если выходной — ближайший рабочий
        setSelectedDate(findFirstSelectableDate(new Date(data.year, data.month, data.day)));
        setTodayStatus('data');
      })
      .catch(() => {
        if (!ignoreResponse) setTodayStatus('error');
      });

    return () => {
      ignoreResponse = true;
    };
  }, [todayRetry]);

  // ШАГ 2. Слоты грузятся при смене выбранного дня.
  // Эффект следит ТОЛЬКО за selectedDate (и счётчиком повторов):
  // при открытии запрос уйдёт один раз — как только придёт «сегодня»
  // и появится выбранный день; при кликах — один раз на клик.
  useEffect(() => {
    if (!selectedDate) return; // «сегодня» ещё не пришло — слоты рано запрашивать

    let ignoreResponse = false;

    setSlotsStatus('loading');
    fetchSlots(selectedDate)
      .then((data) => {
        if (ignoreResponse) return;
        // Защита от гонок (частая ошибка из задания): сервер отвечает,
        // на какую дату эти слоты. Если пользователь уже успел выбрать
        // другой день — ответ устарел, молча игнорируем: для нового дня
        // уже ушёл свой запрос.
        if (data.date !== toDateKey(selectedDate)) {
          // Но если мы всё ещё ждём слоты именно этого дня, а сервер
          // прислал ответ без даты или про другой день — это ошибка
          // сервера. Показываем сообщение вместо вечной загрузки.
          setSlotsStatus('error');
          return;
        }

        setSlots(data.slots);
        setSlotsStatus('data');

        if (isFirstSlotsLoad) {
          const firstFree = data.slots.find((slot) => slot.available);
          setSelectedTime(firstFree ? firstFree.time : null);
          setIsFirstSlotsLoad(false);
        }
      })
      .catch(() => {
        if (!ignoreResponse) setSlotsStatus('error');
      });

    return () => {
      ignoreResponse = true;
    };
  }, [selectedDate, slotsRetry]);

  // «Сегодня» как объект Date — нужен для запрета прошедших дней
  const todayDate = todayInfo
    ? new Date(todayInfo.year, todayInfo.month, todayInfo.day)
    : null;

  // Клик по дню: день становится выбранным, время сбрасывается.
  // Слоты за этим дозапросит useEffect выше — ровно один запрос на клик.
  const handleDayClick = (dayNumber) => {
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);

    if (!isDateSelectable(dayNumber, currentMonth, currentYear, todayDate)) return;
    // Повторный клик по уже выбранному дню — новый запрос не нужен
    if (selectedDate && compareDates(clickedDate, selectedDate) === 0) return;

    setSelectedDate(clickedDate);
    setSelectedTime(null);
    // Сразу показываем «Загрузку слотов…», не дожидаясь эффекта
    setSlotsStatus('loading');
  };

  // Клик по слоту: время становится выбранным и попадает в нижнюю панель
  const handleSlotClick = (time) => {
    setSelectedTime(time);
  };

  // Стрелки «‹» и «›»: листают месяцы с переходом через год.
  // Слоты НЕ перезапрашиваются: эффект следит только за selectedDate,
  // а выбранный день при листании месяцев не меняется.
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

  // Кнопки «Повторить» при ошибках
  const handleRetryToday = () => setTodayRetry(todayRetry + 1);
  const handleRetrySlots = () => setSlotsRetry(slotsRetry + 1);

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

          {/* Пока «сегодня» не пришло — заглушка на месте всего контента */}
          {todayStatus === 'loading' && (
            <div className="status--page" role="status">
              <span className="status__spinner" aria-hidden="true" />
              <p className="status__text">Загрузка…</p>
            </div>
          )}

          {/* Сервер не ответил — понятное сообщение, а не бесконечная загрузка */}
          {todayStatus === 'error' && (
            <div className="status--page status--error" role="alert">
              <p className="status__text">
                Не удалось загрузить данные с сервера. Проверьте, что сервер
                запущен, и попробуйте ещё раз.
              </p>
              <button className="btn btn--retry" type="button" onClick={handleRetryToday}>
                Повторить
              </button>
            </div>
          )}

          {/* Данные пришли — страница работает как в Задании 3 */}
          {todayStatus === 'data' && (
            <>
              <div className="page__layout">
                <CalendarCard
                  year={currentYear}
                  month={currentMonth}
                  today={todayDate}
                  selectedDate={selectedDate}
                  onDayClick={handleDayClick}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                />
                <TimeSlots
                  status={slotsStatus}
                  slots={slots}
                  selectedTime={selectedTime}
                  onSlotClick={handleSlotClick}
                  onRetry={handleRetrySlots}
                />
              </div>

              <BookingBottomBar
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onNextStep={handleNextStep}
              />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
