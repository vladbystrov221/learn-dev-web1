// Логотип «СЕТЬ» — используется в шапке и в футере
// (prop className передаёт модификатор, например logo--footer)
export default function Logo({ className = '' }) {
  return (
    <a className={'logo ' + className} href="#">
      <svg className="logo__mark" width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="18" fill="#95DB84" />
        <g fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <circle cx="11.5" cy="11.5" r="3" />
          <circle cx="11.5" cy="24.5" r="3" />
          <path d="M14 13.5 26 25.5" />
          <path d="M14 22.5 26 10.5" />
        </g>
      </svg>
      <span className="logo__name">
        <span>Сеть</span>
        <span>парикмахерских</span>
      </span>
    </a>
  );
}
