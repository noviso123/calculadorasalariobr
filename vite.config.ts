import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    rollupOptions: isSsrBuild ? {
      input: 'src/entry-server.tsx'
    } : {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-routing': ['react-router-dom', 'react-helmet-async'],
          'vendor-charts': ['recharts'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 800,
    minify: 'esbuild'
  },
  ssr: {
    noExternal: ['react-router-dom', 'react-helmet-async', 'react-bootstrap']
  }
}));
