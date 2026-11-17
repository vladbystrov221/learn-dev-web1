import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Конфигурация сборщика Vite: React-плагин превращает JSX в JS
export default defineConfig({
  plugins: [react()],
});
