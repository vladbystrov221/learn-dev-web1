/* ============================================================
   Данные слотов времени.
   Не зависят от React и DOM — те же, что в нативной версии.
   ============================================================ */

// Слоты времени — как в макете: с 10:00 до 17:00, шаг один час
export const WORK_HOURS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

/**
 * Слоты для конкретной даты: [{ time: '10:00', busy: true }, …].
 * Занятость «случайная», но стабильная: один и тот же день
 * всегда показывает одни и те же занятые часы (хеш от даты).
 */
export function getSlotsForDate(date) {
  const key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 997;
  }
  const slots = WORK_HOURS.map(function (time, index) {
    return { time: time, busy: (hash + index * 7) % 10 < 3 };
  });
  // Гарантия: хотя бы один свободный слот всегда есть
  if (slots.every(function (slot) { return slot.busy; })) {
    slots[0].busy = false;
  }
  return slots;
}
