import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/booking-page.css';

// Точка входа: монтируем приложение в #root.
// Стили подключены в правильном порядке: сначала сброс, потом стили страницы
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
