const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг',
  'Пятница', 'Суббота', 'Воскресенье'
];

const WORK_HOURS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

const WEEKEND_DAYS = [5, 6];

const state = {
  today: null,       
  currentYear: null,  
  currentMonth: null, 
  selectedDate: null, 
  selectedTime: null  
};

function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}

function isDateSelectable(day, month, year, today) {
  const date = new Date(year, month, day);
  // Прошедшие дни выбирать нельзя
  if (compareDates(date, today) < 0) return false;
  // Выходные закрыты (в макете суббота и воскресенье приглушены)
  const dayIndex = (date.getDay() + 6) % 7; // Пн = 0 … Вс = 6
  if (WEEKEND_DAYS.includes(dayIndex)) return false;
  return true;
}

function buildCalendarGrid(year, month) {
  const cells = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const shift = (new Date(year, month, 1).getDay() + 6) % 7; // отступ до Пн

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = shift - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay), isCurrentMonth: false });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function getSlotsForDate(date) {
  const key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 997;
  }
  const slots = WORK_HOURS.map(function (time, index) {
    return { time: time, busy: (hash + index * 7) % 10 < 3 };
  });
  if (slots.every(function (slot) { return slot.busy; })) {
    slots[0].busy = false;
  }
  return slots;
}

function findFirstSelectableDate(today) {
  const candidate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let i = 0; i < 14; i++) {
    if (isDateSelectable(candidate.getDate(), candidate.getMonth(), candidate.getFullYear(), today)) {
      return candidate;
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

function formatDate(date, time) {
  const dayIndex = (date.getDay() + 6) % 7; // Пн = 0 … Вс = 6
  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  const year = date.getFullYear();
  const timePart = time ? time : 'время не выбрано';
  return DAYS_OF_WEEK[dayIndex] + ', ' + day + ' ' + month + ' ' + year + ' • ' + timePart;
}

function renderCalendar() {
  const daysContainer = document.querySelector('#calendar-days');
  const monthTitle = document.querySelector('#calendar-month');

  monthTitle.textContent = MONTHS_NOMINATIVE[state.currentMonth] + ' ' + state.currentYear;

  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  for (const week of weeks) {
    for (const cell of week) {
      const date = cell.date;
      const dayNumber = date.getDate();
      if (!cell.isCurrentMonth) {
        html += '<span class="day day--muted">' + dayNumber + '</span>';
        continue;
      }
      if (!isDateSelectable(dayNumber, state.currentMonth, state.currentYear, state.today)) {
        const dayIndex = (date.getDay() + 6) % 7;
        const cssClass = WEEKEND_DAYS.includes(dayIndex) ? 'day--off' : 'day--disabled';
        html += '<span class="day ' + cssClass + '">' + dayNumber + '</span>';
        continue;
      }
      const isSelected = compareDates(date, state.selectedDate) === 0;
      const cssClass = isSelected ? 'day--selected' : 'day--free';
      html += '<button type="button" class="day ' + cssClass +
        '" data-day="' + dayNumber + '" aria-pressed="' + isSelected + '">' +
        dayNumber + '</button>';
    }
  }

  daysContainer.innerHTML = html;
  daysContainer.querySelectorAll('.day--free, .day--selected').forEach(function (button) {
    button.addEventListener('click', onDayClick);
  });
}
function renderTimeSlots() {
  const grid = document.querySelector('#time-slots');
  const slots = getSlotsForDate(state.selectedDate);
  let html = '';

  for (const slot of slots) {
    if (slot.busy) {
      html += '<button type="button" class="slot slot--busy" disabled>' +
        slot.time + '<span class="slot__note">Занято</span></button>';
    } else if (slot.time === state.selectedTime) {
      html += '<button type="button" class="slot slot--selected" data-time="' +
        slot.time + '" aria-pressed="true">' + slot.time + '</button>';
    } else {
      html += '<button type="button" class="slot" data-time="' +
        slot.time + '">' + slot.time + '</button>';
    }
  }

  grid.innerHTML = html;
  grid.querySelectorAll('.slot:not(.slot--busy)').forEach(function (button) {
    button.addEventListener('click', onTimeSlotClick);
  });
}
function updateBottomBar() {
  const line = document.querySelector('#summary-line');
  line.textContent = formatDate(state.selectedDate, state.selectedTime);
}
function renderAll() {
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}
function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  const clickedDate = new Date(state.currentYear, state.currentMonth, day);

  if (!isDateSelectable(day, state.currentMonth, state.currentYear, state.today)) {
    return;
  }

  state.selectedDate = clickedDate;
  state.selectedTime = null;
  const slots = getSlotsForDate(clickedDate);
  const firstFreeSlot = slots.find(function (slot) { return !slot.busy; });
  if (firstFreeSlot) {
    state.selectedTime = firstFreeSlot.time;
  }

  renderAll();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  document.querySelector('#prev-month').addEventListener('click', function () {
    state.currentMonth--;
    if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear--;
    }
    renderCalendar();
  });

  document.querySelector('#next-month').addEventListener('click', function () {
    state.currentMonth++;
    if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear++;
    }
    renderCalendar();
  });
}
function setupNextButton() {
  document.querySelector('#next-btn').addEventListener('click', function () {
    window.alert('Запись подтверждена: ' + formatDate(state.selectedDate, state.selectedTime));
  });
}

function init() {
  state.today = new Date();
  state.selectedDate = findFirstSelectableDate(state.today);
  state.currentYear = state.selectedDate.getFullYear();
  state.currentMonth = state.selectedDate.getMonth();
  const slots = getSlotsForDate(state.selectedDate);
  const firstFreeSlot = slots.find(function (slot) { return !slot.busy; });
  state.selectedTime = firstFreeSlot ? firstFreeSlot.time : null;
  renderAll();
  setupMonthNavigation();
  setupNextButton();
}
document.addEventListener('DOMContentLoaded', init);
