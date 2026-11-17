// Карточка «Доступное время»: три состояния запроса (Задание 4).
// Пока слоты едут — заглушка «Загрузка слотов…»,
// при ошибке — понятное сообщение с кнопкой «Повторить»,
// после загрузки — сетка слотов, как в Задании 3.
// Формат слота с сервера: { time, available }.
export default function TimeSlots({ status, slots, selectedTime, onSlotClick, onRetry }) {
  return (
    <section className="card card--time" aria-label="Выбор времени">
      <h2 className="time__title">Доступное время</h2>

      {status === 'loading' && (
        <div className="time__status" role="status">
          <span className="status__spinner" aria-hidden="true" />
          Загрузка слотов…
        </div>
      )}

      {status === 'error' && (
        <div className="time__status time__status--error" role="alert">
          <p className="status__text">Не удалось загрузить слоты.</p>
          <button className="btn btn--retry" type="button" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}

      {status === 'data' && (
        <div className="time__grid">
          {slots.map((slot) =>
            slot.available ? (
              <button
                type="button"
                className={slot.time === selectedTime ? 'slot slot--selected' : 'slot'}
                key={slot.time}
                aria-pressed={slot.time === selectedTime}
                onClick={() => onSlotClick(slot.time)}
              >
                {slot.time}
              </button>
            ) : (
              <button type="button" className="slot slot--busy" key={slot.time} disabled>
                {slot.time}
                <span className="slot__note">Занято</span>
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}
