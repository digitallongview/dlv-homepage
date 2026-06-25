import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
  optimizeDeps: {
    // leva ist raus: wird nur noch lazy bei ?debug geladen (eigener Chunk), gehört
    // nicht ins eager Hero-Bundle.
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    target: 'es2022',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    // Don't watch the screenshots dir — locked PNGs there crash the FS watcher (EBUSY).
    watch: {
      ignored: ['**/screenshots/**'],
    },
  },
})
