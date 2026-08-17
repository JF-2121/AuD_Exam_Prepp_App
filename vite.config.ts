import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE_PATH=/<repo-name>/ when building for GitHub Pages project sites.
  // Render, Vercel, Netlify, or a custom domain should leave this at the default '/'.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
