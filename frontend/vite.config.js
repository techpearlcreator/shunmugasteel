import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving CDN images from outside the project root
      allow: ['..', 'C:/My Web Sites'],
    },
  },
})
