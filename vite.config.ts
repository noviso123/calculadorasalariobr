import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['react-router-dom', 'react-helmet-async'],
          'vendor-libs': ['recharts', 'jspdf', 'jspdf-autotable']
        }
      }
    },
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    minify: 'esbuild'
  }
});
