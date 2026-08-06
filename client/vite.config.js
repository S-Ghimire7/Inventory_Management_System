import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// this proxy means when the react app calls /api/... during "npm run dev"
// it actually gets forwarded to our express server on port 5000
// so we don't have to worry about CORS while developing
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000'
    }
  }
})
