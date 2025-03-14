import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true, // Ensures the host header is rewritten
        rewrite: (path) => path.replace(/^\/api/, '') // Optional, if the backend expects paths without `/api`
      }
    }
  }
  
})
