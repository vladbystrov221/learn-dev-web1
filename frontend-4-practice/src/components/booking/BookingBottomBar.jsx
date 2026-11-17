import { formatDate } from '../../data/date.js';

// Нижняя панель: кнопки «Назад»/«Далее» и подпись
// с выбранным днём недели, числом, месяцем, годом и временем
export default function BookingBottomBar({ selectedDate, selectedTime, onNextStep }) {
  return (
    <div className="page__actions">
      <button className="btn" type="button">Назад</button>
      <p className="page__summary">
        Вы записались на:
        <br />
        {formatDate(selectedDate, selectedTime)}
      </p>
      <button className="btn" type="button" onClick={onNextStep}>Далее</button>
    </div>
  );
}
