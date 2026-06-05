import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://168.144.70.172:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://168.144.70.172:8000',
        changeOrigin: true,
      },
    },
  },
})
