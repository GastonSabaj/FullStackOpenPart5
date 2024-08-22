import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        //Esto es lo que necesito para poder hacer peticiones a dominios de terceros
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
