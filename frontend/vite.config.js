import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: intentionally weak config for security demos
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
