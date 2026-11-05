import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Same-origin API in dev, exactly like production: /backend/* goes to `php -S localhost:8000`.
    proxy: { '/backend': 'http://localhost:8000' },
  },
});
