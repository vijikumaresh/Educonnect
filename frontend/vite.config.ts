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
        target: 'https://registerstudents.kattral.ai',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Base URL for production
  base: '/',
})






















