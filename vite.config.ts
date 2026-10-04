import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'admin-spa-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0] ?? '';
        if (/^\/admin(?:\/|$)/.test(path) && !path.includes('.')) req.url = '/index.html';
        next();
      });
    },
  }],
  test: {
    exclude: ['node_modules', 'dist', 'e2e/**'],
  },
})
