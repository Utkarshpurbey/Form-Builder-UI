import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves at https://<user>.github.io/<repo-name>/ so we need base in CI
  base: process.env.BASE_PATH ?? '/',
}))
