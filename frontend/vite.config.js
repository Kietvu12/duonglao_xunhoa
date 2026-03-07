import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from './tailwind.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindConfig],
  css: {
    postcss: './postcss.config.js',
  },
  allowedHosts: [
    "annmarie-unfitted-raylan.ngrok-free.dev"
  ],
  base: '/',
  build: {
    // Tắt eval trong production build để tuân thủ CSP
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
    rollupOptions: {
      output: {
        // Tối ưu hóa để tránh eval
        format: 'es',
      },
    },
  },
  // Chỉ cho phép eval trong development mode (HMR)
  esbuild: {
    legalComments: 'none',
  },
})
