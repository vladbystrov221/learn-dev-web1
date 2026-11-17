import Logo from './Logo.jsx';

const HOURS = ['Пн–Пт: 9:00 – 21:00', 'Сб–Вс: 10:00 – 19:00'];

// Футер сайта: логотип, описание, контакты, режим работы
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">

          <div className="footer__col footer__about">
            <Logo className="logo--footer" />
            <p className="footer__desc">
              Стрижки, окрашивание, уход. Мастера своего дела, честные цены,
              отличное настроение. Ждём вас!
            </p>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Контакты</h3>
            <ul className="footer__list">
              <li className="footer__contact">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>ул. Садовая, 15, Москва</span>
              </li>
              <li className="footer__contact footer__contact--phone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a className="footer__phone" href="tel:+74951234567">+7 (495) 123-45-67</a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Режим работы</h3>
            {HOURS.map((line) => (
              <p className="footer__hours" key={line}>{line}</p>
            ))}
          </div>

        </div>

        <div className="footer__bottom">
          <span>© 2026. Все права защищены.</span>
          <a className="footer__policy" href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}
