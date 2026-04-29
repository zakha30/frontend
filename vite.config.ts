import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // Must match your .NET launchSettings.json https profile URL.
        // Check SaaS.API/Properties/launchSettings.json:
        //   https profile → https://localhost:7089
        //   http profile  → http://localhost:5010
        target: 'https://localhost:7089',
        changeOrigin: true,
        secure: false,   // accept self-signed dev cert
      },
    },
  },
  build: {
    // Generate source maps for production error tracking (Sentry, etc.)
    // Set to false if you don't want source maps exposed publicly.
    sourcemap: false,
    // Chunk size warning threshold (kB)
    chunkSizeWarningLimit: 600,
  },
})
