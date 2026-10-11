import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy API calls to the local Express contact server (server.ts).
      // Vite cannot run Nodemailer/SMTP itself, so `npm run dev:api`
      // (or `npm run dev:full`) must be running for /api/* to work locally.
      // On Vercel, /api/* is served by serverless functions in ./api instead.
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
