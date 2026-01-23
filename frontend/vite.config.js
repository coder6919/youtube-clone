import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React, ReactDOM, and Scheduler together to avoid 'unstable_now' errors
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('scheduler')
            ) {
              return 'vendor_react_core';
            }
            // Keep the heavy video player separate
            if (id.includes('plyr')) {
              return 'vendor_player';
            }
            // Group remaining dependencies
            return 'vendor_libs';
          }


        },
      },
    },
  },
})
