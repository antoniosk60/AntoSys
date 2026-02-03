import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          google: ['@google/genai'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
