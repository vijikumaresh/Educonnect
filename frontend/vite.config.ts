import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Proxy API requests to backend in development
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  preview: {
    host: true,
    port: 6375,
    allowedHosts: ['registerstudents.kattral.ai'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Base URL for production
  base: '/',
})






















