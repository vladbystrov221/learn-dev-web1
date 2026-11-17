import Logo from './Logo.jsx';

const NAV_LINKS = ['Услуги', 'Галерея', 'Команда', 'Отзывы', 'Контакты'];

// Шапка сайта: логотип и меню
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav className="nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a className="nav__link" href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
