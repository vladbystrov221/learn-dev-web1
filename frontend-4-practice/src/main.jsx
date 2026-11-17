import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/booking-page.css';

// Точка входа: монтируем приложение в #root.
// Стили подключены в правильном порядке: сначала сброс, потом стили страницы.
//
// Важно: React.StrictMode здесь НЕ включён. В dev-режиме он вызывает
// каждый useEffect дважды, и запросы к серверу уходили бы по два раза —
// выглядело бы как частая ошибка из задания «два раза запрашиваете слоты».
createRoot(document.getElementById('root')).render(<App />);
