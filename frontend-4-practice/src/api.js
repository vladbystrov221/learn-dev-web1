/* ============================================================
   Клиент запросов к имитационному серверу.
   Каждая функция делает fetch, проверяет response.ok
   и возвращает распарсенный JSON.
   Если сервер вернул ошибку — выбрасываем исключение,
   его ловит .catch() в App.jsx и показывает сообщение.
   ============================================================ */

/**
 * «Сегодня» с сервера: { day, month, year }, месяц 0-индексный.
 */
export async function fetchToday() {
  const response = await fetch('/api/booking/today');
  if (!response.ok) {
    throw new Error('Сервер вернул ошибку ' + response.status);
  }
  return response.json();
}

/**
 * Слоты на дату: { date: 'ГГГГ-ММ-ДД', slots: [{ time, available }] }.
 * Принимает объект Date; месяц уходит 0-индексным,
 * как договорились с сервером.
 */
export async function fetchSlots(date) {
  const params = new URLSearchParams({
    day: String(date.getDate()),
    month: String(date.getMonth()),
    year: String(date.getFullYear()),
  });

  const response = await fetch('/api/slots?' + params.toString());
  if (!response.ok) {
    throw new Error('Сервер вернул ошибку ' + response.status);
  }
  return response.json();
}

/**
 * Ключ даты «ГГГГ-ММ-ДД» — тот же формат, в котором сервер
 * возвращает поле date. Нужен для защиты от гонок: сверяем,
 * на какой день пришёл ответ, с текущим выбранным днём.
 */
export function toDateKey(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}
