import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// The "pages" mode (used by `npm run build:pages`) builds for
// https://taan1el.github.io/jobpulse/, so assets must resolve under that
// subpath. Every other mode serves from the domain root.
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/jobpulse/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}))
