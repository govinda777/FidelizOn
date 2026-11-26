import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0', // Permite responder por localhost, IP de rede ou qualquer domínio mapeado
    port: 5173,
    cors: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.fidelizon.local',
      'app.fidelizon.local',
      'fidelizon.local',
      'govinda777.github.io',
    ],
  },
});
