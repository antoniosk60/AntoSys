import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@google/genai', 'some-other-large-lib'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Aumentar límite si es necesario
  }
})
