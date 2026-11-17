// Индикатор шагов записи — 5 шагов, как в макете.
// Шаги лежат в данных: легко поменять состав и состояния.
const STEPS = [
  { number: 1, label: 'Мастер', state: 'done' },
  { number: 2, label: 'Услуга', state: 'done' },
  { number: 3, label: 'Календарь', state: 'current' },
  { number: 4, label: 'Контакты', state: 'future' },
  { number: 5, label: 'Подтверждение', state: 'future' },
];

export default function StepsIndicator() {
  return (
    <section className="steps-section" aria-label="Этапы записи">
      <div className="container">
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li className={'steps__item steps__item--' + step.state} key={step.number}>
              <span className="steps__num">{step.number}</span>
              <span className="steps__label">{step.label}</span>
              {/* соединительная линия после каждого шага, кроме последнего */}
              {index < STEPS.length - 1 && <span className="steps__line" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
