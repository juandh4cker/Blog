import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 5173,
      port: 5173,
    },
    port: 5173,
    strictPort: true,
  },
  watch: {
    usePolling: true,
    interval: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})