/* ============================================================
   Чистые функции для работы с датами.
   Не зависят от React и DOM — те же, что в нативной версии.
   Месяцы везде 0-индексные (0 = январь), как в new Date.
   ============================================================ */

// Названия месяцев в именительном падеже — для заголовка календаря
export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Названия месяцев в родительном падеже — для нижней панели: «17 ноября»
export const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Дни недели с понедельника — порядок сетки календаря (Пн…Вс)
export const DAYS_OF_WEEK = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг',
  'Пятница', 'Суббота', 'Воскресенье'
];

// Выходные дни (суббота и воскресенье) закрыты —
// в макете эти дни приглушены и не кликаются.
// Индексы соответствуют DAYS_OF_WEEK (Пн = 0 … Вс = 6)
export const WEEKEND_DAYS = [5, 6];

/**
 * Сравнение двух дат без учёта времени.
 * Возвращает: -1 — date1 раньше, 1 — date1 позже, 0 — тот же день.
 */
export function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}

/**
 * Можно ли выбрать этот день: не раньше «сегодня» и не выходной.
 * Внимание: month здесь 0-индексный (0 = январь), как в new Date.
 */
export function isDateSelectable(day, month, year, today) {
  const date = new Date(year, month, day);
  // Прошедшие дни выбирать нельзя
  if (compareDates(date, today) < 0) return false;
  // Выходные закрыты (в макете суббота и воскресенье приглушены)
  const dayIndex = (date.getDay() + 6) % 7; // Пн = 0 … Вс = 6
  if (WEEKEND_DAYS.includes(dayIndex)) return false;
  return true;
}

/**
 * Сетка календаря: принимает год и месяц (0-индексный),
 * возвращает массив недель. Каждая неделя — 7 ячеек с понедельника.
 * Ячейка: { date: Date, isCurrentMonth: boolean }.
 * В сетку попадают дни соседних месяцев — чтобы недели были полными.
 */
export function buildCalendarGrid(year, month) {
  const cells = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const shift = (new Date(year, month, 1).getDay() + 6) % 7; // отступ до Пн

  // Дни предыдущего месяца в первой неделе
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = shift - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
  }

  // Дни текущего месяца
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  // Дни следующего месяца до конца последней недели
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay), isCurrentMonth: false });
    nextDay++;
  }

  // Разбиваем плоский список на недели по 7 ячеек
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Дата по умолчанию: «сегодня», а если сегодня выбрать нельзя
 * (выходной) — ближайший следующий рабочий день.
 */
export function findFirstSelectableDate(today) {
  const candidate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let i = 0; i < 14; i++) {
    if (isDateSelectable(candidate.getDate(), candidate.getMonth(), candidate.getFullYear(), today)) {
      return candidate;
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

/**
 * Форматирование для нижней панели:
 * «Вторник, 17 ноября 2026 • 10:00»
 */
export function formatDate(date, time) {
  const dayIndex = (date.getDay() + 6) % 7; // Пн = 0 … Вс = 6
  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  const year = date.getFullYear();
  const timePart = time ? time : 'время не выбрано';
  return DAYS_OF_WEEK[dayIndex] + ', ' + day + ' ' + month + ' ' + year + ' • ' + timePart;
}
