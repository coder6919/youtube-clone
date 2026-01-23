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
            // Keep ONLY plyr separate as it is very large and independent
            if (id.includes('plyr')) {
              return 'vendor_player';
            }

            // Put ALL other node_modules into one stable vendor chunk.
            // This prevents React's internal modules from breaking each other.
            return 'vendor_main';
          }


        },
      },
    },
  },
})
