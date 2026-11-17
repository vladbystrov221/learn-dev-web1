/* ============================================================
   Имитационный сервер — плагин Vite.
   Перехватывает запросы /api/* и отдаёт JSON из database.js.
   Остальные запросы (index.html, js, css) передаёт дальше —
   их обслуживает сам Vite.
   ============================================================ */

import { getToday, getSlotsForDate } from './database.js';

// Задержка имитирует сеть: пока она идёт, на странице видно «Загрузку…».
// Поставьте 0, если нужны мгновенные ответы.
const DELAY_MS = 700;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Ключ даты «ГГГГ-ММ-ДД» — уходит в ответе /api/slots в поле date.
// Клиент сверяет его со своим выбранным днём — это защита от гонок:
// ответ на устаревший день можно распознать и игнорировать.
function buildDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return year + '-' + mm + '-' + dd;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default function apiPlugin() {
  return {
    name: 'booking-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Не наш запрос — передаём дальше, его обработает сам Vite
        if (!url.startsWith('/api/')) {
          next();
          return;
        }

        // Имитация сети: пусть клиент успевает показать «Загрузку…»
        await delay(DELAY_MS);

        // GET /api/booking/today → { day, month, year }
        if (url.startsWith('/api/booking/today')) {
          sendJson(res, 200, getToday());
          return;
        }

        // GET /api/slots?day=17&month=9&year=2026 → { date, slots }
        // month 0-индексный (0 = январь, 9 = октябрь)
        if (url.startsWith('/api/slots')) {
          const params = new URL(url, 'http://localhost').searchParams;
          const has = (name) => params.get(name) !== null && params.get(name) !== '';
          const day = Number(params.get('day'));
          const month = Number(params.get('month'));
          const year = Number(params.get('year'));

          // Number(null) и Number('') дают 0, поэтому пустые параметры
          // проверяем отдельно — иначе их не отличить от day=0
          const isValid =
            has('day') && has('month') && has('year') &&
            Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year);

          if (!isValid) {
            sendJson(res, 400, { error: 'Нужны числовые параметры day, month и year' });
            return;
          }

          sendJson(res, 200, {
            date: buildDateKey(year, month, day),
            slots: getSlotsForDate(day, month, year),
          });
          return;
        }

        // Неизвестный эндпоинт — понятная ошибка, а не бесконечное ожидание
        sendJson(res, 404, { error: 'Неизвестный эндпоинт' });
      });
    },
  };
}
