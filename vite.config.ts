import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
  },
})
