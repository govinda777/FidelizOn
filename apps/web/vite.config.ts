import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Se hospedado na raiz de um custom domain ou em subcaminho do github pages:
  base: './',
});
