import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site at /ghost-prices/
  base: '/ghost-prices/',
  plugins: [react(), tailwindcss()],
})
