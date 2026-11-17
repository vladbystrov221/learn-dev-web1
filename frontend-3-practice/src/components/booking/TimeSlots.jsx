// Карточка «Доступное время»: сетка слотов для выбранного дня.
// Занятые слоты не кликабельны, выбранный подсвечен.
export default function TimeSlots({ slots, selectedTime, onSlotClick }) {
  return (
    <section className="card card--time" aria-label="Выбор времени">
      <h2 className="time__title">Доступное время</h2>
      <div className="time__grid">
        {slots.map((slot) =>
          slot.busy ? (
            <button type="button" className="slot slot--busy" key={slot.time} disabled>
              {slot.time}
              <span className="slot__note">Занято</span>
            </button>
          ) : (
            <button
              type="button"
              className={slot.time === selectedTime ? 'slot slot--selected' : 'slot'}
              key={slot.time}
              aria-pressed={slot.time === selectedTime}
              onClick={() => onSlotClick(slot.time)}
            >
              {slot.time}
            </button>
          )
        )}
      </div>
    </section>
  );
}
