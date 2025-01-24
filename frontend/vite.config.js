import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Blog/",
  server: {
    host: '0.0.0.0', // Asegura que Vite escuche en todas las interfaces
    port: 5173, // Puerto que estás exponiendo
    strictPort: true, // Obliga a usar el puerto especificado
  },
})
