import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react'
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix'
            }
            if (id.includes('recharts') || id.includes('framer-motion') || id.includes('embla') || id.includes('date-fns')) {
              return 'vendor-visual'
            }
            if (id.includes('lucide-react') || id.includes('sonner') || id.includes('zustand') || id.includes('zod')) {
              return 'vendor-utils'
            }
            return 'vendor-other'
          }
        }
      }
    }
  }
})