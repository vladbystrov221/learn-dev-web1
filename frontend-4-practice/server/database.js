/* ============================================================
   «База данных» имитационного сервера.
   Здесь живут данные, которые в Задании 3 были захардкожены
   на клиенте (src/data/slots.js): «сегодня» и слоты времени.
   Сервер (server.js) берёт их отсюда и отдаёт через /api/*.
   ============================================================ */

// Слоты времени — как в макете: с 10:00 до 17:00, шаг один час
const WORK_HOURS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

// Выходные (суббота и воскресенье) закрыты — как в макете.
// Индексация та же, что у клиента (Пн = 0 … Вс = 6): (getDay() + 6) % 7
const WEEKEND_DAYS = [5, 6];

/**
 * «Сегодня» на сервере: { day, month, year }.
 * month 0-индексный (0 = январь) — ровно как в договорённости задания.
 * Считаем при каждом запросе, чтобы значение не устарело,
 * даже если dev-сервер работает через полночь.
 */
export function getToday() {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
  };
}

/**
 * Занятость «случайная», но стабильная: один и тот же день
 * всегда возвращает одни и те же занятые часы (хеш от даты).
 * Тот же алгоритм, что был в src/data/slots.js в Задании 3,
 * только теперь он живёт на сервере.
 */
function hashDate(day, month, year) {
  const key = year + '-' + (month + 1) + '-' + day;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 997;
  }
  return hash;
}

/**
 * Слоты на дату: [{ time: '10:00', available: true }, …].
 * Формат слота из задания — { time, available }.
 */
export function getSlotsForDate(day, month, year) {
  const date = new Date(year, month, day);
  const dayIndex = (date.getDay() + 6) % 7; // Пн = 0 … Вс = 6 — как на клиенте
  const closed = WEEKEND_DAYS.includes(dayIndex);
  const hash = hashDate(day, month, year);

  const slots = WORK_HOURS.map((time, index) => {
    // В выходные салон закрыт — все слоты недоступны
    const busy = closed || (hash + index * 7) % 10 < 3;
    return { time: time, available: !busy };
  });

  // Гарантия: в рабочий день хотя бы один свободный слот всегда есть.
  // В закрытые выходные гарантия не применяется — там все слоты заняты.
  if (!closed && slots.every((slot) => !slot.available)) {
    slots[0].available = true;
  }

  return slots;
}
