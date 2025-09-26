import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true'
const repoBase = '/my-portfolio/'

export default defineConfig({
  base: isVercel ? '/' : repoBase,
  plugins: [react()],
})
