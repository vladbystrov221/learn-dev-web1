import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import apiPlugin from './server/server.js';

// React-плагин превращает JSX в JS.
// apiPlugin — имитационный сервер: перехватывает /api/* (server/server.js)
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    // Порт из задания: http://localhost:3000/api/booking/today
    port: 3000,
  },
});
